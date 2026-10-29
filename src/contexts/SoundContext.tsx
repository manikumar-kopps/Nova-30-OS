import React, { createContext, useEffect, useCallback, ReactNode } from 'react';
import { useSettingsContext } from './SettingsContext';
import { soundManager, SoundManager } from '../utils/sounds';

interface SoundContextType {
  soundManager: SoundManager;
  playClick: () => void;
  playDoubleClick: () => void;
  playWindowOpen: () => void;
  playWindowClose: () => void;
  playError: () => void;
  playNotification: () => void;
  playStartup: () => void;
  playShutdown: () => void;
  playKeypress: () => void;
  playMenuOpen: () => void;
  playMenuHover: () => void;
  playGameSound: (type: 'eat' | 'die' | 'shoot' | 'hit' | 'win' | 'lose') => void;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  volume: number;
  setVolume: (val: number) => void;
}

export const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettingsContext();

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  useEffect(() => {
    const handleInteraction = () => {
      soundManager.init();
    };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const playClick = useCallback(() => soundManager.playClick(), []);
  const playDoubleClick = useCallback(() => soundManager.playDoubleClick(), []);
  const playWindowOpen = useCallback(() => soundManager.playWindowOpen(), []);
  const playWindowClose = useCallback(() => soundManager.playWindowClose(), []);
  const playError = useCallback(() => soundManager.playError(), []);
  const playNotification = useCallback(() => soundManager.playNotification(), []);
  const playStartup = useCallback(() => soundManager.playStartup(), []);
  const playShutdown = useCallback(() => soundManager.playShutdown(), []);
  const playKeypress = useCallback(() => soundManager.playKeypress(), []);
  const playMenuOpen = useCallback(() => soundManager.playMenuOpen(), []);
  const playMenuHover = useCallback(() => soundManager.playMenuHover(), []);
  const playGameSound = useCallback((type: 'eat' | 'die' | 'shoot' | 'hit' | 'win' | 'lose') => soundManager.playGameSound(type), []);

  const setEnabled = useCallback((val: boolean) => {
    updateSettings({ soundEnabled: val });
  }, [updateSettings]);

  const setVolume = useCallback((val: number) => {
    updateSettings({ soundVolume: val });
  }, [updateSettings]);

  const value: SoundContextType = {
    soundManager,
    playClick,
    playDoubleClick,
    playWindowOpen,
    playWindowClose,
    playError,
    playNotification,
    playStartup,
    playShutdown,
    playKeypress,
    playMenuOpen,
    playMenuHover,
    playGameSound,
    enabled: settings.soundEnabled,
    setEnabled,
    volume: settings.soundVolume,
    setVolume
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}
