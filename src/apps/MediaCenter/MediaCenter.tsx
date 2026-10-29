import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function MediaCenter() {
  const { playClick } = useSound();
  const [tab, setTab] = useState<'video' | 'radio' | 'pictures'>('video');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  // Animated retro synthwave video on canvas
  useEffect(() => {
    if (tab !== 'video' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark violet sky
      ctx.fillStyle = '#0a001a';
      ctx.fillRect(0, 0, w, h);

      // Neon Sun
      const sunY = 90 + Math.sin(frame * 0.02) * 5;
      const grad = ctx.createLinearGradient(0, sunY - 40, 0, sunY + 40);
      grad.addColorStop(0, '#ffff00');
      grad.addColorStop(1, '#ff007f');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, sunY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Horizon line
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.lineTo(w, 140);
      ctx.stroke();

      // Moving Grid Floor
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1;
      const offset = (frame * 1.5) % 20;

      for (let y = 140; y < h; y += 12) {
        const perspectiveY = y + offset * ((y - 140) / 60);
        if (perspectiveY < h) {
          ctx.beginPath();
          ctx.moveTo(0, perspectiveY);
          ctx.lineTo(w, perspectiveY);
          ctx.stroke();
        }
      }

      // Vertical perspective lines
      for (let x = -w; x <= w * 2; x += 30) {
        ctx.beginPath();
        ctx.moveTo(w / 2, 140);
        ctx.lineTo(x + ((frame * 2) % 30), h);
        ctx.stroke();
      }

      // Text overlay
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#00ffcc';
      ctx.fillText('NOVA CASSETTE 98: SYNTHWAVE DREAMS', 10, 20);
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`REC [${Math.floor(frame / 60)}s]`, w - 70, 20);

      if (isPlayingVideo) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [tab, isPlayingVideo]);

  return (
    <div style={{
      backgroundColor: '#111122',
      color: '#ffffff',
      padding: '8px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Top Media Center Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333366', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'video', label: '📼 Video Reel' },
            { key: 'radio', label: '📻 Cyber Radio' },
            { key: 'pictures', label: '🖼️ Pictures' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { playClick(); setTab(t.key as any); }}
              className="retro-button"
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: tab === t.key ? 'bold' : 'normal',
                backgroundColor: tab === t.key ? '#333366' : '#222233',
                color: '#ffffff'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: '#ff00ff' }}>NOVA Media Theater 98</span>
      </div>

      {/* Main Player Display */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        {tab === 'video' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <canvas
              ref={canvasRef}
              width={420}
              height={220}
              style={{ border: '2px solid #00ffff', borderRadius: '4px', backgroundColor: '#000000', maxWidth: '100%', maxHeight: '80%' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="retro-button" onClick={() => setIsPlayingVideo(!isPlayingVideo)} style={{ padding: '3px 14px' }}>
                {isPlayingVideo ? '⏸ Pause' : '▶ Play'}
              </button>
              <button className="retro-button" onClick={() => alert('Rewinding video tape... Please wait.')} style={{ padding: '3px 14px' }}>
                ⏪ Rewind
              </button>
            </div>
          </div>
        )}

        {tab === 'radio' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📻</div>
            <h3 style={{ margin: 0, color: '#00ffcc' }}>NOVA Synth FM • 98.5 MHz</h3>
            <p style={{ color: '#aaa', fontSize: '12px' }}>Broadcasting chiptune and ambient synthesizer soundscapes across the cyber grid.</p>
            <div style={{ display: 'inline-flex', gap: '4px', height: '30px', alignItems: 'flex-end', margin: '14px 0' }}>
              {[18, 28, 12, 24, 30, 16, 22, 10, 26, 14].map((h, i) => (
                <div key={i} style={{ width: '6px', height: `${h}px`, backgroundColor: '#ff00ff', borderRadius: '1px' }} />
              ))}
            </div>
            <div>
              <button className="retro-button" onClick={() => alert('Station locked: 98.5 MHz')} style={{ padding: '4px 16px', fontWeight: 'bold' }}>
                Tune Station
              </button>
            </div>
          </div>
        )}

        {tab === 'pictures' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🖼️</div>
            <h3 style={{ margin: 0 }}>Digital Photo Vault</h3>
            <p style={{ color: '#aaa', fontSize: '11px' }}>Synchronized with C:\Pictures. Launch NOVA Vision or File Explorer to view raw bitmap files.</p>
          </div>
        )}
      </div>
    </div>
  );
}
