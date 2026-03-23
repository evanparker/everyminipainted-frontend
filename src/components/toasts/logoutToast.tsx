import { Toast } from "flowbite-react";
import { FaDoorOpen } from "react-icons/fa6";

const LogoutToast = ({ data = {} }: { data: { message?: string } }) => {
  return (
    <Toast className="bg-gray-200 p-4 dark:bg-gray-700">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
        <FaDoorOpen className="h-5 w-5" />
      </div>
      <div className="pl-4 text-sm font-normal">
        {data.message || "Logged out."}
      </div>
    </Toast>
  );
};

export default LogoutToast;
