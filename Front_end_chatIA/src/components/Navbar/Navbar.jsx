import Logo_CS from '../../assets/img/logo_CS.png';
import { Bell } from 'lucide-react';
import ImageUser from '../ImageUser/ImageUser';
import './Navbar.css';

function Navbar({ role = "Marketing" }) {
    return (
        <>
            <div className='Navbar'>
                <a href="/">
                    <img className='Logo' src={Logo_CS} alt="Logo" />
                </a>
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