import { Button, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import {
  getCollections,
  getCollectionsBySearch,
} from "../../services/collection";
import UserContext from "../../userContext";
import DisplayCollections from "./displayCollections";
import toBool from "../../util/toBool";
import Collection from "./collection";
// import CollectionSearchForm from "./collectionSearchForm";

const Collections = () => {
  const { user } = useContext(UserContext);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);
  const searchString = searchParams.get("search") || "";
  const manufacturer = searchParams.get("manufacturer");

  useEffect(() => {
    const fetchData = async () => {
      let results;
      if (searchString || manufacturer) {
        results = await getCollectionsBySearch(searchString, {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          manufacturer: manufacturer || undefined,
        });
        setTotalPages(results.totalPages);
        setCollections(results.docs);
      } else {
        results = await getCollections({
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        });
        setTotalPages(results.totalPages);
        setCollections(results.docs);
      }
    };

    fetchData();
  }, [searchString, currentPage, manufacturer]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  useEffect(() => {
    if (
      (import.meta.env.VITE_EDIT_COLLECTION_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_COLLECTION_REQUIRES_ADMIN) ===
          false) ||
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
      {/* <CollectionSearchForm className="mb-5" /> */}
      {canEdit && (
        <div className="mb-5 flex gap-5">
          <Button as={Link} to={`/collections/new`}>
            <FaPlus className="inline" /> New Collection
          </Button>
        </div>
      )}
      <DisplayCollections collections={collections} />

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

export default Collections;
