import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [started, setStarted] = useState(false);

  const gameState = useRef({
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30, width: 30, height: 15 },
    bullets: [] as {x: number, y: number}[],
    aliens: [] as {x: number, y: number, alive: boolean}[],
    alienDir: 1,
    alienSpeed: 1,
    keys: { left: false, right: false, space: false }
  });

  const initAliens = () => {
    const aliens = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 10; c++) {
        aliens.push({ x: 50 + c * 40, y: 30 + r * 30, alive: true });
      }
    }
    gameState.current.aliens = aliens;
  };

  useEffect(() => {
    initAliens();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.current.keys.right = true;
      if (e.key === ' ') {
        gameState.current.keys.space = true;
        if (!started) setStarted(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.current.keys.right = false;
      if (e.key === ' ') {
        gameState.current.keys.space = false;
        gameState.current.bullets.push({ x: gameState.current.player.x + 15, y: gameState.current.player.y });
      }
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
    let lastTime = Date.now();

    const update = () => {
      if (!started || lives <= 0) {
        draw();
        animationId = requestAnimationFrame(update);
        return;
      }

      const state = gameState.current;

      // Player Move
      if (state.keys.left && state.player.x > 0) state.player.x -= 4;
      if (state.keys.right && state.player.x < CANVAS_WIDTH - state.player.width) state.player.x += 4;

      // Bullets
      state.bullets.forEach(b => b.y -= 7);
      state.bullets = state.bullets.filter(b => b.y > 0);

      // Aliens
      let hitEdge = false;
      state.aliens.forEach(a => {
        if (!a.alive) return;
        a.x += state.alienSpeed * state.alienDir;
        if (a.x <= 0 || a.x >= CANVAS_WIDTH - 20) hitEdge = true;
      });

      if (hitEdge) {
        state.alienDir *= -1;
        state.aliens.forEach(a => { if (a.alive) a.y += 10; });
        state.alienSpeed += 0.1;
      }

      // Collisions
      state.bullets.forEach((b, bIdx) => {
        state.aliens.forEach(a => {
          if (a.alive && b.x >= a.x && b.x <= a.x + 20 && b.y >= a.y && b.y <= a.y + 20) {
            a.alive = false;
            b.y = -100; // remove bullet
            setScore(s => s + 10);
          }
        });
      });

      // Alien Win check
      if (state.aliens.some(a => a.alive && a.y >= CANVAS_HEIGHT - 40)) {
        setLives(0);
      }

      // Next level
      if (state.aliens.every(a => !a.alive)) {
        initAliens();
        state.alienSpeed += 0.5;
      }

      draw();
      animationId = requestAnimationFrame(update);
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const state = gameState.current;
      ctx.fillStyle = 'lime';

      // Player
      ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);

      // Aliens
      ctx.fillStyle = 'white';
      state.aliens.forEach(a => {
        if (a.alive) ctx.fillRect(a.x, a.y, 20, 20);
      });

      // Bullets
      ctx.fillStyle = 'yellow';
      state.bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 10);
      });

      if (lives <= 0) {
        ctx.fillStyle = 'red';
        ctx.font = '30px "ms sans serif"';
        ctx.fillText('GAME OVER', CANVAS_WIDTH/2 - 80, CANVAS_HEIGHT/2);
      }
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [started, lives]);

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', width: '600px' }}>
        <span aria-live="polite">Score: {score}</span>
        <span>Lives: {'❤️'.repeat(lives)}</span>
      </div>
      <div style={{ border: '3px inset #dfdfdf', background: '#000', padding: '2px' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-label="Space Invaders Game Board" />
      </div>
      <div style={{ marginTop: '15px', padding: '10px', border: '2px outset #dfdfdf', width: '600px', backgroundColor: '#c0c0c0' }}>
        <strong>Controls:</strong> Left/Right or A/D to move, Space to shoot.
      </div>
    </div>
  );
}
