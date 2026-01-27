import { useState, useEffect } from 'react';
import Cards from '../../components/Cards/cards.jsx'
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd.jsx'
import { handleGetCampaigns } from "../../../functions/handlegetCampaigns.js"
import './ViewCampaignsMarketing.css';
import { FolderClosed } from 'lucide-react';
const SECTIONS_CONFIG = [
    { id: 'draft', label: 'En proceso', title: 'Campañas en proceso' },
    { id: 'approved', label: 'Aprobadas', title: 'Campañas aprobadas' },
    { id: 'rejected', label: 'Rechazadas', title: 'Campañas rechazadas' },
    { id: 'cancelled', label: 'Canceladas', title: 'Campañas canceladas' }
];

const STATUS_LABELS = {
    draft: "En Proceso",
    approved: "Aprobado",
    rejected: "Rechazado",
    cancelled: "Cancelado"
};

function ViewCampaignsMarketing() {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const getCampaigns = async () => {
            try {
                setLoading(true);
                const result = await handleGetCampaigns()
                if (result.success) {
                    setCampaigns(result.data || [])
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        getCampaigns()
    }, [])

    const getFilteredSections = () => {
        if (activeFilter === 'all') {
            return SECTIONS_CONFIG;
        }
        return SECTIONS_CONFIG.filter(section => section.id === activeFilter);
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className='container-ViewCampaignsMarketing'>
            <div className='header-ViewCampaignsMarketing'>
                <ButtonAdd />

                <div role="tablist" className="filter-tabs">
                    <button
                        role="tab"
                        aria-selected={activeFilter === 'all'}
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Todos
                    </button>
                    {SECTIONS_CONFIG.map(section => (
                        <button
                            key={section.id}
                            role="tab"
                            aria-selected={activeFilter === section.id}
                            className={`filter-tab ${activeFilter === section.id ? 'active' : ''}`}
                            onClick={() => setActiveFilter(section.id)}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className='cards-ViewCampaignsMarketing'>
                {getFilteredSections().map((section, index) => {
                    const sectionCampaigns = campaigns.filter(c => c.status === section.id);

                    // Skip empty sections in 'all' view to keep it clean
                    if (activeFilter === 'all' && sectionCampaigns.length === 0) {
                        return null;
                    }

                    return (
                        <div key={section.id} className="section-container">
                            <h3>{section.title}</h3>
                            {sectionCampaigns.length > 0 ? (
                                <div className='cards-grid'>
                                    {sectionCampaigns.map((c, i) => (
                                        <Cards
                                            key={c.id || i}
                                            titulo={c.brief_data?.nombre_campaing || "Sin título"}
                                            estado={STATUS_LABELS[c.status]}
                                            fecha={c.brief_data?.fechaPublicacion || "Fecha no disponible"}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-container">
                                    <span className="empty-state-icon"><FolderClosed /></span>
                                    <p className="empty-state-text">No hay campañas en esta sección</p>
                                </div>
                            )}
                            {activeFilter === 'all' && index < SECTIONS_CONFIG.length - 1 && <div className="section-divider"></div>}
                        </div>
                    );
                })}

                {/* Global Empty State */}
                {activeFilter === 'all' && campaigns.length === 0 && (
                    <div className="empty-state-container">
                        <span className="empty-state-icon">📭</span>
                        <p className="empty-state-text">No hay campañas disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewCampaignsMarketing;