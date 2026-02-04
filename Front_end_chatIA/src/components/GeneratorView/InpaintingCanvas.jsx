import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const InpaintingCanvas = forwardRef(({ imageUrl, brushSize = 20 }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState([]); // Stores completed paths (array of {points: [], size: number})
    const [currentPath, setCurrentPath] = useState([]); // Currently drawing points
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getMask: () => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            // Create a temporary canvas for the mask
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            // 1. Fill with Black (Background)
            tempCtx.fillStyle = '#000000';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // 2. Draw the white strokes from the visible canvas
            // Since the user draws white on transparent, we can just draw image
            tempCtx.drawImage(canvas, 0, 0);

            // 3. Export as Base64
            return tempCanvas.toDataURL('image/png');
        },
        undo: () => {
            setPaths(prev => {
                const newPaths = prev.slice(0, -1);
                // We need to redraw from scratch
                // setTimeout ensures state update is processed or we pass newPaths directly
                redrawCanvas(newPaths);
                return newPaths;
            });
        },
        clear: () => {
            setPaths([]);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        },
        hasStrokes: () => paths.length > 0 || currentPath.length > 0
    }));

    // Handle Image Load to set Canvas Size matching the rendered image
    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight, width, height } = e.target;
        // We want the canvas to match the DISPLAYED size for drawing accuracy relative to the user's pointer,
        // BUT for the mask to match the IMAGE resolution, we should probably use natural size?
        // Actually, if we use natural size, the canvas css must scale it down.
        // Let's use displayed size for the canvas resolution to match 1:1 with user interaction,
        // and when exporting, we might need to scale? 
        // Standard approach: Canvas resolution = Displayed size (or scaled by dpr).
        // The mask sent to backend usually needs to match the ORIGINAL image dimensions if the backend expects that.
        // However, the prompt implies "mask of the SAME dimensions as the Base Image".
        // So we should use naturalWidth/Height for the canvas internal resolution,
        // and CSS to scale it visually to match the img element.

        setImageDimensions({ width: naturalWidth, height: naturalHeight });
    };

    // Redraw all paths
    const redrawCanvas = (pathsToDraw) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pathsToDraw.forEach(pathData => {
            if (!pathData.points || pathData.points.length === 0) return;

            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = pathData.size; // Use the size stored with the path
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.moveTo(pathData.points[0].x, pathData.points[0].y);

            for (let i = 1; i < pathData.points.length; i++) {
                ctx.lineTo(pathData.points[i].x, pathData.points[i].y);
            }
            ctx.stroke();
        });
    };

    // Drawing Handlers
    const startDrawing = (e) => {
        setIsDrawing(true);
        const point = getCoordinates(e);
        if (!point) return;

        setCurrentPath([point]);

        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // A single click should draw a dot
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const point = getCoordinates(e);
        if (!point) return;

        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = brushSize; // Dynamic update?
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        setCurrentPath(prev => [...prev, point]);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.closePath();

            if (currentPath.length > 0) {
                setPaths(prev => [...prev, { points: currentPath, size: brushSize }]);
            }
            setCurrentPath([]);
        }
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        // Calculate scale (Natural size / Displayed size)
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
                padding: '10px' // Add breathing room
            }}
        >
            {/* Base Image */}
            <img
                src={imageUrl}
                alt="Editing base"
                onLoad={handleImageLoad}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    minWidth: 0, // Prevent grid blowout
                    minHeight: 0,
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    display: 'block',
                    gridArea: '1 / 1'
                }}
            />

            {/* Canvas Overlay */}
            {imageDimensions.width > 0 && (
                <canvas
                    ref={canvasRef}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        minWidth: 0, // Prevent grid blowout
                        minHeight: 0,
                        objectFit: 'contain',
                        gridArea: '1 / 1',
                        cursor: `crosshair`,
                        touchAction: 'none',
                        zIndex: 10
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            )}
        </div>
    );
});

export default InpaintingCanvas;
