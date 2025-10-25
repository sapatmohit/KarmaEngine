'use client';

import GlassCard from './components/GlassCard';
import KarmaBadge from './components/KarmaBadge';
import TierIndicator from './components/TierIndicator';
import { motion } from 'framer-motion';
import { useKarma } from './contexts/KarmaContext';
import MainLayout from './components/MainLayout';

export default function Home() {
  const { karmaBalance, stakeAmount } = useKarma();

  // Mock data - will be replaced with real data from API
  const userData = {
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karmaBalance: karmaBalance,
    stakeAmount: stakeAmount,
    tier: stakeAmount >= 500 ? 'Influencer' : stakeAmount >= 100 ? 'Trusted' : 'Regular',
    multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1
  };

  const recentActivities = [
    { id: 1, type: 'Post', karma: 5, multiplier: 1.5, timestamp: '2 hours ago' },
    { id: 2, type: 'Comment', karma: 3, multiplier: 1.5, timestamp: '5 hours ago' },
    { id: 3, type: 'Like', karma: 1, multiplier: 1.5, timestamp: '1 day ago' },
    { id: 4, type: 'Repost', karma: 2, multiplier: 1.5, timestamp: '2 days ago' },
  ];

  const stats = [
    { name: 'Total Activities', value: '142' },
    { name: 'Current Streak', value: '12 days' },
    { name: 'Rank', value: '#42' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="text-center py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to <span className="text-gradient">KarmaChain</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track your decentralized reputation and build trust in the ecosystem through meaningful interactions.
            </p>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Your Karma Balance</h3>
              <div className="flex justify-center items-baseline">
                <span className="text-3xl font-bold">{userData.karmaBalance}</span>
                <KarmaBadge karma={userData.karmaBalance} size="sm" className="ml-2" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Staking Tier</h3>
              <div className="text-xl font-bold text-primary">{userData.tier}</div>
              <div className="text-sm text-gray-400 mt-1">{userData.multiplier}x Multiplier</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="text-center py-6">
              <h3 className="text-gray-400 text-sm mb-1">Wallet Connected</h3>
              <div className="font-mono text-sm truncate">{userData.walletAddress.substring(0, 6)}...{userData.walletAddress.substring(userData.walletAddress.length - 4)}</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tier Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">Staking Progress</h2>
                <TierIndicator tier={userData.tier} stakeAmount={userData.stakeAmount} />
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400">Currently Staked</p>
                    <p className="text-2xl font-bold">{userData.stakeAmount} KARMA</p>
                  </div>
                  <button className="btn-glass-primary px-4 py-2 rounded-lg">
                    Manage Stake
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{activity.type}</h3>
                        <p className="text-sm text-gray-400">{activity.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">x{activity.multiplier}</span>
                        <KarmaBadge karma={activity.karma * activity.multiplier} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 btn-glass py-3 rounded-lg">
                  View All Activities
                </button>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">Your Stats</h2>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                      <span className="text-gray-400">{stat.name}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-glass py-3 rounded-lg text-sm">
                    Post
                  </button>
                  <button className="btn-glass py-3 rounded-lg text-sm">
                    Comment
                  </button>
                  <button className="btn-glass py-3 rounded-lg text-sm">
                    Like
                  </button>
                  <button className="btn-glass py-3 rounded-lg text-sm">
                    Repost
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}