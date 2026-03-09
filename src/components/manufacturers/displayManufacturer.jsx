import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import ImageModal from "../images/imageModal";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import SocialsBlock from "../socialsBlock";
import S3Thumbnail from "../images/s3Thumbnail";

const DisplayManufacturer = ({ manufacturer }) => {
  const [selectedImage, setSelectedImage] = useState();

  const onClose = () => {
    setSelectedImage(undefined);
  };

  const onArrowKeyDown = useCallback(
    (e) => {
      if (selectedImage) {
        const index = manufacturer.images.indexOf(selectedImage);

        if (e.key === "ArrowLeft") {
          setSelectedImage(manufacturer.images[Math.max(0, index - 1)]);
        } else if (e.key === "ArrowRight") {
          setSelectedImage(
            manufacturer.images[
              Math.min(manufacturer.images.length - 1, index + 1)
            ]
          );
        }
      }
    },
    [selectedImage, manufacturer.images]
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
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {manufacturer?.name || "Untitled Manufacturer"}
        </h1>
        <div className="format dark:format-invert">
          <Markdown>{manufacturer?.description}</Markdown>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {manufacturer?.images?.map((img) => (
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

        {manufacturer?.website && (
          <div className="max-w-md">
            <Link to={manufacturer.website}>
              <div className="p-3 cursor-pointer rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
                <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                  Website:
                </div>
                {manufacturer.website}
              </div>
            </Link>
          </div>
        )}

        <SocialsBlock socials={manufacturer?.socials} />
      </div>
    </>
  );
};

DisplayManufacturer.propTypes = {
  manufacturer: PropTypes.object,
};

export default DisplayManufacturer;
