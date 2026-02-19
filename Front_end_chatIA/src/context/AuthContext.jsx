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
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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
        // 👇 Aquí hacemos "match" con lo que devuelve tu backend Hexagonal
        const { user, session } = response.data;

        // Guardamos el token sacándolo de la sesión de Supabase
        if (session && session.access_token) {
          localStorage.setItem("token", session.access_token);
        }

        // Guardamos el usuario
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          return user;
        }
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