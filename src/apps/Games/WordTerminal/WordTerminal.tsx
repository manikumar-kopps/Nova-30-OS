import React, { useState, useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';

const RETRO_WORDS = [
  { word: 'INTERNET', hint: 'Global network of connected computers' },
  { word: 'PENTIUM', hint: 'Iconic 1990s microprocessor by Intel' },
  { word: 'CYBERSPACE', hint: 'The virtual world of computers and data' },
  { word: 'SOUNDBLASTER', hint: 'The standard 16-bit sound card of 1998' },
  { word: 'FLOPPY', hint: '1.44 MB magnetic diskette medium' },
  { word: 'NETSCAPE', hint: 'The legendary web browser of the late 90s' },
  { word: 'DIALUP', hint: '56.6 kbps telephone line internet connection' },
  { word: 'MODEM', hint: 'Modulator-demodulator audio communicator' }
];

export default function WordTerminal() {
  const { playClick, playNotification, playError } = useSound();
  const [wordIdx, setWordIdx] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  const cur = RETRO_WORDS[wordIdx % RETRO_WORDS.length];
  const maxMistakes = 6;

  const wordLetters = cur.word.split('');
  const isWon = wordLetters.every(l => guessedLetters.includes(l));
  const isLost = mistakes >= maxMistakes;

  const guess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWon || isLost) return;
    playClick();

    const nextGuessed = [...guessedLetters, letter];
    setGuessedLetters(nextGuessed);

    if (!cur.word.includes(letter)) {
      playError();
      setMistakes(m => m + 1);
    } else {
      // Check if this guess completed the word
      if (wordLetters.every(l => nextGuessed.includes(l))) {
        playNotification();
        setScore(s => s + 100);
      }
    }
  };

  const nextWord = () => {
    playClick();
    setWordIdx(i => i + 1);
    setGuessedLetters([]);
    setMistakes(0);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #005500', paddingBottom: '6px', marginBottom: '10px' }}>
        <span>NOVA WORD CIPHER [DECRYPTOR]</span>
        <span>Score: {score} • Strikes: {mistakes}/{maxMistakes}</span>
      </div>

      {/* Clue and Word Display */}
      <div style={{ backgroundColor: '#001100', border: '1px solid #005500', padding: '12px', textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ color: '#00aa00', fontSize: '11px', marginBottom: '8px' }}>
          CLUE: {cur.hint}
        </div>
        <div style={{ fontSize: '24px', letterSpacing: '6px', fontWeight: 'bold', color: '#00ffcc', margin: '14px 0' }}>
          {wordLetters.map((l, i) => (
            <span key={i} style={{ borderBottom: '2px solid #00ffcc', display: 'inline-block', width: '22px', marginRight: '4px' }}>
              {guessedLetters.includes(l) || isLost ? l : '_'}
            </span>
          ))}
        </div>

        {isWon && <div style={{ color: '#ffff00', fontWeight: 'bold' }}>✓ DECRYPTED! +100 POINTS</div>}
        {isLost && <div style={{ color: '#ff3333', fontWeight: 'bold' }}>✗ TRANSMISSION LOST. Word was: {cur.word}</div>}
      </div>

      {/* Keyboard Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginBottom: '12px' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
          const used = guessedLetters.includes(char);
          return (
            <button
              key={char}
              onClick={() => guess(char)}
              disabled={used || isWon || isLost}
              style={{
                width: '28px',
                height: '28px',
                background: used ? '#002200' : '#003300',
                color: used ? '#005500' : '#00ff00',
                border: '1px solid #005500',
                cursor: used ? 'default' : 'pointer',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            >
              {char}
            </button>
          );
        })}
      </div>

      {(isWon || isLost) && (
        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <button
            onClick={nextWord}
            style={{ background: '#004400', color: '#ffffff', border: '1px solid #00ff00', padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            NEXT CIPHER ▶
          </button>
        </div>
      )}
    </div>
  );
}
