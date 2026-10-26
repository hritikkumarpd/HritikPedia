'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const THEME_STORAGE_KEY = 'hritikpedia-admin-theme';

export function ThemeScript() {
  const scriptContent = `
    (function() {
      try {
        var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
        if (stored === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        document.documentElement.classList.remove('dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') {
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      } else {
        setThemeState('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme) => {
    const valid = newTheme === 'dark' ? 'dark' : 'light';
    startTransition(() => {
      setThemeState(valid);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, valid);
      } catch {}
      if (valid === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
