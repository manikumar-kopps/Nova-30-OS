import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function DiskManager() {
  const { playClick, playNotification } = useSound();
  const [selectedDrive, setSelectedDrive] = useState<'C' | 'A' | 'D'>('C');
  const [isDefragging, setIsDefragging] = useState(false);
  const [defragProgress, setDefragProgress] = useState(0);

  // Cluster grid (120 blocks)
  // Types: 'free' | 'allocated' | 'fragmented' | 'system'
  const [clusters, setClusters] = useState<string[]>(() => {
    return Array.from({ length: 140 }).map((_, i) => {
      if (i < 8) return 'system';
      if (Math.random() < 0.25) return 'fragmented';
      if (Math.random() < 0.55) return 'allocated';
      return 'free';
    });
  });

  const defragRef = useRef<any>(null);

  useEffect(() => {
    if (isDefragging) {
      defragRef.current = setInterval(() => {
        setClusters(prev => {
          const next = [...prev];
          const fragIdx = next.findIndex(c => c === 'fragmented');
          if (fragIdx !== -1) {
            next[fragIdx] = 'allocated';
            return next;
          }
          return next;
        });

        setDefragProgress(p => {
          if (p >= 100) {
            setIsDefragging(false);
            playNotification();
            alert('Defragmentation complete! 100% of files contiguous.');
            return 100;
          }
          return p + 2;
        });
      }, 150);
    } else {
      if (defragRef.current) clearInterval(defragRef.current);
    }
    return () => { if (defragRef.current) clearInterval(defragRef.current); };
  }, [isDefragging, playNotification]);

  const startDefrag = () => {
    playClick();
    setIsDefragging(true);
    setDefragProgress(0);
  };

  const drives = {
    'C': { label: 'Local Disk (C:)', size: '2.1 GB', used: '1.2 GB', free: '900 MB', format: 'FAT32', pct: 57 },
    'A': { label: '3½ Floppy (A:)', size: '1.44 MB', used: '240 KB', free: '1.2 MB', format: 'FAT12', pct: 16 },
    'D': { label: 'CD-ROM (D:)', size: '650 MB', used: '650 MB', free: '0 B', format: 'CDFS', pct: 100 }
  };

  const cur = drives[selectedDrive];

  const getColor = (type: string) => {
    switch (type) {
      case 'system': return '#00aa00'; // green
      case 'fragmented': return '#cc0000'; // red
      case 'allocated': return '#0000cc'; // blue
      default: return '#ffffff'; // white
    }
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '8px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Drive Select Buttons */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '8px' }}>
        {(['C', 'A', 'D'] as const).map(d => (
          <button
            key={d}
            onClick={() => { playClick(); setSelectedDrive(d); }}
            className="retro-button"
            style={{
              padding: '3px 10px',
              fontWeight: selectedDrive === d ? 'bold' : 'normal',
              backgroundColor: selectedDrive === d ? '#dfdfdf' : '#c0c0c0'
            }}
          >
            💾 {drives[d].label}
          </button>
        ))}
      </div>

      {/* Drive Stats Overview */}
      <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#000080' }}>{cur.label}</h3>
          <div style={{ fontSize: '11px', color: '#555' }}>File System: {cur.format} • Capacity: {cur.size}</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>
            Used Space: <strong>{cur.used}</strong> • Free Space: <strong>{cur.free}</strong>
          </div>
        </div>
        <div style={{ width: '120px' }}>
          <div style={{ fontSize: '10px', textAlign: 'right', marginBottom: '2px' }}>{cur.pct}% Used</div>
          <div style={{ height: '14px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff', padding: '1px' }}>
            <div style={{ height: '100%', width: `${cur.pct}%`, backgroundColor: '#000080' }} />
          </div>
        </div>
      </div>

      {/* Defrag Simulation Area */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <strong style={{ color: '#000080' }}>Disk Defragmenter — Cluster Map</strong>
          <button
            className="retro-button"
            onClick={startDefrag}
            disabled={isDefragging}
            style={{ padding: '3px 12px', fontWeight: 'bold' }}
          >
            {isDefragging ? `Defragging (${defragProgress}%)...` : '⚡ Defragment Drive'}
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', marginBottom: '6px', color: '#333' }}>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#00aa00', marginRight: '4px' }} />System</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#0000cc', marginRight: '4px' }} />Contiguous</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#cc0000', marginRight: '4px' }} />Fragmented</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#ffffff', border: '1px solid #aaa', marginRight: '4px' }} />Free Space</span>
        </div>

        {/* Cluster blocks grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(20, 1fr)',
          gap: '2px',
          padding: '4px',
          backgroundColor: '#000000',
          border: '1px solid #808080',
          overflowY: 'auto'
        }}>
          {clusters.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: getColor(c),
                minHeight: '12px',
                borderRadius: '1px'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
