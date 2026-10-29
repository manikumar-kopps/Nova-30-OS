import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';
import { useWindows } from '../../contexts/WindowContext';

interface TrashItem {
  id: string;
  name: string;
  originalPath: string;
  dateDeleted: string;
  size: string;
  isMystery?: boolean;
}

const DEFAULT_TRASH: TrashItem[] = [
  { id: 't1', name: 'old_notes.txt', originalPath: 'C:\\Documents', dateDeleted: '12/10/1998 09:12', size: '2 KB' },
  { id: 't2', name: 'snake_backup.sav', originalPath: 'C:\\Games', dateDeleted: '04/09/1998 16:44', size: '4 KB' },
  { id: 't3', name: 'temp_dialup.log', originalPath: 'C:\\System', dateDeleted: '01/08/1998 11:20', size: '12 KB' }
];

export default function RecycleBin() {
  const { playClick, playNotification, playError } = useSound();
  const { openWindow } = useWindows();
  const [items, setItems] = useState<TrashItem[]>(() => {
    const list = [...DEFAULT_TRASH];
    // If mystery level >= 1, show deleted USER_07.DAT
    if (mysteryEngine.getState().mysteryLevel >= 1) {
      list.push({
        id: 't-user07',
        name: 'USER_07.DAT',
        originalPath: 'C:\\DO_NOT_OPEN',
        dateDeleted: '31/12/1998 23:59',
        size: '64 KB',
        isMystery: true
      });
    }
    return list;
  });

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);

  const selected = items.find(i => i.id === selectedId);

  const handleEmpty = () => {
    playClick();
    if (confirm('Are you sure you want to permanently empty the Recycle Bin?')) {
      playNotification();
      setItems([]);
      setSelectedId(null);
    }
  };

  const handleRestore = () => {
    if (!selected) return;
    playClick();
    if (selected.isMystery) {
      playNotification();
      mysteryEngine.recordSecretFound('recycle_bin_user07_restored');
      alert(`Restored ${selected.name} to ${selected.originalPath}!\nMemory fragment reintegrated.`);
      openWindow('notepad', { initialFile: 'USER_07.DAT' });
    } else {
      alert(`Restored ${selected.name} to ${selected.originalPath}.`);
    }
    setItems(items.filter(i => i.id !== selected.id));
    setSelectedId(null);
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
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '6px' }}>
        <button className="retro-button" onClick={handleRestore} disabled={!selected} style={{ padding: '3px 10px', fontWeight: 'bold' }}>
          ↩️ Restore Item
        </button>
        <button className="retro-button" onClick={handleEmpty} disabled={items.length === 0} style={{ padding: '3px 10px', color: '#cc0000' }}>
          🗑️ Empty Recycle Bin
        </button>
      </div>

      {/* Items List Table */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '1px solid #808080', textAlign: 'left' }}>
              <th style={{ padding: '3px 6px' }}>Name</th>
              <th style={{ padding: '3px 6px' }}>Original Location</th>
              <th style={{ padding: '3px 6px' }}>Date Deleted</th>
              <th style={{ padding: '3px 6px', textAlign: 'right' }}>Size</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr
                key={it.id}
                onClick={() => { playClick(); setSelectedId(it.id); }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: it.id === selectedId ? '#000080' : '#ffffff',
                  color: it.id === selectedId ? '#ffffff' : it.isMystery ? '#cc0000' : '#000000',
                  fontWeight: it.isMystery ? 'bold' : 'normal'
                }}
              >
                <td style={{ padding: '4px 6px' }}>{it.isMystery ? '⚠️ ' : '📄 '}{it.name}</td>
                <td style={{ padding: '4px 6px' }}>{it.originalPath}</td>
                <td style={{ padding: '4px 6px' }}>{it.dateDeleted}</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{it.size}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#888', fontStyle: 'italic' }}>
                  Recycle Bin is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px', borderTop: '2px groove #ffffff', marginTop: '6px', fontSize: '11px', color: '#333' }}>
        <span>{items.length} item(s)</span>
        {selected && <span>Selected: {selected.name} ({selected.size})</span>}
      </div>
    </div>
  );
}
