import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../../components/Cards/Cards.jsx'
import './ViewAssignmentsDesigner.css'
import { useCampaigns, useUpdateCampaignStatus, useCampaignsById } from '../../hooks/useDesigners.js';
import { FolderClosed, Inbox, Search } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import { useCampaignsContext } from '../../hooks/useCampaignsContext';

// Configuration for sections
const SECTIONS_CONFIG = [
    { id: 'draft', label: 'En proceso', title: 'En proceso', color: 'var(--color-proceso)' },
    { id: 'approved', label: 'Aprobadas', title: 'Aprobadas', color: '#4ade80' },
    { id: 'rejected', label: 'Rechazadas', title: 'Rechazadas', color: '#f87171' },
    { id: 'cancelled', label: 'Canceladas', title: 'Canceladas', color: '#94a3b8' }
];

const STATUS_LABELS = {
    draft: "En Proceso",
    approved: "Aprobado",
    rejected: "Rechazado",
    cancelled: "Cancelado"
};

const DraggableCard = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`kanban-card-wrapper ${isDragging ? 'dragging' : ''}`}
        >
            {children}
        </div>
    );
};

const DroppableSection = ({ id, children, className }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`${className}`}
            style={{
                backgroundColor: isOver ? 'rgba(255, 255, 255, 0.05)' : undefined
            }}
        >
            {children}
        </div>
    );
};

function ViewAssignmentsDesigner() {
    const { campaigns, loading, setCampaigns } = useCampaigns();
    const { updateCampaignStatus } = useUpdateCampaignStatus(); // Use the hook properly now
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeId, setActiveId] = useState(null); // For DragOverlay
    const navigate = useNavigate();
    const { setSelectedCamp } = useCampaignsContext();
    const { fetchCampaignsById } = useCampaignsById();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        })
    );

    const handleCampaignbyId = async (id) => {
        try {
            const data = await fetchCampaignsById(id);
            setSelectedCamp(data);
            navigate(`/designer/workspace/${id}`);
        } catch (e) {

        }
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            // Find the moved campaign
            const campaignId = active.id;
            const newStatus = over.id;

            // Only update if status is actually different
            const currentCampaign = campaigns.find(c => c.id === campaignId);
            if (currentCampaign && currentCampaign.status === newStatus) return;

            // Optimistic update
            setCampaigns((prev) =>
                prev.map((campaign) =>
                    campaign.id === campaignId
                        ? { ...campaign, status: newStatus }
                        : campaign
                )
            );

            try {
                await updateCampaignStatus(campaignId, newStatus);
            } catch (e) {
                setCampaigns((prev) =>
                    prev.map((campaign) =>
                        campaign.id === campaignId
                            ? { ...campaign, status: currentCampaign.status } // Revert
                            : campaign
                    )
                );
                console.error(e, "error updating status");
            }
        }
    };

    // Filter Logic
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            const name = c.brief_data?.nombre_campaing || "";
            return name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [campaigns, searchTerm]);

    const activeSections = activeFilter === 'all'
        ? SECTIONS_CONFIG
        : SECTIONS_CONFIG.filter(s => s.id === activeFilter);

    const activeDragItem = activeId ? campaigns.find(c => c.id === activeId) : null;

    if (loading) return <div className="global-empty-state">
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p>Cargando espacio de trabajo...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>;

    return (
        <div className='container-ViewCampaignsMarketing'>
            <div className='header-ViewAssignmentsDesigner'>
                <div className="controls-row">
                    <h1 className="page-title">Espacio de Trabajo</h1>

                    <div className="search-container">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar campaña..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div role="tablist" className="filter-tabs">
                        <button
                            role="tab"
                            aria-selected={activeFilter === 'all'}
                            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            Todo
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
            </div>

            <div className="kanban-board">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {activeSections.map((section) => {
                        const sectionCampaigns = filteredCampaigns.filter(c => c.status === section.id);

                        return (
                            <div key={section.id} className="kanban-column">
                                <div className="column-header">
                                    <div className="column-title">
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: section.color }}></span>
                                        {section.title}
                                    </div>
                                    <span className="column-count">{sectionCampaigns.length}</span>
                                </div>
                                <DroppableSection id={section.id} className="droppable-area">
                                    {sectionCampaigns.length > 0 ? (
                                        sectionCampaigns.map((c) => (
                                            <DraggableCard key={c.id} id={c.id}>
                                                <Cards
                                                    titulo={c.brief_data?.nombre_campaing || "Sin título"}
                                                    estado={STATUS_LABELS[c.status]}
                                                    fecha={c.brief_data?.fechaPublicacion || "Fecha no disponible"}
                                                    onClick={() => handleCampaignbyId(c.id)}
                                                />
                                            </DraggableCard>
                                        ))
                                    ) : (
                                        <div className="column-empty">
                                            {searchTerm ? (
                                                <p style={{ fontSize: '0.9rem' }}>No hay coincidences</p>
                                            ) : (
                                                <>
                                                    <span style={{ opacity: 0.3, marginBottom: 8 }}><FolderClosed size={24} /></span>
                                                    <p style={{ fontSize: '0.9rem' }}>Sin campañas</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </DroppableSection>
                            </div>
                        );
                    })}

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.5',
                                },
                            },
                        }),
                    }}>
                        {activeDragItem ? (
                            <div className="drag-overlay">
                                <Cards
                                    titulo={activeDragItem.brief_data?.nombre_campaing || "Sin título"}
                                    estado={STATUS_LABELS[activeDragItem.status]}
                                    fecha={activeDragItem.brief_data?.fechaPublicacion || "Fecha no disponible"}
                                    onClick={() => { }}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {filteredCampaigns.length === 0 && !loading && (
                    <div className="global-empty-state" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                        <span className="empty-state-icon"><Inbox size={48} /></span>
                        <p className="empty-state-text">
                            {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay campañas disponibles"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAssignmentsDesigner;