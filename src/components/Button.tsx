import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  const { getAccentClasses } = useTheme();
  const accentClasses = getAccentClasses();
  
  const baseStyle = 'w-full font-bold py-3 px-4 rounded-lg transition-colors';
  const styles = {
    primary: `${accentClasses.primary} text-white ${accentClasses.hover}`,
    secondary: 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600',
  };

  return (
    <button className={`${baseStyle} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
