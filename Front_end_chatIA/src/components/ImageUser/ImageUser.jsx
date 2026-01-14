import './imageUser.css'
import user from '../../assets/img/user.jpg'
function ImageUser({ props }) {
    return (
        <div className="imgUser">
            {/* <img src={props.src} alt={props.alt || 'User Image'} className={props.className || 'image-user'} style={props.style || {}} /> */}
            <img className='Userimg' src={user} alt="User" />
        </div>
    );
}
export default ImageUser;