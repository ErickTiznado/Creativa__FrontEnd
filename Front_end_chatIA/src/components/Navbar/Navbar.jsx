import Logo_CS from '../../assets/img/logo_CS.png';
import { Bell } from 'lucide-react';
import ImageUser from '../ImageUser/ImageUser';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { usePushNotifications } from '../../hooks/usePushNotifications';

function Navbar({ role = "Marketing" }) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const rol = user?.role;
    //console.log("usuario en Navbar:", user.firstName);
    let nameUser = user?.firstName || "US";
    nameUser = nameUser.substring(0, 2).toUpperCase();

    const effectiveRole = (role || rol || '').toString().toLowerCase();
    let logoPath = '/';
    if (effectiveRole === 'designer' || effectiveRole === 'diseñador') {
        logoPath = '/designer';
    } else if (effectiveRole === 'admin') {
        logoPath = '/admin';
    } else {
        logoPath = '/';
    }

    const { isSubscribed } = usePushNotifications();

    return (
        <>
            <div className='Navbar'>
                <Link to={logoPath}>
                    <img className='Logo' src={Logo_CS} alt="Logo" />
                </Link>

                <div className='Notification'>
                    <Bell size={24} className={isSubscribed ? 'campana campana--active' : 'campana'} />
                    <p className='textNotification'>
                        {rol ? (rol.charAt(0).toUpperCase() + rol.slice(1)) : role}
                    </p>
                </div>

                <ImageUser Initials={nameUser} name="Userimg" nameContainer="imgUser" />
            </div>

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
