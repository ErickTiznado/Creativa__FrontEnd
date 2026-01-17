import Logo_CS from '../../assets/img/logo_CS.png';
import campana from '../../assets/img/campana.svg';
import ImageUser from '../ImageUser/ImageUser';
import './Navbar.css';

function Navbar({ role = "Marketing" }) {
    return (
        <>
            <div className='Navbar'>
                <a href="/">
                     <img className='Logo'  src={Logo_CS} alt="Logo" />
                </a>
                <div className='Notification'>
                    <img className='campana' src={campana} alt="campana" />
                    <p className='textNotification'>{role}</p>
                </div>
                <ImageUser />
            </div>
        </>
    )
}
export default Navbar