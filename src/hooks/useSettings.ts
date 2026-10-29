import { useState, useCallback } from 'react';
import { NovaSettings } from '../types';

export const DEFAULT_SETTINGS: NovaSettings = {
  wallpaper: 'teal',
  theme: 'classic',
  soundEnabled: true,
  soundVolume: 0.3,
  crtEnabled: true,
  glitchEnabled: true,
  reducedMotion: false,
  largerText: false,
  disableBlinking: false,
  clockFormat: '12h',
  cursorStyle: 'default',
};

export function useSettings() {
  const [settings, setSettingsState] = useState<NovaSettings>(() => {
    try {
      const item = window.localStorage.getItem('novaSettings');
      return item ? { ...DEFAULT_SETTINGS, ...JSON.parse(item) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = useCallback((partial: Partial<NovaSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...partial };
      try {
        window.localStorage.setItem('novaSettings', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save settings:', e);
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    try {
      window.localStorage.setItem('novaSettings', JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Failed to reset settings:', e);
    }
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings
  };
}
