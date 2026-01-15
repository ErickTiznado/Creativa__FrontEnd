import React from 'react';
import { useNavigate } from 'react-router-dom';
import add from '../../assets/img/add.svg';
import './ButtonAdd.css';

function ButtonAdd() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/chat');
    };

    return (
        <button className="ButtonAddContainer" onClick={handleClick}>
            <img src={add} alt="add" />
            Nueva Campaña
        </button>
    );
}

export default ButtonAdd;