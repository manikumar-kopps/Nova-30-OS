import React, { useState, useEffect, useCallback } from 'react';

type Difficulty = 'beginner' | 'intermediate' | 'expert';
const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

type Cell = { isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighborMines: number };

export default function Minesweeper() {
  const [diff, setDiff] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesLeft, setMinesLeft] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  const initGrid = useCallback((difficulty: Difficulty) => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    let newGrid: Cell[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }))
    );
    setGrid(newGrid);
    setMinesLeft(mines);
    setGameOver(false);
    setWin(false);
    setTime(0);
    setStarted(false);
  }, []);

  useEffect(() => initGrid(diff), [diff, initGrid]);

  useEffect(() => {
    let timer: any;
    if (started && !gameOver && !win) {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, gameOver, win]);

  const placeMines = (firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = DIFFICULTIES[diff];
    let newGrid = [...grid.map(r => [...r])];
    let placed = 0;
    while (placed < mines) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine && (r !== firstRow || c !== firstCol)) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols && newGrid[r + i][c + j].isMine) count++;
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    setGrid(newGrid);
    return newGrid;
  };

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let currentGrid = grid;
    if (!started) {
      setStarted(true);
      currentGrid = placeMines(r, c);
    }

    if (currentGrid[r][c].isMine) {
      setGameOver(true);
      setGrid(currentGrid.map(row => row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell)));
      return;
    }

    let newGrid = [...currentGrid.map(row => [...row])];
    const floodFill = (row: number, col: number) => {
      if (row < 0 || row >= DIFFICULTIES[diff].rows || col < 0 || col >= DIFFICULTIES[diff].cols) return;
      if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged || newGrid[row][col].isMine) return;
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            floodFill(row + i, col + j);
          }
        }
      }
    };
    floodFill(r, c);
    setGrid(newGrid);

    // Check win
    let unrevealedSafe = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    if (unrevealedSafe === 0) setWin(true);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;
    let newGrid = [...grid];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
    setMinesLeft(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
  };

  const colors = ['', 'blue', 'green', 'red', 'darkblue', 'darkred', 'teal', 'black', 'gray'];

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '10px' }}>
        <select value={diff} onChange={e => setDiff(e.target.value as Difficulty)} style={{ padding: '2px', border: '2px inset #dfdfdf' }}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div style={{ border: '3px inset #dfdfdf', padding: '10px', backgroundColor: '#c0c0c0', display: 'inline-block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', border: '2px inset #dfdfdf', padding: '5px', marginBottom: '10px', backgroundColor: '#000', color: 'red', fontFamily: 'monospace', fontSize: '24px' }}>
          <div>{minesLeft.toString().padStart(3, '0')}</div>
          <button onClick={() => initGrid(diff)} style={{ fontSize: '20px', padding: '0 5px', border: '2px outset #dfdfdf', cursor: 'pointer', backgroundColor: '#c0c0c0' }}>
            {win ? '😎' : gameOver ? '😵' : '🙂'}
          </button>
          <div>{time.toString().padStart(3, '0')}</div>
        </div>
        <div style={{ border: '3px inset #dfdfdf', display: 'grid', gridTemplateColumns: `repeat(${DIFFICULTIES[diff].cols}, 20px)`, gap: '0' }} role="grid" aria-label="Minesweeper Grid">
          {grid.map((row, r) => row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={e => toggleFlag(e, r, c)}
              style={{
                width: '20px', height: '20px', padding: 0, margin: 0,
                border: cell.isRevealed ? '1px solid #7b7b7b' : '2px outset #dfdfdf',
                backgroundColor: cell.isRevealed ? '#c0c0c0' : '#c0c0c0',
                fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: colors[cell.neighborMines] || 'inherit'
              }}
              aria-label={`Row ${r+1}, Col ${c+1}, ${cell.isRevealed ? (cell.isMine ? 'Mine' : cell.neighborMines + ' neighbors') : (cell.isFlagged ? 'Flagged' : 'Hidden')}`}
            >
              {cell.isRevealed ? (cell.isMine ? '💣' : cell.neighborMines > 0 ? cell.neighborMines : '') : (cell.isFlagged ? '🚩' : '')}
            </button>
          )))}
        </div>
      </div>
    </div>
  );
}
