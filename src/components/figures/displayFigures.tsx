import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import S3Thumbnail from "../images/s3Thumbnail";
import { Figure } from "../../types/figure.types";
import { ImageS3 } from "../../types/image.types";

const DisplayFigures = ({ figures }: { figures: Figure[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {figures.map((figure) => {
        const img = figure?.thumbnail;
        return (
          <Link key={figure._id} to={"/figures/" + figure._id}>
            <Card
              className="overflow-hidden text-gray-900 dark:text-white"
              renderImage={() =>
                img?.type === "s3Image" ? (
                  <S3Thumbnail
                    image={img as ImageS3}
                    width={400}
                    height={400}
                  />
                ) : (
                  <div></div>
                )
              }
            >
              {figure.name}
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default DisplayFigures;
