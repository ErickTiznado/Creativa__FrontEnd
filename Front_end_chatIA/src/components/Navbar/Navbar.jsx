import Logo_CS from '../../assets/img/logo_CS.png';
import { Bell } from 'lucide-react';
import ImageUser from '../ImageUser/ImageUser';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar({ role = "Marketing" }) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const rol = user?.role;

    // determinar rol efectivo: prop 'role' tiene prioridad, si no tomar del localStorage
    const effectiveRole = (role || rol || '').toString().toLowerCase();
    let logoPath = '/';
    if (effectiveRole === 'designer' || effectiveRole === 'diseñador') {
      logoPath = '/designer';
    } else if (effectiveRole === 'admin') {
      logoPath = '/admin';
    } else {
      logoPath = '/';
    }

    return (
        <>
            <div className='Navbar'>
                {/* Mostrar siempre el logo, con enlace según el rol efectivo */}
                <Link to={logoPath}>
                    <img className='Logo' src={Logo_CS} alt="Logo" />
                </Link>

                <div className='Notification'>
                    <Bell size={24} className='campana' />
                    <p className='textNotification'>{role}</p>
                </div>
                <ImageUser />
            </div>
            {/* Enlaces exclusivos para administrador */}
            {role === 'Admin' && (

                <div className="nav-admin-links">
                    <Link to="/admin" className="nav-link">Administrar usuarios</Link>
                    <Link to="/requests" className="nav-link">Solicitudes</Link>
                </div>
            )}
        </>
    )
}
export default Navbar