'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

export type LayoutMode = 'palette' | 'calendar';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const STORAGE_KEY = 'chaeum-layout-mode';

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('palette');
  const [isHydrated, setIsHydrated] = useState(false);

  // 로컬 스토리지에서 레이아웃 모드 복원
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'palette' || stored === 'calendar') {
      setLayoutModeState(stored);
    }
    setIsHydrated(true);
  }, []);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleLayoutMode = useCallback(() => {
    const newMode = layoutMode === 'palette' ? 'calendar' : 'palette';
    setLayoutMode(newMode);
  }, [layoutMode, setLayoutMode]);

  // 하이드레이션 전까지는 기본값 사용
  if (!isHydrated) {
    return (
      <LayoutContext.Provider
        value={{
          layoutMode: 'palette',
          setLayoutMode: () => {},
          toggleLayoutMode: () => {},
        }}
      >
        {children}
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider
      value={{ layoutMode, setLayoutMode, toggleLayoutMode }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
