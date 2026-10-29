import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface WelcomeCenterProps {
  onClose?: () => void;
}

export default function WelcomeCenter({ onClose }: WelcomeCenterProps) {
  const { playClick, playNotification } = useSound();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to NOVA 30 OS',
      icon: '🌟',
      body: `Welcome, Explorer! You are navigating an authentic recreation of a vintage 32-bit operating system from 1998. Everything you see—windows, taskbar, desktop icons, sounds, and CRT phosphor glows—is fully interactive.`
    },
    {
      title: 'Multitasking & Window Management',
      icon: '🪟',
      body: `Every window can be dragged by its blue gradient title bar, minimized to the bottom taskbar, maximized to full viewport, and resized using any of the 8 border handles. Use Alt+Tab to cycle through open applications.`
    },
    {
      title: 'The Retro Internet & Google Search',
      icon: '🌐',
      body: `Launch NOVA Explorer to browse the World Wide Web. Use our Google Search engine to discover real encyclopedic articles, news, and knowledge cards on any topic—or explore authentic 1998 websites.`
    },
    {
      title: 'Secrets & Hidden History',
      icon: '🔍',
      body: `NOVA 30 OS remembers your actions. As you explore the file system, solve terminal puzzles, and inspect system telemetry, you will gradually uncover the mystery of USER_07 and the fateful events of 1998.`
    }
  ];

  const handleNext = () => {
    playClick();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      playNotification();
      mysteryEngine.recordSecretFound('completed_tutorial');
      alert('Congratulations! You completed the NOVA 30 OS Welcome Tour. 100 NOVA Points awarded!');
      if (onClose) onClose();
    }
  };

  const cur = steps[step];

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '16px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '48px', padding: '8px', backgroundColor: '#ffffff', border: '2px inset #dfdfdf' }}>
          {cur.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#000080' }}>
            {cur.title}
          </h2>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            Step {step + 1} of {steps.length}
          </div>
          <p style={{ margin: 0, lineHeight: '1.6', fontSize: '13px' }}>
            {cur.body}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px groove #ffffff', paddingTop: '12px' }}>
        <button
          className="retro-button"
          onClick={() => { playClick(); if (step > 0) setStep(step - 1); }}
          disabled={step === 0}
          style={{ padding: '4px 14px' }}
        >
          ◀ Back
        </button>

        <button
          className="retro-button"
          onClick={handleNext}
          style={{ padding: '4px 18px', fontWeight: 'bold' }}
        >
          {step === steps.length - 1 ? 'Finish Tour 🚀' : 'Next ▶'}
        </button>
      </div>
    </div>
  );
}
