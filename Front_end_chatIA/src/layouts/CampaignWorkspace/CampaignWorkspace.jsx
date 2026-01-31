import React from 'react';
import './CampaignWorkspace.css';
import './ImgGenerated.css';
import { CircleUser, Bookmark, Save, Pencil, Menu, Check } from 'lucide-react';
import { useCampaignWorkspace } from '../../hooks/useCampaignWorkspace';
import { useSavedAssets } from '../../hooks/useSavedAssets';

// Importar los nuevos componentes
import RepositoryView from '../../components/RepositoryView/RepositoryView';
import GeneratorView from '../../components/GeneratorView/GeneratorView';
import SavedAssetsView from '../../components/SavedAssetsView/SavedAssetsView';

const CampaignWorkspace = () => {
    const {
        // Data
        campaignData,
        campaign, // Add campaign object for ID extraction

        // UI State
        activeTab, setActiveTab,
        isSidebarOpen, setIsSidebarOpen,

        // Repository State
        assets, loadingAssets, selectedIds, toggleSelection,

        // Generator State
        prompt, setPrompt,
        style, setStyle,
        useReference, setUseReference,
        aspectRatio, setAspectRatio,
        quantity, setQuantity,
        generatedImages, handleGenerate,
        isGenerating, generationError,

        // Edit State
        activeEdit, setActiveEdit,
        selectedImg, toggleSelectionImg,
        textEdit, setTextEdit,
        selectedSaveImg, toggleSaveImg,
        handleGenerateEdit,
        getRefinements,
        handleDeleteAsset
    } = useCampaignWorkspace();

    // Saved assets state with backend persistence
    const { savedAssets, toggleSaveAsset } = useSavedAssets(campaign?.id);

    // Helper para renderizar los controles de edición (UI only)
    const renderEditControls = () => {
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
                                    <option value="1:1">1:1 cuadrado</option>
                                    <option value="16:9">16:9 panoramico</option>
                                    <option value="9:16">9:16 vertical</option>
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
                                    <option value="1:1">1:1 cuadrado</option>
                                    <option value="16:9">16:9 panoramico</option>
                                    <option value="9:16">9:16 vertical</option>
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
            {/* Overlay para mobile cuando el sidebar está abierto */}
            <div
                className={`cw-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar: agregada clase dinámica open/closed */}
            <aside className={`cw-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className='cw-profile'>
                    <CircleUser className='cw-avatar' size={80} strokeWidth={1.5} />
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
                        className={`cw-nav-item ${activeTab === 'Assets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Assets')}
                    >
                        Assets
                    </button>
                </nav>
            </aside>

            <main className='cw-main-content'>
                <header className='cw-header'>
                    <div className='cw-header-left'>
                        {/* Botón toggle visible en pantallas pequeñas */}
                        <button
                            className="cw-toggle-sidebar"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <Menu />
                        </button>

                        <h1 className='cw-title'>{campaignData.title}</h1>
                        <span className='cw-status'>{campaignData.status}</span>
                    </div>
                </header>

                {activeTab === 'Repositorio' && (
                    <RepositoryView
                        campaignData={campaignData}
                        selectedIds={selectedIds}
                        toggleSelection={toggleSelection}
                        assets={assets}
                        loading={loadingAssets}
                        onDelete={handleDeleteAsset}
                    />
                )}


                {activeTab === 'Generador' && (
                    <GeneratorView
                        designerName={campaignData.designer}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        style={style}
                        setStyle={setStyle}
                        useReference={useReference}
                        setUseReference={setUseReference}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleGenerate={handleGenerate}
                        generatedImages={generatedImages}
                        referenceImages={assets.filter(asset => selectedIds.includes(asset.id))}
                        onDeselectReference={toggleSelection}
                        onToggleSaveAsset={toggleSaveAsset}
                        isGenerating={isGenerating}
                        generationError={generationError}
                        getRefinements={getRefinements}
                        onDelete={handleDeleteAsset}
                        campaignId={campaign?.id}
                    />
                )}

                {/* Assets Tab */}
                {activeTab === 'Assets' && (
                    <SavedAssetsView
                        campaignId={campaign?.id}
                    />
                )}

                {activeTab === 'ImgGenerada' && (
                    <div className='cw-workspace'>
                        <section className='cw-workspace-edit'>
                            <div className="generator-panel-img" style={{ display: selectedImg.length === 0 ? 'grid' : 'flex' }}>
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
                                                            {selectedImg.includes(index) ? <Check size={16} /> : ''}
                                                        </div>
                                                    )}
                                                    {activeEdit === "Solicitud" && (
                                                        <div className="img-generator-saved" onClick={() => toggleSaveImg(index)}>
                                                            <Bookmark className='imgSaved-save' size={20} />
                                                        </div>
                                                    )}
                                                    <img
                                                        style={{
                                                            width: selectedImg.includes(index) ? '300px' : '200px',
                                                            height: selectedImg.includes(index) ? '300px' : '200px',
                                                            // Highlight refinements/variations with a different border
                                                            border: img.parent_asset_id ? '2px solid #a855f7' : 'none',
                                                            borderRadius: img.parent_asset_id ? '8px' : '0'
                                                        }}
                                                        // Fallback logic for URL structure (string vs object)
                                                        src={typeof img.img_url === 'string' ? img.img_url : img.img_url?.url}
                                                        alt={img.prompt_used || "Generación"}
                                                    />
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
                                {renderEditControls()}
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
                                                    <button className='imgSaved-Edit-img'><Pencil className='imgSaved-edit' size={16} /></button>
                                                    <button className='imgSaved-Save-img'><Save className='imgSaved-save' size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CampaignWorkspace;