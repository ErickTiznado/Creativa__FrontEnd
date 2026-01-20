import React, { useState } from 'react';
import './CampaignWorkspace.css';
import './ImgGenerated.css';

import userImg from '../../assets/img/user.jpg';
import imgSaved from '../../assets/img/Saved.png';
import saveIcon from '../../assets/img/save.svg';
import editIcon from '../../assets/img/editar.svg';

// Importar los nuevos componentes
import RepositoryView from '../../components/RepositoryView/RepositoryView';
import GeneratorView from '../../components/GeneratorView/GeneratorView';

const CampaignWorkspace = () => {
    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState('Repositorio');
    
    // Estado Repositorio
    const [selectedIds, setSelectedIds] = useState([1, 2]);

    // Estado Generador
    const [prompt, setPrompt] = useState("Jóvenes universitarios, en oficina moderna, participando en Reunión...");
    const [useReference, setUseReference] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("1:1 cuadrado");
    const [quantity, setQuantity] = useState(2);
    const [generatedImages, setGeneratedImages] = useState([]); 

    // Estado Edición
    const [activeEdit, setActiveEdit] = useState('Solicitud');
    const [selectedImg, setSelectedImg] = useState([]);
    const [textEdit, setTextEdit] = useState("");
    const [selectedSaveImg, setSelectedSaveImg] = useState([]);

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

    // --- FUNCIONES ---
    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectionImg = (index) => {
        if (selectedImg.includes(index)) {
            setSelectedImg([]);
        } else {
            setSelectedImg([index]);
        }
    };

    const toggleSaveImg = (index) => {
        if (selectedSaveImg.includes(index)) {
            setSelectedSaveImg(selectedSaveImg.filter(itemId => itemId !== index));
        } else {
            setSelectedSaveImg([...selectedSaveImg, index]);
        }
    };

    const handleGenerate = () => {
        const newImages = Array.from({ length: quantity }, (_, i) => `Generated IMG ${generatedImages.length + i + 1}`);
        setGeneratedImages([...generatedImages, ...newImages]);
        setActiveTab('ImgGenerada');
    };

    const handleGenerateEdit = () => {
        // Lógica futura para editar
    };

    const showEdit = () => {
        if (activeEdit === 'Solicitud') {
            return (
                <>
                    <div className="prompt-container-edit">
                        <textarea
                            className="prompt-input-edit"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <div className="controls-row-edit">
                        <div className='box-options'>
                            <div className="control-group-edit">
                                <label className="label-edit">Relacion de aspecto</label>
                                <select
                                    className="custom-select-edit"
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(e.target.value)}
                                >
                                    <option>1:1 cuadrado</option>
                                    <option>16:9 panoramico</option>
                                    <option>9:16 vertical</option>
                                </select>
                            </div>
                        </div>
                        <button className="generate-back-btn" onClick={handleGenerateEdit}>
                            Volver a generar
                        </button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="prompt-container-edit-img">
                        <textarea
                            className="prompt-input-edit-img"
                            placeholder='Seleccione una imagen y escriba lo que desea cambiar'
                            value={textEdit}
                            onChange={(e) => setTextEdit(e.target.value)}
                        />
                    </div>
                    <div className="controls-row-edit">
                         <div className='box-options'>
                            <div className="control-group-edit">
                                <label className="label-edit">Relacion de aspecto</label>
                                <select
                                    className="custom-select-edit"
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(e.target.value)}
                                >
                                    <option>1:1 cuadrado</option>
                                    <option>16:9 panoramico</option>
                                    <option>9:16 vertical</option>
                                </select>
                            </div>
                        </div>
                        <button className="generate-back-btn" onClick={handleGenerateEdit}>
                            Volver a generar
                        </button>
                    </div>
                </>
            );
        }
    };

    return (
        <div className='cw-layout'>
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
                        Repositorio
                    </button>
                    <button
                        className={`cw-nav-item ${activeTab === 'Generador' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Generador')}
                    >
                        Generador Img
                    </button>
                    <button
                        className={`cw-nav-item ${activeTab === 'Observaciones' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Observaciones')}
                    >
                        Observaciones
                    </button>
                </nav>
            </aside>

            <main className='cw-main-content'>
                <header className='cw-header'>
                    <div className='cw-header-left'>
                        <h1 className='cw-title'>{campaignData.title}</h1>
                        <span className='cw-status'>{campaignData.status}</span>
                    </div>
                </header>

                {activeTab === 'Repositorio' && (
                    <RepositoryView 
                        campaignData={campaignData}
                        selectedIds={selectedIds}
                        toggleSelection={toggleSelection}
                    />
                )}

                {activeTab === 'Generador' && (
                    <GeneratorView 
                        designerName={campaignData.designer}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        useReference={useReference}
                        setUseReference={setUseReference}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleGenerate={handleGenerate}
                        generatedImages={generatedImages}
                    />
                )}

                {activeTab === 'ImgGenerada' && (
                    <div className='cw-workspace'>
                        <section className='cw-workspace-edit'>
                            <div className="generator-panel-img" style={{ display: selectedImg.length === 0 ? 'grid' : 'flex'}}>
                                {generatedImages.length === 0 ? (
                                    <p>No hay imágenes guardadas</p>
                                ) : (
                                    generatedImages.map((img, index) => {
                                        const isVisible = selectedImg.length === 0 || selectedImg.includes(index);
                                        if (!isVisible) return null;
                                        return (
                                            <div key={index} className='img-generator-container'>
                                                <div className="img-generator">
                                                    {activeEdit !== "Solicitud" && (
                                                        <div
                                                            className='cw-check'
                                                            onClick={() => toggleSelectionImg(index)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {selectedImg.includes(index) ? '✓' : ''}
                                                        </div>
                                                    )}
                                                    {activeEdit === "Solicitud" && (
                                                        <div className="img-generator-saved" onClick={() => toggleSaveImg(index)}>
                                                            <img src={imgSaved} alt="saved" />
                                                        </div>
                                                    )}
                                                    <img style={{width: selectedImg.includes(index)? '300px' : '200px', height: selectedImg.includes(index) ? '300px' : '200px' }} src="https://8d073164.delivery.rocketcdn.me/wp-content/uploads/2025/03/computadora-103.jpg" alt="" />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="generator-panel-edit">
                                <div className="edit-options">
                                    <button className="Edit-prompt" onClick={() => setActiveEdit('Solicitud')} style={{ backgroundColor: activeEdit === 'Solicitud' ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-panel)' }}>Editar solicitud</button>
                                    <button className="Edit-img" onClick={() => setActiveEdit('Imagen')} style={{ backgroundColor: activeEdit === 'Imagen' ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-panel)' }}>Editar imagen</button>
                                </div>
                                {showEdit()}
                            </div>
                        </section>

                        <section className="gallery-section-generated">
                            <div className="gallery-header-generated">
                                <h3>Galeria</h3>
                                <button type='file' className="add-image-icon-generated">
                                    <span>Agregar</span> <span>+</span>
                                </button>
                            </div>
                            <div className={`gallery-content-generated ${selectedSaveImg.length === 0 ? 'empty' : ''}`} style={selectedSaveImg.length === 0 ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }} >
                                {selectedSaveImg.length === 0 ? (
                                    <p className='gallery-content-empty-text'>No hay imagenes guardadas</p>
                                ) : (
                                    selectedSaveImg.map((img, index) => (
                                        <div key={index} className="generated-image-generated">
                                            <div className='imgSaved-container'>
                                                <div className='imgSaved-img'>
                                                    <img src="https://8d073164.delivery.rocketcdn.me/wp-content/uploads/2025/03/computadora-103.jpg" alt="" />
                                                </div>
                                                <div className='imgSaved-description'>
                                                    <p className="imgSaved-description-text">Lorem ipsum dolor sit amet consectetur...</p></div>
                                                <div className='imgSaved-options'>
                                                    <button className='imgSaved-Edit-img'><img className='imgSaved-edit' src={editIcon} alt="Editar" /></button>
                                                    <button className='imgSaved-Save-img'><img className='imgSaved-save' src={saveIcon} alt="Guardar" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'Observaciones' && <div className='cw-placeholder-view-generated'>Notas y Observaciones</div>}
            </main>
        </div>
    );
};

export default CampaignWorkspace;