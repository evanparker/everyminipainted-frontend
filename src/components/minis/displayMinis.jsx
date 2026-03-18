import { Card } from "flowbite-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import UserContext from "../../userContext";
import S3Thumbnail from "../images/s3Thumbnail";

const DisplayMinis = ({ minis }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {minis.map((mini) => {
        const img = mini?.thumbnail;
        return (
          <Link key={mini._id} to={"/minis/" + mini._id}>
            <Card
              className="relative overflow-hidden text-gray-900 dark:text-white"
              renderImage={() =>
                img?.type === "s3Image" ? (
                  <S3Thumbnail
                    image={img}
                    width={400}
                    height={400}
                    blur={mini.blur}
                  />
                ) : (
                  <div></div>
                )
              }
            >
              <p>{mini.name}</p>
              {user?.favorites[mini._id] && (
                <div className="absolute right-5 top-5 p-2 rounded-lg text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-700">
                  <FaHeart className="h-4 w-4" />
                </div>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

DisplayMinis.propTypes = {
  minis: PropTypes.arrayOf(PropTypes.object),
};
export default DisplayMinis;
