import React from 'react';
import './CampaignWorkspace.css';
import './ImgGenerated.css';
// Quitamos CircleUser, solo dejamos Menu
import { Menu } from 'lucide-react';
import { useCampaignWorkspace } from '../../hooks/useCampaignWorkspace';
import { useSavedAssets } from '../../hooks/useSavedAssets';

import RepositoryView from '../../components/RepositoryView/RepositoryView';
import GeneratorView from '../../components/GeneratorView/GeneratorView';
import SavedAssetsView from '../../components/SavedAssetsView/SavedAssetsView';

const CampaignWorkspace = () => {
    const {
        // Data
        campaignData,
        campaign,

        // UI State
        activeTab, setActiveTab,
        isSidebarOpen, setIsSidebarOpen,

        // Repository
        assets, loadingAssets, selectedIds, toggleSelection,
        handleDeleteAsset, handleApproveAsset,

        // Generator
        prompt, setPrompt,
        style, setStyle,
        useReference, setUseReference,
        aspectRatio, setAspectRatio,
        imageSize, setImageSize,
        quantity, setQuantity,
        generatedImages, handleGenerate,
        isGenerating, generationError,
        getRefinements,
    } = useCampaignWorkspace();

    // Single instance of saved assets — passed as props to children (DRY)
    const { savedAssets, loading: savedLoading, toggleSaveAsset } = useSavedAssets(campaign?.id);

    // --- LÓGICA DEL AVATAR ESTILO WHATSAPP ---
    const designerName = campaignData.designer || "Diseñador";
    const initial = designerName.charAt(0).toUpperCase();

    return (
        <div className='cw-layout'>
            {/* Overlay for mobile when sidebar is open */}
            <div
                className={`cw-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`cw-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className='cw-profile'>
                    {/* AVATAR INICIAL ESTILO WHATSAPP */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#00a884', /* Verde tipo WhatsApp oscuro */
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        margin: '0 auto 10px auto'
                    }}>
                        {initial}
                    </div>
                    <h3 className='cw-user-name'>{designerName}</h3>
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
                        designerName={designerName}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        style={style}
                        setStyle={setStyle}
                        useReference={useReference}
                        setUseReference={setUseReference}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        imageSize={imageSize}
                        setImageSize={setImageSize}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleGenerate={handleGenerate}
                        generatedImages={generatedImages}
                        referenceImages={assets.filter(asset => selectedIds.includes(asset.id))}
                        onDeselectReference={toggleSelection}
                        savedAssets={savedAssets}
                        onToggleSaveAsset={toggleSaveAsset}
                        isGenerating={isGenerating}
                        generationError={generationError}
                        getRefinements={getRefinements}
                        onDelete={handleDeleteAsset}
                        campaignId={campaign?.id}
                    />
                )}

                {activeTab === 'Assets' && (
                    <SavedAssetsView
                        campaignId={campaign?.id}
                        savedAssets={savedAssets}
                        loading={savedLoading}
                        toggleSaveAsset={toggleSaveAsset}
                        onApprove={handleApproveAsset}
                    />
                )}
            </main>
        </div>
    );
};

export default CampaignWorkspace;