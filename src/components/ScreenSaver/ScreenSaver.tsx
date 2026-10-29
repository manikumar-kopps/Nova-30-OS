import React, { useEffect, useRef } from 'react';

interface ScreenSaverProps {
  onDismiss: () => void;
}

export default function ScreenSaver({ onDismiss }: ScreenSaverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numStars = 600;
    const stars: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width
      });
    }

    let animId: number;

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 6;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = Math.max(1, (1 - star.z / canvas.width) * 3);
          const brightness = Math.floor((1 - star.z / canvas.width) * 255);
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
          ctx.fillRect(px, py, size, size);
        }
      }

      // Title overlay
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NOVA 30 OS - STARFIELD SIMULATION', cx, canvas.height - 40);
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText('Move mouse or press any key to return to desktop', cx, canvas.height - 20);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleAction = () => onDismiss();
    window.addEventListener('keydown', handleAction);
    window.addEventListener('mousedown', handleAction);
    window.addEventListener('mousemove', handleAction);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleAction);
      window.removeEventListener('mousedown', handleAction);
      window.removeEventListener('mousemove', handleAction);
    };
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000000,
        backgroundColor: '#000000',
        cursor: 'none'
      }}
      role="presentation"
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
