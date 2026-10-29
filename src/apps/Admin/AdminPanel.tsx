import React, { useState, useEffect } from 'react';
import { mysteryEngine } from '../../mystery/mysteryEngine';
import { useSound } from '../../hooks/useSound';

export default function AdminPanel() {
  const { playClick, playError, playNotification } = useSound();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [state, setState] = useState(mysteryEngine.getState());
  const [activeTab, setActiveTab] = useState<'memory' | 'logs' | 'developer'>('memory');

  useEffect(() => {
    return mysteryEngine.subscribe(setState);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mysteryEngine.unlockAdmin(password)) {
      playNotification();
      setErrorMsg('');
    } else {
      playError();
      setErrorMsg('INVALID ADMINISTRATIVE CREDENTIALS. ACCESS DENIED.');
    }
  };

  const handleInspectMemory = () => {
    playNotification();
    mysteryEngine.recordAdminMemoryInspected();
  };

  if (!state.adminUnlocked) {
    return (
      <div style={{ backgroundColor: '#c0c0c0', height: '100%', padding: '24px', boxSizing: 'border-box', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ border: '2px outset #ffffff', backgroundColor: '#d4d0c8', padding: '20px', width: '320px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#000080' }}>NOVA ROOT AUTHENTICATION</h3>
          <p style={{ margin: '0 0 14px 0', color: '#444' }}>
            Enter Master Authorization Key to access Kernel Management System.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              style={{ width: '90%', padding: '4px 6px', border: '2px inset #ffffff', marginBottom: '10px', fontSize: '12px' }}
            />
            {errorMsg && (
              <p style={{ color: '#cc0000', fontWeight: 'bold', margin: '4px 0 8px 0', fontSize: '10px' }}>
                {errorMsg}
              </p>
            )}
            <div>
              <button
                type="submit"
                style={{ padding: '4px 16px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Authenticate
              </button>
            </div>
          </form>

          <p style={{ fontSize: '10px', color: '#777', marginTop: '14px', fontStyle: 'italic' }}>
            Hint: Incept year of NOVA 30 OS. (Look in Black Window or README).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#c0c0c0', height: '100%', padding: '10px', boxSizing: 'border-box', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #808080', paddingBottom: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        <div>
          <strong style={{ fontSize: '12px', color: '#000080' }}>NOVA ADMINISTRATIVE CONTROL MATRIX</strong>
          <span style={{ marginLeft: '10px', color: '#008000', fontWeight: 'bold' }}>[STATUS: ROOT UNLOCKED]</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid #808080' }}>
        <button
          onClick={() => { playClick(); setActiveTab('memory'); handleInspectMemory(); }}
          style={{ padding: '4px 12px', border: '2px outset #ffffff', borderBottom: activeTab === 'memory' ? 'none' : '2px solid #808080', backgroundColor: activeTab === 'memory' ? '#ffffff' : '#c0c0c0', fontWeight: activeTab === 'memory' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          System Memory
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('logs'); }}
          style={{ padding: '4px 12px', border: '2px outset #ffffff', borderBottom: activeTab === 'logs' ? 'none' : '2px solid #808080', backgroundColor: activeTab === 'logs' ? '#ffffff' : '#c0c0c0', fontWeight: activeTab === 'logs' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          Kernel Audit Logs
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('developer'); }}
          style={{ padding: '4px 12px', border: '2px outset #ffffff', borderBottom: activeTab === 'developer' ? 'none' : '2px solid #808080', backgroundColor: activeTab === 'developer' ? '#ffffff' : '#c0c0c0', fontWeight: activeTab === 'developer' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          Developer Vault
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #808080', padding: '12px', overflowY: 'auto', marginTop: '2px' }}>
        {activeTab === 'memory' && (
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>CORE MEMORY ALLOCATION TABLE:</h4>
            <div style={{ backgroundColor: '#000033', color: '#00ffcc', padding: '10px', fontFamily: 'Courier, monospace', fontSize: '12px', lineHeight: 1.6 }}>
              <div>0x0000: SYSTEM BOOTSTRAP [ROM OK]</div>
              <div>0x0400: TASK CONTROLLER [ACTIVE]</div>
              <div>0x0700: REGISTERED USER: <strong style={{ color: '#ff6666' }}>USER_07 (DORMANT RESIDENT)</strong></div>
              <div>0x0701: CURRENT OPERATOR: <strong style={{ color: '#ffff00' }}>YOU</strong></div>
              <div>0x0800: PROTOCOL: AWAITING 'truth' COMMAND IN TERMINAL</div>
            </div>
            <p style={{ marginTop: '10px', color: '#333' }}>
              ✓ <strong>Clue Discovered:</strong> CURRENT_USER verified. USER_07 is directly observing your session.
            </p>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>HISTORICAL AUDIT STREAM (1998–PRESENT):</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
              <li><strong>11/04/1998 23:41:</strong> USER_07 executed final build compilation.</li>
              <li><strong>11/04/1998 23:59:</strong> Anomaly detected in memory swap sector 07. Process unknown.exe spawned.</li>
              <li><strong>Today:</strong> New operator connected to NOVA 30 OS. Progress level: {state.mysteryLevel}/5.</li>
            </ul>
          </div>
        )}

        {activeTab === 'developer' && (
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>C:\DEVELOPER DIRECTORY UNLOCKED:</h4>
            <p>The Developer Archive has now been mounted to File Explorer!</p>
            <p>You may inspect files like <code>BUGS.TXT</code>, <code>TODO.TXT</code>, and <code>USER07_MEMO.TXT</code> under C:\.</p>
            <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#ffffd0', border: '1px solid #808000' }}>
              <strong>FINAL DIRECTIVE:</strong>
              <p style={{ margin: '4px 0 0 0' }}>
                Open Terminal and execute the final sequence command: <code>truth</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
