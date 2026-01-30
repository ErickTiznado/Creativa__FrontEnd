import React from 'react';
import './RepositoryView.css';
import { Check, Trash2 } from 'lucide-react';
import LoadingSpinner from '../animations/LoadingSpinner';
import ConfirmationModal from '../Modals/ConfirmationModal';

function RepositoryView({ campaignData, selectedIds, toggleSelection, assets = [], loading = false, onDelete }) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalImage, setModalImage] = React.useState(null);
    
    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [assetToDelete, setAssetToDelete] = React.useState(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const timerRef = React.useRef(null);

    const startLongPress = (imgUrl) => {
        // iniciar temporizador de 500ms
        clearLongPress();
        timerRef.current = setTimeout(() => {
            setModalImage(imgUrl);
            setModalOpen(true);
            timerRef.current = null;
        }, 500);
    };

    const clearLongPress = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalImage(null);
    };

    const handleDeleteClick = (e, asset) => {
        e.stopPropagation(); // Prevent selection
        setAssetToDelete(asset);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!assetToDelete || !onDelete) return;

        try {
            setIsDeleting(true);
            await onDelete(assetToDelete.id);
            setDeleteModalOpen(false);
            setAssetToDelete(null);
        } catch (error) {
            console.error("Error deleting asset:", error);
            // Optionally show error toast here
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setDeleteModalOpen(false);
        setAssetToDelete(null);
    };
    // Bloquear scroll del body mientras el modal está abierto
    React.useEffect(() => {
        if (modalOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
        return undefined;
    }, [modalOpen]);
    return (
        <>
        <div className='repository-container'>
            <section className='cw-top-section'>
                {/* Panel Izquierdo: Buscador y Grid */}
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
                        {loading ? (
                            <div className="cw-loading">
                                <LoadingSpinner text="Cargando recursos..." size={30} />
                            </div>
                        ) : assets.length > 0 ? (
                            assets.map((asset) => {
                                const isSelected = selectedIds.includes(asset.id);
                                return (
                                    <div
                                        key={asset.id}
                                        className={`cw-img-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleSelection(asset.id)}
                                        style={{ overflow: 'hidden', padding: 0 }}
                                        onMouseDown={() => startLongPress(asset.img_url?.url || asset.img_url?.thumbnail)}
                                        onMouseUp={clearLongPress}
                                        onMouseLeave={clearLongPress}
                                        onTouchStart={() => startLongPress(asset.img_url?.url || asset.img_url?.thumbnail)}
                                        onTouchEnd={clearLongPress}
                                        onTouchMove={clearLongPress}
                                    >
                                        <img
                                            src={asset.img_url?.thumbnail || asset.img_url?.url}
                                            alt="Thumbnail"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                        
                                        {/* Delete Button */}
                                        <button 
                                            className="cw-delete-btn"
                                            onClick={(e) => handleDeleteClick(e, asset)}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                padding: '4px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                zIndex: 10,
                                                opacity: 0, // Hidden by default
                                                transition: 'opacity 0.2s, background-color 0.2s'
                                            }}
                                            title="Eliminar imagen"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        {isSelected && <div className='cw-check-icon'><Check size={16} /></div>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="cw-empty">No hay imágenes en este repositorio.</div>
                        )}
                    </div>
                </div>

                {/* Panel Derecho: Detalles (Brief) */}
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
                        <p style={{ color: 'var(--color-notification)' }}>No has seleccionado imágenes aún.</p>
                    ) : (
                        selectedIds.map((id) => {
                            const asset = assets.find(a => a.id === id);
                            return (
                                <div key={id} className='cw-selected-thumb' style={{ overflow: 'hidden', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {asset ? (
                                        <img
                                            src={asset.img_url?.thumbnail || asset.img_url?.url}
                                            alt="Selected"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '0.8rem' }}>IMG</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
        {modalOpen && (
            <div className="rv-modal-overlay" onClick={handleCloseModal}>
                <div className="rv-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="rv-modal-close" onClick={handleCloseModal} aria-label="Cerrar">×</button>
                    <img src={modalImage} alt="Preview" />
                </div>
            </div>
        )}
        
        <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar imagen?"
            message="Esta acción eliminará la imagen y todas sus variaciones de forma permanente. ¿Estás seguro?"
            isLoading={isDeleting}
        />
        </>
    );
}

export default RepositoryView;