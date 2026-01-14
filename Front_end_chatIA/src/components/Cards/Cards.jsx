import './cards.css';
import Reloj from '../../assets/img/reloj.png';
import FotoUser from '../../assets/img/user.jpg';
function Cards(props) {
    return (
        <div className="cards-container">
            <img className='imgCard' src={Reloj} alt="Reloj" />
            <div className='InfoCard'>
                <h4>Reclutamientos de pasantes</h4>
                <div className="progreso">
                    <div className='Estado'></div>
                    Enviado
                </div>
                <div className="fecha">
                    <img className='FotoUser' src={FotoUser} alt="Foto" />
                    <p>Kata</p>
                    <p>25 Dic</p>
                </div>
            </div>
        </div>
    );
}
export default Cards;