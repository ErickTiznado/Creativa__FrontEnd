import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import './PrivateRoute.css'
import Logo from '../../assets/img/Logo_CS.png'

const PrivateRoute = () => {
    const { isAuth, loading } = useAuth();

    if (loading) {
        return (
            <div className="private-route-loader">
                <div className="loader-content">
                    <div className="logo-container">
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring pulse-ring-delay-1"></div>
                        <div className="pulse-ring pulse-ring-delay-2"></div>
                        <img src={Logo} alt="Logo CS" className="loader-logo" />
                    </div>
                    <div className="loader-text">
                        <h2>Cargando...</h2>
                        <div className="loading-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}

export default PrivateRoute;