import { Bookmark, Download, X, Package, ThumbsUp } from 'lucide-react';
import { downloadImagesAsZip } from '../../services/assetService';
import { getImageUrl, downloadImage } from '../../utils/imageUtils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import './SavedAssetsView.css';

/**
 * View for displaying and managing saved assets.
 * Receives all data as props from parent (single source of truth).
 */
function SavedAssetsView({
    campaignId,
    savedAssets = [],
    loading = false,
    toggleSaveAsset,
    onApprove,
}) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const handleDownloadAll = async () => {
        if (savedAssets.length === 0) return;

        setIsDownloading(true);
        setDownloadError(null);

        try {
            const zipFileName = `campaña_${campaignId || 'assets'}_${new Date().toISOString().slice(0, 10)}`;
            await downloadImagesAsZip(savedAssets, zipFileName);
            toast.success(`${savedAssets.length} asset(s) descargados como ZIP`);
        } catch (error) {
            console.error('Error downloading assets as ZIP:', error);
            setDownloadError('Error al crear el archivo ZIP');
            toast.error('Error al descargar assets');
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

            {loading ? (
                <div className="sav-loading">
                    <p>Cargando assets guardados...</p>
                </div>
            ) : savedAssets.length === 0 ? (
                <div className="sav-empty">
                    <Bookmark size={64} strokeWidth={1} />
                    <p>No hay assets guardados</p>
                    <span>Guarda imágenes desde el Generador para encontrarlas aquí</span>
                </div>
            ) : (
                <div className="sav-grid">
                    {savedAssets.map((img, index) => {
                        const imgUrl = getImageUrl(img);
                        return (
                            <div key={img.id || index} className="sav-item">
                                <div className="sav-image-wrapper">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={`Asset ${index + 1}`} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#888' }}>
                                            Sin imagen
                                        </div>
                                    )}
                                </div>
                                <div className="sav-actions">
                                    <button
                                        className="sav-action-btn"
                                        onClick={() => {
                                            if (imgUrl) {
                                                downloadImage(imgUrl, `asset_${index + 1}_${Date.now()}.png`);
                                            }
                                        }}
                                        title="Descargar"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        className={`sav-action-btn approve ${img.is_approved ? 'active' : ''}`}
                                        onClick={async () => {
                                            if (!img?.id || !onApprove) return;
                                            try {
                                                await onApprove(img.id);
                                                toast.success('Asset aprobado correctamente', {
                                                    icon: <ThumbsUp size={18} color="var(--color-success)" />
                                                });
                                            } catch (error) {
                                                toast.error('Error al aprobar asset');
                                            }
                                        }}
                                        title="Aprobar (Confirmar guardado)"
                                    >
                                        <ThumbsUp size={16} fill={img.is_saved ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        className="sav-action-btn remove"
                                        onClick={async () => {
                                            if (!img?.id) {
                                                toast.error('Error: ID de asset no encontrado');
                                                return;
                                            }
                                            try {
                                                await toggleSaveAsset(img.id, true);
                                                toast.success('Removido de guardados');
                                            } catch (error) {
                                                toast.error('Error al remover asset');
                                            }
                                        }}
                                        title="Quitar de guardados"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SavedAssetsView;
