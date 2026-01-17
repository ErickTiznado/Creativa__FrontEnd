import React, { useState } from 'react';
import './CampaignWorkspace.css';
import './Generator.css';
import userImg from '../../assets/img/user.jpg'; 
import logostars from '../../assets/img/logostarts.png'; 

const CampaignWorkspace = () => {
    const [activeTab, setActiveTab] = useState('Repositorio');
    // Estado simple para simular selección de imágenes
    const [selectedIds, setSelectedIds] = useState([1, 2]); 

    // Estados para el generador
    const [prompt, setPrompt] = useState("Jóvenes universitarios , en oficina moderna, participando en Reunión en un ambiente profesional y colaborativo, colores y estilos alineados al manual de marca.");
    const [useReference, setUseReference] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("1:1 cuadrado");
    const [quantity, setQuantity] = useState(2);
    const [generatedImages, setGeneratedImages] = useState([]); // Array para imágenes generadas

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

    // Función para generar imágenes (placeholder)
    const handleGenerate = () => {
        // Lógica para generar imágenes (simular por ahora)
        const newImages = Array.from({ length: quantity }, (_, i) => `Generated IMG ${generatedImages.length + i + 1}`);
        setGeneratedImages([...generatedImages, ...newImages]);
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

                    {/* GENERADOR DE IMÁGENES IA */}
                    {activeTab === 'Generador' && (
                        <div className='cw-workspace'>
                            {/* Header del Generador */}
                            <header className="app-header">
                                <div className="icon-container">
                                    <img className="sparkles" src={logostars} alt="Stars Logo" />
                                </div>
                                <div className="header-text">
                                    <h1>Hola, {campaignData.designer}</h1>
                                    <p>Empezemos!</p>
                                </div>
                            </header>

                            {/* Panel del Generador */}
                            <section className="generator-panel">
                                <div className="prompt-container">
                                    <textarea 
                                        className="prompt-input"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>
                                <div className="controls-row">
                                    <div className='box-options'>
                                        <div className="control-group toggle-group">
                                            <label>Imagen de referencia</label>
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={useReference}
                                                    onChange={(e) => setUseReference(e.target.checked)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <div className="control-group">
                                            <label>Relacion de aspecto</label>
                                            <select 
                                                className="custom-select"
                                                value={aspectRatio}
                                                onChange={(e) => setAspectRatio(e.target.value)}
                                            >
                                                <option>1:1 cuadrado</option>
                                                <option>16:9 panoramico</option>
                                                <option>9:16 vertical</option>
                                            </select>
                                        </div>
                                        <div className="control-group small-input">
                                            <label>Cantidad:</label>
                                            <input 
                                                type="number" 
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                className="qty-input" 
                                            />
                                        </div>
                                    </div>
                                    <button className="generate-btn" onClick={handleGenerate}>
                                        Generar
                                    </button>
                                </div>
                            </section>

                            {/* Galería */}
                            <section className="gallery-section">
                                <div className="gallery-header">
                                    <h3>Galeria</h3>
                                    <button type='file' className="add-image-icon">
                                        <span>Agregar</span> <span>+</span>
                                    </button>
                                </div>
                                <div className={`gallery-content ${generatedImages.length === 0 ? 'empty' : ''}`}>
                                    {generatedImages.length === 0 ? (
                                        <p>No hay imagenes guardadas</p>
                                    ) : (
                                        generatedImages.map((img, index) => (
                                            <div key={index} className="generated-image">
                                                {img}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Vistas Placeholder */}
                    {activeTab === 'Observaciones' && <div className='cw-placeholder-view'>Notas y Observaciones</div>}

                </main>
            </div>
        </>
    );
};

export default CampaignWorkspace;