import React, { useState, useEffect, useCallback } from 'react';
import { useSound } from '../../../hooks/useSound';

export default function Game2048() {
  const { playClick, playNotification } = useSound();
  const [board, setBoard] = useState<number[][]>(() => getInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem('nova-2048-best') || 0);
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);

  function getInitialBoard(): number[][] {
    const b = Array(4).fill(null).map(() => Array(4).fill(0));
    spawnTile(b);
    spawnTile(b);
    return b;
  }

  function spawnTile(b: number[][]) {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    b[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  const restart = () => {
    playClick();
    setBoard(getInitialBoard());
    setScore(0);
    setGameOver(false);
  };

  const slideRow = (row: number[]) => {
    let arr = row.filter(val => val !== 0);
    let pts = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        pts += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return { newRow: arr, points: pts };
  };

  const move = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    let b = board.map(r => [...r]);
    let totalPts = 0;
    let moved = false;

    if (dir === 'left' || dir === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = dir === 'left' ? b[r] : [...b[r]].reverse();
        const { newRow, points } = slideRow(row);
        const finalRow = dir === 'left' ? newRow : newRow.reverse();
        totalPts += points;
        if (JSON.stringify(b[r]) !== JSON.stringify(finalRow)) moved = true;
        b[r] = finalRow;
      }
    } else {
      for (let c = 0; c < 4; c++) {
        const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
        const target = dir === 'up' ? col : [...col].reverse();
        const { newRow, points } = slideRow(target);
        const finalCol = dir === 'up' ? newRow : newRow.reverse();
        totalPts += points;
        for (let r = 0; r < 4; r++) {
          if (b[r][c] !== finalCol[r]) moved = true;
          b[r][c] = finalCol[r];
        }
      }
    }

    if (moved) {
      playClick();
      spawnTile(b);
      setBoard(b);
      const newScore = score + totalPts;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        try { localStorage.setItem('nova-2048-best', String(newScore)); } catch {}
      }

      // Check game over
      let hasMoves = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (b[r][c] === 0) hasMoves = true;
          if (r < 3 && b[r][c] === b[r + 1][c]) hasMoves = true;
          if (c < 3 && b[r][c] === b[r][c + 1]) hasMoves = true;
        }
      }
      if (!hasMoves) {
        setGameOver(true);
      }
    }
  }, [board, score, bestScore, gameOver, playClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('left');
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) move('right');
      else if (['ArrowUp', 'w', 'W'].includes(e.key)) move('up');
      else if (['ArrowDown', 's', 'S'].includes(e.key)) move('down');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return { bg: '#eee4da', color: '#776e65' };
      case 4: return { bg: '#ede0c8', color: '#776e65' };
      case 8: return { bg: '#f2b179', color: '#f9f6f2' };
      case 16: return { bg: '#f59563', color: '#f9f6f2' };
      case 32: return { bg: '#f67c5f', color: '#f9f6f2' };
      case 64: return { bg: '#f65e3b', color: '#f9f6f2' };
      case 128: return { bg: '#edcf72', color: '#f9f6f2' };
      case 256: return { bg: '#edcc61', color: '#f9f6f2' };
      case 512: return { bg: '#edc850', color: '#f9f6f2' };
      case 1024: return { bg: '#edc53f', color: '#f9f6f2' };
      case 2048: return { bg: '#edc22e', color: '#f9f6f2' };
      default: return { bg: '#cdc1b4', color: 'transparent' };
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
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <div>
          <span>Score: <strong>{score}</strong></span>
          <span style={{ marginLeft: '12px' }}>Best: <strong>{bestScore}</strong></span>
        </div>
        <button className="retro-button" onClick={restart} style={{ padding: '2px 8px' }}>
          🔄 Restart
        </button>
      </div>

      {/* 4x4 Board */}
      <div style={{
        flex: 1,
        backgroundColor: '#bbada0',
        border: '3px inset #dfdfdf',
        borderRadius: '4px',
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '6px'
      }}>
        {board.flat().map((val, idx) => {
          const style = getTileColor(val);
          return (
            <div
              key={idx}
              style={{
                backgroundColor: style.bg,
                color: style.color,
                fontWeight: 'bold',
                fontSize: val > 512 ? '14px' : '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                userSelect: 'none'
              }}
            >
              {val > 0 ? val : ''}
            </div>
          );
        })}
      </div>

      {/* D-Pad Buttons for Touch / Mouse */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
        <button className="retro-button" onClick={() => move('left')} style={{ padding: '3px 8px' }}>◀</button>
        <button className="retro-button" onClick={() => move('up')} style={{ padding: '3px 8px' }}>▲</button>
        <button className="retro-button" onClick={() => move('down')} style={{ padding: '3px 8px' }}>▼</button>
        <button className="retro-button" onClick={() => move('right')} style={{ padding: '3px 8px' }}>▶</button>
      </div>

      {gameOver && (
        <div style={{ textAlign: 'center', color: '#cc0000', fontWeight: 'bold', marginTop: '4px' }}>
          Game Over! No more moves possible.
        </div>
      )}
    </div>
  );
}
