import { Button, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import { getMinis, getMinisBySearch } from "../../services/mini";
import DisplayMinis from "./displayMinis";
import SearchBar from "../searchBar";
import { FaCamera } from "react-icons/fa6";
import UserContext from "../../userContext";
import { Mini } from "../../types/mini.types";

const Minis = () => {
  const [minis, setMinis] = useState<Mini[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);
  const searchString = searchParams.get("search");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      let results;
      if (searchString) {
        try {
          results = await getMinisBySearch(searchString, {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          });
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        try {
          results = await getMinis({
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          });
        } catch (error) {
          console.error("Error fetching minis:", error);
        }
      }
      setTotalPages(results?.totalPages);
      setMinis(results?.docs);
    };
    fetchData();
  }, [searchString, currentPage]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const searchParams: { page?: string; search?: string } = { page: page.toString() };
    if (searchString) {
      searchParams.search = searchString;
    }
    setSearchParams(searchParams, { replace: false });
  };

  return (
    <>
      <div>
        <SearchBar className="mb-5" placeholder="Search Minis..." />
        {user && (
          <div className="mb-5 flex gap-5">
            <Button as={Link} to={`/minis/new`}>
              <FaCamera className="mr-2 h-5 w-5" />
              New Mini
            </Button>
          </div>
        )}
        <DisplayMinis minis={minis} />
        <div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Minis;
