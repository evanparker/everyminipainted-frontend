import { FaMagnifyingGlass } from "react-icons/fa6";
import { TextInput } from "flowbite-react";
import { useRef, useState } from "react";

function AutoCompleteInput<Type extends { _id: string; name: string }>({
  chooseItem,
  dropdownOpen,
  setDropdownOpen,
  onChange,
  onFocus,
  items,
  value,
  onBlur,
  id = "item1",
}: {
  chooseItem: (item: Type | undefined) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  items: Type[];
  value: string;
  onBlur: (e: React.FocusEvent | React.KeyboardEvent) => void;
  id?: string;
}) {
  const [activeItem, setActiveItem] = useState(-1);
  const dropdownContainerRef = useRef(null as unknown as HTMLUListElement);

  const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        await setDropdownOpen(true);
      }
    }
    let activeElement;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activeElement = document.getElementById(
          `dropdownOption${Math.min(items.length, activeItem + 1)}`,
        );
        if (activeElement) {
          dropdownContainerRef.current?.scrollTo({
            top:
              activeElement.offsetTop -
              dropdownContainerRef.current?.offsetHeight / 2,
            behavior: "smooth",
          });
          setActiveItem(Math.min(items.length, activeItem + 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        activeElement = document.getElementById(
          `dropdownOption${Math.max(0, activeItem - 1)}`,
        );
        if (activeElement) {
          dropdownContainerRef.current?.scrollTo({
            top:
              activeElement.offsetTop -
              dropdownContainerRef.current?.offsetHeight / 2,
            behavior: "smooth",
          });
          setActiveItem(Math.max(0, activeItem - 1));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (activeItem === 0) {
          chooseItem(undefined);
        } else {
          chooseItem(items[activeItem - 1]);
        }
        setActiveItem(-1);
        break;
      case "Escape":
      case "Tab":
        onBlur(e);
        break;
    }
  };

  return (
    <div
      className="findme"
      onBlur={onBlur}
      onKeyDown={handleOnKeyDown}
      tabIndex={1}
    >
      <TextInput
        id={id}
        type="text"
        icon={FaMagnifyingGlass}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        autoComplete="off"
      />
      {dropdownOpen && (
        <div className="relative">
          <ul
            ref={dropdownContainerRef}
            className="absolute z-10 w-lg shadow-md h-48 pb-3 overflow-y-auto text-sm bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <li
              id={`dropdownOption${0}`}
              key={"none"}
              onClick={() => chooseItem(undefined)}
              onMouseOver={() => setActiveItem(0)}
              className={`${
                activeItem === 0 ? "bg-gray-100 dark:bg-gray-600" : ""
              } w-full p-2 text-sm rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 font-medium text-gray-900 dark:text-gray-300`}
            >
              None
            </li>
            {items.map((item, idx) => (
              <li
                id={`dropdownOption${idx + 1}`}
                key={item._id as unknown as React.Key}
                onClick={() => chooseItem(item)}
                onMouseOver={() => setActiveItem(idx + 1)}
                className={`${
                  activeItem === idx + 1 ? "bg-gray-100 dark:bg-gray-600" : ""
                } w-full p-2 text-sm rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 font-medium text-gray-900 dark:text-gray-300`}
              >
                {item.name as unknown as string}{" "}
                <span className="text-gray-700 dark:text-gray-500">
                  {"partNumber" in item &&
                    (item.partNumber as unknown as string)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default AutoCompleteInput;
