import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';
import Logo from '../../assets/img/Logo_CS.png';

const AccessDenied = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
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
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Volver Atrás
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleGoHome}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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
