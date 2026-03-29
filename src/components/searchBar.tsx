import { useState } from "react";
import { FaCaretDown, FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function SearchBar({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) {
  const dropdownOptions: DropdownOption[] = [
    { name: "Minis", link: "/minis" },
    { name: "Figures", link: "/figures" },
    { name: "Manufacturers", link: "/manufacturers" },
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState<DropdownOption>(
    dropdownOptions[0],
  );
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleOptionSelection = (option: DropdownOption) => {
    setCurrentOption(option);
    setDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate(currentOption.link + `?search=${search}`);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex relative">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <button
          id="dropdown-button"
          className="min-w-38 justify-between shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          type="button"
          onClick={() => {
            setDropdownOpen((prevState) => !prevState);
          }}
        >
          <span className="block">{currentOption.name}</span>
          <FaCaretDown />
        </button>
        <div
          id="dropdown"
          className={`${
            dropdownOpen ? "" : "hidden"
          } min-w-40 z-10 top-11 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 "
            aria-labelledby="dropdown-button"
          >
            {dropdownOptions.map((option) => (
              <li
                key={option.name}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleOptionSelection(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="outline-0 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder={placeholder || "Search"}
            required
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FaMagnifyingGlass />
          </button>
        </div>
      </div>
    </form>
  );
}
export default SearchBar;

interface DropdownOption {
  name: string;
  link: string;
}
