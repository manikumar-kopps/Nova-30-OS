import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const gameState = useRef({
    p1: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    p2: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 4, dy: 4 },
    keys: { w: false, s: false, ArrowUp: false, ArrowDown: false }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') gameState.current.keys.w = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') gameState.current.keys.s = true;
      if (['Enter', ' '].includes(e.key) && !started) setStarted(true);
      if (['p', 'P', 'Escape'].includes(e.key) && started) setPaused(p => !p);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') gameState.current.keys.w = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') gameState.current.keys.s = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [started]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const update = () => {
      if (!started || paused) {
        draw();
        animationId = requestAnimationFrame(update);
        return;
      }

      const state = gameState.current;

      // Player 1 Movement
      if (state.keys.w && state.p1.y > 0) state.p1.y -= 5;
      if (state.keys.s && state.p1.y < CANVAS_HEIGHT - PADDLE_HEIGHT) state.p1.y += 5;

      // AI Movement (Player 2)
      const aiSpeed = 4;
      if (state.ball.y < state.p2.y + PADDLE_HEIGHT / 2 && state.p2.y > 0) state.p2.y -= aiSpeed;
      if (state.ball.y > state.p2.y + PADDLE_HEIGHT / 2 && state.p2.y < CANVAS_HEIGHT - PADDLE_HEIGHT) state.p2.y += aiSpeed;

      // Ball Movement
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Top/Bottom collision
      if (state.ball.y <= 0 || state.ball.y >= CANVAS_HEIGHT - BALL_SIZE) state.ball.dy *= -1;

      // Paddle collision
      if (state.ball.x <= PADDLE_WIDTH && state.ball.y >= state.p1.y && state.ball.y <= state.p1.y + PADDLE_HEIGHT) {
        state.ball.dx = Math.abs(state.ball.dx) + 0.2;
      }
      if (state.ball.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && state.ball.y >= state.p2.y && state.ball.y <= state.p2.y + PADDLE_HEIGHT) {
        state.ball.dx = -(Math.abs(state.ball.dx) + 0.2);
      }

      // Scoring
      if (state.ball.x <= 0) {
        setScore(s => ({ ...s, p2: s.p2 + 1 }));
        resetBall();
      } else if (state.ball.x >= CANVAS_WIDTH) {
        setScore(s => ({ ...s, p1: s.p1 + 1 }));
        resetBall();
      }

      draw();
      animationId = requestAnimationFrame(update);
    };

    const resetBall = () => {
      gameState.current.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: (Math.random() > 0.5 ? 4 : -4), dy: (Math.random() > 0.5 ? 4 : -4) };
    };

    const draw = () => {
      const state = gameState.current;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      // Center line
      for (let i = 0; i < CANVAS_HEIGHT; i += 20) {
        ctx.fillRect(CANVAS_WIDTH / 2 - 1, i, 2, 10);
      }

      // Paddles and ball
      ctx.fillRect(0, state.p1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.p2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [started, paused]);

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }} aria-live="polite">
        {score.p1} - {score.p2}
      </div>
      <div style={{ border: '3px inset #dfdfdf', background: '#000', padding: '2px' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-label="Pong Game Board" />
      </div>
      <div style={{ marginTop: '15px', padding: '10px', border: '2px outset #dfdfdf', width: '600px', backgroundColor: '#c0c0c0' }}>
        <strong>Controls:</strong> W/S or Up/Down to move, Space/Enter to start, P to pause. First to 11 wins!
      </div>
    </div>
  );
}
