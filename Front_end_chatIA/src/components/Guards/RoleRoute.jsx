import { useAuth } from "../../hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"
import AccessDenied from "../AccessDenied/AccessDenied"

const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuth, loading } = useAuth()

    // Show loading state
    if (loading) {
        return (
            <div className="private-route-loader">
                <div className="loader-content">
                    <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
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