import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  theme: 'dark' | 'system';
  setTheme: (theme: 'dark' | 'system') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Apply theme to document based on theme value or system preference
export function applyTheme(theme?: 'dark' | 'system') {
  const currentTheme = theme || useThemeStore.getState().theme;
  const isDarkMode = currentTheme === 'dark' || 
    (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Always apply dark mode
  document.documentElement.classList.add('dark');
  document.documentElement.style.setProperty('--toast-bg', '#1f2937');
  document.documentElement.style.setProperty('--toast-color', '#f9fafb');
  document.documentElement.style.setProperty('--toast-border', '#374151');
}