import React, { useState, useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';
import { mysteryEngine } from '../../../mystery/mysteryEngine';

const WORD_LIST = [
  'CYBER', 'MODEM', 'PIXEL', 'ROBOT', 'LASER',
  'VIRUS', 'GHOST', 'PULSE', 'TRACE', 'LOGIC',
  'QUERY', 'PATCH', 'CACHE', 'FLOPY', 'CLOCK'
];

export default function TerminalHacker() {
  const { playClick, playNotification, playError } = useSound();
  const [candidates, setCandidates] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const [attempts, setAttempts] = useState(4);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initGame = () => {
    // Pick 8 random words
    const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);
    const target = selected[Math.floor(Math.random() * selected.length)];
    setCandidates(selected);
    setTargetWord(target);
    setAttempts(4);
    setLogs([
      'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL 98',
      'PASSWORD REQUIRED: 5 LETTERS',
      `ATTEMPTS REMAINING: 4`
    ]);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const calculateLikeness = (guess: string, target: string) => {
    let count = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === target[i]) count++;
    }
    return count;
  };

  const handleGuess = (word: string) => {
    if (gameOver) return;
    playClick();

    if (word === targetWord) {
      playNotification();
      setWon(true);
      setGameOver(true);
      setLogs(prev => [
        ...prev,
        `> ${word}`,
        'ACCESS GRANTED! SYSTEM UNLOCKED.'
      ]);
      mysteryEngine.recordSecretFound('terminal_hacker_win');
      return;
    }

    const likeness = calculateLikeness(word, targetWord);
    const nextAttempts = attempts - 1;
    setAttempts(nextAttempts);

    if (nextAttempts <= 0) {
      playError();
      setGameOver(true);
      setLogs(prev => [
        ...prev,
        `> ${word}`,
        `ENTRY DENIED. Likeness=${likeness}/5`,
        'TERMINAL LOCKED OUT. PLEASE CONSULT SYSTEM ADMINISTRATOR.'
      ]);
    } else {
      setLogs(prev => [
        ...prev,
        `> ${word}`,
        `ENTRY DENIED. Likeness=${likeness}/5. (${nextAttempts} attempts left)`
      ]);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#00ff00',
      padding: '12px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      fontSize: '12px',
      userSelect: 'none'
    }}>
      {/* Top Banner */}
      <div style={{ borderBottom: '1px solid #005500', paddingBottom: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span>NOVA MAINFRAME CIPHER TERMINAL</span>
        <button
          onClick={initGame}
          style={{ background: '#003300', color: '#00ff00', border: '1px solid #00ff00', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
        >
          [ RESET ]
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '10px', flex: 1, minHeight: 0 }}>
        {/* Terminal Log Console */}
        <div style={{ backgroundColor: '#001100', border: '1px solid #005500', padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {logs.map((line, idx) => (
            <div key={idx} style={{ marginBottom: '3px' }}>{line}</div>
          ))}
          {gameOver && (
            <div style={{ marginTop: '10px', color: won ? '#ffff00' : '#ff3333', fontWeight: 'bold' }}>
              {won ? 'STATUS: SUCCESS. DATA PACKET DECRYPTED.' : 'STATUS: LOCKOUT. TRY AGAIN.'}
            </div>
          )}
        </div>

        {/* Memory Hex / Words Dump */}
        <div style={{ backgroundColor: '#001100', border: '1px solid #005500', padding: '8px', overflowY: 'auto' }}>
          <div style={{ color: '#00aa00', marginBottom: '6px', fontWeight: 'bold' }}>MEMORY HEAP:</div>
          {candidates.map((w, idx) => (
            <div
              key={idx}
              onClick={() => handleGuess(w)}
              style={{
                padding: '4px 6px',
                cursor: gameOver ? 'default' : 'pointer',
                marginBottom: '4px',
                border: '1px dashed #005500',
                display: 'flex',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => { if (!gameOver) e.currentTarget.style.backgroundColor = '#003300'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span style={{ color: '#008800' }}>0x{(0xFA00 + idx * 16).toString(16).toUpperCase()}</span>
              <strong style={{ color: '#00ff00' }}>{w}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
