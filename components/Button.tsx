import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-sky-400 text-white hover:bg-sky-500",
    secondary: "bg-white text-slate-700 hover:bg-gray-50",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-400 text-white hover:bg-red-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full sm:w-auto"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};