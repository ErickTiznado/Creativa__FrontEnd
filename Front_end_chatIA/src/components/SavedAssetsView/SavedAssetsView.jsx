import { Bookmark, Download, X, Package } from 'lucide-react';
import { downloadAndSaveAssets } from '../../services/assetService';
import { useState } from 'react';
import './SavedAssetsView.css';

function SavedAssetsView({ savedAssets, onRemoveAsset, campaignId }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const handleDownloadAll = async () => {
        if (savedAssets.length === 0) return;
        if (!campaignId) {
            setDownloadError('No se pudo identificar la campaña');
            return;
        }

        setIsDownloading(true);
        setDownloadError(null);

        try {
            const result = await downloadAndSaveAssets(
                savedAssets,
                campaignId,
                `assets_campaign_${campaignId}`
            );

            console.log(`Assets ${result.action} in database:`, result.dbResponse);
            // Success feedback could be added here
        } catch (error) {
            console.error('Error downloading and saving assets:', error);
            setDownloadError('Error al descargar y guardar assets');
        } finally {
            setIsDownloading(false);
        }
    };
    return (
        <div className="saved-assets-view">
            <div className="sav-header">
                <div className="sav-header-content">
                    <Bookmark size={24} />
                    <h2>Assets Guardados</h2>
                </div>
                <div className="sav-header-actions">
                    <span className="sav-count">
                        {savedAssets.length} {savedAssets.length === 1 ? 'imagen' : 'imágenes'}
                    </span>
                    {savedAssets.length > 0 && (
                        <button
                            className="sav-download-all-btn"
                            onClick={handleDownloadAll}
                            disabled={isDownloading}
                            title="Descargar todo como ZIP y guardar en BD"
                        >
                            <Package size={18} />
                            {isDownloading ? 'Descargando...' : 'Descargar Todo'}
                        </button>
                    )}
                </div>
            </div>

            {downloadError && (
                <div className="sav-error">
                    {downloadError}
                </div>
            )}

            {savedAssets.length === 0 ? (
                <div className="sav-empty">
                    <Bookmark size={64} strokeWidth={1} />
                    <p>No hay assets guardados</p>
                    <span>Guarda imágenes desde el Generador para encontrarlas aquí</span>
                </div>
            ) : (
                <div className="sav-grid">
                    {savedAssets.map((img, index) => (
                        <div key={index} className="sav-item">
                            <div className="sav-image-wrapper">
                                {typeof img === 'string' ? (
                                    <img src={img} alt={`Asset ${index + 1}`} />
                                ) : (
                                    img
                                )}
                            </div>
                            <div className="sav-actions">
                                <button
                                    className="sav-action-btn"
                                    title="Descargar"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    className="sav-action-btn remove"
                                    onClick={() => onRemoveAsset(img)}
                                    title="Quitar de guardados"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedAssetsView;
