import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface TaskbarProps {
  onStartClick: () => void;
  startMenuOpen: boolean;
}

export default function Taskbar({ onStartClick, startMenuOpen }: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindows();
  const { settings, updateSettings } = useSettingsContext();
  const { playClick, playNotification } = useSound();
  const [time, setTime] = useState(new Date());
  const [clockClicks, setClockClicks] = useState(0);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [showSoundSlider, setShowSoundSlider] = useState(false);
  const [mysteryToast, setMysteryToast] = useState<string | null>(null);
  const [mysteryState, setMysteryState] = useState(mysteryEngine.getState());
  const clockClickTimerRef = useRef<any>(null);

  useEffect(() => {
    return mysteryEngine.subscribe(setMysteryState);
  }, []);

  useEffect(() => {
    const handleMysteryNotify = (e: any) => {
      if (e.detail?.message) {
        setMysteryToast(e.detail.message);
        setTimeout(() => setMysteryToast(null), 5000);
      }
    };
    window.addEventListener('nova-mystery-notify', handleMysteryNotify);
    return () => window.removeEventListener('nova-mystery-notify', handleMysteryNotify);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClockClick = () => {
    playClick();
    const nextClicks = clockClicks + 1;
    setClockClicks(nextClicks);

    if (clockClickTimerRef.current) clearTimeout(clockClickTimerRef.current);
    clockClickTimerRef.current = setTimeout(() => setClockClicks(0), 10000);

    if (nextClicks >= 5) {
      playNotification();
      mysteryEngine.triggerClockAnomaly();
      alert("⏳ TEMPORAL DIAGNOSTICS ENGAGED!\n\nSystem Clock jump verified: November 1998.\nAnomaly Trace: USER_07 resident signal detected in memory.\nInspect Network monitor or Task Manager (unknown.exe).");
      setClockClicks(0);
    }
  };

  const handleNetworkClick = () => {
    playClick();
    if (mysteryState.cluesDiscovered.includes('TEMPORAL_ANOMALY') || mysteryState.mysteryLevel >= 1) {
      mysteryEngine.triggerNetworkSignal();
      playNotification();
    }
    setShowNetworkInfo(!showNetworkInfo);
  };

  const toggleSound = () => {
    playClick();
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const formatTime = () => {
    const is12h = settings.clockFormat === '12h';
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: undefined,
      hour12: is12h
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        backgroundColor: '#c0c0c0',
        borderTop: '2px outset #ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 3px',
        fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif',
        fontSize: '11px',
        zIndex: 90000,
        userSelect: 'none',
        boxSizing: 'border-box'
      }} 
      role="toolbar"
      aria-label="Taskbar"
    >
      {/* Start Button */}
      <button 
        onClick={() => {
          playClick();
          onStartClick();
        }}
        aria-expanded={startMenuOpen}
        aria-label="Start menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 'bold',
          border: startMenuOpen ? '2px inset #ffffff' : '2px outset #ffffff',
          padding: '2px 8px',
          background: startMenuOpen ? '#e0e0e0' : '#c0c0c0',
          cursor: 'pointer',
          height: '24px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        className="retro-button"
      >
        <span style={{ fontSize: '13px' }}>🌟</span>
        <span style={{ letterSpacing: '0.5px' }}>Start</span>
      </button>

      {/* Vertical separator */}
      <div style={{ width: '2px', height: '22px', borderLeft: '1px solid #808080', borderRight: '1px solid #ffffff', margin: '0 4px' }} />

      {/* Active Application Windows List */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          gap: '3px', 
          padding: '0 2px', 
          overflowX: 'auto',
          alignItems: 'center'
        }}
        role="group"
        aria-label="Running Applications"
      >
        {windows.map(win => {
          const isActive = win.isFocused && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => {
                playClick();
                if (isActive) {
                  minimizeWindow(win.id);
                } else {
                  focusWindow(win.id);
                }
              }}
              style={{
                flex: '0 1 140px',
                minWidth: '70px',
                maxWidth: '160px',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: '2px 6px',
                border: isActive ? '2px inset #ffffff' : '2px outset #ffffff',
                background: isActive ? '#dfdfdf' : '#c0c0c0',
                cursor: 'pointer',
                height: '24px',
                fontWeight: isActive ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              aria-label={`${win.title} application window`}
            >
              <span style={{ fontSize: '12px' }}>{win.icon || '🗂️'}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray (Beveled Inset Area) */}
      <div 
        style={{
          border: '2px inset #dfdfdf',
          padding: '2px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '24px',
          boxSizing: 'border-box',
          backgroundColor: '#c0c0c0',
          position: 'relative'
        }}
        role="region"
        aria-label="System Tray"
      >
        {/* Network status */}
        <span 
          title={mysteryState.cluesDiscovered.includes('TEMPORAL_ANOMALY') || mysteryState.mysteryLevel >= 1 ? "⚠️ UNROUTED PACKET BROADCAST (Click to analyze)" : "Network: 56.6k Dial-Up Connected"}
          onClick={handleNetworkClick}
          style={{ cursor: 'pointer', fontSize: '12px', color: (mysteryState.cluesDiscovered.includes('TEMPORAL_ANOMALY') || mysteryState.mysteryLevel >= 1) ? '#cc0000' : 'inherit' }}
          role="button"
          tabIndex={0}
          aria-label="Network status: 56k dialup connected"
        >
          {(mysteryState.cluesDiscovered.includes('TEMPORAL_ANOMALY') || mysteryState.mysteryLevel >= 1) ? '📡' : '📶'}
        </span>

        {/* Sound toggle */}
        <span 
          title={`Audio: ${settings.soundEnabled ? 'ON' : 'OFF'} (Click to toggle)`}
          onClick={toggleSound}
          style={{ cursor: 'pointer', fontSize: '12px', opacity: settings.soundEnabled ? 1 : 0.5 }}
          role="button"
          tabIndex={0}
          aria-label={`Sound ${settings.soundEnabled ? 'enabled' : 'muted'}`}
        >
          {settings.soundEnabled ? '🔊' : '🔇'}
        </span>

        {/* Battery / AC indicator */}
        <span 
          title="Power: 100% (AC line online)"
          style={{ fontSize: '12px' }}
          aria-label="Power: 100% AC line online"
        >
          🔋
        </span>

        {/* Digital Clock */}
        <span 
          onClick={handleClockClick} 
          onDoubleClick={() => openWindow('clock')}
          style={{ 
            cursor: 'pointer', 
            marginLeft: '4px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '11px',
            padding: '1px 2px'
          }}
          title="Date & Time (Click 5 times for Temporal Diagnostics, Double-click to open Clock)"
          role="button"
          tabIndex={0}
          aria-label={`System Time: ${formatTime()}`}
        >
          {formatTime()}
        </span>


        {/* Network popup tooltip */}
        {showNetworkInfo && (
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: 0,
              backgroundColor: '#ffffcc',
              border: '2px solid #000000',
              padding: '8px 10px',
              fontSize: '11px',
              width: '220px',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
              zIndex: 99999
            }}
          >
            <strong>NOVA Dial-Up Network Adapter</strong>
            <p style={{ margin: '4px 0' }}>Status: Connected (56,000 bps)</p>
            {(mysteryState.cluesDiscovered.includes('TEMPORAL_ANOMALY') || mysteryState.mysteryLevel >= 1) ? (
              <div style={{ marginTop: '6px', borderTop: '1px dashed #888', paddingTop: '4px', color: '#800000' }}>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>⚠️ ANOMALY DETECTED:</p>
                <p style={{ margin: '2px 0' }}>Broadcast packet from 127.0.0.1:0707</p>
                <p style={{ margin: '2px 0', fontSize: '10px', fontStyle: 'italic' }}>
                  "USER_07 resident listener active in Task Manager."
                </p>
                <button
                  onClick={() => { setShowNetworkInfo(false); if (openWindow) openWindow('task-manager'); }}
                  style={{ marginTop: '6px', padding: '2px 8px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', cursor: 'pointer', fontSize: '10px' }}
                >
                  Open Task Manager
                </button>
              </div>
            ) : (
              <p style={{ margin: '4px 0' }}>Packets: 1998 sent / 2026 rcvd</p>
            )}
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <button onClick={() => setShowNetworkInfo(false)} style={{ fontSize: '10px', padding: '1px 6px' }}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Mystery Toast Alert in Bottom Right */}
      {mysteryToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '12px',
            backgroundColor: '#000080',
            color: '#ffffff',
            border: '2px outset #ffffff',
            padding: '8px 14px',
            boxShadow: '3px 3px 10px rgba(0,0,0,0.5)',
            zIndex: 999999,
            fontFamily: '"MS Sans Serif", sans-serif',
            fontSize: '11px',
            maxWidth: '280px',
            whiteSpace: 'pre-line'
          }}
        >
          {mysteryToast}
        </div>
      )}
    </div>
  );
}
