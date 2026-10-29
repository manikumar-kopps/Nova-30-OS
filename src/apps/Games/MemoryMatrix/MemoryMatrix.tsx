import React, { useState, useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';

const CARD_ICONS = ['💾', '🕹️', '📟', '💻', '🛸', '👾', '🧱', '⚡'];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatrix() {
  const { playClick, playNotification } = useSound();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const initGame = () => {
    const pairs = [...CARD_ICONS, ...CARD_ICONS];
    const shuffled = pairs.sort(() => 0.5 - Math.random());
    setCards(shuffled.map((icon, idx) => ({
      id: idx,
      icon,
      isFlipped: false,
      isMatched: false
    })));
    setFlippedIndices([]);
    setMoves(0);
    setMatchedCount(0);
    setTimerSec(0);
    setIsRunning(true);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let t: any;
    if (isRunning && matchedCount < 8) {
      t = setInterval(() => setTimerSec(s => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRunning, matchedCount]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    playClick();
    const nextCards = [...cards];
    nextCards[index].isFlipped = true;
    setCards(nextCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        // Matched!
        setTimeout(() => {
          playNotification();
          nextCards[firstIdx].isMatched = true;
          nextCards[secondIdx].isMatched = true;
          setCards([...nextCards]);
          setFlippedIndices([]);
          setMatchedCount(c => c + 1);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          nextCards[firstIdx].isFlipped = false;
          nextCards[secondIdx].isFlipped = false;
          setCards([...nextCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <div>
          <span>Moves: <strong>{moves}</strong></span>
          <span style={{ marginLeft: '12px' }}>Time: <strong>{timerSec}s</strong></span>
          <span style={{ marginLeft: '12px' }}>Pairs: <strong>{matchedCount}/8</strong></span>
        </div>
        <button className="retro-button" onClick={initGame} style={{ padding: '2px 8px' }}>
          🔄 New Game
        </button>
      </div>

      {/* Cards 4x4 Grid */}
      <div style={{
        flex: 1,
        backgroundColor: '#008080',
        border: '2px inset #dfdfdf',
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '6px'
      }}>
        {cards.map((c, i) => (
          <div
            key={c.id}
            onClick={() => handleCardClick(i)}
            style={{
              backgroundColor: c.isFlipped || c.isMatched ? '#ffffff' : '#000080',
              border: '2px outset #ffffff',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: c.isMatched ? 'default' : 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            {c.isFlipped || c.isMatched ? c.icon : '❓'}
          </div>
        ))}
      </div>

      {matchedCount === 8 && (
        <div style={{ marginTop: '6px', textAlign: 'center', fontWeight: 'bold', color: '#000080' }}>
          🎉 Congratulations! Solved in {moves} moves and {timerSec} seconds!
        </div>
      )}
    </div>
  );
}
