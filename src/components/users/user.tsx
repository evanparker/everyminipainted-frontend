import { Button, Pagination } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { itemsPerPage } from "../../constants/requestDefaults";
import { getMinisByUsername, getUserByUsername } from "../../services/user";
import UserContext from "../../userContext";
import DisplayMinis from "../minis/displayMinis";
import SocialsBlock from "../socialsBlock";
import UserAvatar from "./userAvatar";
import { Mini } from "../../types/mini.types";
import type { User } from "../../types/user.types";

const User = () => {
  const { user: self } = useContext(UserContext);
  const [minis, setMinis] = useState<Mini[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserByUsername(username);
      setUser(userData);
    };
    fetchUserData();
  }, [username]);

  useEffect(() => {
    const fetchMinisData = async () => {
      const results = await getMinisByUsername(username, {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });
      setTotalPages(results.totalPages);
      setMinis(results.docs);
    };

    fetchMinisData();
  }, [currentPage, username]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() }, { replace: false });
  };

  return (
    <>
      {user && (
        <div className="flex flex-col gap-5">
          <div className="w-xs">
            <UserAvatar user={user} isLink={false} />
          </div>

          {user?.description && (
            <div className="format dark:format-invert">
              <Markdown>{user?.description}</Markdown>
            </div>
          )}

          {user?.website && (
            <div className="max-w-md">
              <Link to={user.website}>
                <div className="p-3 cursor-pointer rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
                  <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                    Website:
                  </div>
                  {user.website}
                </div>
              </Link>
            </div>
          )}

          {user?.socials && <SocialsBlock socials={user.socials} />}

          {self?._id === user?._id && (
            <div className="flex gap-5">
              <Button as={Link} to={`/users/edit`}>
                Edit Profile
              </Button>
              <Button as={Link} to={`/password`} outline>
                Edit Password
              </Button>
            </div>
          )}

          <DisplayMinis minis={minis} />
          <div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default User;
