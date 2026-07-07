import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'default', name: 'Blood Red', description: 'The OG. Black & blood red.' },
  { id: 'exotic', name: 'Exotic Dark', description: 'Rich purples, teals & gold. Premium.' },
  { id: 'explosive', name: 'Explosive Dark', description: 'Chaos energy. Reds, oranges & electric blue.' }
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('asis-theme') || 'default');

  useEffect(() => {
    localStorage.setItem('asis-theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-exotic', 'theme-explosive');
    if (theme === 'exotic') root.classList.add('theme-exotic');
    if (theme === 'explosive') root.classList.add('theme-explosive');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}