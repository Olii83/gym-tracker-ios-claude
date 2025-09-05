import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  const baseStyle = 'w-full font-bold py-3 px-4 rounded-lg transition-colors';
  const styles = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
  };

  return (
    <button className={`${baseStyle} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
