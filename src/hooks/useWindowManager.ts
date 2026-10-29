import { useState, useCallback, useRef } from 'react';
import type { WindowState } from '../types';
import { mysteryEngine } from '../mystery/mysteryEngine';

const DEFAULT_APPS: Record<string, { title: string; icon: string; width: number; height: number }> = {
  'my-computer': { title: 'My Computer', icon: '💻', width: 600, height: 420 },
  'internet': { title: 'NOVA Explorer', icon: '🌐', width: 750, height: 520 },
  'games': { title: 'Games', icon: '🎮', width: 480, height: 400 },
  'music': { title: 'NOVA Player', icon: '🎵', width: 450, height: 500 },
  'terminal': { title: 'Terminal', icon: '📟', width: 640, height: 440 },
  'notepad': { title: 'Notepad', icon: '📝', width: 560, height: 420 },
  'paint': { title: 'Paint', icon: '🎨', width: 700, height: 520 },
  'files': { title: 'File Explorer - C:\\', icon: '📁', width: 620, height: 440 },
  'trash': { title: 'Recycle Bin', icon: '🗑️', width: 500, height: 360 },
  'about': { title: 'About NOVA 30 OS', icon: 'ℹ️', width: 440, height: 380 },
  'control-panel': { title: 'Control Panel', icon: '⚙️', width: 680, height: 500 },
  'calculator': { title: 'Calculator', icon: '🧮', width: 320, height: 380 },
  'task-manager': { title: 'Task Manager', icon: '📊', width: 460, height: 380 },
  'black-window': { title: 'BLACK WINDOW', icon: '⬛', width: 520, height: 380 },
  'admin-panel': { title: 'NOVA Admin Panel', icon: '🔑', width: 520, height: 400 },
  'run': { title: 'Run', icon: '🏃', width: 400, height: 180 },
  'calendar': { title: 'Calendar', icon: '📅', width: 560, height: 420 },
  'clock': { title: 'Clock', icon: '⏰', width: 420, height: 380 },
  'weather': { title: 'Weather Simulator', icon: '🌤️', width: 480, height: 390 },
  'contacts': { title: 'Address Book', icon: '📇', width: 520, height: 400 },
  'mail': { title: 'NOVA Mail', icon: '✉️', width: 680, height: 480 },
  'writer': { title: 'NOVA Writer', icon: '📄', width: 680, height: 500 },
  'zip': { title: 'NOVA ZIP', icon: '🗜️', width: 520, height: 380 },
  'sysinfo': { title: 'System Information', icon: '🖥️', width: 540, height: 400 },
  'disk': { title: 'Disk Manager', icon: '💽', width: 540, height: 420 },
  'imageviewer': { title: 'NOVA Vision Image Viewer', icon: '🖼️', width: 560, height: 440 },
  'mediacenter': { title: 'Media Center', icon: '📼', width: 560, height: 420 },
  'screencap': { title: 'Screen Capture', icon: '📸', width: 500, height: 380 },
  'colorlab': { title: 'Color Lab', icon: '🎨', width: 420, height: 380 },
  'password': { title: 'Password Generator', icon: '🔐', width: 440, height: 380 },
  'sysmon': { title: 'System Monitor', icon: '📈', width: 500, height: 360 },
  'network': { title: 'Network Center', icon: '📡', width: 500, height: 380 },
  'help': { title: 'NOVA Help Center', icon: '❓', width: 580, height: 440 },
  'welcome': { title: 'Welcome to NOVA 30 OS', icon: '🌟', width: 520, height: 360 },
  'store': { title: 'NOVA Cyber Store', icon: '🛍️', width: 520, height: 420 },
  'breakout': { title: 'Neon Breakout', icon: '🧱', width: 510, height: 460 },
  'asteroids': { title: 'Asteroids Vector', icon: '🛸', width: 520, height: 460 },
  'snake': { title: 'Cyber Snake', icon: '🐍', width: 460, height: 520 },
  'minesweeper': { title: 'Minesweeper', icon: '💣', width: 360, height: 440 },
  'pong': { title: 'Pong Arena', icon: '🏓', width: 540, height: 440 },
  'space-invaders': { title: 'Space Invaders', icon: '🚀', width: 540, height: 540 },
  'tic-tac-toe': { title: 'Tic-Tac-Toe', icon: '❌', width: 380, height: 440 },
  'solitaire': { title: 'Solitaire 98', icon: '🃏', width: 740, height: 560 },
  'terminal-hacker': { title: 'Terminal Hacker', icon: '📟', width: 520, height: 400 },
  'memory-matrix': { title: 'Memory Matrix', icon: '🧠', width: 460, height: 440 },
  'game-2048': { title: '2048 NOVA', icon: '🔢', width: 380, height: 480 },
  'word-terminal': { title: 'Word Terminal', icon: '🔤', width: 480, height: 420 },
  'digital-pet': { title: 'Digital Pet', icon: '🐾', width: 380, height: 420 },
  'glitch-runner': { title: 'Glitch Runner', icon: '🏃', width: 480, height: 380 },
};


export type OpenWindowArg = string | (Partial<WindowState> & { component: string; title?: string });

