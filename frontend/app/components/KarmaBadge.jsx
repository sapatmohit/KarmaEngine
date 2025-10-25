import React from 'react';

const KarmaBadge = ({ karma, size = 'md' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1';
      case 'lg': return 'text-lg px-4 py-2';
      default: return 'text-sm px-3 py-1.5';
    }
  };

  const getColorClasses = () => {
    if (karma > 0) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (karma < 0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${getSizeClasses()} ${getColorClasses()}`}>
      {karma > 0 ? '+' : ''}{karma}
    </span>
  );
};

export default KarmaBadge;