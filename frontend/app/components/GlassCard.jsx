import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card-glass p-6 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;