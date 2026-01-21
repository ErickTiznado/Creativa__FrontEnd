import './cards.css';
import Reloj from '../../assets/img/reloj.png';
import FotoUser from '../../assets/img/user.jpg';
import { useState } from 'react';


function Cards(props) {
    // const [color, setColor] = useState('var(--color-proceso)');
    var color = 'var(--color-proceso)';
    const estado = props.estado;
    console.log(props)
    if (estado === 'Enviado') {
        color = 'var(--color-proceso)';
    } else if (estado === 'Cancelado') {
        color = 'var(--color-cancelado)';
    } else if (estado === 'Aprobado') {
        color = 'var(--color-aprobado)';
    } else if (estado === 'Rechazado') {
        color = 'var(--color-rechazado)';
    }

    return (
        <div className="cards-container">
            <img className='imgCard' src={Reloj} alt="Reloj" />
            <div className='InfoCard'>
                <h4>{props.titulo}</h4>
                <div className="progreso">
                    <div className='Estado' style={{ backgroundColor: color }}></div>
                    {props.estado}
                </div>
                <div className="fecha">
                    <img className='FotoUser' src={FotoUser} alt="Foto" />
                    <p>{props.usuario}</p>
                    <p>{props.fecha}</p>
                </div>
            </div>
        </div>
    );
}
export default Cards;