import React, { useState, useEffect, useRef } from 'react';

export default function SystemMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>(() => Array(40).fill(15));
  const [memHistory, setMemHistory] = useState<number[]>(() => Array(40).fill(28));
  const [netHistory, setNetHistory] = useState<number[]>(() => Array(40).fill(5));

  useEffect(() => {
    const timer = setInterval(() => {
      const nextCpu = Math.min(100, Math.max(5, Math.floor(Math.random() * 25) + 10 + Math.sin(Date.now() / 2000) * 15));
      const nextMem = Math.min(100, Math.max(10, Math.floor(Math.random() * 8) + 26));
      const nextNet = Math.min(100, Math.max(0, Math.floor(Math.random() * 30)));

      setCpuHistory(prev => [...prev.slice(1), nextCpu]);
      setMemHistory(prev => [...prev.slice(1), nextMem]);
      setNetHistory(prev => [...prev.slice(1), nextNet]);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Draw oscilloscope graphs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark grid background
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Helper draw line
    const drawLine = (data: number[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const step = w / (data.length - 1);
      data.forEach((val, i) => {
        const x = i * step;
        const y = h - (val / 100) * (h - 10) - 5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    // Draw CPU (Green), Memory (Yellow), Network (Cyan)
    drawLine(cpuHistory, '#00ff00');
    drawLine(memHistory, '#ffff00');
    drawLine(netHistory, '#00ffff');
  }, [cpuHistory, memHistory, netHistory]);

  const latestCpu = cpuHistory[cpuHistory.length - 1];
  const latestMem = memHistory[memHistory.length - 1];
  const latestNet = netHistory[netHistory.length - 1];

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
      {/* Metrics Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '6px', textAlign: 'center' }}>
          <div style={{ color: '#008800', fontWeight: 'bold' }}>CPU Load</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.round(latestCpu)}%</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '6px', textAlign: 'center' }}>
          <div style={{ color: '#cc9900', fontWeight: 'bold' }}>RAM Used</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.round(latestMem)}%</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '6px', textAlign: 'center' }}>
          <div style={{ color: '#0088aa', fontWeight: 'bold' }}>Dial-Up I/O</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.round(latestNet * 0.56)} KB/s</div>
        </div>
      </div>

      {/* Real-time Canvas Graph */}
      <div style={{ flex: 1, backgroundColor: '#000000', border: '2px inset #dfdfdf', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Legend & Refresh Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#333' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: '#008800', fontWeight: 'bold' }}>■ CPU</span>
          <span style={{ color: '#cc9900', fontWeight: 'bold' }}>■ Memory</span>
          <span style={{ color: '#0088aa', fontWeight: 'bold' }}>■ Network</span>
        </div>
        <span>Sampling Rate: 500ms</span>
      </div>
    </div>
  );
}
