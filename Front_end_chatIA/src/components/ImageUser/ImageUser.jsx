import './imageUser.css'
import { CircleUser } from 'lucide-react';
function ImageUser() {
    return (
        <div className="imgUser">
            {/* <img src={props.src} alt={props.alt || 'User Image'} className={props.className || 'image-user'} style={props.style || {}} /> */}
            <CircleUser size={40} className='Userimg' />
        </div>
    );
}
export default ImageUser;