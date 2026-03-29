import { createContext } from "react";
import { User } from "./types/user.types";

const UserContext = createContext<{
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  login: (userData: { token: string; userId: string }) => void;
  logout: () => void;
}>({
  user: undefined,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});
export default UserContext;
