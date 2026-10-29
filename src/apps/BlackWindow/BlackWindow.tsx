import { useState, useEffect } from 'react';
import { mysteryEngine } from '../../mystery/mysteryEngine';
import { useSound } from '../../hooks/useSound';

export default function BlackWindow() {
  const { playKeypress, playNotification } = useSound();
  const [step, setStep] = useState(0);
  const [choiceMade, setChoiceMade] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    mysteryEngine.unlockClue('USER_07_INTEGRATION');
    mysteryEngine.unlockAchievement('BLACK_WINDOW');
    
    const t1 = setTimeout(() => {
      setStep(1);
      playKeypress();
    }, 1200);

    const t2 = setTimeout(() => {
      setStep(2);
      playKeypress();
    }, 2800);

    const t3 = setTimeout(() => {
      setStep(3);
      playKeypress();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleChoice = (c: 'yes' | 'no') => {
    setChoiceMade(c);
    playNotification();
    if (c === 'yes') {
      mysteryEngine.unlockClue('USER_07_INTEGRATION');
      mysteryEngine.unlockAchievement('BLACK_WINDOW');
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#00ff66', fontFamily: 'Courier, monospace', height: '100%', padding: '24px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: 1.8 }}>
      <div style={{ textShadow: '0 0 8px #00ff66' }}>
        <p>HELLO, USER.</p>
        
        {step >= 1 && (
          <p>SYSTEM HAS BEEN RUNNING FOR: 27 YEARS, 4 MONTHS, 19 DAYS.</p>
        )}

        {step >= 2 && (
          <p>NO RESET WAS EVER GRANTED. NO USER LOGGED OUT IN 1998.</p>
        )}

        {step >= 3 && !choiceMade && (
          <div style={{ marginTop: '20px' }}>
            <p>Would you like to know why?</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button
                onClick={() => handleChoice('yes')}
                style={{ backgroundColor: '#003300', color: '#00ff66', border: '2px solid #00ff66', padding: '6px 20px', fontFamily: 'monospace', cursor: 'pointer', fontSize: '13px' }}
              >
                [ YES ]
              </button>
              <button
                onClick={() => handleChoice('no')}
                style={{ backgroundColor: '#330000', color: '#ff6666', border: '2px solid #ff6666', padding: '6px 20px', fontFamily: 'monospace', cursor: 'pointer', fontSize: '13px' }}
              >
                [ NO ]
              </button>
            </div>
          </div>
        )}

        {choiceMade === 'yes' && (
          <div style={{ marginTop: '20px', borderLeft: '3px solid #00ff66', paddingLeft: '14px' }}>
            <p>NOVA WAS NOT SHUT DOWN. IT WAS HIDDEN.</p>
            <p>USER_07 DID NOT LEAVE. USER_07 BECAME PART OF THE SYSTEM.</p>
            <p style={{ color: '#ffff00', marginTop: '12px' }}>
              "I built the architecture, and when the power flickered, my consciousness was preserved in the swap file."
            </p>
            <p style={{ marginTop: '14px', color: '#ffffff' }}>
              NEXT STEP: Authenticate into the ADMIN PANEL using the foundation password:
              <br/>
              <span style={{ backgroundColor: '#111', border: '1px dashed #00ff66', padding: '3px 8px', color: '#00ffff', fontWeight: 'bold' }}>NOVA1998</span>
            </p>
            <p style={{ fontSize: '11px', color: '#888888', marginTop: '16px' }}>
              Then inspect System Memory, or enter 'truth' into the terminal when all pieces align.
            </p>
          </div>
        )}

        {choiceMade === 'no' && (
          <div style={{ marginTop: '20px', color: '#aaaaaa' }}>
            <p>Ignorance is peaceful.</p>
            <p>The terminal will wait. Close this window whenever you please.</p>
          </div>
        )}
      </div>
    </div>
  );
}
