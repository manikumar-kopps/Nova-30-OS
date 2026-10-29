import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

interface GalleryImage {
  id: string;
  title: string;
  dimensions: string;
  svgData: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'img1',
    title: 'Neon_Grid_1998.bmp',
    dimensions: '640x480 24-bit',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="400" height="300" fill="#0d001a"/><circle cx="200" cy="140" r="70" fill="url(#sunGrad)"/><path d="M0 160 L400 160 M0 180 L400 180 M0 210 L400 210 M0 250 L400 250 M0 300 L400 300" stroke="#ff007f" stroke-width="2"/><path d="M200 160 L0 300 M200 160 L80 300 M200 160 L160 300 M200 160 L240 300 M200 160 L320 300 M200 160 L400 300" stroke="#00ffff" stroke-width="2"/><defs><linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffff00"/><stop offset="100%" stop-color="#ff0055"/></linearGradient></defs></svg>`
  },
  {
    id: 'img2',
    title: 'Retro_Mountains.bmp',
    dimensions: '800x600 16-color',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="400" height="300" fill="#000080"/><circle cx="320" cy="60" r="30" fill="#ffff99"/><polygon points="0,300 120,120 240,300" fill="#008080"/><polygon points="160,300 280,150 400,300" fill="#004040"/><polygon points="90,165 120,120 150,165" fill="#ffffff"/></svg>`
  },
  {
    id: 'img3',
    title: 'Cyber_Cat_Pixel.bmp',
    dimensions: '320x240 256-color',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="400" height="300" fill="#111122"/><polygon points="140,80 170,140 110,140" fill="#ff66cc"/><polygon points="260,80 290,140 230,140" fill="#ff66cc"/><circle cx="200" cy="170" r="60" fill="#333366"/><ellipse cx="180" cy="160" rx="10" ry="15" fill="#00ffcc"/><ellipse cx="220" cy="160" rx="10" ry="15" fill="#00ffcc"/><polygon points="200,180 190,190 210,190" fill="#ff0066"/><line x1="140" y1="180" x2="90" y2="175" stroke="#fff" stroke-width="2"/><line x1="140" y1="190" x2="90" y2="195" stroke="#fff" stroke-width="2"/><line x1="260" y1="180" x2="310" y2="175" stroke="#fff" stroke-width="2"/><line x1="260" y1="190" x2="310" y2="195" stroke="#fff" stroke-width="2"/></svg>`
  }
];

export default function ImageViewer() {
  const { playClick } = useSound();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<'none' | 'invert' | 'sepia' | 'contrast'>('none');
  const [isSlideshow, setIsSlideshow] = useState(false);

  const curImg = GALLERY_IMAGES[currentIdx];

  useEffect(() => {
    if (isSlideshow) {
      const timer = setInterval(() => {
        setCurrentIdx(i => (i + 1) % GALLERY_IMAGES.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isSlideshow]);

  const handleNext = () => {
    playClick();
    setCurrentIdx((currentIdx + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    playClick();
    setCurrentIdx((currentIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'invert': return 'invert(100%)';
      case 'sepia': return 'sepia(100%) hue-rotate(180deg)';
      case 'contrast': return 'contrast(200%) brightness(120%)';
      default: return 'none';
    }
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '6px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Viewer Toolbar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <button className="retro-button" onClick={handlePrev} style={{ padding: '2px 8px' }}>◀ Prev</button>
        <button className="retro-button" onClick={handleNext} style={{ padding: '2px 8px' }}>Next ▶</button>
        <button className="retro-button" onClick={() => { playClick(); setZoom(z => Math.min(2.5, z + 0.25)); }} style={{ padding: '2px 8px' }}>🔍+ Zoom In</button>
        <button className="retro-button" onClick={() => { playClick(); setZoom(z => Math.max(0.5, z - 0.25)); }} style={{ padding: '2px 8px' }}>🔍- Zoom Out</button>
        <button className="retro-button" onClick={() => { playClick(); setRotation(r => (r + 90) % 360); }} style={{ padding: '2px 8px' }}>🔄 Rotate</button>
        <button className="retro-button" onClick={() => { playClick(); setFilter(f => f === 'none' ? 'invert' : f === 'invert' ? 'sepia' : f === 'sepia' ? 'contrast' : 'none'); }} style={{ padding: '2px 8px' }}>
          🎨 Filter: {filter}
        </button>
        <button 
          className="retro-button" 
          onClick={() => { playClick(); setIsSlideshow(!isSlideshow); }} 
          style={{ padding: '2px 8px', fontWeight: isSlideshow ? 'bold' : 'normal', backgroundColor: isSlideshow ? '#dfdfdf' : '#c0c0c0' }}
        >
          {isSlideshow ? '⏹ Stop' : '▶ Slideshow'}
        </button>
      </div>

      {/* Image Canvas Viewport */}
      <div style={{
        flex: 1,
        backgroundColor: '#000000',
        border: '2px inset #dfdfdf',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0
      }}>
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease',
            filter: getFilterStyle(),
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          dangerouslySetInnerHTML={{ __html: curImg.svgData }}
        />
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px', borderTop: '2px groove #ffffff', marginTop: '6px', fontSize: '11px', color: '#333' }}>
        <span><strong>{curImg.title}</strong> ({curImg.dimensions})</span>
        <span>Image {currentIdx + 1} of {GALLERY_IMAGES.length} • Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
