export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string; // component key like 'terminal', 'notepad' etc
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  props?: Record<string, any>;
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: string; // emoji or SVG path
  action: string; // component to open
  x: number;
  y: number;
}

export interface FileSystemNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileSystemNode[];
  content?: string;
  icon?: string;
}

export interface NovaSettings {
  wallpaper: string;
  theme: 'classic' | 'dark' | 'highcontrast';
  soundEnabled: boolean;
  soundVolume: number;
  crtEnabled: boolean;
  glitchEnabled: boolean;
  reducedMotion: boolean;
  largerText: boolean;
  disableBlinking: boolean;
  clockFormat: '12h' | '24h';
  cursorStyle: 'default' | 'retro' | 'crosshair';
}

export interface StartMenuItem {
  id: string;
  label: string;
  icon: string;
  action?: string;
  children?: StartMenuItem[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  icon?: string;
}
