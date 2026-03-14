import { Toast } from "flowbite-react";
import { FaFloppyDisk } from "react-icons/fa6";

const SaveToast = ({ data = {} }) => {
  return (
    <Toast className="bg-gray-200 p-4 dark:bg-gray-700">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <FaFloppyDisk className="w-5 h-5" />
      </div>
      <div className="pl-4 text-sm font-normal">{data.message || "Saved."}</div>
    </Toast>
  );
};

export default SaveToast;
