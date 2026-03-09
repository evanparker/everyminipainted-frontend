import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import ImageModal from "../images/imageModal";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import S3Thumbnail from "../images/s3Thumbnail";

const DisplayCollection = ({ collection }) => {
  const [selectedImage, setSelectedImage] = useState();

  const onClose = () => {
    setSelectedImage(undefined);
  };

  const onArrowKeyDown = useCallback(
    (e) => {
      if (selectedImage) {
        const index = collection.images.indexOf(selectedImage);

        if (e.key === "ArrowLeft") {
          setSelectedImage(collection.images[Math.max(0, index - 1)]);
        } else if (e.key === "ArrowRight") {
          setSelectedImage(
            collection.images[Math.min(collection.images.length - 1, index + 1)]
          );
        }
      }
    },
    [selectedImage, collection.images]
  );

  useEffect(() => {
    document.addEventListener("keydown", onArrowKeyDown, false);
    return () => {
      document.removeEventListener("keydown", onArrowKeyDown, false);
    };
  });

  return (
    <>
      <ImageModal
        onClose={onClose}
        image={selectedImage}
        show={!!selectedImage}
      />
      <div>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {collection?.name || "Untitled Collection"}
        </h1>
        <div className="format dark:format-invert">
          <Markdown>{collection?.description}</Markdown>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {collection?.images?.map((img) => (
            <figure
              key={img._id}
              onClick={() => setSelectedImage(img)}
              className="cursor-pointer max-w-md flex flex-col rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {img.type === "s3Image" ? (
                <S3Thumbnail image={img} width={400} height={400} />
              ) : (
                <div></div>
              )}
              {img?.caption && (
                <figcaption className="text-sm text-gray-900 dark:text-gray-200 m-2">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        {collection.website && (
          <div className="max-w-md">
            <Link to={collection.website}>
              <div className="mt-5 p-3 cursor-pointer rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
                <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                  Website:
                </div>
                {collection.website}
              </div>
            </Link>
          </div>
        )}
        {collection.partNumber && (
          <div className="max-w-md">
            <div className="mt-5 p-3 rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                Part Number:
              </div>
              {collection.partNumber}
            </div>
          </div>
        )}
        {collection.manufacturer && (
          <div className="max-w-md">
            <Link
              to={`/manufacturers/${collection.manufacturer._id}`}
              className="block mt-5 p-3 cursor-pointer max-w-md rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                Manufacturer:
              </div>
              {collection.manufacturer.name}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

DisplayCollection.propTypes = {
  collection: PropTypes.object,
};

export default DisplayCollection;
