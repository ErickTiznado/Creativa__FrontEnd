import { useState, useRef, useEffect } from 'react';
import { enhancePrompt, refineAsset } from '../../services/generatorService';
import { Sparkles, Image as ImageIcon, Wand2, Download, X, Edit3, Bookmark } from 'lucide-react';
import './GeneratorView.css';

// Reference Images Strip Component
function ReferenceImagesStrip({ images, onDeselect }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="reference-strip">
            <div className="reference-strip-header">
                <span className="reference-count">{images.length} {images.length === 1 ? 'referencia' : 'referencias'}</span>
            </div>
            <div className="reference-grid">
                {images.map((img) => (
                    <div key={img.id} className="reference-item">
                        <img
                            src={typeof img.img_url === 'string' ? img.img_url : img.img_url?.url}
                            alt="Referencia"
                        />
                        <button
                            className="remove-ref-btn"
                            onClick={() => onDeselect(img.id)}
                            title="Deseleccionar"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GeneratorView({
    designerName,
    prompt,
    setPrompt,
    useReference,
    setUseReference,
    aspectRatio,
    setAspectRatio,
    quantity,
    setQuantity,
    handleGenerate,
    generatedImages,
    referenceImages = [],
    onDeselectReference,
    savedAssets = [],
    onToggleSaveAsset,
    isGenerating = false,
    generationError = null,
    getRefinements = () => [] // Default empty function
}) {
    // ===== STATE MANAGEMENT =====
    const [mode, setMode] = useState('create'); // 'create' | 'edit'
    const [editingImage, setEditingImage] = useState(null);
    const [editHistory, setEditHistory] = useState([]); // History of iterations for current editing image
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    // Display images from props
    const [localImages, setLocalImages] = useState([]);

    // Fullscreen modal state
    const [fullscreenImage, setFullscreenImage] = useState(null);

    useEffect(() => {
        setLocalImages(generatedImages);
    }, [generatedImages]);

    const displayImages = localImages;
    const textareaRef = useRef(null);

    // Helper function to extract URL from asset object or string
    const getImageUrl = (img) => {
        if (typeof img === 'string') return img;
        if (img?.img_url) {
            if (typeof img.img_url === 'string') return img.img_url;
            if (img.img_url.url) return img.img_url.url;
            if (img.img_url.thumbnail) return img.img_url.thumbnail;
        }
        return null;
    };

    // ===== MODE HANDLERS =====
    const enterEditMode = (image) => {
        setMode('edit');
        setEditingImage(image);

        // Populate history with Parent + Children (Refinements)
        const refinements = getRefinements(image.id);
        if (refinements && refinements.length > 0) {
            // Combine parent with its refinements
            setEditHistory([image, ...refinements]);
            // Set the latest refinement as the active editing image? 
            // Usually user wants to continue from the latest version, or start from original?
            // Let's keep original selected but show history.
            // Or maybe select the last one? Let's stick to the selected one for now.
        } else {
            setEditHistory([image]);
        }

        setPrompt('');
    };

    const exitEditMode = () => {
        setMode('create');
        setEditingImage(null);
        setPrompt('');
    };

    // ===== ACTION HANDLERS =====
    const handleEnhanceClick = async () => {
        if (!prompt || prompt.trim().length === 0) return;
        setIsEnhancing(true);
        try {
            const enhancedText = await enhancePrompt(prompt);
            setPrompt(enhancedText);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handlePrimaryAction = async () => {
        if (mode === 'create') {
            await handleGenerate();
        } else {
            // Edit/Inpainting mode
            if (!editingImage || !prompt) return;
            setIsRefining(true);
            try {
                console.log('🔍 DEBUG - editingImage object:', editingImage);
                console.log('Refining image with prompt:', prompt);

                // Get asset ID from editingImage object
                const assetId = typeof editingImage === 'object' ? editingImage.id : null;

                console.log('🔍 DEBUG - Extracted assetId:', assetId);

                if (!assetId) {
                    throw new Error('No se pudo obtener el ID del asset para refinar. El asset debe estar guardado primero.');
                }

                // Call refineAsset backend API for inpainting
                // refineAsset expects: (assetIds: array, refinementPrompt: string)
                const result = await refineAsset([assetId], prompt);

                // Get the refined image data from response
                const refinedAsset = result.data || result;

                if (refinedAsset) {
                    // Add to edit history
                    setEditHistory([...editHistory, refinedAsset]);
                    setEditingImage(refinedAsset); // Update canvas to show new iteration
                    setPrompt(''); // Clear prompt for next edit
                } else {
                    console.error('No refined asset in response:', result);
                    alert('No se recibió imagen refinada del servidor');
                }
            } catch (e) {
                console.error("Refine error:", e);
                alert('Error al refinar la imagen: ' + (e.message || 'Error desconocido'));
            } finally {
                setIsRefining(false);
            }
        }
    };

    // ===== DERIVED STATE =====
    const isEditMode = mode === 'edit';
    const canvasImage = isEditMode ? editingImage : (displayImages.length > 0 ? displayImages[displayImages.length - 1] : null);
    const showParameters = mode === 'create';
    const showReferenceControls = mode === 'create';

    return (
        <div className='generator-container'>
            {/* LEFT: CONTROLS */}
            <aside className="controls-panel">

                {/* Mode Indicator */}
                {isEditMode && (
                    <div className="mode-indicator">
                        <span className="mode-badge">
                            <Edit3 size={16} className="mode-icon" />
                            Modo Edición
                        </span>
                        <button
                            className="exit-mode-btn"
                            onClick={exitEditMode}
                            title="Salir del modo edición"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Prompt Input */}
                <div className="prompt-group">
                    <label>
                        {isEditMode ? 'Instrucciones de Edición' : 'Prompt de Generación'}
                    </label>
                    <textarea
                        ref={textareaRef}
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isEditMode
                            ? "Describe los cambios (ej. 'Añade gafas de sol', 'Cambia el fondo a playa')..."
                            : "Describe lo que quieres generar..."}
                    />
                    <div className="prompt-toolbar">
                        <button
                            className="magic-wand-btn"
                            onClick={handleEnhanceClick}
                            disabled={isEnhancing || !prompt}
                            title="Mejorar con IA"
                        >
                            {isEnhancing ? <Sparkles size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        </button>
                    </div>
                </div>

                {/* Parameters - Only in CREATE mode */}
                {showParameters && (
                    <div className="parameters-grid">
                        <div className="control-group">
                            <label>Formato</label>
                            <select
                                className="custom-select"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                            >
                                <option value="1:1">Cuadrado (1:1)</option>
                                <option value="16:9">Paisaje (16:9)</option>
                                <option value="9:16">Historia (9:16)</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Cantidad</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="qty-input"
                                min="1"
                                max="4"
                            />
                        </div>
                    </div>
                )}

                {/* Reference Toggle - Only in CREATE mode */}
                {showReferenceControls && (
                    <div className="control-group">
                        <label>Usar Referencia</label>
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={useReference}
                                    onChange={(e) => setUseReference(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="switch-label">
                                {useReference ? 'Activado' : 'Desactivado'}
                            </span>
                        </div>

                        {/* Reference Images Strip */}
                        {useReference && (
                            <div className="reference-section">
                                {referenceImages.length > 0 ? (
                                    <ReferenceImagesStrip
                                        images={referenceImages}
                                        onDeselect={onDeselectReference}
                                    />
                                ) : (
                                    <p className="warning-text">
                                        Selecciona imágenes del Repositorio
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}


                {/* Primary Action Button */}
                <button
                    className={`generate-btn ${isEditMode ? 'edit-mode' : ''}`}
                    onClick={handlePrimaryAction}
                    disabled={!prompt || (isEditMode && isRefining) || isGenerating}
                >
                    {isGenerating ? 'Generando...' : isRefining ? 'Aplicando cambios...' : isEditMode ? 'Aplicar Cambios' : 'Generar Imágenes'}
                </button>

                {/* Error Message */}
                {generationError && (
                    <div style={{ color: '#ff6b6b', padding: '10px', textAlign: 'center', fontSize: '14px' }}>
                        {generationError}
                    </div>
                )}
            </aside>

            {/* RIGHT: CANVAS */}
            <main className="canvas-area">
                <div className="canvas-header">
                    <h2>
                        {isEditMode ? 'Editando Imagen' : canvasImage ? 'Vista Previa' : 'Canvas'}
                    </h2>
                    {canvasImage && (
                        <div className="canvas-actions">
                            <button
                                className={`canvas-action-btn ${savedAssets.includes(canvasImage) ? 'saved' : ''}`}
                                onClick={() => onToggleSaveAsset(canvasImage)}
                                title={savedAssets.includes(canvasImage) ? 'Guardado' : 'Guardar como asset'}
                            >
                                <Bookmark size={18} fill={savedAssets.includes(canvasImage) ? 'currentColor' : 'none'} />
                            </button>
                            <button className="canvas-action-btn" title="Descargar">
                                <Download size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="canvas-preview">
                    {canvasImage ? (
                        <div
                            className="preview-container"
                            onClick={() => getImageUrl(canvasImage) && setFullscreenImage(getImageUrl(canvasImage))}
                            style={{ cursor: getImageUrl(canvasImage) ? 'pointer' : 'default' }}
                            title="Click para ver en pantalla completa"
                        >
                            {getImageUrl(canvasImage) ? (
                                <img src={getImageUrl(canvasImage)} alt="Preview" className="preview-image" />
                            ) : (
                                <div className="empty-canvas">
                                    <ImageIcon size={48} className="empty-icon" />
                                    <p>Error al cargar la imagen</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-canvas">
                            <ImageIcon size={48} className="empty-icon" />
                            <p>Genera una imagen o selecciona una del historial para editar</p>
                        </div>
                    )}
                </div>

                {/* History Strip - Changes based on mode */}
                <div className="history-strip">
                    <h3>{isEditMode ? 'Iteraciones de Edición' : 'Historial'}</h3>
                    <div className="history-grid">
                        {(isEditMode ? editHistory : displayImages).length === 0 ? (
                            <span className="empty-history">Sin historial</span>
                        ) : (
                            (isEditMode ? editHistory : displayImages).map((img, index) => {
                                const imgUrl = getImageUrl(img);
                                return (
                                    <div
                                        key={index}
                                        className={`history-item ${editingImage === img ? 'active-editing' : ''}`}
                                        onClick={() => isEditMode ? setEditingImage(img) : enterEditMode(img)}
                                        title={isEditMode ? 'Ver iteración' : 'Click para editar'}
                                    >
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={isEditMode ? `Iteración ${index + 1}` : `Generación ${index + 1}`} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                                <ImageIcon size={24} style={{ opacity: 0.3 }} />
                                            </div>
                                        )}
                                        {savedAssets.includes(img) && (
                                            <div className="saved-badge">
                                                <Bookmark size={12} fill="currentColor" />
                                            </div>
                                        )}
                                        <div className="history-overlay">
                                            <button
                                                className="history-save-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleSaveAsset(img);
                                                }}
                                                title={savedAssets.includes(img) ? 'Guardado' : 'Guardar'}
                                            >
                                                <Bookmark size={14} fill={savedAssets.includes(img) ? 'currentColor' : 'none'} />
                                            </button>
                                            {!isEditMode && (
                                                <div className="history-edit-indicator">
                                                    <Edit3 size={16} />
                                                    <span>Editar</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Saved Assets Section */}
                {savedAssets.length > 0 && (
                    <div className="saved-assets-strip">
                        <h3>Assets Guardados ({savedAssets.length})</h3>
                        <div className="saved-assets-grid">
                            {savedAssets.map((img, index) => {
                                const imgUrl = getImageUrl(img);
                                return (
                                    <div key={index} className="saved-asset-item">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={`Asset ${index + 1}`} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                                <ImageIcon size={24} style={{ opacity: 0.3 }} />
                                            </div>
                                        )}
                                        <button
                                            className="remove-asset-btn"
                                            onClick={() => onToggleSaveAsset(img)}
                                            title="Quitar de guardados"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div
                    className="fullscreen-modal"
                    onClick={() => setFullscreenImage(null)}
                >
                    <button
                        className="close-modal-btn"
                        onClick={() => setFullscreenImage(null)}
                        title="Cerrar (ESC)"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={fullscreenImage}
                        alt="Vista completa"
                        className="fullscreen-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

export default GeneratorView;