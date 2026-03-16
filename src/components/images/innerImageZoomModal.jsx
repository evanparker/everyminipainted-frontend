import { Modal, ModalBody } from "flowbite-react";
import InnerImageZoom from "react-inner-image-zoom";
import getS3Url from "./getS3Url";
import { useCallback, useRef, useState } from "react";
import "react-inner-image-zoom/lib/styles.min.css";
import { FaX } from "react-icons/fa6";

function ImageModal({ image, onClose, show }) {
  const containerRef = useRef(null);
  const [altTextVisible, setAltTextVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const closeHandler = useCallback(() => {
    onClose();
  }, [onClose]);

  const url = getS3Url({
    options: "width:1248",
    key: image?.s3Key,
    bucket: image?.s3Bucket,
    extension: "png",
  });
  const zoomUrl = getS3Url({
    options: "width:2048",
    key: image?.s3Key,
    bucket: image?.s3Bucket,
    extension: "png",
  });

  return (
    <Modal
      dismissible
      show={show}
      onClose={closeHandler}
      size="7xl"
      aria-label="Image Display Modal"
    >
      <ModalBody className="grid justify-items-center" ref={containerRef}>
        <figure
          aria-describedby="modal-caption"
          aria-label="Image Modal"
          className="relative"
        >
          <InnerImageZoom
            src={url}
            zoomSrc={zoomUrl}
            moveType="drag"
            hideCloseButton={true}
            ref={{ cotainer: containerRef }}
            afterZoomIn={() => setIsZoomed(true)}
            afterZoomOut={() => setIsZoomed(false)}
            // fullscreenOnMobile={true}
            hideHint={true}
          />
          {image?.altText && !isZoomed && (
            <button
              className="absolute cursor-pointer bg-black text-white px-4 py-2 bottom-4 left-4 rounded-sm border-2 border-gray-400"
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
          <button
            onClick={closeHandler}
            className="cursor-pointer rounded-sm absolute p-2 top-4 right-4 size-10 text-gray-900 dark:text-gray-100 bg-gray-400 dark:bg-gray-600 opacity-40 focus:opacity-100 hover:opacity-100 z-10"
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

export default ImageModal;
