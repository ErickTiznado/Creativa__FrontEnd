import { useEffect, useState } from "react";
import { authLogin, getAuthProfile } from "../services/authService";
import AuthContext from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await getAuthProfile();
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authLogin(email, password);
      if (response && response.data) {
        const { token, ...userData } = response.data;
        if (token) {
          localStorage.setItem("token", token);
        }
        // Assuming the rest is user data containing role
        // Ideally checking structure, but assuming userData is the user object
        // If userData contains a 'user' property, we should use that
        const finalUser = userData.user || userData;
        setUser(finalUser);
        
        return response.data;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuth: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};