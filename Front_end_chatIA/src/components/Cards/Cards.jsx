import './cards.css';
import { Clock, CircleUser } from 'lucide-react';
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
            <Clock size={24} className='imgCard' />
            <div className='InfoCard'>
                <h4>{props.titulo}</h4>
                <div className="progreso">
                    <div className='Estado' style={{ backgroundColor: color }}></div>
                    {props.estado}
                </div>
                <div className="fecha">
                    <CircleUser size={20} className='FotoUser' />
                    <p>{props.usuario}</p>
                    <p>{props.fecha}</p>
                </div>
            </div>
        </div>
    );
}
export default Cards;