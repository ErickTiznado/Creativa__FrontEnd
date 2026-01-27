import React, { useState } from 'react';
import Cards from '../../components/Cards/cards.jsx'
import './ViewAssignmentsDesigner.css'
import { useCampaigns, useUpdateCampaignStatus } from '../../hooks/useDesigners.js';
import { FolderClosed, Inbox } from 'lucide-react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { updateCampaignStatus } from '../../services/designerService.js';

// Configuration for sections
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


const DraggableCard = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        touchAction: 'none', // Recommended for touch devices
        zIndex: 1000, // Ensure it's above other elements while dragging
        cursor: 'grab'
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

const DroppableSection = ({ id, children, className }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });
    const style = {
        transition: 'background-color 0.2s ease',
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.03)' : undefined,
        borderRadius: '8px',
        minHeight: '100px' // Ensure there's a drop target even if empty
    };

    return (
        <div ref={setNodeRef} style={style} className={className}>
            {children}
        </div>
    );
};

function ViewAssignmentsDesigner() {
    const { campaigns, loading, setCampaigns } = useCampaigns();
    const [activeFilter, setActiveFilter] = useState('all');

    if (loading) return <div>Cargando...</div>;

    const getFilteredSections = () => {
        if (activeFilter === 'all') {
            return SECTIONS_CONFIG;
        }
        return SECTIONS_CONFIG.filter(section => section.id === activeFilter);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Find the moved campaign
            const campaignId = active.id;
            const newStatus = over.id;

            // Optimistic update
            setCampaigns((prev) =>
                prev.map((campaign) =>
                    campaign.id === campaignId
                        ? { ...campaign, status: newStatus }
                        : campaign
                )
            );

            try {
                const response = updateCampaignStatus(campaignId, newStatus);
                console.log(response.data, "response");
            } catch (e) {
                setCampaigns((prev) =>
                    prev.map((campaign) =>
                        campaign.id === campaignId
                            ? { ...campaign, status: campaign.status } // Revert to previous status
                            : campaign
                    )
                );
                console.log(e, "error");
                throw e;
            }

        }
    };

    return (
        <div className='container-ViewCampaignsMarketing'>
            <div className='header-ViewAssignmentsDesigner'>
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

            <div className="cardsViewCampaignsMarketing">
                <DndContext onDragEnd={handleDragEnd}>
                    {getFilteredSections().map((section, index) => {
                        const sectionCampaigns = campaigns.filter(c => c.status === section.id);

                        // If filtering by specific status, show empty state if no items.
                        // If showing "All", strictly hide empty sections to reduce noise? 
                        // Let's decide: If "All", show title but maybe compact empty message?
                        // Actually, standard behavior: if All, only show sections that have items OR show all with empty state.
                        // Let's go with: Show all sections if All.


                        // Check if we should render empty sections. For Drag and Drop, we MUST render them so they can be drop targets.
                        // if (activeFilter === 'all' && sectionCampaigns.length === 0) {
                        //    return null; 
                        // }


                        return (
                            <div key={section.id} className="section-container">
                                <h3>{section.title}</h3>
                                <DroppableSection id={section.id} className="cards-grid">
                                    {sectionCampaigns.length > 0 ? (
                                        sectionCampaigns.map((c, i) => (
                                            <DraggableCard key={c.id || i} id={c.id}>
                                                <Cards
                                                    titulo={c.brief_data?.nombre_campaing || "Sin título"}
                                                    estado={STATUS_LABELS[c.status]}
                                                    fecha={c.brief_data?.fechaPublicacion || "Fecha no disponible"}
                                                />
                                            </DraggableCard>
                                        ))
                                    ) : (
                                        <div className="empty-state-container">
                                            <span className="empty-state-icon"><FolderClosed /></span>
                                            <p className="empty-state-text">Arrastra aquí para mover a esta sección</p>
                                        </div>
                                    )}
                                </DroppableSection>
                                {/* Divider only if not the last item and we are in 'all' mode */}
                                {activeFilter === 'all' && index < SECTIONS_CONFIG.length - 1 && <div className="section-divider"></div>}
                            </div>
                        );
                    })}
                </DndContext>

                {/* Fallback if everything is empty in 'all' mode */}
                {activeFilter === 'all' && campaigns.length === 0 && (
                    <div className="empty-state-container">
                        <span className="empty-state-icon"><Inbox size={48} /></span>
                        <p className="empty-state-text">No tienes ninguna campaña asignada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAssignmentsDesigner;