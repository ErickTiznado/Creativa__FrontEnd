import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PublicRoute = () => {
    const { isAuth, user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuth) {
        const role = user?.role?.toLowerCase() || '';

        if (role === 'designer' || role === 'diseñador') {
            return <Navigate to="/designer" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;