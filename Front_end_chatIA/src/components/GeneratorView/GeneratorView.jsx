import React from 'react';
import logostars from '../../assets/img/logostarts.png';
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
    return (
        <div className='generator-container'>
            <header className="gen-header">
                <div className="icon-container">
                    <img className="sparkles" src={logostars} alt="Stars Logo" />
                </div>
                <div className="header-text">
                    <h1>Hola, {designerName}</h1>
                    <p>¡Empecemos!</p>
                </div>
            </header>

            <section className="generator-panel">
                <div className="prompt-container">
                    <textarea
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe lo que quieres generar..."
                    />
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

            <section className="gallery-section">
                <div className="gallery-header">
                    <h3>Galería</h3>
                    <button className="add-image-icon">
                        <span>Agregar</span> <span>+</span>
                    </button>
                </div>
                <div className={`gallery-content ${generatedImages.length === 0 ? 'empty' : ''}`}>
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
            </section>
        </div>
    );
}

export default GeneratorView;