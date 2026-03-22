import { Card } from "flowbite-react";
import { FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      <Card className="max-w-sm" imgSrc="/emplogo.png" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Every Mini Painted
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          A place to both share your minis and search for painted references to
          work from.
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          The dream being to have a place where you can find every mini painted.
        </p>
        <div className="font-normal text-gray-800 dark:text-gray-300">
          <Link
            to="https://github.com/evanparker"
            className="flex items-center gap-3"
          >
            <FaGithub className="inline text-lg" />
            <p> Code available on my github page</p>
          </Link>
        </div>
      </Card>
    </>
  );
}

export default AboutPage;
