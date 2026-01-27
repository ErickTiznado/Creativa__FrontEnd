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
            <div className="ButtonAddIcon">
                <Plus size={20} />
            </div>
            <p>Nueva Campaña</p>
        </button>
    );
}

export default ButtonAdd;