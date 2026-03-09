import { useRef } from "react";
import { FaPen, FaRegStar, FaStar, FaTrashCan } from "react-icons/fa6";
import S3Image from "./s3Image";

const ImageSortContainer = ({
  onSort,
  onDelete,
  onEdit,
  onSetThumbnail,
  images,
  thumbnail,
}) => {
  const dragImage = useRef(0);
  const draggedOverImage = useRef(0);

  return (
    <div className="flex flex-wrap gap-4">
      {images?.map((img, index) => (
        <div
          draggable
          onDragStart={() => (dragImage.current = index)}
          onDragEnter={() => (draggedOverImage.current = index)}
          onDragEnd={() => onSort(dragImage.current, draggedOverImage.current)}
          onDrop={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          key={img._id}
          className="relative cursor-move w-48 h-48 flex rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div
            onClick={() => onDelete(index)}
            className="absolute right-2 top-2 p-2 cursor-pointer text-gray-500 hover:text-gray-800 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:text-gray-200"
          >
            <FaTrashCan />
          </div>
          {onEdit && (
            <div
              onClick={() => onEdit(index)}
              className="absolute right-12 top-2 p-2 cursor-pointer text-gray-500 hover:text-gray-800 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:text-gray-200"
            >
              <FaPen />
            </div>
          )}
          {onSetThumbnail && (
            <div
              onClick={() => onSetThumbnail(img)}
              className="absolute left-2 top-2 p-2 cursor-pointer text-gray-500 hover:text-gray-800 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:text-gray-200"
            >
              {img._id === thumbnail._id ? <FaStar /> : <FaRegStar />}
            </div>
          )}
          {img.type === "s3Image" ? (
            <S3Image image={img} width={400} height={400} />
          ) : (
            <div></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageSortContainer;
