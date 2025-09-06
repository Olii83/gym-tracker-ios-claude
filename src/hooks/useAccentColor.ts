import { useTheme } from '../contexts/ThemeContext';

// Custom hook for easy access to accent colors throughout the app
export const useAccentColor = () => {
  const { getAccentClasses } = useTheme();
  const colors = getAccentClasses();
  
  return {
    // Background colors for buttons and UI elements
    primary: colors.primary,
    hover: colors.hover,
    
    // Text colors for headings and highlights
    text: colors.text,
    
    // Ring/focus colors
    ring: colors.ring,
    
    // Combined classes for common use cases
    button: `${colors.primary} ${colors.hover}`,
    heading: colors.text,
  };
};