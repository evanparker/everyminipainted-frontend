import { Button } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaPencil, FaTrashCan } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { deleteCollection, getCollection } from "../../services/collection";
import UserContext from "../../userContext";
import DeleteModal from "../deleteModal";
import DeleteToast from "../toasts/deleteToast";
import DisplayCollection from "./displayCollection";
import DisplayFigures from "../figures/displayFigures";
import toBool from "../../util/toBool";
import type { Collection } from "../../types/collection.types";

const Collection = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { id } = useParams();

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
    const fetchCollectionData = async () => {
      try {
        const collectionData = await getCollection(id);
        setCollection(collectionData);
      } catch (e) {
        if ((e as { status: number }).status === 404) {
          navigate("/404", { replace: true });
        }
      }
    };

    fetchCollectionData();
  }, [id, navigate]);

  const handleDeleteCollection = async () => {
    const deletedCollection = await deleteCollection(id);
    if (deletedCollection) {
      toast(DeleteToast, {
        data: { message: `${collection?.name} Deleted` },
      });

      navigate("/collections");
    }
  };

  return (
    <div>
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCollection}
      />
      {collection && <DisplayCollection collection={collection} />}
      {canEdit && (
        <div className="flex gap-5">
          <Button
            className="max-w-36 mt-5"
            as={Link}
            to={"/collections/" + id + "/edit"}
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
      {collection && collection?.figures?.length > 0 && (
        <>
          <h3 className="mt-5 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
            Contains These Figures
          </h3>
          <div className="mt-5">
            <DisplayFigures figures={collection.figures} />
          </div>
        </>
      )}
      {collection && !(collection?.figures?.length > 0) && (
        <>
          <h3 className="mt-5 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
            Contains No Figures
          </h3>
        </>
      )}
    </div>
  );
};

export default Collection;
