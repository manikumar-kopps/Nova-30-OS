import React, { useState } from 'react';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [diff, setDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });
  const [winner, setWinner] = useState<Player | 'Draw'>(null);

  const checkWinner = (squares: Player[]): Player | 'Draw' => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // cols
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
    const win = checkWinner(squares);
    if (win === 'O') return 10 - depth;
    if (win === 'X') return depth - 10;
    if (win === 'Draw') return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          best = Math.max(best, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          best = Math.min(best, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return best;
    }
  };

  const getBestMove = (squares: Player[]) => {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const moveVal = minimax(squares, 0, false);
        squares[i] = null;
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  const getRandomMove = (squares: Player[]) => {
    const empty = squares.map((val, i) => val === null ? i : null).filter(val => val !== null) as number[];
    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    let newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);

    let currentWinner = checkWinner(newBoard);
    if (currentWinner) {
      handleGameOver(currentWinner);
      return;
    }

    // AI Move
    setTimeout(() => {
      let move = -1;
      if (diff === 'Hard') move = getBestMove(newBoard);
      else if (diff === 'Easy') move = getRandomMove(newBoard);
      else move = Math.random() > 0.5 ? getBestMove(newBoard) : getRandomMove(newBoard); // Medium

      if (move !== -1) {
        newBoard[move] = 'O';
        setBoard([...newBoard]);
        const aiWin = checkWinner(newBoard);
        if (aiWin) handleGameOver(aiWin);
      }
    }, 300);
  };

  const handleGameOver = (win: Player | 'Draw') => {
    setWinner(win);
    if (win === 'X') setScores(s => ({ ...s, wins: s.wins + 1 }));
    else if (win === 'O') setScores(s => ({ ...s, losses: s.losses + 1 }));
    else setScores(s => ({ ...s, draws: s.draws + 1 }));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div>Wins: {scores.wins} | Losses: {scores.losses} | Draws: {scores.draws}</div>
        <select value={diff} onChange={e => setDiff(e.target.value as any)} style={{ border: '2px inset #dfdfdf' }}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px', backgroundColor: '#808080', padding: '5px', border: '3px inset #dfdfdf' }} role="grid" aria-label="Tic-Tac-Toe Board">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{ width: '100px', height: '100px', fontSize: '48px', fontWeight: 'bold', border: '2px outset #dfdfdf', backgroundColor: '#c0c0c0', cursor: cell || winner ? 'default' : 'pointer' }}
            aria-label={`Row ${Math.floor(i/3)+1}, Col ${(i%3)+1}, ${cell || 'empty'}`}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }} aria-live="polite">
          {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
        </div>
      )}

      <button onClick={reset} style={{ marginTop: '20px', padding: '5px 15px', border: '2px outset #dfdfdf', backgroundColor: '#c0c0c0', cursor: 'pointer' }}>
        New Game
      </button>
    </div>
  );
}
