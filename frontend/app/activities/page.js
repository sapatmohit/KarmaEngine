'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';
import ApiService from '../services/api';

export default function Activities() {
  const { user } = useAuth();
  const { karmaBalance, stakeAmount, activities: allActivities } = useKarma();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'post', 'comment', 'like', 'repost', 'report'

  const activityTypes = [
    { id: 'all', name: 'All Activities' },
    { id: 'post', name: 'Posts' },
    { id: 'comment', name: 'Comments' },
    { id: 'like', name: 'Likes' },
    { id: 'repost', name: 'Reposts' },
    { id: 'report', name: 'Reports' },
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.walletAddress) return;
      
      try {
        setLoading(true);
        const response = await ApiService.getUserActivities(user.walletAddress);
        setActivities(response.activities || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // Calculate activity statistics
  const getActivityStats = () => {
    const stats = {
      total: activities.length,
      post: 0,
      comment: 0,
      like: 0,
      repost: 0,
      report: 0
    };

    activities.forEach(activity => {
      if (stats.hasOwnProperty(activity.type)) {
        stats[activity.type]++;
      }
    });

    return stats;
  };

  const activityStats = getActivityStats();

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'post':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6h-2l-1.5-2h-11l-1.5 2h-2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 10H7v-2h10v2zm0-3H7v-2h10v2zm0-3H7V8h10v2z"/>
            </svg>
          </div>
        );
      case 'like':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        );
      case 'repost':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
          </div>
        );
      case 'report':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    // If it's already a formatted string, return it
    if (typeof timestamp === 'string') return timestamp;
    
    // If it's a date object, format it
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const filteredActivities = activeTab === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeTab);

  const getMultiplier = (stake) => {
    if (stake >= 500) return 2;
    if (stake >= 100) return 1.5;
    return 1;
  };

  const getTierInfo = (stake) => {
    if (stake >= 500) return { name: 'Influencer', color: 'from-purple-500 to-pink-500' };
    if (stake >= 100) return { name: 'Trusted', color: 'from-blue-500 to-cyan-500' };
    return { name: 'Regular', color: 'from-gray-500 to-gray-600' };
  };

  const tierInfo = getTierInfo(stakeAmount);
  const multiplier = getMultiplier(stakeAmount);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <GlassCard className="text-center p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Activities</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </GlassCard>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Activities Dashboard</h1>
              <p className="text-gray-400 mt-2">Track your karma activities and engagement history</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassCard className="text-center">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Karma Balance</h3>
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  <img src="./karma_token_icon.svg" alt="Karma Token" className="w-5 h-5 mr-1" />
                  {karmaBalance?.toLocaleString() || 0}
                </div>
                <div className="mt-2">
                  <KarmaBadge karma={karmaBalance} />
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassCard className="text-center">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Staked Amount</h3>
                <div className="text-2xl font-bold text-white">{stakeAmount?.toLocaleString() || 0} XLM</div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Multiplier: x{multiplier}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassCard className="text-center">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Total Activities</h3>
                <div className="text-2xl font-bold text-white">{activities?.length || 0}</div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active User
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GlassCard>
            <h2 className="text-xl font-bold text-white mb-4">Activity Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{activityStats.post}</div>
                <div className="text-sm text-gray-400">Posts</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{activityStats.comment}</div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{activityStats.like}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{activityStats.repost}</div>
                <div className="text-sm text-gray-400">Reposts</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{activityStats.report}</div>
                <div className="text-sm text-gray-400">Reports</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Activity Filter and List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex flex-wrap gap-2 mb-6">
              {activityTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === type.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {type.name}
                </motion.button>
              ))}
            </div>

            {/* Activity List */}
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div 
                      className="p-5 rounded-xl bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-300 border border-gray-700/50 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-bold capitalize text-white text-lg">{activity.type}</h3>
                              <KarmaBadge karma={activity.finalKarma || activity.value * (activity.multiplier || 1)} />
                              {activity.multiplier && activity.multiplier !== 1 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  x{activity.multiplier} Multiplier
                                </span>
                              )}
                            </div>
                            {activity.metadata?.content && (
                              <p className="text-gray-300 mb-3">{activity.metadata.content}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                {formatTimestamp(activity.timestamp)}
                              </span>
                              {activity.metadata?.network && (
                                <span className="flex items-center capitalize">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                  </svg>
                                  {activity.metadata.network}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">ID: {activity.id?.substring(0, 6)}...</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center p-12 rounded-xl bg-gray-800/40 border border-gray-700/50">
                    <div className="text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Activities Found</h3>
                    <p className="text-gray-400">
                      {activeTab === 'all' 
                        ? "You haven't performed any activities yet." 
                        : `You haven't performed any ${activeTab} activities yet.`}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </MainLayout>
  );
}