import React, { useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

interface NotificationProps {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  icon?: string;
  onClose: () => void;
  buttons?: { label: string; onClick: () => void }[];
}

export default function Notification({ title, message, type, icon, onClose, buttons }: NotificationProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { playError, playNotification } = useSound();

  useEffect(() => {
    if (type === 'error') playError();
    else playNotification();
  }, [type, playError, playNotification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const defaultIcon = type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div 
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        style={{
          width: '300px',
          backgroundColor: '#c0c0c0',
          border: '2px outset #dfdfdf',
          fontFamily: '"MS Sans Serif", sans-serif',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{
          background: 'linear-gradient(90deg, #000080, #1084d0)',
          color: '#fff',
          padding: '2px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold'
        }}>
          <span>{title}</span>
          <button onClick={onClose} style={{
            background: '#c0c0c0', border: '2px outset #dfdfdf', cursor: 'pointer', fontWeight: 'bold'
          }}>✕</button>
        </div>

        <div style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ fontSize: '32px' }}>{icon || defaultIcon}</div>
          <div>{message}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px', marginTop: 'auto' }}>
          {buttons ? buttons.map((btn, i) => (
            <button key={i} onClick={btn.onClick} style={btnStyle} autoFocus={i === 0}>
              {btn.label}
            </button>
          )) : (
            <button onClick={onClose} style={btnStyle} autoFocus>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#c0c0c0',
  border: '2px outset #dfdfdf',
  padding: '4px 15px',
  cursor: 'pointer',
  minWidth: '70px',
  fontFamily: '"MS Sans Serif", sans-serif'
};
