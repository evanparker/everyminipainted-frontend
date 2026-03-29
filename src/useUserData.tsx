import { useState } from "react";

const useUserData = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString || "");
    return userToken;
  };
  const getUserId = () => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString || "");
    return userId;
  };

  const [token, setToken] = useState(getToken());
  const [userId, setUserId] = useState(getUserId());

  const setUserData = (userData: { token: string; userId: string }) => {
    localStorage.setItem("token", JSON.stringify(userData.token));
    localStorage.setItem("userId", JSON.stringify(userData.userId));
    setToken(userData.token);
    setUserId(userData.userId);
  };

  const resetUserData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(undefined);
    setUserId(undefined);
  };

  return {
    setUserData,
    resetUserData,
    token,
    userId,
  };
};

export default useUserData;
