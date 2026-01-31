import { Bookmark, Download, X, Package } from 'lucide-react';
import { downloadAndSaveAssets } from '../../services/assetService';
import { useState } from 'react';
import toast from 'react-hot-toast';
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

    // Helper function to download images from external URLs
    const downloadImage = async (imageUrl, filename) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error('Error al descargar la imagen');
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
                                {(() => {
                                    // Extract URL from various asset structures
                                    let imgUrl = null;
                                    if (typeof img === 'string') {
                                        imgUrl = img;
                                    } else if (img) {
                                        if (img.preview && typeof img.preview === 'string') {
                                            imgUrl = img.preview;
                                        } else if (img.img_url) {
                                            if (typeof img.img_url === 'string') {
                                                imgUrl = img.img_url;
                                            } else if (img.img_url.url && typeof img.img_url.url === 'string') {
                                                imgUrl = img.img_url.url;
                                            } else if (img.img_url.thumbnail && typeof img.img_url.thumbnail === 'string') {
                                                imgUrl = img.img_url.thumbnail;
                                            }
                                        }
                                    }
                                    
                                    return imgUrl ? (
                                        <img src={imgUrl} alt={`Asset ${index + 1}`} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#888' }}>
                                            Sin imagen
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="sav-actions">
                                <button
                                    className="sav-action-btn"
                                    onClick={() => {
                                        // Extract URL from asset
                                        let imgUrl = null;
                                        if (typeof img === 'string') {
                                            imgUrl = img;
                                        } else if (img) {
                                            if (img.preview && typeof img.preview === 'string') {
                                                imgUrl = img.preview;
                                            } else if (img.img_url) {
                                                if (typeof img.img_url === 'string') {
                                                    imgUrl = img.img_url;
                                                } else if (img.img_url.url && typeof img.img_url.url === 'string') {
                                                    imgUrl = img.img_url.url;
                                                } else if (img.img_url.thumbnail && typeof img.img_url.thumbnail === 'string') {
                                                    imgUrl = img.img_url.thumbnail;
                                                }
                                            }
                                        }
                                        
                                        if (imgUrl) {
                                            downloadImage(imgUrl, `asset_${index + 1}_${Date.now()}.png`);
                                        }
                                    }}
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
