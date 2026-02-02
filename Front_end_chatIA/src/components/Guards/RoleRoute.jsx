import { useAuth } from "../../hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"
import AccessDenied from "../AccessDenied/AccessDenied"
import LoadingSpinner from "../animations/LoadingSpinner"

const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuth, loading } = useAuth()


    if (loading) {
        return (
            <div className="private-route-loader">
                <LoadingSpinner text="Verificando sesión..." color="#ffffff" />
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuth || !user) {
        return <Navigate to="/login" replace />
    }

    // Check if user's role is in the allowed roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <AccessDenied />
    }

    // Render protected content if user has the correct role
    return <Outlet />
}

export default RoleRoute