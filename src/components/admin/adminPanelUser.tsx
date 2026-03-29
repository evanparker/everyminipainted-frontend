import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getModerationReportsOnUserId } from "../../services/moderationReport";
import UserContext from "../../userContext";
import { getUserByUsername } from "../../services/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { FaFlag } from "react-icons/fa6";
import { ModerationReport } from "../../types/moderationReport.types";
import { User } from "../../types/user.types";

const AdminPanelUser = () => {
  const { user: self } = useContext(UserContext);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [moderationReports, setModerationReports] = useState<
    ModerationReport[]
  >([]);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (self !== undefined && !self?.roles?.includes("admin")) {
      navigate("/404", { replace: true });
    }

    const fetchUserData = async () => {
      const userData = await getUserByUsername(username);
      setUser(userData);
    };
    fetchUserData();
  }, [navigate, self, username]);

  useEffect(() => {
    const fetchModerationReports = async () => {
      const reports = await getModerationReportsOnUserId({
        userId: user?._id,
      });
      setModerationReports(reports);
    };
    if (user) {
      fetchModerationReports();
    }
  }, [user, username]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className=" text-gray-900 dark:text-white">
          Reports against{" "}
          <Link
            className="text-cyan-600 hover:underline dark:text-cyan-500"
            to={`/users/${user?.username}`}
          >
            {user?.username}
          </Link>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Report</TableHeadCell>
              <TableHeadCell>Mini</TableHeadCell>
              <TableHeadCell>Reason</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {moderationReports.map((report) => (
              <TableRow
                key={report._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>
                  <Link
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                    to={`/admin/moderation/${report._id}`}
                  >
                    <FaFlag />
                  </Link>
                </TableCell>

                <TableCell className="whitespace-nowrap font-medium">
                  <Link
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                    to={`/minis/${report.mini?._id}`}
                  >
                    {report.mini?.name || "Untitled Mini"}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {report.reason}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {report.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminPanelUser;
