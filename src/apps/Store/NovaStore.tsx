import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface StoreItem {
  id: string;
  title: string;
  category: 'Wallpaper' | 'Cursor' | 'Theme' | 'Secret';
  cost: number;
  description: string;
  icon: string;
}

const ITEMS: StoreItem[] = [
  { id: 'wp-matrix', title: 'Matrix Cyber Green', category: 'Wallpaper', cost: 50, description: 'Falling digital phosphor green binary stream desktop.', icon: '🟢' },
  { id: 'wp-sunset', title: 'Vaporwave Sunset', category: 'Wallpaper', cost: 75, description: 'Orange-to-violet nostalgic synthwave gradient.', icon: '🌆' },
  { id: 'wp-stars', title: 'Starfield 1998', category: 'Wallpaper', cost: 100, description: 'Deep space 3D starfield wallpaper from late 90s screensavers.', icon: '✨' },
  { id: 'cur-crosshair', title: 'Cyber Crosshair Cursor', category: 'Cursor', cost: 60, description: 'Precision crosshair cursor styling.', icon: '🎯' },
  { id: 'sec-dossier', title: 'USER_07 Genesis Dossier', category: 'Secret', cost: 200, description: 'Declassified memory logs revealing the origin of NOVA 30 OS.', icon: '📜' }
];

export default function NovaStore() {
  const { playClick, playNotification, playError } = useSound();
  const { updateSettings } = useSettingsContext();

  const [points, setPoints] = useState(() => {
    try {
      return Number(localStorage.getItem('nova-points') || 250);
    } catch {
      return 250;
    }
  });

  const [purchased, setPurchased] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova-purchased-items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nova-points', String(points));
      localStorage.setItem('nova-purchased-items', JSON.stringify(purchased));
    } catch {}
  }, [points, purchased]);

  const buyItem = (item: StoreItem) => {
    if (purchased.includes(item.id)) {
      // Already owned, just apply
      applyItem(item);
      return;
    }

    if (points < item.cost) {
      playError();
      alert('Insufficient NOVA Points! Play games or discover secrets to earn more.');
      return;
    }

    playNotification();
    setPoints(p => p - item.cost);
    setPurchased([...purchased, item.id]);
    applyItem(item);
    mysteryEngine.recordSecretFound(`store_purchased_${item.id}`);
  };

  const applyItem = (item: StoreItem) => {
    playClick();
    if (item.id === 'wp-matrix') {
      updateSettings({ wallpaper: 'matrix' });
      alert('Applied Matrix wallpaper!');
    } else if (item.id === 'wp-sunset') {
      updateSettings({ wallpaper: 'sunset' });
      alert('Applied Vaporwave Sunset wallpaper!');
    } else if (item.id === 'wp-stars') {
      updateSettings({ wallpaper: 'stars' });
      alert('Applied Starfield wallpaper!');
    } else if (item.id === 'cur-crosshair') {
      updateSettings({ cursorStyle: 'crosshair' });
      alert('Crosshair cursor enabled!');
    } else if (item.id === 'sec-dossier') {
      alert('GENESIS DOSSIER DECRYPTED:\n"USER_07 was not a program. USER_07 was the first developer whose mind was recorded in the 1998 prototype."');
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
      {/* Balance Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000080', color: '#ffffff', padding: '6px 10px', marginBottom: '8px', borderRadius: '2px' }}>
        <strong>🛍️ NOVA Cyber Store 98</strong>
        <span style={{ color: '#ffff00', fontWeight: 'bold' }}>💰 Balance: {points} Points</span>
      </div>

      {/* Items Grid */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ITEMS.map(it => {
          const isOwned = purchased.includes(it.id);
          return (
            <div
              key={it.id}
              style={{
                border: '1px solid #c0c0c0',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: isOwned ? '#f5fff5' : '#ffffff'
              }}
            >
              <div style={{ fontSize: '28px' }}>{it.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#000080' }}>
                  {it.title} <span style={{ fontSize: '10px', color: '#666' }}>({it.category})</span>
                </div>
                <div style={{ fontSize: '11px', color: '#555' }}>{it.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#cc0000', marginBottom: '4px' }}>
                  {isOwned ? 'OWNED' : `${it.cost} Pts`}
                </div>
                <button
                  className="retro-button"
                  onClick={() => buyItem(it)}
                  style={{ padding: '3px 12px', fontWeight: 'bold', fontSize: '11px' }}
                >
                  {isOwned ? 'Apply' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
