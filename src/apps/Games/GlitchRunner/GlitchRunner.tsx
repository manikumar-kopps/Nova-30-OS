import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../../hooks/useSound';

export default function GlitchRunner() {
  const { playClick, playNotification, playError } = useSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('nova-glitch-runner-best') || 0);
    } catch {
      return 0;
    }
  });

  const gameState = useRef({
    playerY: 150,
    playerVy: 0,
    isJumping: false,
    obstacles: [] as { x: number; w: number; h: number }[],
    speed: 3,
    frame: 0,
    score: 0
  });

  const jump = () => {
    if (!gameState.current.isJumping) {
      playClick();
      gameState.current.playerVy = -8;
      gameState.current.isJumping = true;
    }
  };

  const startGame = () => {
    playNotification();
    gameState.current = {
      playerY: 150,
      playerVy: 0,
      isJumping: false,
      obstacles: [{ x: 380, w: 16, h: 26 }],
      speed: 3.5,
      frame: 0,
      score: 0
    };
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) {
        if (!isPlaying) startGame();
        else jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const gs = gameState.current;
      gs.frame++;
      gs.score += 1;
      setScore(Math.floor(gs.score / 10));

      const w = canvas.width;
      const h = canvas.height;

      // Physics
      gs.playerVy += 0.45; // gravity
      gs.playerY += gs.playerVy;
      if (gs.playerY >= 150) {
        gs.playerY = 150;
        gs.playerVy = 0;
        gs.isJumping = false;
      }

      // Move obstacles
      gs.obstacles.forEach(ob => {
        ob.x -= gs.speed;
      });

      // Spawn new obstacles
      const last = gs.obstacles[gs.obstacles.length - 1];
      if (!last || last.x < w - 160) {
        if (Math.random() < 0.04) {
          gs.obstacles.push({ x: w + 20, w: 14 + Math.random() * 8, h: 22 + Math.random() * 14 });
        }
      }

      // Remove offscreen
      gs.obstacles = gs.obstacles.filter(ob => ob.x > -40);

      // Collision detection
      const playerBox = { x: 40, y: gs.playerY, w: 20, h: 26 };
      for (const ob of gs.obstacles) {
        const obBox = { x: ob.x, y: 176 - ob.h, w: ob.w, h: ob.h };
        if (
          playerBox.x < obBox.x + obBox.w &&
          playerBox.x + playerBox.w > obBox.x &&
          playerBox.y < obBox.y + obBox.h &&
          playerBox.y + playerBox.h > obBox.y
        ) {
          // Hit! Game over
          playError();
          setIsPlaying(false);
          const finalScore = Math.floor(gs.score / 10);
          if (finalScore > highScore) {
            setHighScore(finalScore);
            try { localStorage.setItem('nova-glitch-runner-best', String(finalScore)); } catch {}
          }
          return;
        }
      }

      // Render
      // Black CRT background
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, w, h);

      // Ground line
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 176);
      ctx.lineTo(w, 176);
      ctx.stroke();

      // Draw Player (Retro Green Sprite Box)
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(playerBox.x, playerBox.y, playerBox.w, playerBox.h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(playerBox.x + 12, playerBox.y + 4, 4, 4); // eye

      // Draw Obstacles (Red Glitch Pyramids)
      ctx.fillStyle = '#ff0055';
      gs.obstacles.forEach(ob => {
        ctx.fillRect(ob.x, 176 - ob.h, ob.w, ob.h);
      });

      // Score HUD
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`SCORE: ${Math.floor(gs.score / 10)}`, 10, 20);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, highScore, playError]);

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
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '8px' }}>
        <div>
          <span>Score: <strong>{score}</strong></span>
          <span style={{ marginLeft: '14px' }}>Best: <strong>{highScore}</strong></span>
        </div>
        <button className="retro-button" onClick={startGame} style={{ padding: '2px 10px', fontWeight: 'bold' }}>
          {isPlaying ? 'Restart' : '▶ Start'}
        </button>
      </div>

      {/* Canvas Viewport */}
      <div 
        onClick={() => { if (!isPlaying) startGame(); else jump(); }}
        style={{
          flex: 1,
          backgroundColor: '#000000',
          border: '2px inset #dfdfdf',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          minHeight: 0
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '6px', color: '#555', fontSize: '11px' }}>
        Press <strong>Spacebar</strong> or click screen to Jump over glitch hazards.
      </div>
    </div>
  );
}
