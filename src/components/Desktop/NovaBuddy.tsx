import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

const TIPS = [
  "It looks like you're exploring 1998! Need help surfing the Information Superhighway?",
  "Did you know? Type 'matrix' in the Terminal to simulate digital neural code!",
  "Try clicking the taskbar clock 5 times in a row for a temporal anomaly!",
  "Press Alt + Tab anytime to cycle between your open windows.",
  "Press Ctrl + Alt + A to instantly open the Accessibility Center.",
  "Check out the DO_NOT_OPEN file on the desktop... if you dare!",
  "Dial-up connections are most stable when no one picks up the landline phone!",
  "You can draw pixel art in Paint and save it directly to your virtual machine.",
  "Need to compute? Launch the new 90s Calculator from Start -> Programs!",
  "Listen to chiptunes in NOVA Player with the animated 16-band equalizer!"
];

export default function NovaBuddy() {
  const { playNotification, playClick } = useSound();
  const [tipIndex, setTipIndex] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimFrame(f => (f + 1) % 2);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const nextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setTipIndex(i => (i + 1) % TIPS.length);
  };

  const toggleBubble = () => {
    playNotification();
    setBubbleOpen(o => !o);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '44px',
        right: '16px',
        zIndex: 89999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        userSelect: 'none',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif'
      }}
    >
      {/* Speech Bubble */}
      {bubbleOpen && (
        <div
          style={{
            backgroundColor: '#ffffcc',
            border: '2px solid #000000',
            borderRadius: '6px',
            padding: '8px 10px',
            maxWidth: '220px',
            boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
            marginBottom: '8px',
            fontSize: '11px',
            lineHeight: '1.4',
            position: 'relative'
          }}
          role="complementary"
          aria-label="Nova Assistant Tip"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px dotted #999', paddingBottom: '2px' }}>
            <strong style={{ color: '#000080', fontSize: '10px' }}>🧙‍♂️ NOVA BUDDY</strong>
            <button
              onClick={() => setBubbleOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}
              aria-label="Close Tip"
            >
              ✕
            </button>
          </div>
          <p style={{ margin: 0, color: '#000000' }}>{TIPS[tipIndex]}</p>
          <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={nextTip}
              style={{
                backgroundColor: '#c0c0c0',
                border: '1px outset #ffffff',
                fontSize: '10px',
                cursor: 'pointer',
                padding: '1px 6px'
              }}
            >
              Next Tip ⏩
            </button>
          </div>
          {/* Speech bubble pointer notch */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '24px',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #000000'
            }}
          />
        </div>
      )}

      {/* Floating Animated Character Icon */}
      <div
        onClick={toggleBubble}
        style={{
          width: '44px',
          height: '44px',
          backgroundColor: '#c0c0c0',
          border: '2px outset #ffffff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
          transform: animFrame === 1 ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.2s ease'
        }}
        title="Click Nova Buddy for tips & help!"
        role="button"
        tabIndex={0}
        aria-label="Nova Buddy Assistant"
      >
        🧙‍♂️
      </div>
    </div>
  );
}
