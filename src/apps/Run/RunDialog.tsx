import React, { useState } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface RunDialogProps {
  onClose?: () => void;
}

export default function RunDialog({ onClose }: RunDialogProps) {
  const { openWindow } = useWindows();
  const { playClick, playError, playNotification } = useSound();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova-run-history');
      return saved ? JSON.parse(saved) : ['notepad', 'calc', 'terminal', 'browser', 'games'];
    } catch {
      return ['notepad', 'calc', 'terminal', 'browser', 'games'];
    }
  });

  const COMMAND_MAP: Record<string, string> = {
    'notepad': 'notepad',
    'editor': 'notepad',
    'paint': 'paint',
    'draw': 'paint',
    'terminal': 'terminal',
    'cmd': 'terminal',
    'command': 'terminal',
    'dos': 'terminal',
    'browser': 'internet',
    'internet': 'internet',
    'web': 'internet',
    'google': 'internet',
    'calc': 'calculator',
    'calculator': 'calculator',
    'taskmgr': 'task-manager',
    'taskmanager': 'task-manager',
    'tasks': 'task-manager',
    'explorer': 'files',
    'files': 'files',
    'mycomputer': 'my-computer',
    'games': 'games',
    'music': 'music',
    'player': 'music',
    'winamp': 'music',
    'settings': 'control-panel',
    'control': 'control-panel',
    'controlpanel': 'control-panel',
    'about': 'about',
    'mail': 'mail',
    'email': 'mail',
    'writer': 'writer',
    'word': 'writer',
    'calendar': 'calendar',
    'cal': 'calendar',
    'clock': 'clock',
    'time': 'clock',
    'weather': 'weather',
    'forecast': 'weather',
    'contacts': 'contacts',
    'addressbook': 'contacts',
    'zip': 'zip',
    'winzip': 'zip',
    'compress': 'zip',
    'sysinfo': 'sysinfo',
    'systeminfo': 'sysinfo',
    'disk': 'disk',
    'defrag': 'disk',
    'recycle': 'trash',
    'trash': 'trash',
    'imageviewer': 'imageviewer',
    'images': 'imageviewer',
    'photos': 'imageviewer',
    'mediacenter': 'mediacenter',
    'media': 'mediacenter',
    'screencap': 'screencap',
    'screenshot': 'screencap',
    'colorlab': 'colorlab',
    'color': 'colorlab',
    'password': 'password',
    'passgen': 'password',
    'sysmon': 'sysmon',
    'monitor': 'sysmon',
    'network': 'network',
    'dialup': 'network',
    'help': 'help',
    'welcome': 'welcome',
    'store': 'store',
    'shop': 'store',
    // Mystery triggers
    'admin': 'admin-panel',
    'black': 'black-window',
    'ghost': 'black-window',
    'user07': 'black-window',
    '1998': 'admin-panel'
  };

  const handleRun = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = command.trim().toLowerCase();
    if (!clean) return;

    // Check history
    if (!history.includes(clean)) {
      const updated = [clean, ...history.slice(0, 9)];
      setHistory(updated);
      try {
        localStorage.setItem('nova-run-history', JSON.stringify(updated));
      } catch {}
    }

    const appKey = COMMAND_MAP[clean];
    if (appKey) {
      playClick();
      openWindow(appKey);
      if (onClose) onClose();
    } else if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('www.')) {
      playClick();
      openWindow('internet');
      if (onClose) onClose();
    } else if (clean === '42' || clean === 'matrix') {
      playNotification();
      mysteryEngine.recordSecretFound(`run_${clean}`);
      openWindow('terminal');
      if (onClose) onClose();
    } else {
      playError();
      alert(`Cannot find '${command}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '16px',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px',
      color: '#000000',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '32px' }}>🏃</div>
        <div>
          <p style={{ margin: '0 0 12px 0', lineHeight: '1.4' }}>
            Type the name of a program, folder, document, or Internet resource, and NOVA 30 OS will open it for you.
          </p>

          <form onSubmit={handleRun}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="run-cmd" style={{ fontWeight: 'bold' }}><u>O</u>pen:</label>
              <input
                id="run-cmd"
                type="text"
                list="run-history-list"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g. notepad, calc, mail, sysmon, games..."
                autoFocus
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  border: '2px inset #ffffff',
                  fontSize: '12px',
                  backgroundColor: '#ffffff'
                }}
              />
              <datalist id="run-history-list">
                {history.map((h, i) => (
                  <option key={i} value={h} />
                ))}
              </datalist>
            </div>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => handleRun()}
          className="retro-button"
          style={{ padding: '4px 16px', fontWeight: 'bold', minWidth: '70px' }}
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => { playClick(); if (onClose) onClose(); }}
          className="retro-button"
          style={{ padding: '4px 16px', minWidth: '70px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
