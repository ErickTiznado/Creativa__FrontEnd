import React from 'react';
import './RepositoryView.css';

function RepositoryView({ campaignData, selectedIds, toggleSelection }) {
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
                        selectedIds.map((id) => (
                            <div key={id} className='cw-selected-thumb'>
                                IMG {id}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default RepositoryView;