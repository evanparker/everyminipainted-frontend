import { FaTrash } from "react-icons/fa6";
import Socials from "../constants/socials";
import {
  Button,
  Dropdown,
  DropdownItem,
  Label,
  TextInput,
} from "flowbite-react";
import type { Social } from "../types/social.types";

const SocialsForm = ({
  socials,
  setSocials,
}: {
  socials: Social[];
  setSocials: React.Dispatch<React.SetStateAction<Social[]>>;
}) => {
  const addSocialField = (social: Social) => {
    setSocials((prevSocials) =>
      prevSocials
        ? [
            ...prevSocials,
            {
              name: social.name,
              service: social.service,
              link: "",
              icon: social.icon,
            },
          ]
        : [
            {
              name: social.name,
              service: social.service,
              link: "",
              icon: social.icon,
            },
          ],
    );
  };

  const deleteSocialField = (index: number) => {
    setSocials((prevSocials) => [
      ...prevSocials.filter((_value, i) => index !== i),
    ]);
  };

  const handleSocialFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    social: Social,
    index: number,
  ) => {
    setSocials((prevSocials) => {
      const socialsCopy = [...prevSocials];
      socialsCopy[index] = {
        name: social.name,
        service: social.service,
        link: e.target.value,
        icon: social.icon,
      };
      return socialsCopy;
    });
  };

  return (
    <>
      <div className="block max-w-lg">
        <Label>Socials</Label>

        <Dropdown
          id="socials-dropdown-button"
          className="mb-2 shadow-md"
          label="Add Social"
        >
          {Object.entries(Socials).map(([key, social]) => (
            <div key={`dropdown${key}`}>
              <DropdownItem
                onClick={() => addSocialField(social)}
                icon={social.icon}
              >
                {social.name}
              </DropdownItem>
            </div>
          ))}
        </Dropdown>

        <div className="flex flex-col gap-2">
          {socials?.map((social, index) => (
            <div className="flex gap-2 items-center" key={`socials${index}`}>
              <TextInput
                icon={Socials[social.service].icon}
                type="search"
                id={`socials${index}`}
                key={`socials${index}`}
                className="grow-1"
                value={social.link}
                onChange={(e) => handleSocialFieldChange(e, social, index)}
                placeholder="link to social media (including https://)"
              />
              <Button
                onClick={() => deleteSocialField(index)}
                color="gray"
                className=" px-3 cursor-pointer text-gray-500 hover:text-gray-800 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:text-gray-200"
              >
                <FaTrash />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialsForm;
