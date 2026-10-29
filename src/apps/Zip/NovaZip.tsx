import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

interface ZipItem {
  name: string;
  date: string;
  size: number;
  packed: number;
  ratio: string;
}

const DEFAULT_ARCHIVE_FILES: ZipItem[] = [
  { name: 'setup.exe', date: '15/07/1998 10:14', size: 1048576, packed: 482100, ratio: '54%' },
  { name: 'readme.txt', date: '15/07/1998 10:15', size: 8420, packed: 2310, ratio: '72%' },
  { name: 'kernel.sys', date: '14/07/1998 18:22', size: 524288, packed: 262144, ratio: '50%' },
  { name: 'soundfx.wav', date: '12/07/1998 14:02', size: 245760, packed: 198000, ratio: '19%' },
  { name: 'secret_key.enc', date: '01/01/1998 00:00', size: 4096, packed: 1024, ratio: '75%' },
];

export default function NovaZip() {
  const { playClick, playNotification } = useSound();
  const [archiveName] = useState('NOVA_SYS_ARCHIVE.ZIP');
  const [items, setItems] = useState<ZipItem[]>(DEFAULT_ARCHIVE_FILES);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);

  const handleExtract = () => {
    playClick();
    setIsExtracting(true);
    setExtractProgress(10);

    let p = 10;
    const interval = setInterval(() => {
      p += 20;
      setExtractProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExtracting(false);
          playNotification();
          alert(`Successfully extracted ${items.length} files to C:\\Downloads!`);
        }, 300);
      }
    }, 250);
  };

  const handleAddFile = () => {
    playClick();
    const fname = prompt('Enter filename to compress into archive:', 'document.txt');
    if (!fname) return;
    const size = Math.floor(Math.random() * 50000) + 1200;
    const packed = Math.floor(size * 0.45);
    const newFile: ZipItem = {
      name: fname,
      date: new Date().toLocaleDateString(),
      size,
      packed,
      ratio: '55%'
    };
    setItems([...items, newFile]);
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
      {/* Top WinZip Toolbar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '6px' }}>
        <button className="retro-button" onClick={() => { playClick(); alert('New Archive initialized.'); }} style={{ padding: '3px 8px' }}>
          📄 New
        </button>
        <button className="retro-button" onClick={() => { playClick(); alert(`Opened ${archiveName}`); }} style={{ padding: '3px 8px' }}>
          📂 Open
        </button>
        <button className="retro-button" onClick={handleExtract} style={{ padding: '3px 8px', fontWeight: 'bold' }}>
          ⚡ Extract
        </button>
        <button className="retro-button" onClick={handleAddFile} style={{ padding: '3px 8px' }}>
          ➕ Add File
        </button>
        <button className="retro-button" onClick={() => { playClick(); alert('Integrity Test: All CRC-32 checksums verified OK.'); }} style={{ padding: '3px 8px' }}>
          🔍 Test
        </button>
      </div>

      <div style={{ fontSize: '11px', color: '#000080', fontWeight: 'bold', marginBottom: '4px' }}>
        Archive: {archiveName} ({items.length} files)
      </div>

      {/* Archive Files Table */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', overflowY: 'auto', minHeight: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '1px solid #808080', textAlign: 'left' }}>
              <th style={{ padding: '3px 6px' }}>Name</th>
              <th style={{ padding: '3px 6px' }}>Date</th>
              <th style={{ padding: '3px 6px', textAlign: 'right' }}>Size</th>
              <th style={{ padding: '3px 6px', textAlign: 'right' }}>Packed</th>
              <th style={{ padding: '3px 6px', textAlign: 'right' }}>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedIdx === idx ? '#000080' : '#ffffff',
                  color: selectedIdx === idx ? '#ffffff' : '#000000'
                }}
              >
                <td style={{ padding: '3px 6px' }}>📁 {it.name}</td>
                <td style={{ padding: '3px 6px' }}>{it.date}</td>
                <td style={{ padding: '3px 6px', textAlign: 'right' }}>{it.size.toLocaleString()} B</td>
                <td style={{ padding: '3px 6px', textAlign: 'right' }}>{it.packed.toLocaleString()} B</td>
                <td style={{ padding: '3px 6px', textAlign: 'right' }}>{it.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px', borderTop: '2px groove #ffffff', marginTop: '6px', fontSize: '11px', color: '#333' }}>
        <span>Selected 1 file ({selectedIdx !== null ? items[selectedIdx]?.size.toLocaleString() : 0} bytes)</span>
        <span>Total: {items.reduce((a, b) => a + b.size, 0).toLocaleString()} bytes</span>
      </div>

      {/* Extracting Progress Modal */}
      {isExtracting && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          right: '15%',
          backgroundColor: '#c0c0c0',
          border: '2px outset #ffffff',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
          padding: '16px',
          zIndex: 999
        }}>
          <strong style={{ display: 'block', marginBottom: '8px' }}>Extracting files from archive...</strong>
          <div style={{ fontSize: '11px', marginBottom: '4px' }}>Processing: {items[selectedIdx || 0]?.name || 'archive data'} ({extractProgress}%)</div>
          <div style={{ height: '18px', backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '1px' }}>
            <div style={{ height: '100%', width: `${extractProgress}%`, backgroundColor: '#000080' }} />
          </div>
        </div>
      )}
    </div>
  );
}
