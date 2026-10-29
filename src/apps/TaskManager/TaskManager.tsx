import React, { useState, useEffect } from 'react';
import { mysteryEngine } from '../../mystery/mysteryEngine';
import { useSound } from '../../hooks/useSound';

interface ProcessItem {
  name: string;
  cpu: string;
  memory: string;
  user: string;
  description: string;
}

export default function TaskManager() {
  const { playClick, playError, playNotification } = useSound();
  const [selectedProc, setSelectedProc] = useState<string>('explorer.exe');
  const [showModal, setShowModal] = useState(false);
  const [accessDeniedMsg, setAccessDeniedMsg] = useState('');
  const [mysteryState, setMysteryState] = useState(mysteryEngine.getState());

  useEffect(() => {
    return mysteryEngine.subscribe(setMysteryState);
  }, []);

  const normalProcesses: ProcessItem[] = [
    { name: 'explorer.exe', cpu: '02%', memory: '4,120 K', user: 'EXPLORER', description: 'NOVA Desktop Shell & File Manager' },
    { name: 'novaplayer.exe', cpu: '03%', memory: '3,450 K', user: 'EXPLORER', description: 'Polyphonic Audio Media Core' },
    { name: 'terminal.exe', cpu: '01%', memory: '1,820 K', user: 'EXPLORER', description: 'Command Line Interpreter' },
    { name: 'system.exe', cpu: '08%', memory: '8,940 K', user: 'SYSTEM', description: 'Kernel Architecture & Hardware Control' },
  ];

  const hasUnknown = mysteryState.unknownProcessDiscovered || mysteryState.mysteryLevel >= 2;
  const processes: ProcessItem[] = hasUnknown
    ? [
        ...normalProcesses,
        { name: 'unknown.exe', cpu: '13%', memory: '6,660 K', user: 'USER_07', description: 'Sub-routine active since November 1998' }
      ]
    : normalProcesses;

  const handleEndProcess = () => {
    if (selectedProc === 'unknown.exe') {
      playError();
      setAccessDeniedMsg('ACCESS DENIED\n\nThis process belongs to SYSTEM (USER_07).\nTermination is prohibited by kernel lock.');
      setTimeout(() => setAccessDeniedMsg(''), 4000);
    } else {
      playClick();
      alert(`Cannot end system-critical process '${selectedProc}' in protected mode.`);
    }
  };

  const handleInspect = () => {
    playClick();
    if (selectedProc === 'unknown.exe') {
      mysteryEngine.unlockClue('UNKNOWN_PROCESS');
      mysteryEngine.unlockAchievement('GHOST_IN_THE_MACHINE');
      playNotification();
    }
    setShowModal(true);
  };

  const selectedItem = processes.find(p => p.name === selectedProc) || processes[0];

  return (
    <div style={{ padding: '8px', backgroundColor: '#c0c0c0', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', userSelect: 'none' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid #808080', marginBottom: '8px' }}>
        <button style={{ border: '2px outset #ffffff', borderBottom: 'none', backgroundColor: '#c0c0c0', padding: '4px 12px', fontWeight: 'bold' }}>Processes</button>
        <button style={{ border: '2px outset #ffffff', borderBottom: 'none', backgroundColor: '#d4d0c8', padding: '4px 12px', color: '#666' }}>Performance</button>
      </div>

      {accessDeniedMsg && (
        <div style={{ backgroundColor: '#800000', color: '#ffffff', padding: '6px 10px', marginBottom: '8px', border: '2px inset #000', whiteSpace: 'pre-line', fontWeight: 'bold' }}>
          {accessDeniedMsg}
        </div>
      )}

      {/* Process Table */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #808080', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#c0c0c0', borderBottom: '1px solid #808080' }}>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #808080' }}>Image Name</th>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #808080' }}>CPU</th>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #808080' }}>Mem Usage</th>
              <th style={{ padding: '3px 6px' }}>User</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc) => {
              const isSelected = selectedProc === proc.name;
              const isGhost = proc.name === 'unknown.exe';
              return (
                <tr
                  key={proc.name}
                  onClick={() => { playClick(); setSelectedProc(proc.name); }}
                  onDoubleClick={handleInspect}
                  style={{
                    backgroundColor: isSelected ? '#000080' : isGhost ? '#fff0f0' : 'transparent',
                    color: isSelected ? '#ffffff' : isGhost ? '#cc0000' : '#000000',
                    cursor: 'pointer'
                  }}
                >
                  <td style={{ padding: '2px 6px' }}>{isGhost ? '⚠️ ' : '📄 '}{proc.name}</td>
                  <td style={{ padding: '2px 6px' }}>{proc.cpu}</td>
                  <td style={{ padding: '2px 6px' }}>{proc.memory}</td>
                  <td style={{ padding: '2px 6px' }}>{proc.user}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: '#444' }}>
          Processes: {processes.length} | CPU Usage: {hasUnknown ? '27%' : '14%'}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleInspect}
            style={{ padding: '3px 12px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', cursor: 'pointer' }}
          >
            Properties
          </button>
          <button
            onClick={handleEndProcess}
            style={{ padding: '3px 12px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', cursor: 'pointer', fontWeight: 'bold' }}
          >
            End Process
          </button>
        </div>
      </div>

      {/* Process Properties Modal */}
      {showModal && (
        <div style={{ position: 'absolute', top: '15%', left: '10%', right: '10%', backgroundColor: '#c0c0c0', border: '3px outset #ffffff', padding: '12px', boxShadow: '4px 4px 10px rgba(0,0,0,0.5)', zIndex: 100 }}>
          <div style={{ backgroundColor: '#000080', color: '#ffffff', padding: '2px 6px', fontWeight: 'bold', marginBottom: '8px' }}>
            Process Properties - {selectedItem.name}
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '2px inset #808080', padding: '10px', fontSize: '11px', lineHeight: 1.6 }}>
            <p><strong>Image:</strong> {selectedItem.name}</p>
            <p><strong>Owner:</strong> <span style={{ color: selectedItem.user === 'USER_07' ? '#cc0000' : 'inherit', fontWeight: 'bold' }}>{selectedItem.user}</span></p>
            <p><strong>Description:</strong> {selectedItem.description}</p>
            <p><strong>Memory Status:</strong> {selectedItem.name === 'unknown.exe' ? 'RESERVED (LOCKED KERNEL SECTOR)' : 'ALLOCATED'}</p>
            {selectedItem.name === 'unknown.exe' && (
              <p style={{ color: '#800000', fontStyle: 'italic', marginTop: '8px' }}>
                "USER_07 left this background process listening for someone worthy of the truth. Enter 'wake' in Terminal."
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button
              onClick={() => { playClick(); setShowModal(false); }}
              style={{ padding: '3px 16px', border: '2px outset #ffffff', backgroundColor: '#c0c0c0', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
