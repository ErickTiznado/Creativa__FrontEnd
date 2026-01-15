import React from 'react';

const summaryData = [
  { label: 'Tipo', value: 'Reclutamiento' },
  { label: 'Objetivo', value: 'Contactar estudiantes' },
  { label: 'Publico', value: 'Universitario' },
  { label: 'fecha', value: '12 de octubre' },
  { label: 'Canal', value: 'redes sociales' },
  { label: 'Descripcion', value: 'descripcion breve' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="rocket">🚀</span> <h3>Tabla de resumen</h3>
      </div>

      <ul className="summary-list">
        {summaryData.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong> {item.value}
          </li>
        ))}
      </ul>

      <div className="search-bar">
        <span className="icon">🔍</span>
        <input type="text" placeholder="Buscar" />
      </div>

      <div className="user-card">
        <img src="https://i.pravatar.cc/150?img=11" alt="Juan" className="card-avatar" />
        <div className="user-info">
          <h4>Juan carlos</h4>
          <p>Diseñador</p>
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
