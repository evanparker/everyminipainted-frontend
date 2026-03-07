import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import S3Thumbnail from "../images/s3Thumbnail";

const DisplayCollections = ({ collections }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {collections.map((collection) => {
        const img = collection?.thumbnail;
        return (
          <Link key={collection._id} to={"/collections/" + collection._id}>
            <Card
              className="overflow-hidden text-gray-900 dark:text-white"
              renderImage={() =>
                img?.type === "s3Image" ? (
                  <S3Thumbnail image={img} width={400} height={400} />
                ) : (
                  <div></div>
                )
              }
            >
              {collection.name}
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default DisplayCollections;
