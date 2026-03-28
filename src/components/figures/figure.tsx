import { Button, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaCamera, FaPencil, FaTrashCan } from "react-icons/fa6";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { itemsPerPage } from "../../constants/requestDefaults";
import { deleteFigure, getFigure, getFigureMinis } from "../../services/figure";
import UserContext from "../../userContext";
import DeleteModal from "../deleteModal";
import DisplayMinis from "../minis/displayMinis";
import DeleteToast from "../toasts/deleteToast";
import DisplayFigure from "./displayFigure";
import DisplayCollections from "../collections/displayCollections";
import { getCollectionsByFigure } from "../../services/collection";
import toBool from "../../util/toBool";
import type { Figure } from "../../types/figure.types";
import { Mini } from "../../types/mini.types";

const Figure = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [figure, setFigure] = useState<Figure | undefined>();
  const [minis, setMinis] = useState<Mini[] | undefined>();
  const [collections, setCollections] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);
  const [currentCollectionsPage, setCurrentCollectionsPages] = useState(1);
  const [totalCollectionsPages, setTotalCollectionsPages] = useState(1);

  useEffect(() => {
    if (
      (import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN) === false) ||
      user?.roles?.includes("admin")
    ) {
      setCanEdit(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchFigureData = async () => {
      try {
        const figureData = await getFigure(id);
        setFigure(figureData);
      } catch (e) {
        if ((e as { status: number }).status === 404) {
          navigate("/404", { replace: true });
        }
      }
    };

    fetchFigureData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchFigureCollectionsData = async () => {
      const results = await getCollectionsByFigure({
        figureId: id,
        limit: itemsPerPage,
        offset: currentCollectionsPage * itemsPerPage,
      });
      setCollections(results.docs);
      setTotalCollectionsPages(results.totalPages);
    };
    fetchFigureCollectionsData();
  }, [currentCollectionsPage, id]);

  useEffect(() => {
    const fetchFigureMinisData = async () => {
      const results = await getFigureMinis(id, {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });
      setTotalPages(results.totalPages);
      setMinis(results.docs);
    };

    fetchFigureMinisData();
  }, [currentPage, id]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  const handleDeleteFigure = async () => {
    const deletedFigure = await deleteFigure(id);
    if (deletedFigure) {
      toast(DeleteToast, {
        data: { message: `${figure && figure?.name} Deleted` },
      });

      navigate("/figures");
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() }, { replace: false });
  };
  const onCollectionsPageChange = (page: number) => {
    setCurrentCollectionsPages(page);
  };

  return (
    <div>
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteFigure}
      />
      {figure && <DisplayFigure figure={figure} />}
      {canEdit && (
        <div className="flex gap-5">
          <Button
            className="max-w-36 mt-5"
            as={Link}
            to={"/figures/" + id + "/edit"}
          >
            <FaPencil className="mr-2 h-5 w-5" />
            Edit
          </Button>
          <Button
            color="red"
            className="max-w-36 mt-5"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrashCan className="mr-2 h-5 w-5" /> Delete
          </Button>
        </div>
      )}
      {collections?.length > 0 && (
        <>
          <h3 className="mt-5 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
            Part of These Collections
          </h3>
          <div className="mt-5">
            <DisplayCollections collections={collections} />
          </div>
          <div>
            <Pagination
              currentPage={currentCollectionsPage}
              totalPages={totalCollectionsPages}
              onPageChange={onCollectionsPageChange}
            />
          </div>
        </>
      )}

      <h3 className="mt-5 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
        Minis
      </h3>
      {!(minis && minis.length > 0) && (
        <div className="text-sm text-gray-900 dark:text-gray-200">
          This figure has no painted minis yet...
        </div>
      )}
      <Button
        className="max-w-42 mt-5"
        as={Link}
        to={`/minis/new?figure=${id}`}
      >
        <FaCamera className="mr-2 h-5 w-5" />
        Post Your Own
      </Button>
      {minis && minis.length > 0 && (
        <>
          <div className="mt-5">
            <DisplayMinis minis={minis} />
          </div>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Figure;
