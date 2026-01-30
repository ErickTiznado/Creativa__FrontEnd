import React, { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Rocket, Search, X, AlertTriangle, AlertCircle } from 'lucide-react';
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
const Sidebar = ({ className, onToggle, briefData = [] }) => {
  const summaryData = useMemo(() => Array.isArray(briefData) ? briefData : [], [briefData]);
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
          toast.success("Campaña enviada con éxito!", {
            icon: <Rocket size={28} color="var(--color-success)" />
          });
        }
      } catch (e) {
        console.error("Error sending campaign:", e);
        toast.error("Error al enviar la campaña: " + (e.response?.data?.message || e.message), {
            icon: <AlertTriangle size={28} color="var(--color-error)" />
        });
      }
    } else {
      if (!user) {
        toast.error("Error: No se encontró información del usuario. Por favor inicie sesión nuevamente.");
      } else if (!selectedDesigner) {
        toast('Por favor seleccione un diseñador.', {
            icon: <AlertCircle size={28} color="var(--color-warning)" />,
            style: {
                border: '1px solid var(--color-warning)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-panel)'
            }
        });
      } else if (!isBriefComplete) {
        const missingNames = missingFields.map(getTranslatedLabel).join(', ');
        toast(`Faltan datos obligatorios: ${missingNames}. Por favor completa la conversación.`, {
            duration: 5000,
            icon: <div style={{ display: 'flex', minWidth: '28px' }}><AlertTriangle size={28} color="var(--color-error)" /></div>,
            style: {
                border: '1px solid var(--color-error)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-panel)'
            }
        });
      }
    }
  }, [summaryData, selectedDesigner, user]);

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <Rocket /> <h3 className='sidebar-h3'>Resumen de Campaña</h3>
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
