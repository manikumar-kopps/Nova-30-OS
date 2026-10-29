import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sounds';

const BOOT_SEQUENCE = [
  "NOVA BIOS v2.1",
  "(C) 1998 NOVA Systems Inc.",
  "",
  "CPU: NOVA-486 @ 66MHz",
  "Memory: 640K OK... Extended: 16384K OK",
  "",
  "Checking Memory........ OK",
  "Checking Devices...... OK",
  "Detecting Hard Drive... C: 2.1GB OK",
  "Loading NOVA 30 OS....... OK",
  "",
  "Starting graphical interface...",
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let currentLine = 0;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      setLines(BOOT_SEQUENCE);
      setProgress(100);
      setShowWelcome(true);
      setTimeout(onComplete, 1500);
      return;
    }

    const interval = setInterval(() => {
      if (currentLine < BOOT_SEQUENCE.length) {
        setLines(prev => [...prev, BOOT_SEQUENCE[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        const progressInterval = setInterval(() => {
          setProgress(p => {
            if (p >= 100) {
              clearInterval(progressInterval);
              setShowWelcome(true);
              soundManager.playStartup();
              setTimeout(onComplete, 1200);
              return 100;
            }
            return p + 5;
          });
        }, 50);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    soundManager.playStartup();
    onComplete();
  };

  return (
    <div style={{
      backgroundColor: '#000', color: '#0f0', fontFamily: 'monospace', height: '100vh', width: '100vw', 
      padding: '20px', boxSizing: 'border-box', position: 'relative'
    }} role="status" aria-live="polite">
      <div className="crt-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      {lines.map((line, i) => <div key={i} style={{ minHeight: '1.2em' }}>{line}</div>)}
      
      {lines.length >= BOOT_SEQUENCE.length && (
        <div style={{ marginTop: '20px' }}>
          <div>{'█'.repeat(Math.floor(progress / 4))} {progress}%</div>
        </div>
      )}
      
      {showWelcome && (
        <div style={{ marginTop: '40px', fontSize: '1.5em', textAlign: 'center' }}>
          Welcome to NOVA 30 OS
        </div>
      )}

      <button 
        onClick={handleSkip}
        style={{
          position: 'absolute', bottom: '20px', right: '20px', 
          background: '#c0c0c0', color: '#000', border: '2px outset #dfdfdf', 
          padding: '5px 15px', cursor: 'pointer', fontFamily: '"MS Sans Serif", sans-serif', zIndex: 10
        }}
      >
        Skip Boot
      </button>
    </div>
  );
}
