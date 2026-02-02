import Logo_CS from '../../assets/img/logo_CS.png';
import { Bell } from 'lucide-react';
import ImageUser from '../ImageUser/ImageUser';
import './Navbar.css';

function Navbar({ role = "Marketing" }) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const rol = user?.role;


    return (
        <>
            <div className='Navbar'>
                {rol === "marketing" && (
                    <a href="/">
                        <img className='Logo' src={Logo_CS} alt="Logo" />
                    </a>
                )}
                {rol === "designer" && (
                    <a href="/designer">
                        <img className='Logo' src={Logo_CS} alt="Logo" />
                    </a>
                )
                }
                <div className='Notification'>
                    <Bell size={24} className='campana' />
                    <p className='textNotification'>{role}</p>
                </div>
                <ImageUser />
            </div>
        </>
    )
}
export default Navbar