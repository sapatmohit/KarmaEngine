'use client';

import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import KarmaBadge from '../components/KarmaBadge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKarma } from '../contexts/KarmaContext';
import MainLayout from '../components/MainLayout';

export default function Activities() {
  const { activities, recordActivity } = useKarma();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'post', 'comment', 'like', 'repost', 'report'
  const [newActivity, setNewActivity] = useState({ type: 'post', content: '' });

  const activityTypes = [
    { id: 'all', name: 'All Activities' },
    { id: 'post', name: 'Posts' },
    { id: 'comment', name: 'Comments' },
    { id: 'like', name: 'Likes' },
    { id: 'repost', name: 'Reposts' },
    { id: 'report', name: 'Reports' },
  ];

  const handleRecordActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.content && (newActivity.type === 'post' || newActivity.type === 'comment' || newActivity.type === 'repost')) {
      return;
    }
    
    try {
      await recordActivity(newActivity);
      setNewActivity({ type: 'post', content: '' });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="text-center py-8">
            <h1 className="text-3xl font-bold mb-2">Your Activities</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track and record all your interactions in the KarmaChain ecosystem.
            </p>
          </GlassCard>
        </motion.div>

        {/* Record New Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard>
            <h2 className="text-xl font-bold mb-4">Record New Activity</h2>
            <form onSubmit={handleRecordActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'post', name: 'Post', icon: '📝' },
                    { id: 'comment', name: 'Comment', icon: '💬' },
                    { id: 'like', name: 'Like', icon: '👍' },
                    { id: 'repost', name: 'Repost', icon: '🔄' },
                    { id: 'report', name: 'Report', icon: '🚩' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewActivity({ ...newActivity, type: type.id })}
                      className={`glass-effect py-3 rounded-lg flex flex-col items-center justify-center ${
                        newActivity.type === type.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <span className="text-lg mb-1">{type.icon}</span>
                      <span className="text-xs">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(newActivity.type === 'post' || newActivity.type === 'comment' || newActivity.type === 'repost') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {newActivity.type === 'post' ? 'Post Content' : 
                     newActivity.type === 'comment' ? 'Comment' : 'Repost Content'}
                  </label>
                  <textarea
                    value={newActivity.content}
                    onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                    placeholder={
                      newActivity.type === 'post' ? 'What\'s on your mind?' : 
                      newActivity.type === 'comment' ? 'Add your comment...' : 'Share this content...'
                    }
                    className="w-full glass-effect px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                  />
                </div>
              )}

              <GlassButton variant="primary" className="w-full py-3" type="submit">
                Record Activity
              </GlassButton>
            </form>
          </GlassCard>
        </motion.div>

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
                    ? 'bg-primary text-white'
                    : 'glass-effect hover:bg-gray-700'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <GlassCard key={activity.id} className="hover:glass-effect-hover transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'post' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'comment' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'like' ? 'bg-yellow-500/20 text-yellow-400' :
                      activity.type === 'repost' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.type === 'post' && '📝'}
                      {activity.type === 'comment' && '💬'}
                      {activity.type === 'like' && '👍'}
                      {activity.type === 'repost' && '🔄'}
                      {activity.type === 'report' && '🚩'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium capitalize">{activity.type}</h3>
                        <KarmaBadge karma={activity.karma * activity.multiplier} />
                      </div>
                      {activity.content && (
                        <p className="text-gray-300 mt-1">{activity.content}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-400">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">x{activity.multiplier}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}