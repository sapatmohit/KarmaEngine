'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import KarmaChart from '../components/KarmaChart';
import MainLayout from '../components/MainLayout';
import RedeemInterface from '../components/RedeemInterface';
import TierIndicator from '../components/TierIndicator';
import TransactionHistory from '../components/TransactionHistory';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';
import ApiService from '../services/api';

export default function Dashboard() {
  const router = useRouter();
  const { karmaBalance, stakeAmount, activities } = useKarma();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Update recent activities when activities change
    if (activities && activities.length > 0) {
      setRecentActivities(activities.slice(0, 3));
    } else {
      setRecentActivities([]);
    }
  }, [activities]);

  const getTierInfo = (stake) => {
    if (stake >= 500) return { name: 'Influencer', color: 'from-purple-500 to-pink-500' };
    if (stake >= 100) return { name: 'Trusted', color: 'from-blue-500 to-cyan-500' };
    return { name: 'Regular', color: 'from-gray-500 to-gray-600' };
  };

  const getMultiplier = (stake) => {
    if (stake >= 500) return 2;
    if (stake >= 100) return 1.5;
    return 1;
  };

  if (authLoading) {
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

  const tierInfo = getTierInfo(stakeAmount);
  const multiplier = getMultiplier(stakeAmount);

  // User data
  const userData = {
    walletAddress: user?.walletAddress || '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karmaBalance: karmaBalance,
    stakeAmount: stakeAmount,
    tier: tierInfo.name,
    multiplier: multiplier
  };

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
          <GlassCard className="justify-items-center justify-evenly">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Karma Balance</h3>
            <div className="text-2xl font-bold text-white flex items-center">
              <img src="./karma_token_icon.svg" alt="Karma Token" className="w-6 h-6 mr-1 rounded-full" />
              {userData.karmaBalance?.toLocaleString() || 0}
            </div>
            <div className="mt-2">
              <KarmaBadge karma={userData.karmaBalance} />
            </div>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Staked Amount</h3>
            <div className="text-2xl font-bold text-white">{userData.stakeAmount?.toLocaleString() || 0} XLM</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Multiplier: x{userData.multiplier}
              </span>
            </div>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Activities</h3>
            <div className="text-2xl font-bold text-white">{activities?.length || 0}</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active User
              </span>
            </div>
          </GlassCard>
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
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                        <div>
                          <h3 className="font-medium capitalize text-white">{activity.type}</h3>
                          <p className="text-sm text-gray-400">
                            {activity.timestamp 
                              ? new Date(activity.timestamp).toLocaleString() 
                              : 'Just now'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.multiplier && activity.multiplier !== 1 && (
                            <span className="text-gray-400">x{activity.multiplier}</span>
                          )}
                          <KarmaBadge karma={activity.finalKarma || activity.value * (activity.multiplier || 1)} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No recent activities</p>
                      <p className="text-sm mt-1">Start engaging to earn karma!</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => router.push('/activities')}
                  className="w-full mt-4 btn-glass py-3 rounded-lg"
                >
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