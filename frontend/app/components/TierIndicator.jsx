import React from 'react';

const TierIndicator = ({ tier, stakeAmount }) => {
  const tiers = [
    { name: 'Regular', min: 0, max: 100, multiplier: '1x', color: 'bg-gray-500' },
    { name: 'Trusted', min: 100, max: 500, multiplier: '1.5x', color: 'bg-blue-500' },
    { name: 'Influencer', min: 500, max: Infinity, multiplier: '2x', color: 'bg-purple-500' }
  ];

  const getCurrentTier = () => {
    return tiers.find(t => stakeAmount >= t.min && stakeAmount < t.max) || tiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers.findIndex(t => t.name === currentTier.name);
    return tiers[currentIndex + 1] || null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progress = nextTier 
    ? ((stakeAmount - currentTier.min) / (nextTier.min - currentTier.min)) * 100 
    : 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{currentTier.name} Tier</span>
        <span className="text-sm font-medium">{currentTier.multiplier} Multiplier</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${currentTier.color}`} 
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      {nextTier && (
        <div className="mt-2 text-xs text-gray-400">
          Stake {nextTier.min - stakeAmount} more tokens to reach {nextTier.name} Tier
        </div>
      )}
    </div>
  );
};

export default TierIndicator;