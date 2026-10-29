import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function ClockApp() {
  const { playClick, playNotification } = useSound();
  const [tab, setTab] = useState<'digital' | 'analog' | 'stopwatch' | 'timer' | 'world'>('digital');
  const [now, setNow] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<any>(null);

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setSwTime(t => t + 10), 10);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState('60');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            playNotification();
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning, timerSeconds, playNotification]);

  // Analog Clock angles
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Format stopwatch ms
  const formatSw = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
  };

  const worldCities = [
    { name: 'Bengaluru', zone: 'Asia/Kolkata', flag: '🇮🇳' },
    { name: 'London', zone: 'Europe/London', flag: '🇬🇧' },
    { name: 'New York', zone: 'America/New_York', flag: '🇺🇸' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Sydney', zone: 'Australia/Sydney', flag: '🇦🇺' },
  ];

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
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #808080', paddingBottom: '4px', marginBottom: '10px' }}>
        {[
          { key: 'digital', label: '📟 Digital' },
          { key: 'analog', label: '🕰️ Analog' },
          { key: 'stopwatch', label: '⏱️ Stopwatch' },
          { key: 'timer', label: '⏳ Timer' },
          { key: 'world', label: '🌍 World' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { playClick(); setTab(t.key as any); }}
            className="retro-button"
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: tab === t.key ? 'bold' : 'normal',
              borderStyle: tab === t.key ? 'inset' : 'outset'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {tab === 'digital' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Lucida Console", monospace',
              fontSize: '44px',
              fontWeight: 'bold',
              color: '#00ff00',
              backgroundColor: '#000000',
              padding: '16px 24px',
              border: '4px inset #dfdfdf',
              borderRadius: '4px',
              letterSpacing: '2px',
              textShadow: '0 0 10px #00ff00'
            }}>
              {now.toLocaleTimeString()}
            </div>
            <div style={{ marginTop: '12px', fontSize: '14px', color: '#555555', fontWeight: 'bold' }}>
              {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        )}

        {tab === 'analog' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Dial background */}
              <circle cx="100" cy="100" r="95" fill="#f8f8f8" stroke="#000000" strokeWidth="4" />
              {/* Hour tick marks */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 100 + 80 * Math.sin(angle);
                const y1 = 100 - 80 * Math.cos(angle);
                const x2 = 100 + 90 * Math.sin(angle);
                const y2 = 100 - 90 * Math.cos(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={i % 3 === 0 ? "3" : "1"} />;
              })}
              {/* Hands */}
              <line
                x1="100" y1="100"
                x2={100 + 50 * Math.sin((hourAngle * Math.PI) / 180)}
                y2={100 - 50 * Math.cos((hourAngle * Math.PI) / 180)}
                stroke="#000" strokeWidth="5" strokeLinecap="round"
              />
              <line
                x1="100" y1="100"
                x2={100 + 70 * Math.sin((minAngle * Math.PI) / 180)}
                y2={100 - 70 * Math.cos((minAngle * Math.PI) / 180)}
                stroke="#333" strokeWidth="3" strokeLinecap="round"
              />
              <line
                x1="100" y1="100"
                x2={100 + 80 * Math.sin((secAngle * Math.PI) / 180)}
                y2={100 - 80 * Math.cos((secAngle * Math.PI) / 180)}
                stroke="#cc0000" strokeWidth="1.5"
              />
              <circle cx="100" cy="100" r="4" fill="#cc0000" />
            </svg>
            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>{now.toLocaleTimeString()}</div>
          </div>
        )}

        {tab === 'stopwatch' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '36px', fontWeight: 'bold', color: '#000080', marginBottom: '14px' }}>
              {formatSw(swTime)}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
              <button 
                className="retro-button" 
                onClick={() => { playClick(); setSwRunning(!swRunning); }} 
                style={{ padding: '4px 14px', fontWeight: 'bold' }}
              >
                {swRunning ? 'Pause' : 'Start'}
              </button>
              <button 
                className="retro-button" 
                onClick={() => { playClick(); if (swTime > 0) setLaps([swTime, ...laps]); }} 
                disabled={!swRunning} 
                style={{ padding: '4px 14px' }}
              >
                Lap
              </button>
              <button 
                className="retro-button" 
                onClick={() => { playClick(); setSwRunning(false); setSwTime(0); setLaps([]); }} 
                style={{ padding: '4px 14px' }}
              >
                Reset
              </button>
            </div>
            {laps.length > 0 && (
              <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #c0c0c0', padding: '4px', textAlign: 'left', fontSize: '11px' }}>
                {laps.map((lp, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px' }}>
                    <span>Lap {laps.length - idx}</span>
                    <strong>{formatSw(lp)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'timer' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '44px',
              fontWeight: 'bold',
              color: timerSeconds <= 5 && timerSeconds > 0 ? '#cc0000' : '#000080',
              marginBottom: '14px'
            }}>
              {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
            </div>
            {!timerRunning && (
              <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                <label>Seconds:</label>
                <input
                  type="number"
                  value={timerInput}
                  onChange={(e) => { setTimerInput(e.target.value); setTimerSeconds(parseInt(e.target.value) || 0); }}
                  style={{ width: '60px', padding: '2px 4px', border: '2px inset #dfdfdf' }}
                />
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button 
                className="retro-button" 
                onClick={() => { playClick(); setTimerRunning(!timerRunning); }} 
                style={{ padding: '4px 16px', fontWeight: 'bold' }}
              >
                {timerRunning ? 'Pause' : 'Start Timer'}
              </button>
              <button 
                className="retro-button" 
                onClick={() => { playClick(); setTimerRunning(false); setTimerSeconds(parseInt(timerInput) || 60); }} 
                style={{ padding: '4px 12px' }}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {tab === 'world' && (
          <div style={{ width: '100%', maxWidth: '340px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#000080', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '4px 6px' }}>City</th>
                  <th style={{ padding: '4px 6px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {worldCities.map((city, idx) => {
                  let timeStr = '';
                  try {
                    timeStr = new Intl.DateTimeFormat([], { timeZone: city.zone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
                  } catch {
                    timeStr = now.toLocaleTimeString();
                  }
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                      <td style={{ padding: '6px' }}>{city.flag} <strong>{city.name}</strong></td>
                      <td style={{ padding: '6px', fontFamily: 'monospace', fontWeight: 'bold', color: '#000080' }}>{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
