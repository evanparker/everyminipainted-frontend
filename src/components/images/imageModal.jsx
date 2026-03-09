import { Modal, ModalBody } from "flowbite-react";
import PropTypes from "prop-types";
import S3Image from "./s3Image";
import { useCallback, useState } from "react";
import { FaX } from "react-icons/fa6";

function ImageModal({ image, onClose, show }) {
  const [containerZoom, setContainerZoom] = useState(false);

  const toggleZoom = useCallback(() => {
    setContainerZoom(!containerZoom);
  }, [containerZoom]);

  const closeHandler = useCallback(() => {
    setContainerZoom(false);
    onClose();
  }, [onClose]);

  return (
    <Modal dismissible show={show} onClose={closeHandler} size="7xl">
      <ModalBody>
        <figure>
          <div
            className={`relative ${
              containerZoom
                ? "w-[1600px] cursor-zoom-out"
                : "w-full cursor-zoom-in"
            }`}
            onClick={toggleZoom}
          >
            {image?.type === "s3Image" ? (
              <S3Image image={image} width={1600} className="w-full" />
            ) : (
              <div></div>
            )}
          </div>
          <FaX
            className="cursor-pointer rounded-sm absolute p-2 top-10 right-10 size-10 text-gray-900 dark:text-gray-100 bg-gray-400 dark:bg-gray-600 opacity-30 hover:opacity-100"
            onClick={closeHandler}
          />
          <figcaption className="text-m text-gray-900 dark:text-gray-200 m-2">
            {image?.caption}
          </figcaption>
        </figure>
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
