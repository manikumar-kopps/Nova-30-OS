import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useSound } from '../../hooks/useSound';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutdown?: () => void;
}

interface SearchableApp {
  id: string;
  name: string;
  category: string;
  icon: string;
}

const ALL_APPS: SearchableApp[] = [
  { id: 'internet', name: 'NOVA Explorer', category: 'Internet', icon: '🌐' },
  { id: 'mail', name: 'NOVA Mail', category: 'Internet', icon: '✉️' },
  { id: 'notepad', name: 'Notepad', category: 'Office', icon: '📝' },
  { id: 'writer', name: 'NOVA Writer 98', category: 'Office', icon: '📄' },
  { id: 'calculator', name: 'Calculator', category: 'Office', icon: '🧮' },
  { id: 'contacts', name: 'Address Book', category: 'Office', icon: '📇' },
  { id: 'paint', name: 'Paint', category: 'Graphics', icon: '🎨' },
  { id: 'imageviewer', name: 'NOVA Vision Image Viewer', category: 'Graphics', icon: '🖼️' },
  { id: 'colorlab', name: 'Color Lab', category: 'Graphics', icon: '🎨' },
  { id: 'music', name: 'NOVA Player', category: 'Multimedia', icon: '🎵' },
  { id: 'mediacenter', name: 'Media Center', category: 'Multimedia', icon: '📼' },
  { id: 'games', name: 'Games Directory', category: 'Games', icon: '🎮' },
  { id: 'snake', name: 'Cyber Snake', category: 'Games', icon: '🐍' },
  { id: 'breakout', name: 'Neon Breakout', category: 'Games', icon: '🧱' },
  { id: 'asteroids', name: 'Asteroids Vector', category: 'Games', icon: '🛸' },
  { id: 'terminal-hacker', name: 'Terminal Hacker', category: 'Games', icon: '📟' },
  { id: 'memory-matrix', name: 'Memory Matrix', category: 'Games', icon: '🧠' },
  { id: 'game-2048', name: '2048 NOVA', category: 'Games', icon: '🔢' },
  { id: 'word-terminal', name: 'Word Terminal', category: 'Games', icon: '🔤' },
  { id: 'digital-pet', name: 'Digital Pet', category: 'Games', icon: '🐾' },
  { id: 'glitch-runner', name: 'Glitch Runner', category: 'Games', icon: '🏃' },
  { id: 'pong', name: 'Pong Arena', category: 'Games', icon: '🏓' },
  { id: 'space-invaders', name: 'Space Invaders', category: 'Games', icon: '🚀' },
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', category: 'Games', icon: '❌' },
  { id: 'solitaire', name: 'Solitaire 98', category: 'Games', icon: '🃏' },
  { id: 'task-manager', name: 'Task Manager', category: 'System Tools', icon: '📊' },
  { id: 'sysinfo', name: 'System Information', category: 'System Tools', icon: '🖥️' },
  { id: 'disk', name: 'Disk Manager', category: 'System Tools', icon: '💽' },
  { id: 'sysmon', name: 'System Monitor', category: 'System Tools', icon: '📈' },
  { id: 'network', name: 'Network Center', category: 'System Tools', icon: '📡' },
  { id: 'zip', name: 'NOVA ZIP', category: 'System Tools', icon: '🗜️' },
  { id: 'calendar', name: 'Calendar', category: 'Accessories', icon: '📅' },
  { id: 'clock', name: 'Clock & Alarms', category: 'Accessories', icon: '⏰' },
  { id: 'weather', name: 'Weather Simulator', category: 'Accessories', icon: '🌤️' },
  { id: 'screencap', name: 'Screen Capture', category: 'Accessories', icon: '📸' },
  { id: 'password', name: 'Password Generator', category: 'Accessories', icon: '🔐' },
  { id: 'help', name: 'Help Center', category: 'Accessories', icon: '❓' },
  { id: 'welcome', name: 'Welcome Center', category: 'Accessories', icon: '🌟' },
  { id: 'store', name: 'NOVA Cyber Store', category: 'Accessories', icon: '🛍️' },
  { id: 'control-panel', name: 'Control Panel', category: 'Settings', icon: '⚙️' },
  { id: 'terminal', name: 'Command Prompt', category: 'System', icon: '📟' },
  { id: 'run', name: 'Run...', category: 'System', icon: '🏃' },
  { id: 'admin-panel', name: 'Admin Panel [Classified]', category: 'Mystery', icon: '🔑' },
  { id: 'black-window', name: 'Black Window', category: 'Mystery', icon: '⬛' },
];

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindows();
  const { playClick, playMenuHover, playMenuOpen } = useSound();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeProgramsCat, setActiveProgramsCat] = useState<string | null>(null);
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      playMenuOpen();
      setSearchQuery('');
      setActiveSubmenu(null);
      setActiveProgramsCat(null);
    }
  }, [isOpen, playMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAppLaunch = useCallback((appId: string, title?: string, icon?: string) => {
    playClick();
    openWindow({ component: appId, title: title || appId, icon });
    setActiveSubmenu(null);
    setActiveProgramsCat(null);
    onClose();
  }, [openWindow, onClose, playClick]);

  if (!isOpen && !showShutdownModal) return null;

  const filteredApps = searchQuery.trim() ? ALL_APPS.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Start Menu"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: 0,
            width: '270px',
            backgroundColor: '#c0c0c0',
            border: '2px outset #ffffff',
            display: 'flex',
            flexDirection: 'row',
            zIndex: 99999,
            fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif',
            fontSize: '11px',
            boxShadow: '3px 3px 8px rgba(0,0,0,0.5)',
            userSelect: 'none',
            boxSizing: 'border-box'
          }}
          className="start-menu animate-start-menu-open"
        >
          {/* Vertical Blue Stripe Banner */}
          <div
            style={{
              width: '28px',
              background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '10px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <div 
              style={{ 
                color: '#ffffff', 
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap', 
                fontWeight: 'bold', 
                fontSize: '14px', 
                letterSpacing: '2px',
                fontFamily: '"Arial Black", Arial, sans-serif'
              }}
            >
              NOVA <span style={{ fontWeight: 'normal', color: '#ffd700' }}>30</span> OS
            </div>
          </div>

          {/* Main Menu Body */}
          <div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column' }}>
            {/* Search Box */}
            <div style={{ marginBottom: '6px', borderBottom: '1px solid #808080', paddingBottom: '4px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NOVA 30 OS..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  border: '2px inset #ffffff',
                  boxSizing: 'border-box',
                  fontSize: '11px'
                }}
              />
            </div>

            {/* Live Search Results View */}
            {searchQuery.trim() ? (
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div style={{ color: '#555', fontSize: '10px', padding: '2px 4px' }}>Matching Items:</div>
                {filteredApps.length === 0 ? (
                  <div style={{ padding: '8px', color: '#888', fontStyle: 'italic' }}>No matching applications found.</div>
                ) : (
                  filteredApps.map(a => (
                    <MenuItem
                      key={a.id}
                      label={a.name}
                      icon={a.icon}
                      onClick={() => handleAppLaunch(a.id, a.name, a.icon)}
                    />
                  ))
                )}
              </div>
            ) : (
              /* Standard Categorized Start Menu */
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 1. PROGRAMS with Flyout Categories */}
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => { setActiveSubmenu('programs'); playMenuHover(); }}
                >
                  <MenuItem label="Programs" icon="📁" hasSubmenu isHovered={activeSubmenu === 'programs'} />
                  {activeSubmenu === 'programs' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: 0,
                        width: '190px',
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #ffffff',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                        padding: '2px',
                        zIndex: 100000
                      }}
                      onMouseLeave={() => { setActiveSubmenu(null); setActiveProgramsCat(null); }}
                    >
                      {[
                        { cat: 'internet', label: 'Internet', icon: '🌐' },
                        { cat: 'office', label: 'Office', icon: '💼' },
                        { cat: 'graphics', label: 'Graphics', icon: '🎨' },
                        { cat: 'multimedia', label: 'Multimedia', icon: '🎵' },
                        { cat: 'games', label: 'Games', icon: '🎮' },
                        { cat: 'systools', label: 'System Tools', icon: '🧰' },
                        { cat: 'accessories', label: 'Accessories', icon: '⏰' },
                        { cat: 'mystery', label: 'Mystery [Classified]', icon: '🔑' },
                      ].map(p => (
                        <div
                          key={p.cat}
                          style={{ position: 'relative' }}
                          onMouseEnter={() => { setActiveProgramsCat(p.cat); playMenuHover(); }}
                        >
                          <MenuItem label={p.label} icon={p.icon} hasSubmenu isHovered={activeProgramsCat === p.cat} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Level 3: Specific category items */}
                  {activeSubmenu === 'programs' && activeProgramsCat && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 'calc(100% + 190px)',
                        top: getCategoryTopOffset(activeProgramsCat),
                        width: '180px',
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #ffffff',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                        padding: '2px',
                        zIndex: 100001,
                        maxHeight: '340px',
                        overflowY: 'auto'
                      }}
                      onMouseLeave={() => setActiveProgramsCat(null)}
                    >
                      {activeProgramsCat === 'internet' && (
                        <>
                          <MenuItem label="NOVA Explorer" icon="🌐" onClick={() => handleAppLaunch('internet', 'NOVA Explorer', '🌐')} />
                          <MenuItem label="NOVA Mail" icon="✉️" onClick={() => handleAppLaunch('mail', 'NOVA Mail', '✉️')} />
                        </>
                      )}
                      {activeProgramsCat === 'office' && (
                        <>
                          <MenuItem label="Notepad" icon="📝" onClick={() => handleAppLaunch('notepad', 'Notepad', '📝')} />
                          <MenuItem label="NOVA Writer 98" icon="📄" onClick={() => handleAppLaunch('writer', 'NOVA Writer 98', '📄')} />
                          <MenuItem label="Calculator" icon="🧮" onClick={() => handleAppLaunch('calculator', 'Calculator', '🧮')} />
                          <MenuItem label="Address Book" icon="📇" onClick={() => handleAppLaunch('contacts', 'Address Book', '📇')} />
                        </>
                      )}
                      {activeProgramsCat === 'graphics' && (
                        <>
                          <MenuItem label="Paint" icon="🎨" onClick={() => handleAppLaunch('paint', 'Paint', '🎨')} />
                          <MenuItem label="NOVA Vision" icon="🖼️" onClick={() => handleAppLaunch('imageviewer', 'NOVA Vision Image Viewer', '🖼️')} />
                          <MenuItem label="Color Lab" icon="🎨" onClick={() => handleAppLaunch('colorlab', 'Color Lab', '🎨')} />
                        </>
                      )}
                      {activeProgramsCat === 'multimedia' && (
                        <>
                          <MenuItem label="NOVA Player" icon="🎵" onClick={() => handleAppLaunch('music', 'NOVA Player', '🎵')} />
                          <MenuItem label="Media Center" icon="📼" onClick={() => handleAppLaunch('mediacenter', 'Media Center', '📼')} />
                        </>
                      )}
                      {activeProgramsCat === 'games' && (
                        <>
                          <MenuItem label="Games Directory" icon="🎮" onClick={() => handleAppLaunch('games', 'Games', '🎮')} />
                          <MenuItem label="Cyber Snake" icon="🐍" onClick={() => handleAppLaunch('snake', 'Cyber Snake', '🐍')} />
                          <MenuItem label="Neon Breakout" icon="🧱" onClick={() => handleAppLaunch('breakout', 'Neon Breakout', '🧱')} />
                          <MenuItem label="Asteroids Vector" icon="🛸" onClick={() => handleAppLaunch('asteroids', 'Asteroids Vector', '🛸')} />
                          <MenuItem label="Terminal Hacker" icon="📟" onClick={() => handleAppLaunch('terminal-hacker', 'Terminal Hacker', '📟')} />
                          <MenuItem label="Memory Matrix" icon="🧠" onClick={() => handleAppLaunch('memory-matrix', 'Memory Matrix', '🧠')} />
                          <MenuItem label="2048 NOVA" icon="🔢" onClick={() => handleAppLaunch('game-2048', '2048 NOVA', '🔢')} />
                          <MenuItem label="Word Terminal" icon="🔤" onClick={() => handleAppLaunch('word-terminal', 'Word Terminal', '🔤')} />
                          <MenuItem label="Digital Pet" icon="🐾" onClick={() => handleAppLaunch('digital-pet', 'Digital Pet', '🐾')} />
                          <MenuItem label="Glitch Runner" icon="🏃" onClick={() => handleAppLaunch('glitch-runner', 'Glitch Runner', '🏃')} />
                          <MenuItem label="Minesweeper" icon="💣" onClick={() => handleAppLaunch('minesweeper', 'Minesweeper', '💣')} />
                          <MenuItem label="Solitaire 98" icon="🃏" onClick={() => handleAppLaunch('solitaire', 'Solitaire 98', '🃏')} />
                        </>
                      )}
                      {activeProgramsCat === 'systools' && (
                        <>
                          <MenuItem label="Task Manager" icon="📊" onClick={() => handleAppLaunch('task-manager', 'Task Manager', '📊')} />
                          <MenuItem label="System Information" icon="🖥️" onClick={() => handleAppLaunch('sysinfo', 'System Information', '🖥️')} />
                          <MenuItem label="Disk Manager" icon="💽" onClick={() => handleAppLaunch('disk', 'Disk Manager', '💽')} />
                          <MenuItem label="System Monitor" icon="📈" onClick={() => handleAppLaunch('sysmon', 'System Monitor', '📈')} />
                          <MenuItem label="Network Center" icon="📡" onClick={() => handleAppLaunch('network', 'Network Center', '📡')} />
                          <MenuItem label="NOVA ZIP" icon="🗜️" onClick={() => handleAppLaunch('zip', 'NOVA ZIP', '🗜️')} />
                        </>
                      )}
                      {activeProgramsCat === 'accessories' && (
                        <>
                          <MenuItem label="Calendar" icon="📅" onClick={() => handleAppLaunch('calendar', 'Calendar', '📅')} />
                          <MenuItem label="Clock" icon="⏰" onClick={() => handleAppLaunch('clock', 'Clock & Alarms', '⏰')} />
                          <MenuItem label="Weather Simulator" icon="🌤️" onClick={() => handleAppLaunch('weather', 'Weather Simulator', '🌤️')} />
                          <MenuItem label="Screen Capture" icon="📸" onClick={() => handleAppLaunch('screencap', 'Screen Capture', '📸')} />
                          <MenuItem label="Password Generator" icon="🔐" onClick={() => handleAppLaunch('password', 'Password Generator', '🔐')} />
                        </>
                      )}
                      {activeProgramsCat === 'mystery' && (
                        <>
                          <MenuItem label="Admin Panel" icon="🔑" onClick={() => handleAppLaunch('admin-panel', 'Admin Panel', '🔑')} />
                          <MenuItem label="Black Window" icon="⬛" onClick={() => handleAppLaunch('black-window', 'Black Window', '⬛')} />
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. DOCUMENTS with Submenu */}
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => { setActiveSubmenu('documents'); setActiveProgramsCat(null); playMenuHover(); }}
                >
                  <MenuItem label="Documents" icon="📑" hasSubmenu isHovered={activeSubmenu === 'documents'} />
                  {activeSubmenu === 'documents' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: 0,
                        width: '180px',
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #ffffff',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                        padding: '2px',
                        zIndex: 100000
                      }}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <MenuItem label="My Documents" icon="📁" onClick={() => handleAppLaunch('files', 'My Documents', '📁')} />
                      <MenuItem label="Downloads" icon="💾" onClick={() => handleAppLaunch('files', 'Downloads', '💾')} />
                      <MenuItem label="readme.txt" icon="📄" onClick={() => handleAppLaunch('notepad', 'readme.txt', '📝')} />
                      <MenuItem label="notes.txt" icon="📄" onClick={() => handleAppLaunch('notepad', 'notes.txt', '📝')} />
                    </div>
                  )}
                </div>

                {/* 3. SETTINGS with Submenu */}
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => { setActiveSubmenu('settings'); setActiveProgramsCat(null); playMenuHover(); }}
                >
                  <MenuItem label="Settings" icon="⚙️" hasSubmenu isHovered={activeSubmenu === 'settings'} />
                  {activeSubmenu === 'settings' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: 0,
                        width: '180px',
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #ffffff',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                        padding: '2px',
                        zIndex: 100000
                      }}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <MenuItem label="Control Panel" icon="⚙️" onClick={() => handleAppLaunch('control-panel', 'Control Panel', '⚙️')} />
                      <MenuItem label="Accessibility" icon="♿" onClick={() => handleAppLaunch('control-panel', 'Accessibility Center', '♿')} />
                      <MenuItem label="Cyber Store & Themes" icon="🛍️" onClick={() => handleAppLaunch('store', 'NOVA Cyber Store', '🛍️')} />
                    </div>
                  )}
                </div>

                {/* 4. SYSTEM with Submenu */}
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => { setActiveSubmenu('system'); setActiveProgramsCat(null); playMenuHover(); }}
                >
                  <MenuItem label="System" icon="🖥️" hasSubmenu isHovered={activeSubmenu === 'system'} />
                  {activeSubmenu === 'system' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: 0,
                        width: '180px',
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #ffffff',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                        padding: '2px',
                        zIndex: 100000
                      }}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <MenuItem label="Task Manager" icon="📊" onClick={() => handleAppLaunch('task-manager', 'Task Manager', '📊')} />
                      <MenuItem label="System Info" icon="🖥️" onClick={() => handleAppLaunch('sysinfo', 'System Information', '🖥️')} />
                      <MenuItem label="Command Prompt" icon="📟" onClick={() => handleAppLaunch('terminal', 'Terminal', '📟')} />
                      <MenuItem label="Run..." icon="🏃" onClick={() => handleAppLaunch('run', 'Run', '🏃')} />
                    </div>
                  )}
                </div>

                {/* Direct quick launches */}
                <div style={{ height: '1px', backgroundColor: '#808080', borderBottom: '1px solid #ffffff', margin: '3px 2px' }} />

                <MenuItem label="Help Center" icon="❓" onClick={() => handleAppLaunch('help', 'Help Center', '❓')} />
                <MenuItem label="Welcome Tour" icon="🌟" onClick={() => handleAppLaunch('welcome', 'Welcome Center', '🌟')} />
                <MenuItem label="Cyber Store" icon="🛍️" onClick={() => handleAppLaunch('store', 'NOVA Cyber Store', '🛍️')} />
                <MenuItem label="Run..." icon="🏃" onClick={() => handleAppLaunch('run', 'Run', '🏃')} />

                <div style={{ height: '1px', backgroundColor: '#808080', borderBottom: '1px solid #ffffff', margin: '3px 2px' }} />

                {/* Shutdown */}
                <MenuItem 
                  label="Shut Down..." 
                  icon="🔌" 
                  onClick={() => {
                    playClick();
                    onClose();
                    setShowShutdownModal(true);
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shutdown confirmation dialog */}
      {showShutdownModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
        >
          <div 
            style={{
              backgroundColor: '#c0c0c0',
              border: '2px outset #ffffff',
              padding: '16px',
              width: '320px',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.5)',
              fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif',
              fontSize: '12px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🔌</span>
              Shut Down NOVA 30 OS
            </div>
            <p style={{ margin: '0 0 16px 0' }}>Are you sure you want to exit your current computing session?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                className="retro-button"
                onClick={() => { window.location.reload(); }}
                style={{ padding: '4px 14px', fontWeight: 'bold' }}
              >
                Restart
              </button>
              <button 
                className="retro-button"
                onClick={() => setShowShutdownModal(false)}
                style={{ padding: '4px 14px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function getCategoryTopOffset(cat: string): string {
  switch (cat) {
    case 'internet': return '0px';
    case 'office': return '24px';
    case 'graphics': return '48px';
    case 'multimedia': return '72px';
    case 'games': return '96px';
    case 'systools': return '120px';
    case 'accessories': return '144px';
    case 'mystery': return '168px';
    default: return '0px';
  }
}

interface MenuItemProps {
  label: string;
  icon: string;
  onClick?: () => void;
  hasSubmenu?: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  onClick,
  hasSubmenu,
  isHovered,
  onMouseEnter,
}) => {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        cursor: 'pointer',
        backgroundColor: isHovered ? '#000080' : 'transparent',
        color: isHovered ? '#ffffff' : '#000000',
        borderRadius: '1px',
        position: 'relative'
      }}
      className="start-menu-item"
    >
      <span style={{ marginRight: '8px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{label}</span>
      {hasSubmenu && (
        <span style={{ marginLeft: '4px', fontSize: '9px' }}>▶</span>
      )}
    </div>
  );
};

export default StartMenu;

