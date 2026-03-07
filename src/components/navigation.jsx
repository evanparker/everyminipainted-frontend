import {
  Avatar,
  Button,
  DarkThemeToggle,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useContext } from "react";
import { FaPlus, FaUser } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../userContext";
import S3Image from "./images/s3Image";

function Navigation() {
  const { user, logout } = useContext(UserContext);
  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} to={"/"}>
        <img src="/emplogo.png" className="mr-3 h-9" alt="EMP Logo" />
        <span className="hidden sm:block self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Every Mini Painted
        </span>
        <span className="block sm:hidden self-center whitespace-nowrap text-md font-semibold dark:text-white">
          EMP
        </span>
      </NavbarBrand>
      <div className="flex md:order-2 gap-5">
        <DarkThemeToggle />

        <Dropdown
          arrowIcon={false}
          inline
          className="z-20"
          label={
            <Avatar
              rounded
              className="cursor-pointer"
              img={(props) => (
                <>
                  {(user?.avatar && (
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      {user?.avatar.type === "s3Image" ? (
                        <S3Image
                          image={user?.avatar}
                          width={120}
                          height={120}
                          {...props}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )) || (
                    <div className="cursor-pointer rounded-full p-2 bg-gray-200 dark:bg-gray-600 dark:text-white">
                      <FaUser />
                    </div>
                  )}
                </>
              )}
            ></Avatar>
          }
        >
          {user && (
            <>
              <DropdownHeader className="dark:text-white">
                <span className="block text-sm">{user.username}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </DropdownHeader>
              <DropdownItem
                className="dark:text-white"
                as={Link}
                to={`/users/${user.username}`}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                className="dark:text-white"
                as={Link}
                onClick={logout}
              >
                Sign out
              </DropdownItem>
              {user.roles.includes("admin") && (
                <>
                  <DropdownDivider />
                  <DropdownHeader className="dark:text-white font-bold">
                    Admin
                  </DropdownHeader>
                  <DropdownItem
                    className="dark:text-white"
                    as={Link}
                    to={`/admin/moderation`}
                  >
                    Moderation
                  </DropdownItem>
                  <DropdownItem
                    className="dark:text-white"
                    as={Link}
                    to={`/admin/invites`}
                  >
                    Invite Codes
                  </DropdownItem>
                </>
              )}
            </>
          )}
          {!user && (
            <>
              <DropdownItem className="dark:text-white" as={Link} to={`/login`}>
                Login
              </DropdownItem>
              <DropdownItem
                className="dark:text-white"
                as={Link}
                to={`/signup`}
              >
                Signup
              </DropdownItem>
            </>
          )}
        </Dropdown>

        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <div className="md:self-center">
          <NavLink to={"/minis"}>
            {({ isActive }) => (
              <NavbarLink as="div" active={isActive}>
                Minis
              </NavbarLink>
            )}
          </NavLink>
        </div>
        <div className="md:self-center">
          <NavLink to={"/figures"}>
            {({ isActive }) => (
              <NavbarLink as="div" active={isActive}>
                Figures
              </NavbarLink>
            )}
          </NavLink>
        </div>
        <div className="md:self-center">
          <NavLink to={"/collections"}>
            {({ isActive }) => (
              <NavbarLink as="div" active={isActive}>
                Collections
              </NavbarLink>
            )}
          </NavLink>
        </div>
        <div className="md:self-center">
          <NavLink to={"/manufacturers"}>
            {({ isActive }) => (
              <NavbarLink as="div" active={isActive}>
                Manufacturers
              </NavbarLink>
            )}
          </NavLink>
        </div>
        {user && (
          <Button as={Link} to={`/minis/new`}>
            <FaPlus className="inline" /> New Mini
          </Button>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}

export default Navigation;
