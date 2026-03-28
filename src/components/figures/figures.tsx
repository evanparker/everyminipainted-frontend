import { Button, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import { getFigures, getFiguresBySearch } from "../../services/figure";
import UserContext from "../../userContext";
import DisplayFigures from "./displayFigures";
import toBool from "../../util/toBool";
import FigureSearchForm from "./figureSearchForm";
import type { Figure } from "../../types/figure.types";

const Figures = () => {
  const { user } = useContext(UserContext);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);
  const searchString = searchParams.get("search") || "";
  const manufacturer = searchParams.get("manufacturer") || undefined;

  useEffect(() => {
    const fetchData = async () => {
      let results;
      if (searchString || manufacturer) {
        results = await getFiguresBySearch(searchString, {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          manufacturer,
        });
        setTotalPages(results.totalPages);
        setFigures(results.docs);
      } else {
        results = await getFigures({
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        });
        setTotalPages(results.totalPages);
        setFigures(results.docs);
      }
    };

    fetchData();
  }, [searchString, currentPage, manufacturer]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  useEffect(() => {
    if (
      (import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN) === false) ||
      user?.roles?.includes("admin")
    ) {
      setCanEdit(true);
    }
  }, [user]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const searchParams: {
      page?: string;
      search?: string;
      manufacturer?: string;
    } = { page: page.toString() };
    if (searchString) {
      searchParams.search = searchString;
    }
    if (manufacturer) {
      searchParams.manufacturer = manufacturer;
    }
    setSearchParams(searchParams, { replace: false });
  };

  return (
    <>
      <FigureSearchForm className="mb-5" />
      {canEdit && (
        <div className="mb-5 flex gap-5">
          <Button as={Link} to={`/figures/new`}>
            <FaPlus className="inline" /> New Figure
          </Button>
        </div>
      )}
      <DisplayFigures figures={figures} />

      <div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default Figures;
