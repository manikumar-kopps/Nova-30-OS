import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = 400;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key) && dir.y === 0) setDir({ x: 0, y: -1 });
      if (['ArrowDown', 's', 'S'].includes(e.key) && dir.y === 0) setDir({ x: 0, y: 1 });
      if (['ArrowLeft', 'a', 'A'].includes(e.key) && dir.x === 0) setDir({ x: -1, y: 0 });
      if (['ArrowRight', 'd', 'D'].includes(e.key) && dir.x === 0) setDir({ x: 1, y: 0 });
      if (['Enter', ' '].includes(e.key)) {
        if (!started || gameOver) {
          setSnake([{ x: 10, y: 10 }]);
          setDir({ x: 1, y: 0 });
          setScore(0);
          setGameOver(false);
          setStarted(true);
          setPaused(false);
        }
      }
      if (['p', 'P', 'Escape'].includes(e.key) && started && !gameOver) {
        setPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, started, gameOver]);

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [dir, food, started, paused, gameOver, score]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });
  }, [snake, food]);

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', width: '400px' }}>
        <span aria-live="polite">Score: {score}</span>
        <span>{gameOver ? 'GAME OVER' : paused ? 'PAUSED' : started ? 'PLAYING' : 'READY'}</span>
      </div>
      <div style={{ border: '3px inset #dfdfdf', background: '#000', padding: '2px' }}>
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} aria-label="Snake Game Board" />
      </div>
      <div style={{ marginTop: '15px', padding: '10px', border: '2px outset #dfdfdf', width: '400px', backgroundColor: '#c0c0c0' }}>
        <strong>Controls:</strong> Arrows/WASD to move, Space/Enter to start, P to pause.
      </div>
    </div>
  );
}
