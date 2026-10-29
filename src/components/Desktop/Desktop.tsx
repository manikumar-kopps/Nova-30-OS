import React, { useState, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import { useWindows } from '../../contexts/WindowContext';
import { useSound } from '../../hooks/useSound';

import { mysteryEngine } from '../../mystery/mysteryEngine';

interface IconData {
  id: string;
  icon: string;
  label: string;
  x: number;
  y: number;
}

const INITIAL_ICONS: IconData[] = [
  { id: 'my-computer', icon: '💻', label: 'My Computer', x: 20, y: 20 },
  { id: 'internet', icon: '🌐', label: 'Internet', x: 20, y: 105 },
  { id: 'files', icon: '📁', label: 'Files', x: 20, y: 190 },
  { id: 'notepad', icon: '📝', label: 'Notepad', x: 20, y: 275 },
  { id: 'paint', icon: '🎨', label: 'Paint', x: 20, y: 360 },
  { id: 'terminal', icon: '📟', label: 'Terminal', x: 20, y: 445 },
  { id: 'games', icon: '🎮', label: 'Games', x: 20, y: 530 },
  { id: 'music', icon: '🎵', label: 'Music', x: 105, y: 20 },
  { id: 'calculator', icon: '🧮', label: 'Calculator', x: 105, y: 105 },
  { id: 'task-manager', icon: '📊', label: 'Task Manager', x: 105, y: 190 },
  { id: 'control-panel', icon: '⚙️', label: 'Control Panel', x: 105, y: 275 },
  { id: 'about', icon: 'ℹ️', label: 'About NOVA', x: 105, y: 360 },
  { id: 'trash', icon: '🗑️', label: 'Recycle Bin', x: 105, y: 445 },
  { id: 'mail', icon: '✉️', label: 'NOVA Mail', x: 190, y: 20 },
  { id: 'writer', icon: '📄', label: 'NOVA Writer', x: 190, y: 105 },
  { id: 'clock', icon: '⏰', label: 'Clock', x: 190, y: 190 },
  { id: 'weather', icon: '🌤️', label: 'Weather', x: 190, y: 275 },
  { id: 'store', icon: '🛍️', label: 'Cyber Store', x: 190, y: 360 },
  // Secret Easter Egg desktop icon
  { id: 'secret-egg', icon: '🔮', label: 'DO_NOT_OPEN', x: 105, y: 530 },
];


interface DesktopProps {
  onStartScreenSaver?: () => void;
}

export default function Desktop({ onStartScreenSaver }: DesktopProps) {
  const { openWindow } = useWindows();
  const { playClick, playNotification } = useSound();
  const [icons, setIcons] = useState<IconData[]>(() => {
    try {
      const saved = localStorage.getItem('nova-desktop-icons');
      return saved ? JSON.parse(saved) : INITIAL_ICONS;
    } catch {
      return INITIAL_ICONS;
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    playClick();
  };

  const handleOpen = useCallback((id: string) => {
    playClick();
    if (id === 'secret-egg') {
      playNotification();
      mysteryEngine.recordFileOpen('DO_NOT_OPEN');
      openWindow({
        component: 'notepad',
        title: 'DO_NOT_OPEN.TXT - Secret File',
        icon: '🔮',
        props: {
          initialFileName: 'DO_NOT_OPEN.TXT',
          initialContent: `CLASSIFIED - NOVA RESEARCH ARCHIVE (1998)
===========================================
Subject: Time Slip in Subnet 4
Status: ANOMALOUS

If you are reading this, you have bypassed the desktop security layer.
We found this workstation running in an empty office on November 12, 1998.
The terminal logs showed commands typed from the year 2026.

Hidden Commands to try in Terminal:
- matrix
- doom
- hack
- nova
- devroom
- secret

Remember: Alt+Tab switches windows, and Ctrl+Alt+A opens Accessibility Center.`
        }
      });
      return;
    }
    if (id === 'trash') {
      openWindow('trash');
      return;
    }
    openWindow(id);

  }, [openWindow, playClick, playNotification]);

  const handleMove = (id: string, x: number, y: number) => {
    const boundedX = Math.max(10, Math.min(window.innerWidth - 90, x));
    const boundedY = Math.max(10, Math.min(window.innerHeight - 100, y));
    const updated = icons.map(icon => icon.id === id ? { ...icon, x: boundedX, y: boundedY } : icon);
    setIcons(updated);
    try {
      localStorage.setItem('nova-desktop-icons', JSON.stringify(updated));
    } catch {}
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleArrangeIcons = () => {
    setIcons(INITIAL_ICONS);
    localStorage.removeItem('nova-desktop-icons');
    setContextMenu(null);
  };

  const handleNewDocument = () => {
    openWindow('notepad');
    setContextMenu(null);
  };

  const handleProperties = () => {
    openWindow('control-panel');
    setContextMenu(null);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}
      onClick={() => {
        setSelectedId(null);
        setContextMenu(null);
      }}
      onContextMenu={handleContextMenu}
      role="region"
      aria-label="Desktop Surface"
      id="main-desktop"
    >
      {/* Desktop Icons */}
      {icons.map(icon => (
        <DesktopIcon
          key={icon.id}
          {...icon}
          isSelected={selectedId === icon.id}
          onSelect={handleSelect}
          onOpen={handleOpen}
          onMove={handleMove}
        />
      ))}

      {/* Retro Right-Click Context Menu */}
      {contextMenu && (
        <div
          role="menu"
          aria-label="Desktop context menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            width: '170px',
            backgroundColor: '#c0c0c0',
            border: '2px outset #ffffff',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
            zIndex: 99999,
            padding: '2px',
            fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
            fontSize: '11px'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={handleArrangeIcons}
          >
            📐 Arrange Icons
          </div>
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={() => {
              setContextMenu(null);
              playClick();
            }}
          >
            🔄 Refresh
          </div>
          <div style={{ height: '1px', backgroundColor: '#808080', margin: '3px 1px' }} />
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={handleNewDocument}
          >
            📄 New Text Document
          </div>
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={() => {
              openWindow('paint');
              setContextMenu(null);
            }}
          >
            🎨 New Bitmap Image
          </div>
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={() => {
              openWindow('calculator');
              setContextMenu(null);
            }}
          >
            🧮 Calculator
          </div>
          {onStartScreenSaver && (
            <div
              role="menuitem"
              style={contextMenuItemStyle}
              onClick={() => {
                setContextMenu(null);
                onStartScreenSaver();
              }}
            >
              🌌 Screen Saver
            </div>
          )}
          <div style={{ height: '1px', backgroundColor: '#808080', margin: '3px 1px' }} />
          <div
            role="menuitem"
            style={contextMenuItemStyle}
            onClick={handleProperties}
          >
            ⚙️ Properties
          </div>
        </div>
      )}
    </div>
  );
}

const contextMenuItemStyle: React.CSSProperties = {
  padding: '4px 8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  userSelect: 'none'
};
