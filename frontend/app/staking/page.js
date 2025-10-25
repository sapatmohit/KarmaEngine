'use client';

import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import TierIndicator from '../components/TierIndicator';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKarma } from '../contexts/KarmaContext';
import MainLayout from '../components/MainLayout';

export default function Staking() {
  const { karmaBalance, stakeAmount, stakeTokens, unstakeTokens } = useKarma();
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [activeTab, setActiveTab] = useState('stake'); // 'stake' or 'unstake'

  const userData = {
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karmaBalance: karmaBalance,
    stakeAmount: stakeAmount,
    tier: stakeAmount >= 500 ? 'Influencer' : stakeAmount >= 100 ? 'Trusted' : 'Regular',
    multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1
  };

  const tiers = [
    { 
      name: 'Regular', 
      min: 0, 
      max: 100, 
      multiplier: '1x', 
      color: 'from-gray-500 to-gray-700',
      benefits: ['Base karma rewards', 'Standard influence']
    },
    { 
      name: 'Trusted', 
      min: 100, 
      max: 500, 
      multiplier: '1.5x', 
      color: 'from-blue-500 to-blue-700',
      benefits: ['1.5x karma rewards', 'Priority in rewards', 'Enhanced influence']
    },
    { 
      name: 'Influencer', 
      min: 500, 
      max: Infinity, 
      multiplier: '2x', 
      color: 'from-purple-500 to-purple-700',
      benefits: ['2x karma rewards', 'Premium rewards', 'Maximum influence', 'Exclusive features']
    }
  ];

  const handleStake = async (e) => {
    e.preventDefault();
    if (!stakeInput || parseFloat(stakeInput) <= 0) return;
    
    try {
      await stakeTokens(stakeInput);
      setStakeInput('');
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  const handleUnstake = async (e) => {
    e.preventDefault();
    if (!unstakeInput || parseFloat(unstakeInput) <= 0) return;
    
    try {
      await unstakeTokens(unstakeInput);
      setUnstakeInput('');
    } catch (error) {
      console.error('Error unstaking tokens:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="text-center py-8">
            <h1 className="text-3xl font-bold mb-2">Staking</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stake your KARMA tokens to boost your reputation multiplier and unlock exclusive benefits.
            </p>
          </GlassCard>
        </motion.div>

        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Your Karma Balance</h3>
              <div className="text-2xl font-bold">{userData.karmaBalance} KARMA</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Currently Staked</h3>
              <div className="text-2xl font-bold">{userData.stakeAmount} KARMA</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Current Tier</h3>
              <div className="text-2xl font-bold text-primary">{userData.tier}</div>
              <div className="text-sm text-gray-400">{userData.multiplier}x Multiplier</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Staking Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex border-b border-gray-800 mb-6">
              <button
                className={`py-3 px-6 font-medium ${activeTab === 'stake' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                onClick={() => setActiveTab('stake')}
              >
                Stake Tokens
              </button>
              <button
                className={`py-3 px-6 font-medium ${activeTab === 'unstake' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                onClick={() => setActiveTab('unstake')}
              >
                Unstake Tokens
              </button>
            </div>

            {activeTab === 'stake' ? (
              <form onSubmit={handleStake} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Stake</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      placeholder="0.00"
                      className="w-full glass-effect px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-gray-400">KARMA</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>Available: {userData.karmaBalance} KARMA</span>
                    <button 
                      type="button"
                      onClick={() => setStakeInput(userData.karmaBalance.toString())}
                      className="text-primary hover:underline"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Staking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Stake:</span>
                      <span>{userData.stakeAmount} KARMA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Stake:</span>
                      <span>{userData.stakeAmount + (parseFloat(stakeInput) || 0)} KARMA</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-400">New Tier:</span>
                      <span className="font-medium">
                        {userData.stakeAmount + (parseFloat(stakeInput) || 0) >= 500 ? 'Influencer' : 
                         userData.stakeAmount + (parseFloat(stakeInput) || 0) >= 100 ? 'Trusted' : 'Regular'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Multiplier:</span>
                      <span className="font-medium">
                        {userData.stakeAmount + (parseFloat(stakeInput) || 0) >= 500 ? '2x' : 
                         userData.stakeAmount + (parseFloat(stakeInput) || 0) >= 100 ? '1.5x' : '1x'}
                      </span>
                    </div>
                  </div>
                </div>

                <GlassButton variant="primary" className="w-full py-3" type="submit">
                  Stake Tokens
                </GlassButton>
              </form>
            ) : (
              <form onSubmit={handleUnstake} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Unstake</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeInput}
                      onChange={(e) => setUnstakeInput(e.target.value)}
                      placeholder="0.00"
                      className="w-full glass-effect px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-gray-400">KARMA</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>Staked: {userData.stakeAmount} KARMA</span>
                    <button 
                      type="button"
                      onClick={() => setUnstakeInput(userData.stakeAmount.toString())}
                      className="text-primary hover:underline"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Unstaking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Stake:</span>
                      <span>{userData.stakeAmount} KARMA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Stake:</span>
                      <span>{Math.max(0, userData.stakeAmount - (parseFloat(unstakeInput) || 0))} KARMA</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-400">New Tier:</span>
                      <span className="font-medium">
                        {Math.max(0, userData.stakeAmount - (parseFloat(unstakeInput) || 0)) >= 500 ? 'Influencer' : 
                         Math.max(0, userData.stakeAmount - (parseFloat(unstakeInput) || 0)) >= 100 ? 'Trusted' : 'Regular'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Multiplier:</span>
                      <span className="font-medium">
                        {Math.max(0, userData.stakeAmount - (parseFloat(unstakeInput) || 0)) >= 500 ? '2x' : 
                         Math.max(0, userData.stakeAmount - (parseFloat(unstakeInput) || 0)) >= 100 ? '1.5x' : '1x'}
                      </span>
                    </div>
                  </div>
                </div>

                <GlassButton variant="primary" className="w-full py-3" type="submit">
                  Unstake Tokens
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </motion.div>

        {/* Tier Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard>
            <h2 className="text-2xl font-bold mb-6">Staking Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, index) => (
                <div 
                  key={tier.name} 
                  className={`glass-effect p-6 rounded-xl border ${
                    userData.tier === tier.name 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-800'
                  }`}
                >
                  <div className={`bg-gradient-to-r ${tier.color} text-white text-center py-3 rounded-lg mb-4`}>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="text-sm">{tier.multiplier} Multiplier</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      {tier.max === Infinity 
                        ? `Stake ${tier.min}+ KARMA` 
                        : `Stake ${tier.min}-${tier.max} KARMA`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </MainLayout>
  );
}