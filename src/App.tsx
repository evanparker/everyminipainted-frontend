import { initThemeMode, ThemeModeScript } from "flowbite-react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify/unstyled";
import "./App.css";
import AboutPage from "./components/aboutPage";
import AdminPanelUser from "./components/admin/adminPanelUser";
import ModerationReport from "./components/admin/moderationReport";
import ModerationReports from "./components/admin/moderationReports";
import ForgotPasswordForm from "./components/auth/forgotPasswordForm";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import PasswordForm from "./components/auth/passwordForm";
import ResetPasswordForm from "./components/auth/resetPasswordForm";
import Signup from "./components/auth/signup";
import ContactPage from "./components/contactPage";
import Figure from "./components/figures/figure";
import FigureEdit from "./components/figures/figureEdit";
import FigureNew from "./components/figures/figureNew";
import Figures from "./components/figures/figures";
import Collection from "./components/collections/collection";
import CollectionEdit from "./components/collections/collectionEdit";
import CollectionNew from "./components/collections/collectionNew";
import Collections from "./components/collections/collections";
import Manufacturer from "./components/manufacturers/manufacturer";
import ManufacturerEdit from "./components/manufacturers/manufacturerEdit";
import ManufacturerNew from "./components/manufacturers/manufacturerNew";
import Manufacturers from "./components/manufacturers/manufacturers";
import Mini from "./components/minis/mini";
import MiniEdit from "./components/minis/miniEdit";
import MiniNew from "./components/minis/miniNew";
import Minis from "./components/minis/minis";
import Navigation from "./components/navigation";
import PageFooter from "./components/pageFooter";
import LogoutToast from "./components/toasts/logoutToast";
import User from "./components/users/user";
import UserEdit from "./components/users/userEdit";
import { postLogout } from "./services/auth";
import { getUserByMe } from "./services/user";
import UserContext from "./userContext";
import useUserData from "./useUserData";
import NotFound from "./404";
import GenerateInvite from "./components/admin/generateInvite";
import type { User as UserType } from "./types/user.types";

function App() {
  const { token, setUserData, resetUserData } = useUserData();
  const [user, setUser] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserByMe();
      setUser(userData);
    };
    if (token) {
      fetchUserData();
    } else {
      setUser(undefined);
    }
  }, [token]);

  const login = (userData: { token: string; userId: string }) => {
    setUserData(userData);
  };

  const logout = async () => {
    try {
      await postLogout();
      resetUserData();
      toast(LogoutToast);
    } catch (error) {
      console.error(error);
      resetUserData();
      toast(LogoutToast);
    }
  };

  initThemeMode();

  return (
    <>
      <UserContext.Provider value={{ user, setUser, login, logout }}>
        <ThemeModeScript />
        <ToastContainer
          position="bottom-right"
          closeButton={false}
          closeOnClick={true}
          hideProgressBar={true}
          pauseOnHover={true}
        />

        <title>Every Mini Painted</title>

        <div className="mb-5">
          <Navigation />
        </div>

        <Routes>
          <Route path="/" element={<Minis />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/password" element={<PasswordForm />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/passwordreset" element={<ResetPasswordForm />} />

          <Route path="/minis" element={<Minis />} />
          <Route path="/minis/:id" element={<Mini />} />
          <Route path="/minis/:id/edit" element={<MiniEdit />} />
          <Route path="/minis/new" element={<MiniNew />} />

          <Route path="/figures" element={<Figures />} />
          <Route path="/figures/:id" element={<Figure />} />
          <Route path="/figures/:id/edit" element={<FigureEdit />} />
          <Route path="/figures/new" element={<FigureNew />} />

          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<Collection />} />
          <Route path="/collections/:id/edit" element={<CollectionEdit />} />
          <Route path="/collections/new" element={<CollectionNew />} />

          <Route path="/manufacturers" element={<Manufacturers />} />
          <Route path="/manufacturers/:id" element={<Manufacturer />} />
          <Route
            path="/manufacturers/:id/edit"
            element={<ManufacturerEdit />}
          />
          <Route path="/manufacturers/new" element={<ManufacturerNew />} />

          <Route path="/users/:username" element={<User />} />
          <Route path="/users/edit" element={<UserEdit />} />

          {/* Admin */}
          <Route path="/admin" element={<ModerationReports />} />
          <Route path="/admin/invites" element={<GenerateInvite />} />
          <Route path="/admin/moderation" element={<ModerationReports />} />
          <Route path="/admin/moderation/:id" element={<ModerationReport />} />
          {/* <Route path="/admin/users" element={<></>} /> */}
          <Route path="/admin/users/:username" element={<AdminPanelUser />} />

          {/* Catch all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <div className="mt-5">
          <PageFooter />
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