export interface WindowManagerReturn {
  windows: WindowState[];
  openWindow: (arg: OpenWindowArg, extraProps?: Record<string, any>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  getTopZIndex: () => number;
  cycleWindows: () => void;
  closeActiveWindow: () => void;
  getActiveWindow: () => WindowState | undefined;
}

export function useWindowManager(): WindowManagerReturn {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zIndexCounter = useRef(100);
  const cascadeOffset = useRef(0);

  const getTopZIndex = useCallback(() => {
    zIndexCounter.current += 1;
    return zIndexCounter.current;
  }, []);

  const focusWindow = useCallback((id: string) => {
    const topZ = getTopZIndex();
    setWindows(prev => 
      prev.map(w => ({
        ...w,
        isFocused: w.id === id,
        isMinimized: w.id === id ? false : w.isMinimized,
        zIndex: w.id === id ? topZ : w.zIndex
      }))
    );
  }, [getTopZIndex]);

  const openWindow = useCallback((arg: OpenWindowArg, extraProps?: Record<string, any>) => {
    let config: Partial<WindowState> & { component: string; title: string; icon?: string };

    if (typeof arg === 'string') {
      const def = DEFAULT_APPS[arg] || { title: arg, icon: '🗂️', width: 500, height: 350 };
      config = {
        component: arg,
        title: def.title,
        icon: def.icon,
        width: def.width,
        height: def.height,
        props: extraProps
      };
    } else {
      const def = DEFAULT_APPS[arg.component];
      config = {
        title: arg.title || def?.title || arg.component,
        icon: arg.icon || def?.icon || '🗂️',
        width: arg.width || def?.width || 500,
        height: arg.height || def?.height || 350,
        ...arg,
        props: { ...(arg.props || {}), ...(extraProps || {}) }
      };
    }

    // Check if a window with this component is already open (for single-instance style like Control Panel or Settings)
    // If so, restore and focus it
    mysteryEngine.recordAppOpen(config.component);
    const existing = windows.find(w => w.component === config.component && !config.id);
    if (existing) {
      focusWindow(existing.id);
      return existing.id;
    }

    const id = config.id || `win-${config.component}-${Date.now()}`;
    const topZ = getTopZIndex();
    
    // Position cascade
    const offset = (cascadeOffset.current % 8) * 28;
    cascadeOffset.current += 1;

    // Viewport responsive positioning
    const maxInitialLeft = Math.max(10, (window.innerWidth || 800) - (config.width || 500) - 40);
    const maxInitialTop = Math.max(10, (window.innerHeight || 600) - (config.height || 350) - 70);
    const initialX = config.x ?? Math.min(40 + offset, maxInitialLeft);
    const initialY = config.y ?? Math.min(40 + offset, maxInitialTop);
    
    const newWindow: WindowState = {
      id,
      component: config.component,
      title: config.title,
      icon: config.icon || '🗂️',
      x: initialX,
      y: initialY,
      width: Math.min(config.width || 500, window.innerWidth ? window.innerWidth - 20 : 800),
      height: Math.min(config.height || 350, window.innerHeight ? window.innerHeight - 80 : 500),
      minWidth: config.minWidth || 280,
      minHeight: config.minHeight || 200,
      isMinimized: false,
      isMaximized: Boolean(config.isMaximized),
      zIndex: topZ,
      isFocused: true,
      props: config.props
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, isFocused: false })),
      newWindow
    ]);

    return id;
  }, [windows, getTopZIndex, focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const filtered = prev.filter(w => w.id !== id);
      if (filtered.length > 0) {
        const topWindow = [...filtered].sort((a, b) => b.zIndex - a.zIndex)[0];
        return filtered.map(w => ({
          ...w,
          isFocused: w.id === topWindow.id
        }));
      }
      return filtered;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, isMinimized: true, isFocused: false } : w);
      // Focus next top visible window
      const visible = updated.filter(w => !w.isMinimized);
      if (visible.length > 0) {
        const top = [...visible].sort((a, b) => b.zIndex - a.zIndex)[0];
        return updated.map(w => ({ ...w, isFocused: w.id === top.id }));
      }
      return updated;
    });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w));
    focusWindow(id);
  }, [focusWindow]);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w));
    focusWindow(id);
  }, [focusWindow]);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    // Keep window within reasonable screen bounds
    const boundedX = Math.max(-200, Math.min(window.innerWidth - 80, x));
    const boundedY = Math.max(0, Math.min(window.innerHeight - 60, y));
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x: boundedX, y: boundedY } : w));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      return { 
        ...w, 
        width: Math.max(w.minWidth || 260, width), 
        height: Math.max(w.minHeight || 180, height) 
      };
    }));
  }, []);

  const getActiveWindow = useCallback(() => {
    return windows.find(w => w.isFocused && !w.isMinimized);
  }, [windows]);

  const cycleWindows = useCallback(() => {
    setWindows(prev => {
      const activeWindows = prev.filter(w => !w.isMinimized);
      if (activeWindows.length <= 1) return prev;
      
      const sortedByZ = [...activeWindows].sort((a, b) => b.zIndex - a.zIndex);
      // Bring the second one to front
      const nextFocus = sortedByZ[1]; 
      
      const topZ = getTopZIndex();
      return prev.map(w => ({
        ...w,
        isFocused: w.id === nextFocus.id,
        zIndex: w.id === nextFocus.id ? topZ : w.zIndex
      }));
    });
  }, [getTopZIndex]);

  const closeActiveWindow = useCallback(() => {
    const active = getActiveWindow();
    if (active) {
      closeWindow(active.id);
    }
  }, [getActiveWindow, closeWindow]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    getTopZIndex,
    cycleWindows,
    closeActiveWindow,
    getActiveWindow
  };
}
