import React, { createContext, useContext } from 'react';
import { useSettings as useSettingsHook } from '../hooks/useSettings';
import { NovaSettings } from '../types';

export interface SettingsContextType {
  settings: NovaSettings;
  updateSettings: (partial: Partial<NovaSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsManager = useSettingsHook();
  return (
    <SettingsContext.Provider value={settingsManager}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsContext must be used within SettingsProvider');
  return context;
}
