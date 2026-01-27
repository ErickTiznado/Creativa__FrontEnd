import React from 'react';
import './RepositoryView.css';
import { Check } from 'lucide-react';

function RepositoryView({ campaignData, selectedIds, toggleSelection, assets = [], loading = false }) {
    return (
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
                            <div className="cw-loading">Cargando recursos...</div>
                        ) : assets.length > 0 ? (
                            assets.map((asset) => {
                                const isSelected = selectedIds.includes(asset.id);
                                return (
                                    <div
                                        key={asset.id}
                                        className={`cw-img-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleSelection(asset.id)}
                                        style={{ overflow: 'hidden', padding: 0 }}
                                    >
                                        <img
                                            src={asset.img_url?.thumbnail || asset.img_url?.url}
                                            alt="Thumbnail"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
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
    );
}

export default RepositoryView;