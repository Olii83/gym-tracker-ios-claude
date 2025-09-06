import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AccentColor = 'red' | 'blue' | 'green' | 'purple' | 'orange';

export const accentColors: Record<AccentColor, { name: string; primary: string; hover: string; ring: string; text: string }> = {
  red: { name: 'Rot', primary: 'bg-red-600', hover: 'hover:bg-red-700', ring: 'focus:ring-red-600', text: 'text-red-500' },
  blue: { name: 'Blau', primary: 'bg-blue-600', hover: 'hover:bg-blue-700', ring: 'focus:ring-blue-600', text: 'text-blue-500' },
  green: { name: 'Grün', primary: 'bg-green-600', hover: 'hover:bg-green-700', ring: 'focus:ring-green-600', text: 'text-green-500' },
  purple: { name: 'Lila', primary: 'bg-purple-600', hover: 'hover:bg-purple-700', ring: 'focus:ring-purple-600', text: 'text-purple-500' },
  orange: { name: 'Orange', primary: 'bg-orange-600', hover: 'hover:bg-orange-700', ring: 'focus:ring-orange-600', text: 'text-orange-500' },
};

interface ThemeContextType {
  isDarkMode: boolean;
  accentColor: AccentColor;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  getAccentClasses: () => { primary: string; hover: string; ring: string; text: string };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference, default to dark
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    // Check localStorage for saved accent color, default to red
    const saved = localStorage.getItem('accentColor') as AccentColor;
    return saved && saved in accentColors ? saved : 'red';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document class for Tailwind
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Save accent color preference to localStorage
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const getAccentClasses = () => {
    return accentColors[accentColor];
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      accentColor, 
      toggleTheme, 
      setAccentColor, 
      getAccentClasses 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};