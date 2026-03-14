import { Toast } from "flowbite-react";
import { FaFlag } from "react-icons/fa6";

const ModerationReportToast = ({ data = {} }) => {
  return (
    <Toast className="bg-gray-200 p-4 dark:bg-gray-700">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <FaFlag className="h-5 w-5" />
      </div>
      <div className="pl-4 text-sm font-normal">
        {data.message || "Thank you for your report."}
      </div>
    </Toast>
  );
};

export default ModerationReportToast;
