import { useState, useRef, useEffect } from 'react';
import { enhancePrompt } from '../../services/api';
import { Sparkles } from 'lucide-react';
import './GeneratorView.css';

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
    generatedImages
}) {
    // Estado local para controlar la carga de la mejora
    const [isEnhancing, setIsEnhancing] = useState(false);

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '250px';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight} px`;
        }
    }, [prompt]);

    // Función para manejar el clic en la varita
    const handleEnhanceClick = async () => {
        if (!prompt || prompt.trim().length === 0) return;

        setIsEnhancing(true);
        try {
            const enhacedText = await enhancePrompt(prompt);
            setPrompt(enhacedText);
        } catch (error) {
            alert("No se pudo mejorar el prompt en este momento.");
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className='generator-container'>
            <header className="gen-header">
                <div className="icon-container">
                    <Sparkles className="sparkles" size={32} />
                </div>
                <div className="header-text">
                    <h1>Hola, {designerName}</h1>
                    <p>¡Empecemos!</p>
                </div>
            </header>

            <section className="generator-panel">
                <div className="prompt-container" style={{ position: 'relative' }}>
                    <textarea
                        ref={textareaRef}
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe lo que quieres generar..."
                        disabled={isEnhancing} // Deshabilitar mientras carga
                        rows={1}
                    />

                    {/* BOTÓN DE VARITA MÁGICA */}
                    <button
                        className={`magic - wand - btn ${isEnhancing ? 'loading' : ''} `}
                        onClick={handleEnhanceClick}
                        disabled={isEnhancing || !prompt}
                        title="Mejorar prompt con IA"
                        style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            color: 'white'
                        }}
                    >
                        {isEnhancing ? (
                            <span style={{ fontSize: '14px' }}>✨...</span>
                        ) : (
                            // Icono SVG de Varita Mágica
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 4V2" />
                                <path d="M15 16V14" />
                                <path d="M8 9h2" />
                                <path d="M20 9h2" />
                                <path d="M17.8 11.8L19 13" />
                                <path d="M15 9h0" />
                                <path d="M17.8 6.2L19 5" />
                                <path d="M3 21l9-9" />
                                <path d="M12.2 6.2L11 5" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="controls-row">
                    <div className='box-options'>
                        <div className="control-group toggle-group">
                            <label>Imagen de referencia</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={useReference}
                                    onChange={(e) => setUseReference(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="control-group">
                            <label>Relación de aspecto</label>
                            <select
                                className="custom-select"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                            >
                                <option>1:1 cuadrado</option>
                                <option>16:9 panorámico</option>
                                <option>9:16 vertical</option>
                            </select>
                        </div>
                        <div className="control-group small-input">
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="qty-input"
                                min="1"
                                max="10"
                            />
                        </div>
                    </div>
                    <button className="generate-btn" onClick={handleGenerate}>
                        Generar
                    </button>
                </div>
            </section>

            {/* <section className="gallery-section">
                <div className="gallery-header">
                    <h3>Galería</h3>
                    <button className="add-image-icon">
                        <span>Agregar</span> <span>+</span>
                    </button>
                </div>
                <div className={`gallery - content ${ generatedImages.length === 0 ? 'empty' : '' } `}>
                    {generatedImages.length === 0 ? (
                        <p>No hay imágenes guardadas</p>
                    ) : (
                        generatedImages.map((img, index) => (
                            <div key={index} className="generated-image">
                                {img}
                            </div>
                        ))
                    )}
                </div>
            </section> */}
        </div>
    );
}

export default GeneratorView;