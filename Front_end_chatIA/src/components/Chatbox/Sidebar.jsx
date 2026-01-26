import React, { useState, useMemo, useCallback } from 'react';
import { Rocket, Search, X } from 'lucide-react';
import { sendCampaign } from '../../services/designerService';
import { useDesigners } from '../../hooks/useDesigners';
import { useUser } from '../../hooks/useUser';
import {
  getTranslatedLabel,
  validateCampaignData,
  formatBriefData
} from '../../config/campaignConfig';

/**
 * Sidebar - Campaign summary and designer selection component.
 * Uses custom hooks for data fetching and config for constants.
 */
const Sidebar = ({ className, onToggle, briefData = [], type }) => {
  const summaryData = Array.isArray(briefData) ? briefData : [];
  const { designers } = useDesigners();
  const user = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  // Memoized filtered designers list
  const filteredDesigners = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return designers.filter((designer) =>
      designer.first_name.toLowerCase().includes(term) ||
      designer.last_name.toLowerCase().includes(term)
    );
  }, [designers, searchTerm]);

  // Handle campaign submission
  const handleSendCampaign = useCallback(async () => {
    const missingFields = validateCampaignData(summaryData);
    const isBriefComplete = missingFields.length === 0;

    if (isBriefComplete && selectedDesigner && user) {
      try {
        const formattedBriefData = formatBriefData(summaryData);
        const campaign = {
          user_id: user.id,
          briefData: formattedBriefData,
          designer_id: selectedDesigner.id
        };

        const response = await sendCampaign(campaign);

        if (response?.status === 200 || response?.data) {
          alert("Campaña enviada con éxito!");
        }
      } catch (e) {
        console.error("Error sending campaign:", e);
        alert("Error al enviar la campaña: " + (e.response?.data?.message || e.message));
      }
    } else {
      if (!user) {
        alert("Error: No se encontró información del usuario. Por favor inicie sesión nuevamente.");
      } else if (!selectedDesigner) {
        alert("Por favor seleccione un diseñador.");
      } else if (!isBriefComplete) {
        const missingNames = missingFields.map(getTranslatedLabel).join(', ');
        alert(`No se puede enviar la campaña porque faltan datos obligatorios:\n\nFaltan: ${missingNames}\n\nPor favor completa la conversación con el asistente.`);
      }
    }
  }, [summaryData, selectedDesigner, user]);

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <Rocket /> <h3>Resumen de Campaña</h3>
        <button className="close-sidebar-btn" onClick={onToggle}>
          <X />
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
            <p>Conversa con el asistente para completar los datos de tu campaña</p>
          </div>
        )}
      </div>

      <div className="search-bar">
        <span className="icon"><Search /></span>
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='box-users'>
        {filteredDesigners.map((designer) => (
          <div
            className="user-card"
            key={designer.id || designer.first_name}
            onClick={() => setSelectedDesigner(designer)}
          >
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt={designer.first_name}
              className="card-avatar"
            />
            <div className="user-info">
              <h4>{designer.first_name} {designer.last_name}</h4>
              <p>Diseñador</p>
            </div>
          </div>
        ))}
      </div>

      <div className="send-action-area">
        <label>Enviar campaña a:</label>
        <div className="recipient-tag">
          {selectedDesigner ? (
            <>
              <img src="https://i.pravatar.cc/150?img=11" alt="u" />
              <span>{selectedDesigner.first_name} {selectedDesigner.last_name}</span>
              <button className="close-tag" onClick={() => setSelectedDesigner(null)}>×</button>
            </>
          ) : (
            <p>No hay diseñador seleccionado</p>
          )}
        </div>
        <button className="main-cta-btn" onClick={handleSendCampaign}>Enviar</button>
      </div>
    </aside>
  );
};

export default Sidebar;
