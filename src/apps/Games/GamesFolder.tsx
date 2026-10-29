import React from 'react';
import { useWindows } from '../../contexts/WindowContext';

const games = [
  { id: 'snake', name: 'Cyber Snake', icon: '🐍' },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣' },
  { id: 'breakout', name: 'Neon Breakout', icon: '🧱' },
  { id: 'asteroids', name: 'Asteroids Vector', icon: '🛸' },
  { id: 'terminal-hacker', name: 'Terminal Hacker', icon: '📟' },
  { id: 'memory-matrix', name: 'Memory Matrix', icon: '🧠' },
  { id: 'game-2048', name: '2048 NOVA', icon: '🔢' },
  { id: 'word-terminal', name: 'Word Terminal', icon: '🔤' },
  { id: 'digital-pet', name: 'Digital Pet', icon: '🐾' },
  { id: 'glitch-runner', name: 'Glitch Runner', icon: '🏃' },
  { id: 'pong', name: 'Pong Arena', icon: '🏓' },
  { id: 'space-invaders', name: 'Space Invaders', icon: '🚀' },
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', icon: '❌' },
  { id: 'solitaire', name: 'Solitaire 98', icon: '🃏' },
];


export default function GamesFolder() {
  const { openWindow } = useWindows();

  const handleLaunch = (id: string, name: string, icon: string) => {
    openWindow({
      component: id,
      title: name,
      icon
    });
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        padding: '16px', 
        backgroundColor: '#ffffff', 
        height: '100%',
        alignContent: 'flex-start'
      }}
      role="region"
      aria-label="Games Directory"
    >
      {games.map(g => (
        <div 
          key={g.id}
          onDoubleClick={() => handleLaunch(g.id, g.name, g.icon)}
          onClick={() => {}}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLaunch(g.id, g.name, g.icon);
            }
          }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            cursor: 'pointer', 
            width: '84px',
            padding: '6px',
            borderRadius: '2px',
            outline: 'none'
          }}
          tabIndex={0}
          role="button"
          aria-label={`Open ${g.name} game`}
        >
          <div style={{ fontSize: '40px', lineHeight: 1, filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}>
            {g.icon}
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontFamily: '"MS Sans Serif", sans-serif', fontSize: '11px', color: '#000000' }}>
            {g.name}
          </div>
        </div>
      ))}
    </div>
  );
}
