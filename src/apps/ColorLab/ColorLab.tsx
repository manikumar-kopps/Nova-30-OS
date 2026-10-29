import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

export default function ColorLab() {
  const { playClick, playNotification } = useSound();
  const [r, setR] = useState(0);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);

  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

  const copyToClipboard = (text: string) => {
    playNotification();
    navigator.clipboard?.writeText(text);
    alert(`Copied "${text}" to clipboard.`);
  };

  const VGA_16 = [
    '#000000', '#000080', '#008000', '#008080',
    '#800000', '#800080', '#808000', '#C0C0C0',
    '#808080', '#0000FF', '#00FF00', '#00FFFF',
    '#FF0000', '#FF00FF', '#FFFF00', '#FFFFFF'
  ];

  const handleHexPick = (h: string) => {
    playClick();
    const clean = h.replace('#', '');
    const num = parseInt(clean, 16);
    setR((num >> 16) & 255);
    setG((num >> 8) & 255);
    setB(num & 255);
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '10px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '12px', marginBottom: '12px' }}>
        {/* Swatch & Hex preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{
            height: '90px',
            backgroundColor: hex,
            border: '2px inset #ffffff',
            borderRadius: '2px',
            boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.4)'
          }} />
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '13px' }}>
            {hex}
          </div>
          <button className="retro-button" onClick={() => copyToClipboard(hex)} style={{ padding: '2px', fontSize: '11px' }}>
            Copy HEX
          </button>
          <button className="retro-button" onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`)} style={{ padding: '2px', fontSize: '11px' }}>
            Copy RGB
          </button>
        </div>

        {/* Sliders */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#cc0000', fontWeight: 'bold' }}>Red:</span>
              <span>{r}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#008800', fontWeight: 'bold' }}>Green:</span>
              <span>{g}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#0000cc', fontWeight: 'bold' }}>Blue:</span>
              <span>{b}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* 16-Color VGA Palette */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '8px' }}>
        <strong style={{ display: 'block', fontSize: '11px', color: '#000080', marginBottom: '6px' }}>
          Standard VGA 16-Color Palette:
        </strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
          {VGA_16.map((color, i) => (
            <div
              key={i}
              onClick={() => handleHexPick(color)}
              title={color}
              style={{
                height: '24px',
                backgroundColor: color,
                border: '1px solid #000000',
                cursor: 'pointer',
                boxShadow: hex === color ? '0 0 0 2px #000080' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
