import './imageUser.css'

function ImageUser() {
    // 1. Obtenemos el usuario del localStorage (tal como lo hace tu Navbar)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // 2. Sacamos la inicial usando el firstName (o 'U' de Usuario si falla algo)
    const firstName = user?.firstName || 'Usuario';
    const initial = firstName.charAt(0).toUpperCase();

    return (
        <div className="imgUser">
            {/* AVATAR INICIAL ESTILO WHATSAPP (Reemplazando a CircleUser) */}
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#00a884', /* Verde tipo WhatsApp oscuro */
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer' /* Para que se vea clickeable */
            }} className='Userimg'>
                {initial}
            </div>
        </div>
    );
}
export default ImageUser;