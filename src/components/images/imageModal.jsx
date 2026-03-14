import { Modal, ModalBody } from "flowbite-react";
import PropTypes from "prop-types";
import S3Image from "./s3Image";
import { useCallback, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";

function ImageModal({ image, onClose, show }) {
  const [containerZoom, setContainerZoom] = useState(false);
  const [altTextVisible, setAltTextVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef(null);

  const toggleZoom = useCallback(() => {
    setContainerZoom(!containerZoom);
  }, [containerZoom]);

  const closeHandler = useCallback(() => {
    setContainerZoom(false);
    onClose();
  }, [onClose]);

  const onImageLoad = useCallback(async (e) => {
    await setContainerZoom(false);

    const { naturalWidth, naturalHeight } = e.target;
    await setImageDimensions({ width: naturalWidth, height: naturalHeight });
  }, []);

  return (
    <Modal
      dismissible
      show={show}
      onClose={closeHandler}
      size="7xl"
      aria-label="Image Display Modal"
    >
      <ModalBody>
        <figure
          aria-describedby="modal-caption"
          aria-label="Image Modal"
          className="overflow-auto p-2"
        >
          <div
            ref={containerRef}
            className={`relative m-auto ${
              containerZoom
                ? `w-[1600px] cursor-zoom-out`
                : `w-full cursor-zoom-in`
            }`}
            onClick={toggleZoom}
            tabIndex={0}
            onKeyDown={(e) =>
              e.target === e.currentTarget && e.key == "Enter"
                ? toggleZoom()
                : undefined
            }
            style={{
              maxWidth: `${imageDimensions.width}px`,
            }}
          >
            {image?.type === "s3Image" ? (
              <S3Image
                image={image}
                width={1600}
                altText={image?.altText}
                onLoad={onImageLoad}
              />
            ) : (
              <></>
            )}
            {image?.altText && (
              <button
                className="absolute cursor-pointer bg-black text-white px-4 py-2 bottom-4 right-4 rounded-sm border-2 border-gray-400"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAltTextVisible(!altTextVisible);
                }}
                aria-label="Show Alt Text"
              >
                {!altTextVisible && <span>ALT</span>}
                {altTextVisible && <span>{image?.altText}</span>}
              </button>
            )}
          </div>

          <button
            onClick={closeHandler}
            className="cursor-pointer rounded-sm absolute p-2 top-10 right-10 size-10 text-gray-900 dark:text-gray-100 bg-gray-400 dark:bg-gray-600 opacity-30 focus:opacity-100 hover:opacity-100 z-10"
            aria-label="Close Modal"
          >
            <FaX className="size-full" />
          </button>
        </figure>
        {image?.caption && (
          <figcaption
            id="modal-caption"
            className="text-m text-gray-900 dark:text-gray-200 m-2"
          >
            {image?.caption}
          </figcaption>
        )}
      </ModalBody>
    </Modal>
  );
}

ImageModal.propTypes = {
  image: PropTypes.object,
  onClose: PropTypes.func,
  show: PropTypes.bool,
};

export default ImageModal;
