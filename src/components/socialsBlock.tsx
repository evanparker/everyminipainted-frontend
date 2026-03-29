import { Link } from "react-router-dom";
import Socials from "../constants/socials";
import { Social } from "../types/social.types";

const SocialsBlock = ({
  socials,
  compact = false,
}: {
  socials: Social[];
  compact?: boolean;
}) => {
  return (
    <>
      {socials?.length > 0 && !compact && (
        <div className="max-w-md">
          <div className="p-3 cursor-pointer rounded-lg border overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
              Socials:
            </div>
            {socials.map((social, index) => {
              const Icon =
                Socials[social.service as keyof typeof Socials]?.icon ||
                (() => <></>);
              return (
                <Link
                  key={`social${index}`}
                  to={social.link || "#"}
                  aria-label={`Link to ${social.service}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white">
                    <Icon /> {social.link}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {socials?.length > 0 && compact && (
        <div className="flex gap-2">
          {socials.map((social, index) => {
            const Icon =
              Socials[social.service as keyof typeof Socials]?.icon ||
              (() => <></>);
            return (
              <Link
                key={`social${index}`}
                to={social.link || "#"}
                aria-label={`Link to ${social.service}`}
              >
                <div className="text-md text-gray-700 dark:text-gray-200 hover:text-black hover:dark:text-white">
                  <Icon />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SocialsBlock;
