import './cards.css';
import Reloj from '../../assets/img/reloj.png';
import FotoUser from '../../assets/img/user.jpg';
import { useState, useRef, useLayoutEffect } from 'react';


function Cards(props) {
    // const [color, setColor] = useState('var(--color-proceso)');
    var color = 'var(--color-proceso)';
    const estado = props.estado;
    console.log(props)
    if (estado === 'Enviado') {
        color = 'var(--color-proceso)';
    } else if (estado === 'Cancelado') {
        color = 'var(--color-cancelado)';
    } else if (estado === 'Aprobado') {
        color = 'var(--color-aprobado)';
    } else if (estado === 'Rechazado') {
        color = 'var(--color-rechazado)';
    }

    // ajuste dinámico de fuente para titulos largos (max 2 líneas) ---
    const titleRef = useRef(null);
    const [titleFontSize, setTitleFontSize] = useState(null);

    useLayoutEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        // computar valores iniciales
        const computed = window.getComputedStyle(el);
        const baseFontSize = parseFloat(computed.fontSize) || 16;
        const baseLineHeight = (() => {
            const lh = computed.lineHeight;
            if (lh === 'normal' || !lh) return baseFontSize * 1.2;
            return parseFloat(lh);
        })();

        let currentFont = titleFontSize || baseFontSize;
        const minFont = 12;

        const measureLines = (font) => {
            el.style.fontSize = font + 'px';
            // aproximar line-height al escalar con la fuente
            const scale = font / baseFontSize;
            const currentLineHeight = baseLineHeight * scale;
            const height = el.offsetHeight;
            const lines = Math.max(1, Math.round(height / currentLineHeight));
            return lines;
        };

        // si ya cabe en 2 líneas no cambiamos
        if (measureLines(currentFont) <= 2) {
            setTitleFontSize(currentFont);
            return;
        }

        // reducir en pasos hasta que quepa o llegue al mínimo
        while (currentFont > minFont && measureLines(currentFont) > 2) {
            currentFont = Math.max(minFont, Math.floor(currentFont - 1));
        }

        setTitleFontSize(currentFont);

        // re-calcular en resize (para cambios de ancho)
        const onResize = () => {
            // permitir que se re-evalúe con el tamaño base actual
            setTitleFontSize(null);
            // pequeña demora para que el DOM aplique cambios de layout
            setTimeout(() => {
                // forzamos nuevo cálculo reusando el effect (por título no cambió, así recalculamos aquí)
                let font = baseFontSize;
                if (measureLines(font) > 2) {
                    while (font > minFont && measureLines(font) > 2) {
                        font = Math.max(minFont, Math.floor(font - 1));
                    }
                }
                setTitleFontSize(font);
            }, 60);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [props.titulo]); // re-evalúa al cambiar el título

    return (
        <div className="cards-container">
            <img className='imgCard' src={Reloj} alt="Reloj" />
            <div className='InfoCard'>
                <h4 ref={titleRef} style={titleFontSize ? { fontSize: `${titleFontSize}px` } : undefined}>{props.titulo}</h4>
                <div className="progreso">
                    <div className='Estado' style={{ backgroundColor: color }}></div>
                    {props.estado}
                </div>
                <div className="fecha">
                    <img className='FotoUser' src={FotoUser} alt="Foto" />
                    <p>{props.usuario}</p>
                    <p>{props.fecha}</p>
                </div>
            </div>
        </div>
    );
}
export default Cards;