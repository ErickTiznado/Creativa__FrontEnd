import './cards.css';
import { useState, useRef, useLayoutEffect } from 'react';
import { Clock, CircleUser } from 'lucide-react';

function Cards(props) {
	var color = 'var(--color-proceso)';
	const estado = props.estado;
	// console.log(props) // Removed console log for cleaner code
	if (estado === 'Enviado') {
		color = 'var(--color-proceso)';
	} else if (estado === 'Cancelado') {
		color = 'var(--color-cancelado)';
	} else if (estado === 'Aprobado') {
		color = 'var(--color-aprobado)';
	} else if (estado === 'Rechazado') {
		color = 'var(--color-rechazado)';
	}

	const titleRef = useRef(null);
	const [titleFontSize, setTitleFontSize] = useState(null);

	useLayoutEffect(() => {
		const el = titleRef.current;
		if (!el) return;
		let cancelled = false;

		const computeBase = () => {
			const computed = window.getComputedStyle(el);
			const baseFontSize = parseFloat(computed.fontSize) || 16;
			const baseLineHeight = (() => {
				const lh = computed.lineHeight;
				if (lh === 'normal' || !lh) return baseFontSize * 1.2;
				return parseFloat(lh);
			})();
			return { baseFontSize, baseLineHeight };
		};

		const runMeasure = async () => {
			// esperar fuentes cargadas para mediciones consistentes
			if (document.fonts && document.fonts.status !== 'loaded') {
				try { await document.fonts.ready; } catch (e) { /* ignore */ }
			}
			// pequeña espera para que el layout finalice (fonts/images)
			await new Promise(r => setTimeout(r, 30));
			if (cancelled) return;

			const { baseFontSize, baseLineHeight } = computeBase();
			const minFont = 12;
			let currentFont = titleFontSize || baseFontSize;

			const measureLines = (font) => {
				// Aplicar temporalmente el tamaño para medir
				el.style.fontSize = font + 'px';
				const scale = font / baseFontSize;
				const currentLineHeight = baseLineHeight * scale;
				// usar getBoundingClientRect para mayor precisión
				const height = el.getBoundingClientRect().height;
				const lines = Math.max(1, Math.round(height / currentLineHeight));
				return lines;
			};

			// Si ya cabe en 2 líneas no cambiamos
			if (measureLines(currentFont) <= 2) {
				if (!cancelled) setTitleFontSize(currentFont);
				return;
			}

			// Reducir en pasos hasta que quepa o llegue al mínimo
			while (currentFont > minFont && measureLines(currentFont) > 2) {
				currentFont = Math.max(minFont, Math.floor(currentFont - 1));
			}
			if (!cancelled) setTitleFontSize(currentFont);
		};

		runMeasure();

		const onResize = () => {
			// recalcular en resize
			runMeasure();
		};
		window.addEventListener('resize', onResize);

		return () => {
			cancelled = true;
			window.removeEventListener('resize', onResize);
		};
	}, [props.titulo]); // re-evalúa al cambiar el título

	return (
		<div className="cards-container" onClick={props.onClick} style={{ cursor: props.onClick ? 'pointer' : 'default' }}>
			<Clock size={24} className='imgCard' />
			<div className='InfoCard'>
				<h4 ref={titleRef} style={titleFontSize ? { fontSize: `${titleFontSize}px` } : undefined}>{props.titulo}</h4>
				<div className="progreso">
					<div className='Estado' style={{ backgroundColor: color }}></div>
					{props.estado}
				</div>
				<div className="fecha">
					<CircleUser size={20} className='FotoUser' />
					<p>{props.usuario}</p>
					<p>{props.fecha}</p>
				</div>
			</div>
		</div>
	);
}
export default Cards;