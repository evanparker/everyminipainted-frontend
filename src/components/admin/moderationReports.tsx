import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FaFlag } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import { getModerationReports } from "../../services/moderationReport";
import UserContext from "../../userContext";
import { ModerationReport } from "../../types/moderationReport.types";

const ModerationReports = () => {
  const [moderationReports, setModerationReports] = useState<
    ModerationReport[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("open");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user !== undefined && !user?.roles?.includes("admin")) {
      navigate("/404", { replace: true });
    }
    const fetchData = async () => {
      const results = await getModerationReports({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        status: filter,
      });

      setTotalPages(results.totalPages);
      setModerationReports(results.docs);
    };
    if (user?.roles?.includes("admin")) {
      fetchData();
    }
  }, [user, navigate, currentPage, filter]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const searchParams = { page: page.toString() };
    setSearchParams(searchParams, { replace: false });
  };

  return (
    <>
      <div className="flex gap-5 mb-5">
        <Button
          color={filter === "open" ? "default" : "alternative"}
          onClick={() => {
            setFilter("open");
          }}
        >
          Open
        </Button>
        <Button
          color={filter === "accepted" ? "default" : "alternative"}
          onClick={() => {
            setFilter("accepted");
          }}
        >
          Accepted
        </Button>
        <Button
          color={filter === "rejected" ? "default" : "alternative"}
          onClick={() => {
            setFilter("rejected");
          }}
        >
          Rejected
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Report</TableHeadCell>
              <TableHeadCell>Mini</TableHeadCell>
              <TableHeadCell>Reason</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Resolution</TableHeadCell>
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
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {report.resolution}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default ModerationReports;
