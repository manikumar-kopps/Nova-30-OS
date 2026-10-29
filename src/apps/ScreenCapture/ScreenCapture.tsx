import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

export default function ScreenCapture() {
  const { playClick, playNotification } = useSound();
  const [delay, setDelay] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const takeScreenshot = () => {
    playClick();
    if (delay > 0) {
      setCapturing(true);
      setCountdown(delay);
      let c = delay;
      const interval = setInterval(() => {
        c -= 1;
        setCountdown(c);
        if (c <= 0) {
          clearInterval(interval);
          setCapturing(false);
          captureCanvas();
        }
      }, 1000);
    } else {
      captureCanvas();
    }
  };

  const captureCanvas = () => {
    playNotification();
    // Generate simulated desktop snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Teal desktop
      ctx.fillStyle = '#008080';
      ctx.fillRect(0, 0, 640, 480);

      // Window representation
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(80, 60, 480, 320);
      ctx.fillStyle = '#000080';
      ctx.fillRect(82, 62, 476, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('NOVA 30 OS Desktop Capture', 90, 78);

      // Content inside window
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(84, 88, 472, 288);
      ctx.fillStyle = '#333333';
      ctx.font = '14px monospace';
      ctx.fillText(`Snapshot captured at: ${new Date().toLocaleTimeString()}`, 110, 140);
      ctx.fillText('Resolution: 640 x 480 @ 60Hz', 110, 170);
      ctx.fillText('Memory State: NORMAL', 110, 200);

      // Taskbar
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 452, 640, 28);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Start', 12, 470);
      ctx.fillText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 580, 470);

      setScreenshotUrl(canvas.toDataURL());
    }
  };

  const handleDownload = () => {
    if (!screenshotUrl) return;
    playClick();
    const a = document.createElement('a');
    a.href = screenshotUrl;
    a.download = `NOVA_SCREENSHOT_${Date.now()}.png`;
    a.click();
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '10px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <button
          className="retro-button"
          onClick={takeScreenshot}
          disabled={capturing}
          style={{ padding: '3px 12px', fontWeight: 'bold' }}
        >
          {capturing ? `Capturing in ${countdown}s...` : '📸 Take Snapshot'}
        </button>

        <label style={{ marginLeft: '8px' }}>Delay:</label>
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          style={{ padding: '2px', border: '1px inset #ffffff' }}
        >
          <option value={0}>Instant (0s)</option>
          <option value={3}>3 seconds</option>
          <option value={5}>5 seconds</option>
        </select>

        {screenshotUrl && (
          <button className="retro-button" onClick={handleDownload} style={{ padding: '3px 10px', marginLeft: 'auto' }}>
            💾 Save As PNG
          </button>
        )}
      </div>

      {/* Preview Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#808080',
        border: '2px inset #dfdfdf',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {screenshotUrl ? (
          <img src={screenshotUrl} alt="Captured Screenshot" style={{ maxWidth: '95%', maxHeight: '95%', border: '1px solid #000000', boxShadow: '2px 2px 6px rgba(0,0,0,0.5)' }} />
        ) : (
          <div style={{ color: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>📷</div>
            <div>Click "Take Snapshot" to capture current screen buffer.</div>
          </div>
        )}
      </div>
    </div>
  );
}
