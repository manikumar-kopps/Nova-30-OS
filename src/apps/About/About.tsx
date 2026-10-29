import React from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useSound } from '../../hooks/useSound';

const About: React.FC = () => {
  const { closeActiveWindow } = useWindows();
  const { playClick } = useSound();

  const handleOk = () => {
    playClick();
    closeActiveWindow();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', padding: '16px', fontFamily: '"MS Sans Serif", Tahoma, sans-serif', fontSize: '11px', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '48px', marginRight: '16px', filter: 'drop-shadow(2px 2px 0px #ffffff)' }}>🌟</div>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#000080' }}>NOVA 30 OS</h1>
          <p style={{ margin: '2px 0 0 0', fontWeight: 'bold' }}>Version 30.01 Build 1998</p>
          <p style={{ margin: 0, color: '#333' }}>(C) 1998 NOVA Systems Inc.</p>
          <p style={{ margin: 0, color: '#333' }}>All Rights Reserved.</p>
        </div>
      </div>
      
      <div style={{ borderTop: '2px inset #dfdfdf', margin: '8px 0' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#ffffff', padding: '8px', border: '2px inset #dfdfdf' }}>
        <div style={{ display: 'flex' }}><span style={{ width: '110px', fontWeight: 'bold' }}>Processor:</span><span>NOVA-486DX4 @ 66MHz</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '110px', fontWeight: 'bold' }}>Memory:</span><span>16,384 KB Extended RAM</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '110px', fontWeight: 'bold' }}>Hard Drive:</span><span>2.1 GB IDE Hard Disk</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '110px', fontWeight: 'bold' }}>OS Architecture:</span><span>32-bit Hybrid Protected Mode</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '110px', fontWeight: 'bold' }}>Licensed to:</span><span>Explorer (Registered User)</span></div>
      </div>
      
      <div style={{ borderTop: '2px inset #dfdfdf', margin: '12px 0' }} />
      
      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#444', lineHeight: '1.4' }}>
        This operating system is provided as-is. NOVA Systems is not responsible for any temporal anomalies, sudden nostalgia, dial-up disconnection sounds, or uncontrollable urges to browse web rings.
      </p>
      
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleOk}
          style={{ 
            padding: '4px 20px', 
            backgroundColor: '#c0c0c0', 
            border: '2px outset #ffffff',
            fontFamily: '"MS Sans Serif", sans-serif',
            fontSize: '11px',
            cursor: 'pointer',
            minWidth: '75px',
            outline: 'none'
          }}
          className="retro-button"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default About;
