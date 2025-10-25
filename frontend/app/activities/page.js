'use client';

import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useKarma } from '../contexts/KarmaContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/MainLayout';
import ApiService from '../services/api';

export default function Activities() {
  const { user } = useAuth();
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

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'post':
        return (
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6h-2l-1.5-2h-11l-1.5 2h-2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 10H7v-2h10v2zm0-3H7v-2h10v2zm0-3H7V8h10v2z"/>
            </svg>
          </div>
        );
      case 'like':
        return (
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        );
      case 'repost':
        return (
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
          </div>
        );
      case 'report':
        return (
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Your Activities</h1>
          <p className="text-gray-400">{activities.length} activities</p>
        </div>

        {/* Activity Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {activityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === type.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <GlassCard key={activity.id} className="hover:bg-gray-800/50 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      {getActivityIcon(activity.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium capitalize text-white">{activity.type}</h3>
                          <KarmaBadge karma={activity.finalKarma || activity.value * (activity.multiplier || 1)} />
                        </div>
                        {activity.metadata?.content && (
                          <p className="text-gray-300 mt-1 max-w-2xl">{activity.metadata.content}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-2 text-sm text-gray-400">
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {activity.multiplier && activity.multiplier !== 1 ? `x${activity.multiplier}` : ''}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="text-center p-12">
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
              </GlassCard>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}