import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cards from '../../components/Cards/cards.jsx'
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd.jsx'
import { handleGetCampaigns } from "../../../functions/handlegetCampaigns.js"
import { getDrafts } from '../../services/draftService.js'; // Import draft service
import './ViewCampaignsMarketing.css';
import { FolderClosed } from 'lucide-react';
import LoadingSpinner from '../../components/animations/LoadingSpinner.jsx';

const SECTIONS_CONFIG = [
    { id: 'chat_draft', label: 'Borradores', title: 'Borradores de Chat' }, // New Section
    { id: 'draft', label: 'En proceso', title: 'Campañas en proceso' },
    { id: 'approved', label: 'Aprobadas', title: 'Campañas aprobadas' },
    { id: 'rejected', label: 'Rechazadas', title: 'Campañas rechazadas' },
    { id: 'cancelled', label: 'Canceladas', title: 'Campañas canceladas' }
];

const STATUS_LABELS = {
    chat_draft: "Borrador de Chat", // New Label
    draft: "En Proceso",
    approved: "Aprobado",
    rejected: "Rechazado",
    cancelled: "Cancelado"
};

function ViewCampaignsMarketing() {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const getCampaigns = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch Local Drafts
                const localDrafts = getDrafts().map(d => ({
                    id: d.id,
                    status: 'chat_draft',
                    isLocalDraft: true, // Flag to identify local drafts
                    brief_data: {
                        nombre_campaing: d.preview || "Nuevo Chat",
                        fechaPublicacion: new Date(d.lastActive).toLocaleDateString()
                    }
                }));

                // 2. Fetch API Campaigns
                const result = await handleGetCampaigns()
                let apiCampaigns = [];
                if (result.success) {
                    apiCampaigns = result.data || [];
                }

                // 3. Merge Both
                setCampaigns([...localDrafts, ...apiCampaigns]);

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

    const handleCardClick = (campaign) => {
        if (campaign.isLocalDraft) {
            // Navigate to Chat with Draft ID to resume
            navigate(`/chat/${campaign.id}`);
        } else {
            // Navigate to standard campaign view (preserving existing behavior if any)
            // For now, existing campaigns might not have a specific click action defined here,
            // or if they do, add it here.
            console.log("Clicked API campaign:", campaign.id);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
            <LoadingSpinner text="Cargando campañas..." />
        </div>
    );

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
                                            onClick={() => handleCardClick(c)} // Pass click handler
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