import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

export default function PasswordGen() {
  const { playClick, playNotification } = useSound();
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [leetMode, setLeetMode] = useState(false);
  const [generated, setGenerated] = useState('N0vA_98!xK7#');

  const generate = () => {
    playClick();
    if (leetMode) {
      const words = ['CYBER', 'HACKER', 'MATRIX', 'TERMINAL', 'MODEM', 'PHREAK', 'RETRO'];
      const pick = words[Math.floor(Math.random() * words.length)];
      const leet = pick.replace(/A/g, '4').replace(/E/g, '3').replace(/I/g, '1').replace(/O/g, '0');
      const num = Math.floor(Math.random() * 900 + 100);
      setGenerated(`${leet}_${num}!`);
      return;
    }

    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=~';

    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGenerated(res);
  };

  const copyPassword = () => {
    playNotification();
    navigator.clipboard?.writeText(generated);
    alert('Password copied to clipboard.');
  };

  const getStrength = () => {
    if (generated.length < 8) return { label: 'Weak (Breakable in seconds)', color: '#cc0000', width: '25%' };
    if (generated.length < 12) return { label: 'Moderate (Cray supercomputer: 2 hours)', color: '#e69500', width: '55%' };
    return { label: 'Strong (Deep Blue would take 4,000 years)', color: '#008800', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '12px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Generated output */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Generated Cipher Key:</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            readOnly
            value={generated}
            style={{
              flex: 1,
              padding: '6px 8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '2px inset #ffffff',
              backgroundColor: '#ffffff'
            }}
          />
          <button className="retro-button" onClick={copyPassword} style={{ padding: '4px 10px' }}>
            📋 Copy
          </button>
        </div>
      </div>

      {/* Strength Bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Security Level:</span>
          <strong style={{ color: strength.color }}>{strength.label}</strong>
        </div>
        <div style={{ height: '10px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff' }}>
          <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Settings Panel */}
      <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>Length: {length} characters</label>
          <input
            type="range"
            min="6"
            max="28"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            disabled={leetMode}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} disabled={leetMode} />
          Include Uppercase Letters (A-Z)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} disabled={leetMode} />
          Include Numbers (0-9)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} disabled={leetMode} />
          Include Symbols (!@#$%^&*)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#800080', fontWeight: 'bold' }}>
          <input type="checkbox" checked={leetMode} onChange={(e) => setLeetMode(e.target.checked)} />
          🕹️ 90s LeetSpeak Mode (L33t_H4x0r)
        </label>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <button
          className="retro-button"
          onClick={generate}
          style={{ padding: '6px 20px', fontWeight: 'bold', fontSize: '13px' }}
        >
          🎲 Generate New Password
        </button>
      </div>
    </div>
  );
}
