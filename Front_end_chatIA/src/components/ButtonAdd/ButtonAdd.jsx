import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './ButtonAdd.css';

function ButtonAdd() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/chat');
    };

    return (
        <button className="ButtonAddContainer" onClick={handleClick}>
            <Plus size={20} />
            Nueva Campaña
        </button>
    );
}

export default ButtonAdd;