import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getModerationReport,
  putModerationReport,
} from "../../services/moderationReport";
import UserContext from "../../userContext";
import DisplayMini from "../minis/displayMini";
import { Button, HR } from "flowbite-react";
import { deleteMini, putMini } from "../../services/mini";
import type { ModerationReport } from "../../types/moderationReport.types";

const ModerationReport = () => {
  const [moderationReport, setModerationReport] = useState<
    Partial<ModerationReport> | undefined
  >(undefined);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    if (user !== undefined && !user?.roles?.includes("admin")) {
      navigate("/404", { replace: true });
    }
    const fetchData = async () => {
      const results = await getModerationReport(id);

      setModerationReport(results);
    };
    if (user?.roles?.includes("admin")) {
      fetchData();
    }
  }, [user, navigate, id]);

  const onRejectReport = async () => {
    try {
      await putModerationReport(id, {
        status: "rejected",
        resolution: "no action",
      });
      setModerationReport({
        ...moderationReport,
        status: "rejected",
        resolution: "no action",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteMini = async () => {
    try {
      await deleteMini(moderationReport?.mini?._id);
      await putModerationReport(id, {
        status: "accepted",
        resolution: "deleted",
      });
      setModerationReport({
        ...moderationReport,
        status: "accepted",
        resolution: "deleted",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onBlurMini = async () => {
    try {
      await putMini(moderationReport?.mini?._id, { blur: true });
      await putModerationReport(id, {
        status: "accepted",
        resolution: "blurred",
      });
      setModerationReport({
        ...moderationReport,
        status: "accepted",
        resolution: "blurred",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {moderationReport && (
        <>
          <div className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Moderation Report
          </div>
          <div className="flex flex-col gap-3 text-lg leading-none tracking-tight text-gray-900  dark:text-gray-300">
            <div className="flex gap-2">
              <span className="text-black dark:text-white font-bold">
                User:
              </span>
              <Link
                className="text-cyan-600 hover:underline dark:text-cyan-500"
                to={`/admin/users/${moderationReport.mini?.userId?.username}`}
              >
                {moderationReport.mini?.userId?.username}
              </Link>
            </div>
            <div className="flex gap-2">
              <span className="text-black dark:text-white font-bold">
                Reported By:
              </span>
              <Link
                className="text-cyan-600 hover:underline dark:text-cyan-500"
                to={`/admin/users/${moderationReport.userId?.username}`}
              >
                {moderationReport.userId?.username}
              </Link>
            </div>
            <div className="flex gap-2">
              <span className="text-black dark:text-white font-bold">
                Status:
              </span>
              <span>{moderationReport.status}</span>
            </div>
            {moderationReport.resolution && (
              <div className="flex gap-2">
                <span className="text-black dark:text-white font-bold">
                  Resolution:
                </span>
                <span>{moderationReport.resolution}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-black dark:text-white font-bold">
                Reason:
              </span>
              <span>{moderationReport.reason}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-black dark:text-white font-bold">
                Description:
              </span>
              <span>{moderationReport.description}</span>
            </div>
          </div>
          <div className="flex gap-5 mb-10 mt-10">
            <Button onClick={onRejectReport}>Reject Report</Button>
            <Button onClick={onBlurMini} color="alternative">
              Blur Mini
            </Button>
            <Button onClick={onDeleteMini} color="red">
              Delete Mini
            </Button>
          </div>
          <HR />
          {moderationReport?.mini && (
            <DisplayMini mini={moderationReport.mini} />
          )}
        </>
      )}
    </>
  );
};

export default ModerationReport;
