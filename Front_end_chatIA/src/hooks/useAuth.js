import { useContext } from "react"
import authContext from "../context/AuthContext"


export const useAuth = () => {
    const context = useContext(authContext);

    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }

    return context;
}