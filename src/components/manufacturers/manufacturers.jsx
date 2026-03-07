import { Button, Card, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import {
  getManufacturers,
  getManufacturersBySearch,
} from "../../services/manufacturer";
import UserContext from "../../userContext";
import S3Image from "../images/s3Image";
import toBool from "../../util/toBool";

const Manufacturers = () => {
  const { user } = useContext(UserContext);
  const [manufacturers, setManufacturers] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || 1)
  );
  const [totalPages, setTotalPages] = useState(0);
  const searchString = searchParams.get("search");

  useEffect(() => {
    const fetchData = async () => {
      let results;
      if (searchString) {
        results = await getManufacturersBySearch(searchString, {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        });
      } else {
        results = await getManufacturers({
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        });
      }
      setTotalPages(results.totalPages);
      setManufacturers(results.docs);
    };

    fetchData();
  }, [searchString, currentPage]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || 1));
  }, [searchParams]);

  useEffect(() => {
    if (
      user?.roles?.includes("admin") ||
      (import.meta.env.VITE_EDIT_MANUFACTURER_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_MANUFACTURER_REQUIRES_ADMIN) === false)
    ) {
      setCanEdit(true);
    }
  }, [user]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    const searchParams = { page };
    if (searchString) {
      searchParams.search = searchString;
    }
    setSearchParams(searchParams, { replace: false });
  };

  return (
    <>
      {canEdit && (
        <div className="mb-5 flex gap-5">
          <Button as={Link} to={`/manufacturers/new`}>
            <FaPlus className="inline" /> New Manufacturer
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {manufacturers.map((manufacturer) => {
          const img = manufacturer?.thumbnail;
          return (
            <Link
              key={manufacturer._id}
              to={"/manufacturers/" + manufacturer._id}
            >
              <Card
                className="overflow-hidden text-gray-900 dark:text-white"
                renderImage={() =>
                  img?.type === "s3Image" ? (
                    <S3Image image={img} width={400} height={400} />
                  ) : (
                    <div></div>
                  )
                }
              >
                {manufacturer.name}
              </Card>
            </Link>
          );
        })}
      </div>
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

export default Manufacturers;
