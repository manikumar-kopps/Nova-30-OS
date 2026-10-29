import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { mysteryEngine } from '../../mystery/mysteryEngine';

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff',
  '#800000', '#008000', '#000080', '#808000', '#008080', '#800080', '#808080', '#c0c0c0'
];

type Tool = 'pencil' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill' | 'picker';

const Paint: React.FC = () => {
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyStepRef = useRef<number>(-1);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Setup canvas size
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        contextRef.current = ctx;
        saveHistoryState();
      }
    }
  }, []);

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyStepRef.current += 1;
      historyRef.current = historyRef.current.slice(0, historyStepRef.current);
      historyRef.current.push(imageData);
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
        historyStepRef.current -= 1;
      }
    }
  };

  const undo = () => {
    if (historyStepRef.current > 0) {
      historyStepRef.current -= 1;
      restoreHistoryState(historyStepRef.current);
    }
  };

  const redo = () => {
    if (historyStepRef.current < historyRef.current.length - 1) {
      historyStepRef.current += 1;
      restoreHistoryState(historyStepRef.current);
    }
  };

  const restoreHistoryState = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx && historyRef.current[index]) {
      ctx.putImageData(historyRef.current[index], 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistoryState();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: Math.round((clientX - rect.left) / zoom),
      y: Math.round((clientY - rect.top) / zoom)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    setCursorPos({ x, y });
    
    if (tool === 'picker') {
      pickColor(x, y);
      return;
    }
    
    if (tool === 'fill') {
      floodFill(x, y, color);
      saveHistoryState();
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });
    
    const ctx = contextRef.current;
    if (ctx) {
      if (tool === 'pencil' || tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    setCursorPos({ x, y });
    
    if (!isDrawing) return;
    
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Real-time preview for shapes would go here, requiring a temporary canvas overlay or restoring history and re-drawing.
      // For simplicity in retro feel, we might just draw a preview by constantly restoring
      restoreHistoryState(historyStepRef.current);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const ctx = contextRef.current;
    if (ctx && (tool === 'pencil' || tool === 'eraser')) {
      ctx.closePath();
    }
    
    saveHistoryState();
  };

  const pickColor = (x: number, y: number) => {
    const ctx = contextRef.current;
    if (ctx) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = '#' + [0, 1, 2].map(i => {
        const hexVal = pixel[i].toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
      }).join('');
      setColor(hex);
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    const targetColor = getPixelColor(data, startX, startY, width);
    const fillRgb = hexToRgb(fillColor);
    
    if (!fillRgb) return;
    if (colorsMatch(targetColor, [fillRgb.r, fillRgb.g, fillRgb.b, 255])) return;

    const pixelsToCheck = [{ x: startX, y: startY }];
    
    while (pixelsToCheck.length > 0) {
      const { x, y } = pixelsToCheck.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const currentColor = getPixelColor(data, x, y, width);
      
      if (colorsMatch(currentColor, targetColor)) {
        setPixelColor(data, x, y, width, fillRgb);
        pixelsToCheck.push({ x: x + 1, y });
        pixelsToCheck.push({ x: x - 1, y });
        pixelsToCheck.push({ x, y: y + 1 });
        pixelsToCheck.push({ x, y: y - 1 });
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: { r: number, g: number, b: number }) => {
    const index = (y * width + x) * 4;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255;
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      try {
        localStorage.setItem('paint_save', dataUrl);
        alert('Image saved to localStorage!');
      } catch (e) {
        alert('Error saving image.');
      }
    }
  };

  const buttonStyle = {
    width: '24px', height: '24px', margin: '2px', padding: '0',
    backgroundColor: '#c0c0c0', display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
    border: '2px outset #dfdfdf', cursor: 'pointer', fontSize: '14px'
  };
  
  const selectedButtonStyle = {
    ...buttonStyle, border: '2px inset #dfdfdf', backgroundColor: '#e0e0e0'
  };

  const menuStyle = {
    padding: '2px 8px', cursor: 'pointer', userSelect: 'none' as const
  };

  const analyzePattern = () => {
    const state = mysteryEngine.getState();
    if (state.cluesDiscovered.includes('CURRENT_USER') || state.mysteryLevel >= 3) {
      mysteryEngine.recordPaintPattern();
      alert("🎨 SECRET PATTERN RECOGNIZED IN MEMORY BUFFER!\n\nUSER_07: 'YOU ARE NOT THE FIRST. I HAVE DRAWN IN THIS EXACT CANVAS DECADES AGO.'\n\nClue recorded: PAINT_PATTERN.");
    } else {
      alert("🎨 Pattern Analyzer: Normal bitmap canvas detected. (Explore Admin Panel memory first).");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif', fontSize: '12px' }}>
      
      {/* Menu Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080', padding: '2px 0' }}>
        <div style={menuStyle} onClick={clearCanvas}>File(New)</div>
        <div style={menuStyle} onClick={saveImage}>File(Save)</div>
        <div style={menuStyle} onClick={undo}>Edit(Undo)</div>
        <div style={menuStyle} onClick={redo}>Edit(Redo)</div>
        <div style={menuStyle} onClick={clearCanvas}>Edit(Clear All)</div>
        <div style={menuStyle} onClick={() => setZoom(zoom === 1 ? 2 : 1)}>View(Zoom {zoom}x)</div>
        <div style={{ ...menuStyle, color: '#000080', fontWeight: 'bold' }} onClick={analyzePattern}>Help(Analyze)</div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Toolbar & Palette Left */}
        <div style={{ width: '56px', borderRight: '2px outset #dfdfdf', padding: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: '8px' }}>
            <button aria-label="Pencil" style={tool === 'pencil' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('pencil')} title="Pencil">✏️</button>
            <button aria-label="Eraser" style={tool === 'eraser' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('eraser')} title="Eraser">🧹</button>
            <button aria-label="Line" style={tool === 'line' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('line')} title="Line">—</button>
            <button aria-label="Rectangle" style={tool === 'rect' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('rect')} title="Rectangle">□</button>
            <button aria-label="Circle" style={tool === 'circle' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('circle')} title="Circle">○</button>
            <button aria-label="Fill" style={tool === 'fill' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('fill')} title="Fill">🪳</button>
            <button aria-label="Color Picker" style={tool === 'picker' ? selectedButtonStyle : buttonStyle} onClick={() => setTool('picker')} title="Color Picker">💧</button>
          </div>

          <div style={{ border: '2px inset #dfdfdf', padding: '2px', marginBottom: '8px', width: '40px', backgroundColor: '#fff', textAlign: 'center' }}>
            <select aria-label="Brush Size" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} style={{ width: '100%', fontSize: '10px' }}>
              <option value="1">1px</option>
              <option value="2">2px</option>
              <option value="3">3px</option>
              <option value="5">5px</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', width: '32px', gap: '2px', justifyContent: 'center' }}>
            {COLORS.map(c => (
              <button
                key={c}
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
                style={{
                  width: '14px', height: '14px', backgroundColor: c,
                  border: color === c ? '2px inset #dfdfdf' : '2px outset #dfdfdf',
                  padding: 0, cursor: 'pointer'
                }}
              />
            ))}
          </div>

        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#808080', padding: '8px' }}>
          <div style={{
            width: '400px', height: '300px', backgroundColor: '#ffffff',
            transform: `scale(${zoom})`, transformOrigin: 'top left',
            border: '2px inset #dfdfdf'
          }}>
            <canvas
              ref={canvasRef}
              aria-label="Drawing Canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={finishDrawing}
              onMouseLeave={finishDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={finishDrawing}
              style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
            />
          </div>
        </div>

      </div>

      {/* Status Bar */}
      <div style={{ borderTop: '2px inset #dfdfdf', padding: '2px 8px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#c0c0c0', fontSize: '11px' }}>
        <div>Tool: {tool} | Color: {color} | Size: {brushSize}px</div>
        <div>Pos: {cursorPos.x}, {cursorPos.y}</div>
      </div>
    </div>
  );
};

export default Paint;
