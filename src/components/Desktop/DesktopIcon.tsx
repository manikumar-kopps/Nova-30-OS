import React, { useState } from 'react';

interface DesktopIconProps {
  id: string;
  icon: string;
  label: string;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function DesktopIcon({ id, icon, label, x, y, isSelected, onSelect, onOpen, onMove }: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      onMove(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label} application icon`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen(id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(id);
        }
      }}
      onFocus={() => onSelect(id)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '74px',
        padding: '4px',
        cursor: isDragging ? 'grabbing' : 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: isSelected ? 50 : 1,
        borderRadius: '2px',
        outline: 'none',
      }}
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
    >
      <div 
        style={{ 
          fontSize: '32px', 
          lineHeight: 1, 
          marginBottom: '4px',
          filter: isSelected ? 'drop-shadow(0 0 2px #000080)' : 'drop-shadow(1px 1px 1px rgba(0,0,0,0.6))',
          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.1s ease'
        }}
      >
        {icon}
      </div>
      <div 
        style={{
          backgroundColor: isSelected ? '#000080' : 'rgba(0, 0, 0, 0.4)',
          color: '#ffffff',
          padding: '2px 4px',
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif',
          lineHeight: '1.2',
          wordBreak: 'break-word',
          border: isSelected ? '1px dotted #ffffff' : '1px solid transparent',
          borderRadius: '1px',
          textShadow: '1px 1px 1px #000000'
        }}
      >
        {label}
      </div>
    </div>
  );
}
