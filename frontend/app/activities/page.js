'use client';

import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKarma } from '../contexts/KarmaContext';
import MainLayout from '../components/MainLayout';

export default function Activities() {
  const { activities } = useKarma();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'post', 'comment', 'like', 'repost', 'report'

  const activityTypes = [
    { id: 'all', name: 'All Activities' },
    { id: 'post', name: 'Posts' },
    { id: 'comment', name: 'Comments' },
    { id: 'like', name: 'Likes' },
    { id: 'repost', name: 'Reposts' },
    { id: 'report', name: 'Reports' },
  ];


  const filteredActivities = activeTab === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeTab);

  return (
    <MainLayout>
      <div className="space-y-8">

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
                    <div>
                      {activity.type === 'post'}
                      {activity.type === 'comment'}
                      {activity.type === 'like'}
                      {activity.type === 'repost'}
                      {activity.type === 'report'}
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