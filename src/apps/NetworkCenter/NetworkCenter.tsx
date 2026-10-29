import React, { useState, useRef } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

export default function NetworkCenter() {
  const { playClick, playNotification } = useSound();
  const [activeTab, setActiveTab] = useState<'status' | 'ping' | 'dialup'>('status');
  const [pingTarget, setPingTarget] = useState('192.168.0.1');
  const [pingLogs, setPingLogs] = useState<string[]>([]);
  const [isPinging, setIsPinging] = useState(false);

  // Dial-up sound generator
  const [isConnectingModem, setIsConnectingModem] = useState(false);
  const modemAudioRef = useRef<any>(null);

  const startPing = () => {
    playClick();
    setIsPinging(true);
    setPingLogs([`Pinging ${pingTarget} with 32 bytes of data:`]);

    let seq = 1;
    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 40) + 120;
      setPingLogs(prev => [...prev, `Reply from ${pingTarget}: bytes=32 time=${ms}ms TTL=128`]);
      seq++;

      if (seq > 4) {
        clearInterval(interval);
        setIsPinging(false);
        setPingLogs(prev => [
          ...prev,
          `Ping statistics for ${pingTarget}: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`
        ]);

        if (pingTarget.includes('1998') || pingTarget.includes('07') || pingTarget === 'sector7.local') {
          playNotification();
          mysteryEngine.recordSecretFound('network_ping_mystery');
        }
      }
    }, 600);
  };

  const simulateDialup = () => {
    playClick();
    setIsConnectingModem(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // dial tone
      osc.frequency.setValueAtTime(1209, audioCtx.currentTime + 0.6); // DTMF beep
      osc.frequency.setValueAtTime(941, audioCtx.currentTime + 1.0);
      osc.frequency.setValueAtTime(2100, audioCtx.currentTime + 1.8); // modem handshake screech
      osc.frequency.setValueAtTime(1650, audioCtx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 3.3);
    } catch {}

    setTimeout(() => {
      setIsConnectingModem(false);
      playNotification();
      alert('MODEM HANDSHAKE CONNECT 57600/ARQ/V90/LAPM\nCarrier Detected. Connected to NOVA Net.');
    }, 3500);
  };

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
      {/* Top Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '8px' }}>
        {[
          { key: 'status', label: '📡 Network Status' },
          { key: 'ping', label: '🏓 Ping Utility' },
          { key: 'dialup', label: '📞 Dial-Up Handshake' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { playClick(); setActiveTab(t.key as any); }}
            className="retro-button"
            style={{
              padding: '3px 8px',
              fontWeight: activeTab === t.key ? 'bold' : 'normal',
              backgroundColor: activeTab === t.key ? '#dfdfdf' : '#c0c0c0'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', minHeight: 0 }}>
        {activeTab === 'status' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
              <span style={{ fontSize: '32px' }}>🌐</span>
              <div>
                <strong style={{ fontSize: '14px', color: '#008800' }}>ONLINE (56.6 Kbps Dial-up)</strong>
                <div style={{ fontSize: '11px', color: '#666' }}>Connected via USRobotics Sportster 56K V.90</div>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>IP Address:</td><td><strong>192.168.0.7</strong></td></tr>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>Subnet Mask:</td><td>255.255.255.0</td></tr>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>Default Gateway:</td><td>192.168.0.1</td></tr>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>Primary DNS:</td><td>4.2.2.1</td></tr>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>Secondary DNS:</td><td>199.8.7.0 (Classified Gateway)</td></tr>
                <tr><td style={{ color: '#666', padding: '4px 0' }}>Host Name:</td><td>NOVA-STATION-98</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ping' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input
                type="text"
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                placeholder="IP or Host (e.g. 192.168.0.1, sector7.local)"
                style={{ flex: 1, padding: '3px', border: '1px inset #ffffff' }}
              />
              <button className="retro-button" onClick={startPing} disabled={isPinging} style={{ padding: '3px 12px', fontWeight: 'bold' }}>
                {isPinging ? 'Pinging...' : 'Ping'}
              </button>
            </div>

            <div style={{ flex: 1, backgroundColor: '#000000', color: '#00ff00', padding: '8px', fontFamily: 'monospace', fontSize: '11px', overflowY: 'auto' }}>
              {pingLogs.length === 0 ? 'Type a destination address and press Ping.' : pingLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dialup' && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📠</div>
            <h3 style={{ margin: '0 0 6px 0', color: '#000080' }}>56K Dial-Up Handshake Simulator</h3>
            <p style={{ color: '#555', fontSize: '11px', maxWidth: '320px', margin: '0 auto 16px auto' }}>
              Simulate the nostalgic sound of a 1998 dial-up modem handshaking over telephone lines using the Web Audio API.
            </p>
            <button
              className="retro-button"
              onClick={simulateDialup}
              disabled={isConnectingModem}
              style={{ padding: '6px 20px', fontWeight: 'bold' }}
            >
              {isConnectingModem ? 'Dialing & Handshaking...' : '📞 Connect Modem (Play Audio)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
