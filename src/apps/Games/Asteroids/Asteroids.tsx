import React, { useRef, useEffect, useState } from 'react';
import { useSound } from '../../../hooks/useSound';

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  points: number;
  vertices: { x: number; y: number }[];
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function Asteroids() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playError, playNotification } = useSound();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('nova_asteroids_high') || '0');
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    shipX: 240,
    shipY: 200,
    shipVx: 0,
    shipVy: 0,
    angle: -Math.PI / 2,
    rotSpeed: 0,
    thrusting: false,
    bullets: [] as Bullet[],
    asteroids: [] as Asteroid[],
    lives: 3,
    score: 0,
    state: 'ready' as 'ready' | 'playing' | 'gameover'
  });

  const createAsteroid = (x: number, y: number, radius: number): Asteroid => {
    const numPoints = 8 + Math.floor(Math.random() * 4);
    const vertices: { x: number; y: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const a = (i / numPoints) * Math.PI * 2;
      const r = radius * (0.75 + Math.random() * 0.45);
      vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    const angle = Math.random() * Math.PI * 2;
    const speed = (60 / radius) * 0.6;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      points: radius > 30 ? 20 : radius > 18 ? 50 : 100,
      vertices
    };
  };

  const spawnInitialAsteroids = () => {
    const arr: Asteroid[] = [];
    for (let i = 0; i < 5; i++) {
      let x = Math.random() * 480;
      let y = Math.random() * 400;
      if (Math.hypot(x - 240, y - 200) < 80) {
        x += 120;
      }
      arr.push(createAsteroid(x, y, 36));
    }
    return arr;
  };

  const startGame = () => {
    playClick();
    const s = stateRef.current;
    s.shipX = 240;
    s.shipY = 200;
    s.shipVx = 0;
    s.shipVy = 0;
    s.angle = -Math.PI / 2;
    s.bullets = [];
    s.asteroids = spawnInitialAsteroids();
    s.lives = 3;
    s.score = 0;
    s.state = 'playing';
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    stateRef.current.asteroids = spawnInitialAsteroids();

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        s.rotSpeed = -0.09;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        s.rotSpeed = 0.09;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        s.thrusting = true;
      }
      if (e.key === ' ' && s.state === 'playing') {
        // Shoot bullet
        if (s.bullets.length < 5) {
          s.bullets.push({
            x: s.shipX + Math.cos(s.angle) * 12,
            y: s.shipY + Math.sin(s.angle) * 12,
            vx: Math.cos(s.angle) * 6 + s.shipVx * 0.4,
            vy: Math.sin(s.angle) * 6 + s.shipVy * 0.4,
            life: 60
          });
        }
      }
      if ((e.key === ' ' || e.key === 'Enter') && s.state !== 'playing') {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        s.rotSpeed = 0;
      }
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        s.thrusting = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (s.state === 'playing') {
        // Ship physics
        s.angle += s.rotSpeed;
        if (s.thrusting) {
          s.shipVx += Math.cos(s.angle) * 0.14;
          s.shipVy += Math.sin(s.angle) * 0.14;
        }
        s.shipVx *= 0.985;
        s.shipVy *= 0.985;
        s.shipX += s.shipVx;
        s.shipY += s.shipVy;

        // Screen wrap
        if (s.shipX < 0) s.shipX = canvas.width;
        if (s.shipX > canvas.width) s.shipX = 0;
        if (s.shipY < 0) s.shipY = canvas.height;
        if (s.shipY > canvas.height) s.shipY = 0;

        // Update bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.life--;

          if (b.x < 0) b.x = canvas.width;
          if (b.x > canvas.width) b.x = 0;
          if (b.y < 0) b.y = canvas.height;
          if (b.y > canvas.height) b.y = 0;

          if (b.life <= 0) {
            s.bullets.splice(i, 1);
            continue;
          }

          // Check bullet hit asteroid
          for (let j = s.asteroids.length - 1; j >= 0; j--) {
            const ast = s.asteroids[j];
            if (Math.hypot(b.x - ast.x, b.y - ast.y) < ast.radius) {
              s.bullets.splice(i, 1);
              s.score += ast.points;
              setScore(s.score);
              if (s.score > highScore) {
                setHighScore(s.score);
                try { localStorage.setItem('nova_asteroids_high', String(s.score)); } catch {}
              }

              // Split asteroid
              if (ast.radius > 20) {
                s.asteroids.push(createAsteroid(ast.x, ast.y, ast.radius / 1.8));
                s.asteroids.push(createAsteroid(ast.x, ast.y, ast.radius / 1.8));
              }
              s.asteroids.splice(j, 1);
              break;
            }
          }
        }

        // Respawn wave if empty
        if (s.asteroids.length === 0) {
          s.asteroids = spawnInitialAsteroids();
          playNotification();
        }

        // Check ship collision with asteroid
        for (const ast of s.asteroids) {
          if (Math.hypot(s.shipX - ast.x, s.shipY - ast.y) < ast.radius + 8) {
            s.lives--;
            setLives(s.lives);
            playError();
            if (s.lives <= 0) {
              s.state = 'gameover';
              setGameState('gameover');
            } else {
              s.shipX = 240;
              s.shipY = 200;
              s.shipVx = 0;
              s.shipVy = 0;
            }
            break;
          }
        }
      }

      // Draw asteroids
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (const ast of s.asteroids) {
        ast.x += ast.vx;
        ast.y += ast.vy;
        if (ast.x < 0) ast.x = canvas.width;
        if (ast.x > canvas.width) ast.x = 0;
        if (ast.y < 0) ast.y = canvas.height;
        if (ast.y > canvas.height) ast.y = 0;

        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.beginPath();
        ast.vertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Draw bullets
      ctx.fillStyle = '#ff0055';
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Ship
      if (s.state === 'playing') {
        ctx.save();
        ctx.translate(s.shipX, s.shipY);
        ctx.rotate(s.angle);
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-10, 8);
        ctx.closePath();
        ctx.stroke();

        // Thrust flame
        if (s.thrusting) {
          ctx.strokeStyle = '#ff9900';
          ctx.beginPath();
          ctx.moveTo(-7, -4);
          ctx.lineTo(-15, 0);
          ctx.lineTo(-7, 4);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [highScore]);

  return (
    <div style={{ backgroundColor: '#c0c0c0', padding: '10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '480px', marginBottom: '8px', border: '2px inset #ffffff', padding: '4px 10px', backgroundColor: '#000080', color: '#ffffff', fontWeight: 'bold' }}>
        <span>SCORE: {score}</span>
        <span>SHIPS: {'🚀 '.repeat(lives)}</span>
        <span>HIGH: {highScore}</span>
      </div>

      <div style={{ position: 'relative', border: '3px inset #808080' }}>
        <canvas ref={canvasRef} width={480} height={380} style={{ display: 'block', backgroundColor: '#050510' }} />

        {gameState !== 'playing' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5,5,16,0.8)', color: '#00ffcc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Courier, monospace' }}>
            <h2 style={{ color: '#ff3366', margin: '0 0 10px 0' }}>
              {gameState === 'ready' ? '🚀 ASTEROIDS VECTOR 98' : '💀 SYSTEM SHIP DESTROYED'}
            </h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px' }}>
              Controls: Arrows / WASD to rotate & thrust • Space to fire.
            </p>
            <button
              onClick={startGame}
              style={{ padding: '6px 20px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif' }}
            >
              {gameState === 'ready' ? '▶ COMMENCE MISSION' : '↺ RESTART FLIGHT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
