import React from 'react';
import { FaRocket, FaSearch, FaTimes } from 'react-icons/fa'; 

const summaryData = [
  { label: 'Tipo', value: 'Reclutamiento' },
  { label: 'Objetivo', value: 'Contactar estudiantes' },
  { label: 'Publico', value: 'Universitario' },
  { label: 'fecha', value: '12 de octubre' },
  { label: 'Canal', value: 'redes sociales' },
  { label: 'Descripcion', value: 'descripcion breve' },
];

const Sidebar = ({ className, onToggle }) => {
  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <FaRocket /> <h3>Tabla de resumen</h3>
        <button className="close-sidebar-btn" onClick={onToggle}>
          <FaTimes />
        </button>
      </div>

      <ul className="summary-list">
        {summaryData.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong> {item.value}
          </li>
        ))}
      </ul>

      <div className="search-bar">
        <span className="icon"><FaSearch /></span>
        <input type="text" placeholder="Buscar" />
      </div>

      <div className='box-users'>
        <div className="user-card">
          <img src="https://i.pravatar.cc/150?img=11" alt="Juan" className="card-avatar" />
          <div className="user-info">
            <h4>Juan carlos</h4>
            <p>Diseñador</p>
          </div>
        </div>
        <div className="user-card">
          <img src="https://i.pravatar.cc/150?img=11" alt="Juan" className="card-avatar" />
          <div className="user-info">
            <h4>Juan carlos</h4>
            <p>Diseñador</p>
          </div>
        </div>
      </div>

      <div className="send-action-area">
        <label>Enviar campaña a:</label>
        <div className="recipient-tag">
          <img src="https://i.pravatar.cc/150?img=11" alt="u" />
          <span>Juan carlos</span>
          <button className="close-tag">×</button>
        </div>
        <button className="main-cta-btn">Enviar</button>
      </div>
    </aside>
  );
};

export default Sidebar;
