import React from 'react';

const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'default', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const baseClasses = "btn-glass px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  
  const variantClasses = {
    default: "btn-glass",
    primary: "btn-glass-primary",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;