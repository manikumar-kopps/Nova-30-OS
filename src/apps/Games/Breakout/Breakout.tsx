import React, { useRef, useEffect, useState } from 'react';
import { useSound } from '../../../hooks/useSound';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  points: number;
  alive: boolean;
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playNotification, playError } = useSound();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'win'>('ready');
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('nova_breakout_high') || '0');
    } catch {
      return 0;
    }
  });

  const gameStateRef = useRef({
    paddleX: 200,
    paddleW: 70,
    paddleH: 10,
    ballX: 235,
    ballY: 340,
    ballDx: 3,
    ballDy: -3,
    ballRadius: 5,
    bricks: [] as Brick[],
    leftPressed: false,
    rightPressed: false,
    score: 0,
    lives: 3,
    state: 'ready' as 'ready' | 'playing' | 'gameover' | 'win'
  });

  const initBricks = () => {
    const bricks: Brick[] = [];
    const colors = ['#ff3333', '#ff9933', '#ffff33', '#33cc33', '#3399ff'];
    const points = [50, 40, 30, 20, 10];
    const rows = 5;
    const cols = 8;
    const brickW = 50;
    const brickH = 14;
    const pad = 6;
    const offsetTop = 40;
    const offsetLeft = 18;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickW + pad),
          y: offsetTop + r * (brickH + pad),
          w: brickW,
          h: brickH,
          color: colors[r],
          points: points[r],
          alive: true
        });
      }
    }
    return bricks;
  };

  const startGame = () => {
    playClick();
    const g = gameStateRef.current;
    g.bricks = initBricks();
    g.score = 0;
    g.lives = 3;
    g.ballX = 235;
    g.ballY = 340;
    g.ballDx = (Math.random() > 0.5 ? 3 : -3);
    g.ballDy = -3.5;
    g.paddleX = 200;
    g.state = 'playing';
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    gameStateRef.current.bricks = initBricks();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.leftPressed = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.rightPressed = true;
      }
      if ((e.key === ' ' || e.key === 'Enter') && gameStateRef.current.state !== 'playing') {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.leftPressed = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.rightPressed = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rootX = e.clientX - rect.left;
      gameStateRef.current.paddleX = Math.max(0, Math.min(canvas.width - gameStateRef.current.paddleW, rootX - gameStateRef.current.paddleW / 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    let animId: number;

    const loop = () => {
      const g = gameStateRef.current;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      let aliveCount = 0;
      g.bricks.forEach(b => {
        if (b.alive) {
          aliveCount++;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
      });

      // Draw paddle
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(g.paddleX, canvas.height - 20, g.paddleW, g.paddleH);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(g.paddleX, canvas.height - 20, g.paddleW, g.paddleH);

      // Draw ball
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, g.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffff00';
      ctx.fill();
      ctx.closePath();

      if (g.state === 'playing') {
        // Move paddle by keys
        if (g.leftPressed) {
          g.paddleX = Math.max(0, g.paddleX - 6);
        }
        if (g.rightPressed) {
          g.paddleX = Math.min(canvas.width - g.paddleW, g.paddleX + 6);
        }

        // Move ball
        g.ballX += g.ballDx;
        g.ballY += g.ballDy;

        // Bounce walls
        if (g.ballX - g.ballRadius <= 0) {
          g.ballX = g.ballRadius;
          g.ballDx = -g.ballDx;
        } else if (g.ballX + g.ballRadius >= canvas.width) {
          g.ballX = canvas.width - g.ballRadius;
          g.ballDx = -g.ballDx;
        }

        if (g.ballY - g.ballRadius <= 0) {
          g.ballY = g.ballRadius;
          g.ballDy = -g.ballDy;
        }

        // Paddle collision
        const paddleTop = canvas.height - 20;
        if (
          g.ballY + g.ballRadius >= paddleTop &&
          g.ballY - g.ballRadius <= paddleTop + g.paddleH &&
          g.ballX >= g.paddleX &&
          g.ballX <= g.paddleX + g.paddleW
        ) {
          const hitPos = (g.ballX - (g.paddleX + g.paddleW / 2)) / (g.paddleW / 2);
          g.ballDx = hitPos * 4.5;
          g.ballDy = -Math.abs(g.ballDy);
        }

        // Brick collision
        for (const b of g.bricks) {
          if (b.alive) {
            if (
              g.ballX + g.ballRadius >= b.x &&
              g.ballX - g.ballRadius <= b.x + b.w &&
              g.ballY + g.ballRadius >= b.y &&
              g.ballY - g.ballRadius <= b.y + b.h
            ) {
              b.alive = false;
              g.ballDy = -g.ballDy;
              g.score += b.points;
              setScore(g.score);
              if (g.score > highScore) {
                setHighScore(g.score);
                try { localStorage.setItem('nova_breakout_high', String(g.score)); } catch {}
              }
              break;
            }
          }
        }

        // Win check
        if (aliveCount === 0) {
          g.state = 'win';
          setGameState('win');
          playNotification();
        }

        // Bottom hit (lose life)
        if (g.ballY - g.ballRadius > canvas.height) {
          g.lives--;
          setLives(g.lives);
          if (g.lives <= 0) {
            g.state = 'gameover';
            setGameState('gameover');
            playError();
          } else {
            // Reset ball
            g.ballX = g.paddleX + g.paddleW / 2;
            g.ballY = 340;
            g.ballDx = 3 * (Math.random() > 0.5 ? 1 : -1);
            g.ballDy = -3.5;
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [highScore]);

  return (
    <div style={{ backgroundColor: '#c0c0c0', padding: '10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', userSelect: 'none' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '470px', marginBottom: '8px', border: '2px inset #ffffff', padding: '4px 10px', backgroundColor: '#000080', color: '#ffffff', fontWeight: 'bold' }}>
        <span>SCORE: {score}</span>
        <span>LIVES: {'❤️ '.repeat(lives)}</span>
        <span>HIGH: {highScore}</span>
      </div>

      <div style={{ position: 'relative', border: '3px inset #808080' }}>
        <canvas ref={canvasRef} width={470} height={380} style={{ display: 'block', backgroundColor: '#000' }} />

        {gameState !== 'playing' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: '#00ffcc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Courier, monospace' }}>
            <h2 style={{ color: '#ffcc00', margin: '0 0 10px 0' }}>
              {gameState === 'ready' ? '🧱 RETRO BREAKOUT 98' : gameState === 'win' ? '🎉 YOU CLEARED THE GRID!' : '💀 GAME OVER'}
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px' }}>
              Controls: Left/Right arrows, A/D, or Mouse to move paddle.
            </p>
            <button
              onClick={startGame}
              style={{ padding: '6px 20px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif' }}
            >
              {gameState === 'ready' ? '▶ PLAY GAME' : '↺ RESTART'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
