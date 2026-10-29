import React, { Suspense } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import Window from './Window';

const FileExplorer = React.lazy(() => import('../../apps/FileExplorer/FileExplorer'));

const APP_COMPONENTS: Record<string, React.LazyExoticComponent<any>> = {
  'my-computer': FileExplorer,
  'internet': React.lazy(() => import('../../apps/Browser/Browser')),
  'games': React.lazy(() => import('../../apps/Games/GamesFolder')),
  'music': React.lazy(() => import('../../apps/MusicPlayer/MusicPlayer')),
  'terminal': React.lazy(() => import('../../apps/Terminal/Terminal')),
  'notepad': React.lazy(() => import('../../apps/Notepad/Notepad')),
  'paint': React.lazy(() => import('../../apps/Paint/Paint')),
  'files': FileExplorer,
  'trash': React.lazy(() => import('../../apps/RecycleBin/RecycleBin')),
  'about': React.lazy(() => import('../../apps/About/About')),
  'control-panel': React.lazy(() => import('../../apps/ControlPanel/ControlPanel')),
  'calculator': React.lazy(() => import('../../apps/Calculator/Calculator')),
  'task-manager': React.lazy(() => import('../../apps/TaskManager/TaskManager')),
  'black-window': React.lazy(() => import('../../apps/BlackWindow/BlackWindow')),
  'admin-panel': React.lazy(() => import('../../apps/Admin/AdminPanel')),
  'run': React.lazy(() => import('../../apps/Run/RunDialog')),
  'calendar': React.lazy(() => import('../../apps/Calendar/Calendar')),
  'clock': React.lazy(() => import('../../apps/Clock/ClockApp')),
  'weather': React.lazy(() => import('../../apps/Weather/Weather')),
  'contacts': React.lazy(() => import('../../apps/Contacts/Contacts')),
  'mail': React.lazy(() => import('../../apps/Mail/NovaMail')),
  'writer': React.lazy(() => import('../../apps/Writer/NovaWriter')),
  'zip': React.lazy(() => import('../../apps/Zip/NovaZip')),
  'sysinfo': React.lazy(() => import('../../apps/SystemInfo/SystemInfo')),
  'disk': React.lazy(() => import('../../apps/DiskManager/DiskManager')),
  'imageviewer': React.lazy(() => import('../../apps/ImageViewer/ImageViewer')),
  'mediacenter': React.lazy(() => import('../../apps/MediaCenter/MediaCenter')),
  'screencap': React.lazy(() => import('../../apps/ScreenCapture/ScreenCapture')),
  'colorlab': React.lazy(() => import('../../apps/ColorLab/ColorLab')),
  'password': React.lazy(() => import('../../apps/PasswordGen/PasswordGen')),
  'sysmon': React.lazy(() => import('../../apps/SystemMonitor/SystemMonitor')),
  'network': React.lazy(() => import('../../apps/NetworkCenter/NetworkCenter')),
  'help': React.lazy(() => import('../../apps/HelpCenter/HelpCenter')),
  'welcome': React.lazy(() => import('../../apps/Welcome/WelcomeCenter')),
  'store': React.lazy(() => import('../../apps/Store/NovaStore')),
  'breakout': React.lazy(() => import('../../apps/Games/Breakout/Breakout')),
  'asteroids': React.lazy(() => import('../../apps/Games/Asteroids/Asteroids')),
  'snake': React.lazy(() => import('../../apps/Games/Snake/Snake')),
  'minesweeper': React.lazy(() => import('../../apps/Games/Minesweeper/Minesweeper')),
  'pong': React.lazy(() => import('../../apps/Games/Pong/Pong')),
  'space-invaders': React.lazy(() => import('../../apps/Games/SpaceInvaders/SpaceInvaders')),
  'tic-tac-toe': React.lazy(() => import('../../apps/Games/TicTacToe/TicTacToe')),
  'solitaire': React.lazy(() => import('../../apps/Games/Solitaire/Solitaire')),
  'terminal-hacker': React.lazy(() => import('../../apps/Games/TerminalHacker/TerminalHacker')),
  'memory-matrix': React.lazy(() => import('../../apps/Games/MemoryMatrix/MemoryMatrix')),
  'game-2048': React.lazy(() => import('../../apps/Games/Game2048/Game2048')),
  'word-terminal': React.lazy(() => import('../../apps/Games/WordTerminal/WordTerminal')),
  'digital-pet': React.lazy(() => import('../../apps/Games/DigitalPet/DigitalPet')),
  'glitch-runner': React.lazy(() => import('../../apps/Games/GlitchRunner/GlitchRunner')),
};


export default function WindowManager() {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow } = useWindows();

  return (
    <>
      {windows.map(win => {
        const App = APP_COMPONENTS[win.component];
        if (!App) return null;
        return (
          <Window
            key={win.id}
            windowState={win}
            icon={win.icon}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            onResize={(w, h) => resizeWindow(win.id, w, h)}
          >
            <Suspense fallback={
              <div style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'monospace'
              }}>
                <span>⌛</span> Loading {win.title}...
              </div>
            }>
              <App {...(win.props || {})} />
            </Suspense>
          </Window>
        );
      })}
    </>
  );
}
