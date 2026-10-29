import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { SettingsProvider, useSettingsContext } from './contexts/SettingsContext';
import { SoundProvider } from './contexts/SoundContext';
import BootScreen from './components/BootScreen/BootScreen';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import WindowManager from './components/Window/WindowManager';
import Notification from './components/Notification/Notification';
import NovaBuddy from './components/Desktop/NovaBuddy';
import ScreenSaver from './components/ScreenSaver/ScreenSaver';
import { useWindows } from './contexts/WindowContext';
import { initKonamiCode } from './utils/easter-eggs';
import { Notification as NotificationType } from './types';
import './styles/retro.css';
import './styles/crt.css';
import './styles/animations.css';

function NovaOSContent() {
  const [booted, setBooted] = useState(() => {
    return sessionStorage.getItem('nova-booted') === 'true';
  });
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [blueScreen, setBlueScreen] = useState(false);
  const [screenSaverActive, setScreenSaverActive] = useState(false);
  const { settings } = useSettingsContext();
  const windowManager = useWindows();

  // Handle boot complete
  const handleBootComplete = useCallback(() => {
    setBooted(true);
    sessionStorage.setItem('nova-booted', 'true');
  }, []);

  // Toggle start menu
  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  // Close start menu
  const closeStartMenu = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Meta/Win key - toggle start menu
      if (e.key === 'Meta' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        toggleStartMenu();
        return;
      }

      // Alt+Tab - cycle windows
      if (e.key === 'Tab' && e.altKey) {
        e.preventDefault();
        windowManager.cycleWindows();
        return;
      }

      // Alt+F4 - close active window
      if (e.key === 'F4' && e.altKey) {
        e.preventDefault();
        windowManager.closeActiveWindow();
        return;
      }

      // F11 - toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        return;
      }

      // Ctrl+Alt+A - Accessibility Center
      if (e.key === 'a' && e.ctrlKey && e.altKey) {
        e.preventDefault();
        windowManager.openWindow({
          component: 'control-panel',
          title: 'Control Panel - Accessibility',
          icon: '♿',
          width: 700,
          height: 500,
          props: { initialSection: 'accessibility' },
        });
        return;
      }

      // Alt+R - Run dialog
      if ((e.key === 'r' || e.key === 'R') && e.altKey) {
        e.preventDefault();
        windowManager.openWindow('run');
        return;
      }

      // Escape - close start menu

      if (e.key === 'Escape' && startMenuOpen) {
        closeStartMenu();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startMenuOpen, toggleStartMenu, closeStartMenu, windowManager]);

  // Konami code easter egg
  useEffect(() => {
    const cleanup = initKonamiCode(() => {
      setNotification({
        id: 'konami',
        title: '🎮 Secret Unlocked!',
        message: 'You entered the Konami Code! You have unlocked the hidden developer room. Check the Terminal for the "devroom" command.',
        type: 'info',
      });
    });
    return cleanup;
  }, []);

  // Mystery system notification listener
  useEffect(() => {
    const handleMysteryNotify = (e: any) => {
      if (e.detail?.message) {
        setNotification({
          id: `mystery-${Date.now()}`,
          title: 'NOVA SYSTEM NOTICE',
          message: e.detail.message,
          type: 'info',
          icon: '🕵️',
        });
      }
    };
    window.addEventListener('nova-mystery-notify', handleMysteryNotify);
    return () => window.removeEventListener('nova-mystery-notify', handleMysteryNotify);
  }, []);

  // Random playful notifications & computer memory
  useEffect(() => {
    if (!booted) return;
    
    const messages = [
      { title: 'NOVA SYSTEM', message: 'Your activity has been detected. Continue if you wish.', type: 'warning' as const },
      { title: 'NOVA 30 OS', message: 'Warning: Unrouted signals detected on port 0707.', type: 'warning' as const },
      { title: 'NOVA 30 OS', message: 'Tip: Have you checked C:\\SYSTEM\\NOTHING or Task Manager?', type: 'info' as const },
      { title: 'System', message: 'Your virtual hard drive is 98% fictional.', type: 'info' as const },
      { title: 'Network', message: 'Dial-up connection established at 56kbps.', type: 'info' as const },
    ];

    const timer = setTimeout(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setNotification({
        id: `random-${Date.now()}`,
        ...msg,
      });
    }, 45000 + Math.random() * 90000);

    return () => clearTimeout(timer);
  }, [booted]);

  // Click outside start menu to close
  const handleDesktopClick = useCallback(() => {
    if (startMenuOpen) {
      closeStartMenu();
    }
  }, [startMenuOpen, closeStartMenu]);

  // Blue screen effect
  if (blueScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0000aa',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '20%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'none',
          zIndex: 999999,
        }}
        role="alert"
        aria-live="assertive"
        onClick={() => setBlueScreen(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setBlueScreen(false); }}
        tabIndex={0}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: '#aaaaaa', color: '#0000aa', padding: '2px 8px' }}>
            NOVA 30 OS
          </span>
        </div>
        <p>A fatal exception 0E has occurred at 0028:C0034B03 in VXD NOVA(01) +</p>
        <p>00010E36. The current application will be terminated.</p>
        <br />
        <p>* Press any key to terminate the current application.</p>
        <p>* Press CTRL+ALT+DEL to restart your computer. You will</p>
        <p>  lose any unsaved information in all applications.</p>
        <br />
        <p style={{ textAlign: 'center' }}>Press any key to continue _</p>
        <p style={{ marginTop: '2rem', fontSize: '10px', textAlign: 'center', opacity: 0.5 }}>
          (Just kidding! Click or press any key to go back)
        </p>
      </div>
    );
  }

  // Boot screen
  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  // Get wallpaper style
  const getWallpaperStyle = (): React.CSSProperties => {
    const raw = (settings.wallpaper || 'teal').toLowerCase().replace(/\s+/g, '');
    const wallpapers: Record<string, string> = {
      teal: '#008080',
      blue: '#000080',
      green: '#004000',
      purple: '#400040',
      sunset: 'linear-gradient(180deg, #ff6b35, #9b2335, #4a1a6b)',
      sunsetgradient: 'linear-gradient(180deg, #ff6b35, #9b2335, #4a1a6b)',
      matrix: '#001a00',
      stars: '#000022',
    };

    const value = wallpapers[raw] || '#008080';
    if (value.startsWith('linear-gradient') || value.startsWith('radial-gradient')) {
      return { background: value };
    }
    return { backgroundColor: value };
  };

  // Theme class
  const normalizedTheme = (settings.theme || 'classic').toLowerCase().replace(/\s+/g, '');
  const themeClass = normalizedTheme === 'dark' ? 'theme-dark' : 
                     (normalizedTheme === 'highcontrast' || normalizedTheme === 'highcontrastmode') ? 'theme-highcontrast' : '';

  // Cursor class
  const cursorClass = settings.cursorStyle === 'retro' ? 'cursor-retro' :
                      settings.cursorStyle === 'crosshair' ? 'cursor-crosshair' : '';

  // CRT/effects classes
  const effectClasses = [
    settings.crtEnabled ? 'crt-enabled' : '',
    settings.reducedMotion ? 'reduce-motion' : '',
    settings.largerText ? 'larger-text' : '',
    settings.disableBlinking ? 'no-blink' : '',
    themeClass,
    cursorClass,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`nova-os ${effectClasses}`}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        ...getWallpaperStyle(),
        fontFamily: "'MS Sans Serif', 'Microsoft Sans Serif', 'Segoe UI', Geneva, sans-serif",
        fontSize: settings.largerText ? '14px' : '11px',
      }}
      role="application"
      aria-label="NOVA 30 OS Desktop Environment"
    >
      {/* Stars wallpaper */}
      {settings.wallpaper === 'stars' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #ddd, transparent), radial-gradient(1px 1px at 130px 80px, #fff, transparent), radial-gradient(2px 2px at 160px 30px, #eee, transparent)',
            backgroundSize: '200px 100px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      {/* Matrix wallpaper */}
      {settings.wallpaper === 'matrix' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      {/* CRT Overlay */}
      {settings.crtEnabled && (
        <div className="crt-overlay" aria-hidden="true" />
      )}

      {/* Desktop area (clicking closes start menu) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          bottom: '32px', // leave room for taskbar
        }}
        onClick={handleDesktopClick}
        role="presentation"
      >
        <Desktop onStartScreenSaver={() => setScreenSaverActive(true)} />
        <Suspense fallback={
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontFamily: 'monospace',
          }}>
            Loading...
          </div>
        }>
          <WindowManager />
        </Suspense>
      </div>

      {/* Desktop Assistant Nova Buddy */}
      <NovaBuddy />

      {/* Start Menu */}
      <StartMenu isOpen={startMenuOpen} onClose={closeStartMenu} />

      {/* Taskbar */}
      <Taskbar
        onStartClick={toggleStartMenu}
        startMenuOpen={startMenuOpen}
      />

      {/* Screen Saver Simulator */}
      {screenSaverActive && (
        <ScreenSaver onDismiss={() => setScreenSaverActive(false)} />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          icon={notification.icon}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Accessibility skip link */}
      <a
        href="#main-desktop"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          const target = e.target as HTMLElement;
          target.style.left = '10px';
          target.style.top = '10px';
          target.style.width = 'auto';
          target.style.height = 'auto';
          target.style.overflow = 'visible';
          target.style.background = '#000080';
          target.style.color = '#ffffff';
          target.style.padding = '8px 16px';
          target.style.zIndex = '999999';
          target.style.fontSize = '14px';
        }}
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          target.style.left = '-9999px';
          target.style.width = '1px';
          target.style.height = '1px';
        }}
      >
        Skip to Desktop
      </a>

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        id="nova-live-region"
      />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <SoundProvider>
        <WindowProvider>
          <NovaOSContent />
        </WindowProvider>
      </SoundProvider>
    </SettingsProvider>
  );
}

export default App;
