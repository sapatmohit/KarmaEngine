'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import KarmaChart from '../components/KarmaChart';
import MainLayout from '../components/MainLayout';
import RedeemInterface from '../components/RedeemInterface';
import TierIndicator from '../components/TierIndicator';
import TransactionHistory from '../components/TransactionHistory';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';

export default function Dashboard() {
  const router = useRouter();
  const { karmaBalance, stakeAmount } = useKarma();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Track your karma activities and staking progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <TierIndicator tier={userData.tier} stakeAmount={userData.stakeAmount} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard>
                <h3 className="text-gray-400 text-sm font-medium">{stat.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

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