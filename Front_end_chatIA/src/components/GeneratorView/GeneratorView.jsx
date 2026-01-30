import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { enhancePrompt, refineAsset } from '../../services/generatorService';
import { Sparkles, Image as ImageIcon, Wand2, Download, X, Edit3, Bookmark, Square, RectangleHorizontal, RectangleVertical, Lightbulb, Upload, ChevronLeft, ChevronRight, Palette, Maximize, Trash2, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../animations/LoadingSpinner';
import ScanningPlaceholder from '../animations/ScanningPlaceholder';
import ConfirmationModal from '../Modals/ConfirmationModal';
import './GeneratorView.css';

// ... (ReferenceImagesStrip remain the same)

function GeneratorView({

    prompt,
    setPrompt,
    style, // ✅ ADDED
    setStyle, // ✅ ADDED
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
    getRefinements = () => [], // Default empty function
    onDelete, // ✅ ADDED
    campaignId // ✅ ADDED for Refinement Context
}) {
    // ===== STATE MANAGEMENT =====
    const [mode, setMode] = useState('create'); // 'create' | 'edit'
    const [editingImage, setEditingImage] = useState(null);
    const [editHistory, setEditHistory] = useState([]); // History of iterations for current editing image
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [isControlsOpen, setIsControlsOpen] = useState(true);

    // Collapsible Sections State
    const [openSections, setOpenSections] = useState({
        prompt: true,
        params: true,
        refs: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Local references (dropped or uploaded locally)
    const [localReferences, setLocalReferences] = useState([]);
    
    // Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);

    // Display images from props
    const [localImages, setLocalImages] = useState([]);

    // Fullscreen modal state
    const [fullscreenImage, setFullscreenImage] = useState(null);
    // File input ref for "Agregar imagen" button
    const fileInputRef = useRef(null);

    const handleAddImageClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const processFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setLocalReferences(prev => [...prev, { id: Date.now(), preview: reader.result, isLocal: true }]);
            if (!useReference) setUseReference(true);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            processFile(file);
            e.target.value = '';
        }
    };

    // Drag Handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Helper function to extract URL from asset object or string
    const getImageUrl = (img) => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.preview) return img.preview; // For local references
        if (img.img_url) {
            if (typeof img.img_url === 'string') return img.img_url;
            if (img.img_url.url) return img.img_url.url;
            if (img.img_url.thumbnail) return img.img_url.thumbnail;
        }
        return null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        
        // Handle external files
        if (files && files.length > 0) {
            processFile(files[0]);
            return;
        }

        // Handle internal drag (History -> Reference)
        const customData = e.dataTransfer.getData("application/json");
        if (customData) {
            try {
                const imgData = JSON.parse(customData);
                // Check if already in references to avoid duplicates? (logic could be refined)
                // Add to local references
                const previewUrl = getImageUrl(imgData);
                if (previewUrl) {
                    setLocalReferences(prev => [...prev, { id: Date.now(), preview: previewUrl, isLocal: true, original: imgData }]);
                    if (!useReference) setUseReference(true);
                }
            } catch (err) {
                console.error("Error parsing drag data", err);
            }
        }
    };

    const handleRemoveLocalReference = (refToRemove) => {
        if (refToRemove.isLocal) {
            setLocalReferences(prev => prev.filter(r => r !== refToRemove));
        } else {
            onDeselectReference(refToRemove); // Call parent for repository assets
        }
    };
    
    // START: Concat previous parts if needed, but here is the new Delete Logic
    // START: Concat previous parts if needed, but here is the new Delete Logic
    const handleDeleteClick = (imgToDelete) => {
        setAssetToDelete(imgToDelete);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!assetToDelete) return;

        try {
            setIsDeleting(true);

            // 1. Delete from DB (if it's a real asset with ID and onDelete is provided)
            if (onDelete && (assetToDelete.id || typeof assetToDelete === 'number')) {
                 await onDelete(assetToDelete.id || assetToDelete);
            }

            // 2. Remove from local state (Visual feedback)
            if (isEditMode) {
                const newHistory = editHistory.filter(img => img !== assetToDelete);
                setEditHistory(newHistory);
                if (editingImage === assetToDelete) {
                    setEditingImage(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null);
                }
            } else {
                setLocalImages(prev => prev.filter(img => img !== assetToDelete));
            }

            setDeleteModalOpen(false);
            setDeleteModalOpen(false);
            setAssetToDelete(null);
            toast.success('Imagen eliminada', {
                icon: <CheckCircle size={20} color="var(--color-success)" />
            });
        } catch (error) {
            console.error("Error confirming delete:", error);
            toast.error('Error al eliminar la imagen', {
                icon: <AlertTriangle size={20} color="var(--color-error)" />
            });
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Helper to close modal
    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setDeleteModalOpen(false);
        setAssetToDelete(null);
    };
    
    // ... (useEffect, displayImages, mode handlers) ...

    useEffect(() => {
        setLocalImages(generatedImages);
    }, [generatedImages]);

    const displayImages = localImages;
    const textareaRef = useRef(null);

    // ===== MODE HANDLERS =====
    const enterEditMode = (image) => {
        setMode('edit');
        setEditingImage(image);

        // Populate history with Parent + Children (Refinements)
        const refinements = getRefinements(image.id);
        if (refinements && refinements.length > 0) {
            setEditHistory([image, ...refinements]);
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

    // Style Pills Handler
    const handleStyleClick = (selectedStyle) => {
        if (setStyle) {
            setStyle(selectedStyle.toLowerCase());
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
                const assetId = typeof editingImage === 'object' ? editingImage.id : null;
                if (!assetId) {
                    throw new Error('No se pudo obtener el ID del asset para refinar.');
                }
                const result = await refineAsset([assetId], prompt, {
                    style,
                    aspectRatio,
                    campaignId
                });
                const refinedAsset = result.data || result;

                if (refinedAsset) {
                    setEditHistory([...editHistory, refinedAsset]);
                    setEditingImage(refinedAsset); 
                    setEditingImage(refinedAsset); 
                    setPrompt(''); 
                    toast.success('Imagen refinada con éxito', {
                        icon: <CheckCircle size={20} color="var(--color-success)" />
                    });
                } else {
                    toast.error('No se recibió imagen refinada', {
                        icon: <AlertTriangle size={20} color="var(--color-error)" />
                    });
                }
            } catch (e) {
                console.error("Refine error:", e);
                toast.error('Error al refinar: ' + (e.message || 'Error desconocido'), {
                    icon: <AlertTriangle size={20} color="var(--color-error)" />
                });
            } finally {
                setIsRefining(false);
            }
        }
    };

    // ===== DERIVED STATE =====
    const isEditMode = mode === 'edit';
    const canvasImage = isEditMode ? editingImage : (displayImages.length > 0 ? displayImages[displayImages.length - 1] : null);
    const showParameters = mode === 'create' || mode === 'edit';
    const showReferenceControls = mode === 'create';

    const inspirationPrompts = [
        "Retrato cyberpunk con luces de neón",
        "Paisaje de fantasía con montañas flotantes",
        "Logo minimalista geométrico",
        "Ilustración 3D estilo Pixar de un robot"
    ];
    
    const stylePills = [
        "Cinematic", "Anime", "3D Render", "Oil Painting", "Cyberpunk", "Minimalist"
    ];

    const combinedReferences = [...referenceImages, ...localReferences];

    return (
        <div className={`generator-container ${!isControlsOpen ? 'controls-collapsed' : ''}`}>
            {/* COLLAPSE BUTTON */}
            <button 
                className="toggle-controls-btn"
                onClick={() => setIsControlsOpen(!isControlsOpen)}
                title={isControlsOpen ? "Ocultar controles" : "Mostrar controles"}
            >
                {isControlsOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* LEFT: CONTROLS */}
            <aside className={`controls-panel ${!isControlsOpen ? 'collapsed' : ''}`}>
                
                {/* Scrollable Content Area */}
                <div className="controls-scroll-area">
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

                    <div className="section-wrapper">
                        {/* Prompt Section */}
                        <div className="section-header" onClick={() => toggleSection('prompt')}>
                            <span className="section-title">
                                {isEditMode ? 'Instrucciones' : 'Prompt'}
                            </span>
                            {openSections.prompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        
                        <div className={`section-content ${!openSections.prompt ? 'collapsed' : ''}`}>
                            <div className="prompt-group">
                                <textarea
                                    ref={textareaRef}
                                    className="prompt-input"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={isEditMode
                                        ? "Describe los cambios (ej. 'Añade gafas de sol', 'Cambia el fondo a playa')..."
                                        : "Describe lo que quieres generar..."}
                                    rows={4}
                                />
                                {/* Prompt Helpers */}
                                <div className="prompt-helpers" style={{marginTop: 8}}>
                                    <div className="style-pills">
                                        <Palette size={14} style={{color: 'var(--color-text-muted)', marginRight: 4}} />
                                        {stylePills.map(s => (
                                            <button 
                                                key={s} 
                                                className={`style-pill ${style === s.toLowerCase() ? 'active' : ''}`}
                                                onClick={() => handleStyleClick(s)}
                                                type="button"
                                                style={{
                                                    backgroundColor: style === s.toLowerCase() ? 'var(--color-primary)' : 'var(--bg-secondary)',
                                                    color: style === s.toLowerCase() ? '#fff' : 'var(--color-text)',
                                                    border: style === s.toLowerCase() ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="prompt-toolbar" style={{marginTop: 10, justifyContent: 'flex-end'}}>
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
                        </div>
                    </div>

                    {/* Parameters - Only in CREATE mode */}
                    {showParameters && (
                        <div className="section-wrapper">
                            <div className="section-header" onClick={() => toggleSection('params')}>
                                <span className="section-title">Configuración</span>
                                {openSections.params ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            <div className={`section-content ${!openSections.params ? 'collapsed' : ''}`}>
                                <div className="control-group">
                                    <div className="parameters-grid">
                                        
                                        {/* Aspect Ratio Visual Selector */}
                                        <div className="control-group" style={{gridColumn: 'span 2'}}>
                                            <label style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>Formato</label>
                                            <div className="aspect-ratio-selector">
                                                <button 
                                                    className={`ratio-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                                                    onClick={() => setAspectRatio('1:1')}
                                                    title="Cuadrado (1:1)"
                                                >
                                                    <Square size={20} className="ratio-icon" />
                                                    <span className="ratio-label">1:1</span>
                                                </button>
                                                <button 
                                                    className={`ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                                                    onClick={() => setAspectRatio('16:9')}
                                                    title="Paisaje (16:9)"
                                                >
                                                    <RectangleHorizontal size={20} className="ratio-icon" />
                                                    <span className="ratio-label">16:9</span>
                                                </button>
                                                <button 
                                                    className={`ratio-btn ${aspectRatio === '9:16' ? 'active' : ''}`}
                                                    onClick={() => setAspectRatio('9:16')}
                                                    title="Historia (9:16)"
                                                >
                                                    <RectangleVertical size={20} className="ratio-icon" />
                                                    <span className="ratio-label">9:16</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantity Input */}
                                        {mode === 'create' && (
                                            <div className="control-group">
                                                <label style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>Cantidad</label>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    className="qty-input"
                                                    min="1"
                                                    max="4"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reference Toggle - Only in CREATE mode */}
                    {showReferenceControls && (
                        <div className="section-wrapper">
                            <div className="section-header" onClick={() => toggleSection('refs')}>
                                <span className="section-title">Referencias</span>
                                {openSections.refs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            <div className={`section-content ${!openSections.refs ? 'collapsed' : ''}`}>
                                <div className="control-group">
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
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
                                            </div>
                                        </div>

                                        <div>
                                            <button type="button" className="add-image-btn" onClick={handleAddImageClick} title="Subir referencia">
                                                <Upload size={14} />
                                                <span style={{marginLeft:8}}>Subir</span>
                                            </button>
                                            <input ref={fileInputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={handleFileChange} />
                                        </div>
                                    </div>

                                    {/* Reference Images Strip / Drop Zone */}
                                    {useReference && (
                                        <div 
                                            className={`reference-section ${isDragging ? 'dragging' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            {combinedReferences.length > 0 ? (
                                                <div className={`reference-drop-zone ${isDragging ? 'active' : ''}`}>
                                                     <ReferenceImagesStrip
                                                        images={combinedReferences}
                                                        onDeselect={handleRemoveLocalReference}
                                                    />
                                                    {isDragging && <div className="reference-drop-text" style={{marginTop: 10}}>Sueltar para añadir referencia</div>}
                                                </div>
                                            ) : (
                                                <div className={`reference-drop-zone ${isDragging ? 'active' : ''}`}>
                                                    <div style={{opacity: 0.7, marginBottom: 8}}><Upload size={24} /></div>
                                                    <p className="reference-drop-text" style={{margin:0}}>
                                                        Arrastra imágenes aquí o selecciona 'Subir'
                                                        <br/>
                                                        <span style={{fontSize: '0.75rem', opacity: 0.7}}>También puedes seleccionar del repositorio o historial</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Footer for Primary Action */}
                <div className="controls-footer">
                    <button
                        className={`generate-btn ${isEditMode ? 'edit-mode' : ''}`}
                        onClick={handlePrimaryAction}
                        disabled={!prompt || (isEditMode && isRefining) || isGenerating}
                    >
                        {isGenerating ? (
                           <>Generando...</>
                        ) : isRefining ? (
                            <>Aplicando...</>
                        ) : isEditMode ? (
                            <><Edit3 size={18} /> Aplicar Cambios</>
                        ) : (
                            <> Generar</>
                        )}
                    </button>
                     {/* Error Message */}
                    {generationError && (
                        <div style={{ color: '#ff6b6b', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>
                            {generationError}
                        </div>
                    )}
                </div>
            </aside>

            {/* RIGHT: CANVAS */}
            <main className="canvas-area">
                
                <div className="canvas-header">
                    <h2>
                        {isEditMode ? 'Editando Imagen' : canvasImage ? 'Vista Previa' : 'Canvas'}
                    </h2>
                </div>

                <div className="canvas-preview">
                    {isGenerating ? (
                         <div className="preview-container">
                            <ScanningPlaceholder width="100%" height="100%" text="Generando Imagen..." />
                        </div>
                    ) : canvasImage ? (
                        <div
                            className="preview-container"
                            onClick={() => getImageUrl(canvasImage) && setFullscreenImage(getImageUrl(canvasImage))}
                            style={{ cursor: getImageUrl(canvasImage) ? 'pointer' : 'default' }}
                            title="Click para ver en pantalla completa"
                            draggable="true"
                            onDragStart={(e) => {
                                // Allow dragging the current canvas result to reference
                                e.dataTransfer.setData("application/json", JSON.stringify(canvasImage));
                            }}
                        >
                            {getImageUrl(canvasImage) ? (
                                <>
                                    <img src={getImageUrl(canvasImage)} alt="Preview" className="preview-image" />
                                    {/* Hover Overlay Actions */}
                            <div className="canvas-image-overlay" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="overlay-action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullscreenImage(getImageUrl(canvasImage));
                                    }}
                                    title="Pantalla Completa"
                                >
                                    <Maximize size={18} />
                                </button>
                                <button
                                    className="overlay-action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Descargar'); // Implement actual download logic here if available
                                    }} 
                                    title="Descargar imagen"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    className={`overlay-action-btn ${savedAssets.includes(canvasImage) ? 'secondary' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSaveAsset(canvasImage);
                                    }}
                                    style={savedAssets.includes(canvasImage) ? {backgroundColor: '#fbbf24', color: '#000'} : {}}
                                    title={savedAssets.includes(canvasImage) ? 'Guardado' : 'Guardar en Assets'}
                                >
                                    <Bookmark size={18} fill={savedAssets.includes(canvasImage) ? 'currentColor' : 'none'} /> 
                                    {savedAssets.includes(canvasImage) ? 'Guardado' : 'Guardar'}
                                </button>
                                <button
                                    className="overlay-action-btn secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(canvasImage);
                                    }}
                                    title="Eliminar"
                                    style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                                </>
                            ) : (
                                <div className="empty-canvas">
                                    <ImageIcon size={48} className="empty-icon" />
                                    <p>Error al cargar la imagen</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-canvas">
                            <Lightbulb size={48} className="empty-icon" style={{color: '#fbbf24', opacity: 0.8}} />
                            <p style={{fontWeight: 500, margin: '15px 0 10px'}}>¡Empieza a crear!</p>
                            <p style={{fontSize: '0.9rem', opacity: 0.7}}>Escribe un prompt o prueba uno de estos:</p>
                            
                            <div className="inspiration-chips">
                                {inspirationPrompts.map((p, i) => (
                                    <button 
                                        key={i} 
                                        className="inspiration-chip"
                                        onClick={() => setPrompt(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* History Strip - Changes based on mode */}
                <div className="history-strip">
                    <h3>{isEditMode ? 'Iteraciones de Edición' : 'Historial Reciente'}</h3>
                    <div className="history-grid">
                        {(isEditMode ? editHistory : displayImages).length === 0 ? (
                            <span className="empty-history">Tus creaciones aparecerán aquí</span>
                        ) : (
                            (isEditMode ? editHistory : displayImages).map((img, index) => {
                                const imgUrl = getImageUrl(img);
                                return (
                                    <div
                                        key={index}
                                        className={`history-item ${editingImage === img ? 'active-editing' : ''}`}
                                        onClick={() => isEditMode ? setEditingImage(img) : enterEditMode(img)}
                                        title={isEditMode ? 'Ver iteración' : 'Click para editar'}
                                        draggable="true" 
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("application/json", JSON.stringify(img));
                                        }}
                                    >
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={isEditMode ? `Iteración ${index + 1}` : `Generación ${index + 1}`} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                                <ImageIcon size={24} style={{ opacity: 0.3 }} />
                                            </div>
                                        )}
                                        <div className="history-overlay">
                                            <button 
                                                className="history-save-btn" 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleDeleteClick(img); 
                                                }}
                                                title="Eliminar"
                                                style={{backgroundColor: 'rgba(239, 68, 68, 0.8)', borderColor: 'transparent'}}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {savedAssets.includes(img) && (
                                            <div className="saved-badge">
                                                <Bookmark size={12} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
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
            
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar imagen?"
                message="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
                isLoading={isDeleting}
            />
        </div>
    );
}

export default GeneratorView;