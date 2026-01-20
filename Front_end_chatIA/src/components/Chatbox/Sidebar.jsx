import React from 'react';
import { FaRocket, FaSearch, FaTimes } from 'react-icons/fa';


const Sidebar = ({ className, onToggle, briefData = [] }) => {
  const summaryData = Array.isArray(briefData) ? briefData : [];

  // Mapeo de labels técnicos a nombres amigables en español
  const labelTranslations = {
    nombre_campaing: 'Nombre de campaña',
    ContentType: 'Tipo de contenido',
    Description: 'Descripción',
    Objective: 'Objetivo',
    observations: 'Observaciones',
    publishing_channel: 'Canal de publicación',
    fechaPublicacion: 'Fecha de publicación'
  };

  // Función para obtener el label traducido
  const getTranslatedLabel = (key) => {
    return labelTranslations[key] || key;
  };

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <FaRocket /> <h3>Resumen de Campaña</h3>
        <button className="close-sidebar-btn" onClick={onToggle}>
          <FaTimes />
        </button>
      </div>

      <div className="summary-list">
        {summaryData.length > 0 ? (
          summaryData.map((item, index) => (
            <div key={index} className="summary-item">
              <span className="summary-label">{getTranslatedLabel(item.label)}</span>
              <span className="summary-value">{item.value}</span>
            </div>
          ))
        ) : (
          <div className="empty-message">
            <p>💬 Conversa con el asistente para completar los datos de tu campaña</p>
          </div>
        )}
      </div>

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
