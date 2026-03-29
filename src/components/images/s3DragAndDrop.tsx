import { useEffect, useRef, useState } from "react";
import { FileInput, Label } from "flowbite-react";
import { postImage } from "../../services/image";
import { ImageS3 } from "../../types/image.types";

const S3DragAndDrop = ({
  addImages,
}: {
  addImages: (images: ImageS3[]) => void;
}) => {
  const [dragOver, setDragOver] = useState(false);
  const abortControllerRef = useRef(new AbortController());

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setDragOver(false);

    const files =
      "dataTransfer" in e
        ? Array.from(e.dataTransfer.files)
        : Array.from(e.target?.files || []);

    const images = [];

    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const image = await postImage(
            file,
            abortControllerRef.current.signal,
          );
          images.push(image);
        } catch (error) {
          if ((error as { name: string }).name !== "AbortError") {
            console.error(error);
          }
        }
      }
      addImages(images);
    }
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  return (
    <>
      <Label
        htmlFor="dropzone-file"
        className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
          dragOver ? `border-green-300 dark:border-green-600` : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Click here or
          </p>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            drag and drop to upload
          </p>
        </div>
        <FileInput
          id="dropzone-file"
          className="hidden"
          multiple
          onChange={(e) => {
            handleDrop(e);
          }}
        />
      </Label>
    </>
  );
};

export default S3DragAndDrop;
