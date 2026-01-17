import React, { useState } from 'react';
import './CampaignWorkspace.css';
import userImg from '../../assets/img/user.jpg'; 

const CampaignWorkspace = () => {
    const [activeTab, setActiveTab] = useState('Repositorio');
    // Estado simple para simular selección de imágenes
    const [selectedIds, setSelectedIds] = useState([1, 2]); 

    // Mock Data
    const campaignData = {
        designer: "Juan Carlos",
        title: "Campaña de reclutamiento de pasantes",
        status: "En proceso",
        details: {
            objective: "Contactar estudiantes de diseño para pasantías de verano.",
            channel: "Instagram, LinkedIn",
            public: "Universitarios 18-24 años",
            date: "12 de Octubre, 2023",
            description: "Se requiere un estilo visual dinámico y juvenil."
        },
        tags: ["Reclutamiento", "Oficina", "Jóvenes", "Tecnología", "Verano", "Equipo"],
        repoImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };

    // Función para alternar selección
    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <>
            <div className='cw-layout'>
                
                {/* --- SIDEBAR --- */}
                <aside className='cw-sidebar'>
                    <div className='cw-profile'>
                        <img src={userImg} alt="Designer" className='cw-avatar' />
                        <h3 className='cw-user-name'>{campaignData.designer}</h3>
                    </div>
                    
                    <nav className='cw-nav-menu'>
                        <button 
                            className={`cw-nav-item ${activeTab === 'Repositorio' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Repositorio')}
                        >
                            {/* ICON */}
                            Repositorio
                        </button>
                        <button 
                            className={`cw-nav-item ${activeTab === 'Generador' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Generador')}
                        >
                            {/* ICON */}
                            Generador Img
                        </button>
                        <button 
                            className={`cw-nav-item ${activeTab === 'Observaciones' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Observaciones')}
                        >
                            {/* ICON */}
                            Observaciones
                        </button>
                    </nav>
                </aside>

                {/* --- CONTENIDO PRINCIPAL  --- */}
                <main className='cw-main-content'>
                    
                    {/* Encabezado Contextual */}
                    <header className='cw-header'>
                        <div className='cw-header-left'>
                            <h1 className='cw-title'>{campaignData.title}</h1>
                            <span className='cw-status'>{campaignData.status}</span>
                        </div>
                    </header>

                    {/* REPOSITORIO */}
                    {activeTab === 'Repositorio' && (
                        <div className='cw-workspace'>
                            
                            <section className='cw-top-section'>
                                
                                {/* Buscador y Grid */}
                                <div className='cw-panel'>
                                    <div className='cw-panel-header'>
                                        <h3 className='cw-panel-title'>Repositorio de Imágenes</h3>
                                    </div>
                                    
                                    <div className='cw-search-container'>
                                        <input 
                                            type="text" 
                                            placeholder="Buscar recursos..." 
                                            className='cw-search-bar'
                                        />
                                        <div className='cw-tags'>
                                            {campaignData.tags.map((tag, index) => (
                                                <span key={index} className='cw-tag'>{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='cw-image-grid'>
                                        {campaignData.repoImages.map((imgId) => {
                                            const isSelected = selectedIds.includes(imgId);
                                            return (
                                                <div 
                                                    key={imgId} 
                                                    className={`cw-img-card ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleSelection(imgId)}
                                                >
                                                    <span>IMG {imgId}</span>
                                                    {isSelected && <div className='cw-check-icon'>✓</div>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button className='cw-btn-action'>
                                        Usar estas imágenes ({selectedIds.length})
                                    </button>
                                </div>

                                {/* Detalles (Brief) */}
                                <div className='cw-panel'>
                                    <div className='cw-panel-header'>
                                        <h3 className='cw-panel-title'>Detalles del Proyecto</h3>
                                    </div>
                                    <div className='cw-details-content'>
                                        <div className='cw-detail-item'>
                                            <span className='cw-detail-label'>Objetivo</span>
                                            <span className='cw-detail-value'>{campaignData.details.objective}</span>
                                        </div>
                                        <div className='cw-detail-item'>
                                            <span className='cw-detail-label'>Canal</span>
                                            <span className='cw-detail-value'>{campaignData.details.channel}</span>
                                        </div>
                                        <div className='cw-detail-item'>
                                            <span className='cw-detail-label'>Público Objetivo</span>
                                            <span className='cw-detail-value'>{campaignData.details.public}</span>
                                        </div>
                                        <div className='cw-detail-item'>
                                            <span className='cw-detail-label'>Fecha Límite</span>
                                            <span className='cw-detail-value'>{campaignData.details.date}</span>
                                        </div>
                                        <div className='cw-detail-item'>
                                            <span className='cw-detail-label'>Descripción</span>
                                            <span className='cw-detail-value'>{campaignData.details.description}</span>
                                        </div>
                                    </div>
                                </div>

                            </section>

                            {/* Sección Inferior: Confirmación Visual */}
                            <section className='cw-bottom-section'>
                                <h3 className='cw-panel-title'>Imágenes seleccionadas para uso</h3>
                                <div className='cw-selected-strip'>
                                    {selectedIds.length === 0 ? (
                                        <p style={{color: 'var(--color-notification)'}}>No has seleccionado imágenes aún.</p>
                                    ) : (
                                        selectedIds.map((id) => (
                                            <div key={id} className='cw-selected-thumb'>
                                                IMG {id}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                        </div>
                    )}

                    {/* Vistas Placeholder */}
                    {activeTab === 'Generador' && <div className='cw-placeholder-view'>Generador de IA</div>}
                    {activeTab === 'Observaciones' && <div className='cw-placeholder-view'>Notas y Observaciones</div>}

                </main>
            </div>
        </>
    );
};

export default CampaignWorkspace;