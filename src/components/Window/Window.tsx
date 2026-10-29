import React, { useState, useEffect, useRef } from 'react';
import type { WindowState } from '../../types';
import { useSound } from '../../hooks/useSound';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  menuBar?: React.ReactNode;
  statusBar?: React.ReactNode;
  icon?: string;
}

export default function Window({
  windowState,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  menuBar,
  statusBar,
  icon
}: WindowProps) {
  const { playClick, playWindowClose } = useSound();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, winX: 0, winY: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Play close sound wrapper
  const handleClose = () => {
    playWindowClose();
    onClose();
  };

  const handleMinimize = () => {
    playClick();
    onMinimize();
  };

  const handleMaximize = () => {
    playClick();
    onMaximize();
  };

  // Dragging handlers
  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onFocus();
    if (windowState.isMaximized) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTitlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || windowState.isMaximized) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    onMove(newX, newY);
  };

  const handleTitlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore pointer capture release error
      }
    }
  };

  // Resizing handlers
  const handleResizeStart = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    if (windowState.isMaximized) return;

    setIsResizing(true);
    setResizeDirection(dir);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowState.width,
      height: windowState.height,
      winX: windowState.x,
      winY: windowState.y
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeDirection) return;

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    const minW = windowState.minWidth || 280;
    const minH = windowState.minHeight || 180;

    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = resizeStart.winX;
    let newY = resizeStart.winY;

    if (resizeDirection.includes('e')) {
      newWidth = Math.max(minW, resizeStart.width + dx);
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(minH, resizeStart.height + dy);
    }
    if (resizeDirection.includes('w')) {
      const candidateWidth = resizeStart.width - dx;
      if (candidateWidth >= minW) {
        newWidth = candidateWidth;
        newX = resizeStart.winX + dx;
      }
    }
    if (resizeDirection.includes('n')) {
      const candidateHeight = resizeStart.height - dy;
      if (candidateHeight >= minH) {
        newHeight = candidateHeight;
        newY = resizeStart.winY + dy;
      }
    }

    if (newX !== windowState.x || newY !== windowState.y) {
      onMove(newX, newY);
    }
    onResize(newWidth, newHeight);
  };

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      setResizeDirection(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  if (windowState.isMinimized) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    top: windowState.isMaximized ? 0 : windowState.y,
    left: windowState.isMaximized ? 0 : windowState.x,
    width: windowState.isMaximized ? '100vw' : windowState.width,
    height: windowState.isMaximized ? 'calc(100vh - 30px)' : windowState.height,
    zIndex: windowState.zIndex,
    backgroundColor: '#c0c0c0',
    border: '2px outset #ffffff',
    boxShadow: windowState.isFocused ? '2px 2px 8px rgba(0,0,0,0.4)' : '1px 1px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, Geneva, sans-serif',
    boxSizing: 'border-box',
    touchAction: 'none',
    userSelect: isDragging || isResizing ? 'none' : 'auto'
  };

  return (
    <div
      ref={windowRef}
      style={style}
      role="dialog"
      aria-label={windowState.title}
      onMouseDownCapture={onFocus}
      tabIndex={-1}
      className={`retro-window ${windowState.isFocused ? 'focused' : ''}`}
    >
      {/* Title Bar */}
      <div 
        style={{
          background: windowState.isFocused 
            ? 'linear-gradient(90deg, #000080, #1084d0)' 
            : 'linear-gradient(90deg, #808080, #b4b4b4)',
          color: windowState.isFocused ? '#ffffff' : '#c0c0c0',
          padding: '3px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: windowState.isMaximized ? 'default' : 'grab',
          userSelect: 'none',
          boxSizing: 'border-box'
        }}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={handleMaximize}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon || windowState.icon || '🗂️'}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{windowState.title}</span>
        </div>
        
        {/* Title Bar Buttons */}
        <div 
          style={{ display: 'flex', gap: '2px', marginLeft: '8px' }} 
          onPointerDown={e => e.stopPropagation()}
        >
          <button 
            onClick={handleMinimize} 
            style={btnStyle} 
            aria-label={`Minimize ${windowState.title}`}
            title="Minimize"
          >
            _
          </button>
          <button 
            onClick={handleMaximize} 
            style={btnStyle} 
            aria-label={windowState.isMaximized ? `Restore ${windowState.title}` : `Maximize ${windowState.title}`}
            title={windowState.isMaximized ? "Restore" : "Maximize"}
          >
            {windowState.isMaximized ? '❐' : '□'}
          </button>
          <button 
            onClick={handleClose} 
            style={{ ...btnStyle, fontWeight: 'bold' }} 
            aria-label={`Close ${windowState.title}`}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Menu Bar slot */}
      {menuBar && (
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #808080', backgroundColor: '#c0c0c0', fontSize: '11px' }}>
          {menuBar}
        </div>
      )}
      
      {/* Window Body/Content */}
      <div 
        style={{ 
          flex: 1, 
          overflow: 'hidden', 
          backgroundColor: '#c0c0c0', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </div>
      
      {/* Status Bar slot */}
      {statusBar && (
        <div style={{ 
          padding: '2px 6px', 
          borderTop: '1px solid #808080', 
          fontSize: '11px', 
          backgroundColor: '#c0c0c0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {statusBar}
        </div>
      )}

      {/* Resize corner grip (Windows 95/98 diagonal lines) */}
      {!windowState.isMaximized && (
        <div
          onPointerDown={e => handleResizeStart(e, 'se')}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          title="Resize window"
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            cursor: 'nwse-resize',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '2px',
            boxSizing: 'border-box',
            zIndex: 10
          }}
        >
          <div style={{ width: '9px', height: '1px', background: '#808080', marginBottom: '2px' }} />
          <div style={{ width: '6px', height: '1px', background: '#808080', marginBottom: '2px' }} />
          <div style={{ width: '3px', height: '1px', background: '#808080' }} />
        </div>
      )}

      {/* Resize handles on borders (invisible hit targets) */}
      {!windowState.isMaximized && (
        <>
          {/* Top handle */}
          <div
            onPointerDown={e => handleResizeStart(e, 'n')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            style={{ position: 'absolute', top: 0, left: 10, right: 10, height: '4px', cursor: 'ns-resize' }}
          />
          {/* Bottom handle */}
          <div
            onPointerDown={e => handleResizeStart(e, 's')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: '4px', cursor: 'ns-resize' }}
          />
          {/* Left handle */}
          <div
            onPointerDown={e => handleResizeStart(e, 'w')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            style={{ position: 'absolute', top: 10, bottom: 10, left: 0, width: '4px', cursor: 'ew-resize' }}
          />
          {/* Right handle */}
          <div
            onPointerDown={e => handleResizeStart(e, 'e')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            style={{ position: 'absolute', top: 10, bottom: 10, right: 0, width: '4px', cursor: 'ew-resize' }}
          />
        </>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#c0c0c0',
  border: '2px outset #ffffff',
  color: '#000000',
  cursor: 'pointer',
  padding: '1px 5px',
  fontFamily: 'monospace',
  fontSize: '11px',
  lineHeight: '1',
  minWidth: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none'
};
