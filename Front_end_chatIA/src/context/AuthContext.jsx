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
        const { user, session } = response.data;

        // Guardamos el token INMEDIATAMENTE para que nuestra API esté autorizada
        if (session && session.access_token) {
          localStorage.setItem("token", session.access_token);
          
          try {
            // Ahora que tenemos token, pedimos el perfil completo con el ROL REAL
            const profileResponse = await getAuthProfile();
            
            if (profileResponse && profileResponse.data) {
              const fullUser = profileResponse.data;
              
              // Guardamos el usuario completo y lo retornamos
              localStorage.setItem("user", JSON.stringify(fullUser));
              setUser(fullUser);
              return fullUser; 
            }
          } catch (profileError) {
            console.error("Error obteniendo el perfil completo:", profileError);
          }
        }

        // FALLBACK: Si algo falla con el perfil, guardamos el usuario base
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