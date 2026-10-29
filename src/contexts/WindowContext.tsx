import React, { createContext, useContext } from 'react';
import { useWindowManager, WindowManagerReturn } from '../hooks/useWindowManager';

type WindowContextType = WindowManagerReturn;

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const windowManager = useWindowManager();
  return (
    <WindowContext.Provider value={windowManager}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows(): WindowContextType {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindows must be used within WindowProvider');
  return context;
}
