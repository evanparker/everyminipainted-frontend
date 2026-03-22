import { Card } from "flowbite-react";
import { FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <>
      <Card className="max-w-sm" imgSrc="/emplogo.png" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Contact Us
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400 ">
          <p className="flex items-center gap-3">
            <FaEnvelope className="inline text-xl" />
            evanparker@everyminipainted.com
          </p>
          <Link
            to="https://discord.gg/qGUP2zYMQz"
            className="flex items-center gap-3 hover:text-gray-900 hover:dark:text-white"
          >
            <FaDiscord className="inline text-xl" />
            <p>Discord</p>
          </Link>
          <Link
            to="https://github.com/evanparker"
            className="flex items-center gap-3 hover:text-gray-900 hover:dark:text-white"
          >
            <FaGithub className="inline text-xl" />
            <p>Github</p>
          </Link>
        </div>
      </Card>
    </>
  );
}

export default ContactPage;
