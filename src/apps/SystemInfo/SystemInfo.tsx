import React, { useState, useEffect } from 'react';

export default function SystemInfo() {
  const [cpuTemp, setCpuTemp] = useState(42);
  const [memUsed, setMemUsed] = useState(18);
  const [uptimeSec, setUptimeSec] = useState(384);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSec(s => s + 1);
      setCpuTemp(40 + Math.floor(Math.sin(Date.now() / 4000) * 4));
      setMemUsed(17 + Math.floor(Math.cos(Date.now() / 3000) * 3));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '12px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #808080', paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ fontSize: '36px' }}>🖥️</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#000080' }}>NOVA 30 OS Professional</h2>
          <span style={{ fontSize: '11px', color: '#555' }}>Build 1998.07.15-RELEASE • 32-Bit Enhanced Architecture</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1, minHeight: 0 }}>
        {/* Hardware Specs Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px' }}>
          <strong style={{ color: '#000080', display: 'block', marginBottom: '8px', borderBottom: '1px solid #e0e0e0', paddingBottom: '4px' }}>
            Hardware Specifications:
          </strong>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Processor:</td><td><strong>NOVA-486DX @ 66 MHz</strong></td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Co-Processor:</td><td>Integrated FPU 80387</td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Installed Memory:</td><td><strong>64 MB EDO RAM</strong></td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Graphics Adapter:</td><td>Trident 9680 PCI 2MB</td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Sound Controller:</td><td>SoundBlaster 16 AWE32</td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Primary Storage:</td><td>Quantum Fireball 2.1 GB</td></tr>
              <tr><td style={{ color: '#666', padding: '3px 0' }}>Modem:</td><td>USRobotics 56K V.90 Fax</td></tr>
            </tbody>
          </table>
        </div>

        {/* Live Health Metrics Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <strong style={{ color: '#000080', borderBottom: '1px solid #e0e0e0', paddingBottom: '4px' }}>
            Real-Time Diagnostics:
          </strong>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
              <span>Memory Allocation:</span>
              <strong>{memUsed} MB / 64 MB</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff', padding: '1px' }}>
              <div style={{ height: '100%', width: `${(memUsed / 64) * 100}%`, backgroundColor: '#000080' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
              <span>Core Temperature:</span>
              <strong style={{ color: cpuTemp > 50 ? '#cc0000' : '#008000' }}>{cpuTemp}°C</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff', padding: '1px' }}>
              <div style={{ height: '100%', width: `${(cpuTemp / 80) * 100}%`, backgroundColor: cpuTemp > 50 ? '#cc0000' : '#00aa00' }} />
            </div>
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid #e0e0e0', paddingTop: '8px', fontSize: '11px' }}>
            <div><strong>System Uptime:</strong> {formatUptime(uptimeSec)}</div>
            <div><strong>Registered To:</strong> Explorer (Single User License)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
