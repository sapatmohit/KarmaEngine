'use client';

import KarmaChart from './components/KarmaChart';
import RedeemInterface from './components/RedeemInterface';
import TransactionHistory from './components/TransactionHistory';
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
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Karma Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <KarmaChart />
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <TransactionHistory />
            </motion.div>
          </div>

          {/* Right Column - Redeem Interface */}
          <div className="space-y-6">
            {/* Redeem Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RedeemInterface />
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  {recentActivities.slice(0, 3).map((activity) => (
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
        </div>
      </div>
    </MainLayout>
  );
}