import React, { useState, useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';

export default function DigitalPet() {
  const { playClick, playNotification } = useSound();
  const [hunger, setHunger] = useState(80);
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(80);
  const [ageDays, setAgeDays] = useState(1);
  const [mood, setMood] = useState<'happy' | 'tired' | 'hungry' | 'sleeping'>('happy');

  // Pet life cycle tick
  useEffect(() => {
    const timer = setInterval(() => {
      setHunger(h => Math.max(0, h - 2));
      setHappiness(hp => Math.max(0, hp - 2));
      setEnergy(e => mood === 'sleeping' ? Math.min(100, e + 5) : Math.max(0, e - 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [mood]);

  // Update mood
  useEffect(() => {
    if (mood === 'sleeping') return;
    if (hunger < 30) setMood('hungry');
    else if (energy < 25) setMood('tired');
    else if (happiness < 40) setMood('tired');
    else setMood('happy');
  }, [hunger, happiness, energy, mood]);

  const feed = () => {
    playClick();
    setHunger(h => Math.min(100, h + 25));
    setHappiness(hp => Math.min(100, hp + 10));
  };

  const play = () => {
    playClick();
    if (energy < 15) {
      alert('Too tired to play! Put pet to sleep.');
      return;
    }
    setHappiness(hp => Math.min(100, hp + 25));
    setEnergy(e => Math.max(0, e - 15));
    setHunger(h => Math.max(0, h - 10));
  };

  const toggleSleep = () => {
    playNotification();
    setMood(mood === 'sleeping' ? 'happy' : 'sleeping');
  };

  const clean = () => {
    playClick();
    setHappiness(hp => Math.min(100, hp + 15));
  };

  const getPetEmoji = () => {
    if (mood === 'sleeping') return '💤 🐱 (Zzz)';
    if (mood === 'hungry') return '😿 (Hungry!)';
    if (mood === 'tired') return '🥱 (Tired...)';
    return '😸 (Happy!)';
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '10px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '8px' }}>
        <strong>🐾 NOVA Tamagotchi 98</strong>
        <span>Age: {ageDays} days</span>
      </div>

      {/* Screen Enclosure */}
      <div style={{
        backgroundColor: '#a4b397',
        border: '4px inset #718165',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        marginBottom: '10px',
        boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.4)',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '6px' }}>
          {getPetEmoji()}
        </div>
        <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '12px', color: '#1e2d14' }}>
          PIXEL BUDDY • STATUS: {mood.toUpperCase()}
        </div>
      </div>

      {/* Vitals Bars */}
      <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '8px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>Fullness:</span><strong>{hunger}%</strong>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff' }}>
            <div style={{ height: '100%', width: `${hunger}%`, backgroundColor: hunger < 30 ? '#cc0000' : '#00aa00' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>Happiness:</span><strong>{happiness}%</strong>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff' }}>
            <div style={{ height: '100%', width: `${happiness}%`, backgroundColor: happiness < 30 ? '#cc0000' : '#0088cc' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>Energy:</span><strong>{energy}%</strong>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e0e0e0', border: '1px inset #ffffff' }}>
            <div style={{ height: '100%', width: `${energy}%`, backgroundColor: energy < 30 ? '#cc0000' : '#e69500' }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        <button className="retro-button" onClick={feed} style={{ padding: '6px 2px' }}>🍕 Feed</button>
        <button className="retro-button" onClick={play} style={{ padding: '6px 2px' }}>🎾 Play</button>
        <button className="retro-button" onClick={toggleSleep} style={{ padding: '6px 2px' }}>💤 Sleep</button>
        <button className="retro-button" onClick={clean} style={{ padding: '6px 2px' }}>🧼 Clean</button>
      </div>
    </div>
  );
}
