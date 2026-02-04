import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';
import Logo from '../../assets/img/Logo_CS.png';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const AccessDenied = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const role = user.role;
        if (role === "designer") {
            navigate('/designer')
        }
        if (role === "marketing") {
            navigate('/');
        }
    };

    return (
        <div className="access-denied-container">
            <div className="access-denied-content">
                {/* Warning Icon with Animation */}


                {/* Logo */}
                <div className="logo-section">
                    <img src={Logo} alt="Logo CS" className="denied-logo" />
                </div>

                {/* Error Code */}
                <div className="error-code">
                    <div className="warning-icon">
                        <AlertTriangle size={80} />
                    </div>
                    <span className="code-number">403</span>
                </div>

                {/* Main Message */}
                <div className="message-section">
                    <h1 className="denied-title">Acceso Denegado</h1>
                    <p className="denied-description">
                        Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
                    </p>
                    <p className="denied-subdescription">
                        Si crees que esto es un error, contacta al administrador del sistema.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="btn-secondary"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={20} />
                        Volver Atrás
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleGoHome}
                    >
                        <Home size={20} />
                        Ir al Inicio
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="decorative-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
