import { Avatar } from "flowbite-react";
import SocialsBlock from "../socialsBlock";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import S3Image from "../images/s3Image";

const UserAvatar = ({
  user,
  showText = true,
  isLink = true,
  showSocials = true,
}) => {
  return (
    <>
      {user && (
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-5 py-3 rounded-lg">
          {isLink && (
            <Link
              to={`/users/${user.username}`}
              aria-label={`Link to ${user.username}`}
            >
              <Avatar
                rounded
                className=""
                img={(props) => <ProfilePicture user={user} props={props} />}
              />
            </Link>
          )}
          {!isLink && (
            <Avatar
              rounded
              className=""
              img={(props) => <ProfilePicture user={user} props={props} />}
            />
          )}
          {showText && (
            <div className="flex flex-col ml-5 space-y-1 font-medium  dark:text-white">
              {isLink && (
                <Link to={`/users/${user.username}`}>
                  <div>{user.username}</div>
                </Link>
              )}
              {!isLink && <div>{user.username}</div>}
              {showSocials && user.socials?.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <SocialsBlock socials={user.socials} compact={true} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const ProfilePicture = ({ user, props }) => {
  return (
    <>
      {(user.avatar && (
        <div className="w-10 h-10 overflow-hidden rounded-full">
          {user?.avatar.type === "s3Image" ? (
            <S3Image image={user?.avatar} width={120} height={120} {...props} />
          ) : (
            <div></div>
          )}
        </div>
      )) || (
        <div className="rounded-full p-2 bg-gray-200 dark:bg-gray-600 dark:text-white">
          <FaUser />
        </div>
      )}
    </>
  );
};

export default UserAvatar;
