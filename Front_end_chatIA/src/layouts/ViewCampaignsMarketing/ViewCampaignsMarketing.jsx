import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd.jsx';
import LoadingSpinner from '../../components/animations/LoadingSpinner.jsx';
import { useCampaigns } from '../../hooks/useCampaigns.js';
import { Inbox } from 'lucide-react';
import CampaignFilter from '../../components/Campaigns/CampaignFilter.jsx';
import CampaignSection from '../../components/Campaigns/CampaignSection.jsx';
import './ViewCampaignsMarketing.css';

const SECTIONS_CONFIG = [
    { id: 'chat_draft', label: 'Borradores', title: 'Borradores de Chat' },
    { id: 'draft', label: 'En proceso', title: 'Campañas en proceso' },
    { id: 'approved', label: 'Aprobadas', title: 'Campañas aprobadas' },
    { id: 'rejected', label: 'Rechazadas', title: 'Campañas rechazadas' },
    { id: 'cancelled', label: 'Canceladas', title: 'Campañas canceladas' }
];

const STATUS_LABELS = {
    chat_draft: "Borrador de Chat",
    draft: "En Proceso",
    approved: "Aprobado",
    rejected: "Rechazado",
    cancelled: "Cancelado"
};

function ViewCampaignsMarketing() {
    const { campaigns, loading } = useCampaigns();
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

    const handleCardClick = (campaign) => {
        // Navigate to chat for both local drafts and API campaigns
        navigate(`/chat/${campaign.id}`);
    };

    const getFilteredSections = () => {
        if (activeFilter === 'all') {
            return SECTIONS_CONFIG;
        }
        return SECTIONS_CONFIG.filter(section => section.id === activeFilter);
    };

    if (loading) return (
        <div className="loading-container">
            <LoadingSpinner text="Cargando campañas..." />
        </div>
    );

    return (
        <div className='container-ViewCampaignsMarketing'>
            <div className='header-ViewCampaignsMarketing'>
                <ButtonAdd />
                <CampaignFilter
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    sections={SECTIONS_CONFIG}
                />
            </div>

            <div className='cards-ViewCampaignsMarketing'>
                {getFilteredSections().map((section, index) => {
                    const sectionCampaigns = campaigns.filter(c => c.status === section.id);

                    if (activeFilter === 'all' && sectionCampaigns.length === 0) {
                        return null;
                    }

                    return (
                        <div key={section.id}>
                            <CampaignSection
                                title={section.title}
                                campaigns={sectionCampaigns}
                                statusLabels={STATUS_LABELS}
                                onCardClick={handleCardClick}
                            />
                            {activeFilter === 'all' && index < SECTIONS_CONFIG.length - 1 && sectionCampaigns.length > 0 && <div className="section-divider"></div>}
                        </div>
                    );
                })}

                {activeFilter === 'all' && campaigns.length === 0 && (
                    <div className="empty-state-container">
                        <span className="empty-state-icon"><Inbox size={48} /></span>
                        <p className="empty-state-text">No hay campañas disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewCampaignsMarketing;