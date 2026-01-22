import { createContext, useEffect, useState } from "react";
import { authLogin, getAuthProfile } from "../services/authService";
const authContext = createContext(null);

const authProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await getAuthProfile()
                if (response.status === 200) {
                    setUser(response.id)
                    setIsAuth(true)
                    localStorage.setItem('token', token)
                    setLoading(false)
                } else if (response.error) {
                    localStorage.removeItem('token')
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        checkAuth();
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authLogin(email, password)
            if (response.status === 200) {
                setUser(response.user)
                setToken(response.token)
                setIsAuth(true)
                setLoading(false)
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            throw new Error(message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuth(false);
        setToken(null);
        setUser(null);
        setLoading(false);
    }

    return (
        <authContext.Provider value={{ user, token, isAuth, loading, login, logout }}>
            {children}
        </authContext.Provider>
    )
}

export { authProvider, authContext };
export default authContext;