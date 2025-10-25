'use client';

import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import { motion } from 'framer-motion';
import { useKarma } from '../contexts/KarmaContext';
import MainLayout from '../components/MainLayout';

export default function Leaderboard() {
  const { leaderboard } = useKarma();

  // Mock data - will be replaced with real data from API
  const leaderboardData = [
    { 
      rank: 1, 
      user: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4', 
      karma: 15420, 
      tier: 'Influencer',
      change: 125
    },
    { 
      rank: 2, 
      user: '0xa1b2c3d4e5f6789012345678901234567890abcd', 
      karma: 12850, 
      tier: 'Influencer',
      change: 98
    },
    { 
      rank: 3, 
      user: '0x456789012345678901234567890123456789def0', 
      karma: 11230, 
      tier: 'Influencer',
      change: 210
    },
    { 
      rank: 4, 
      user: '0xfedcba0987654321fedcba0987654321fedcba09', 
      karma: 9870, 
      tier: 'Trusted',
      change: 75
    },
    { 
      rank: 5, 
      user: '0x13579bdf02468ace13579bdf02468ace13579bdf', 
      karma: 8760, 
      tier: 'Trusted',
      change: 150
    },
    { 
      rank: 6, 
      user: '0x2468ace013579bdf2468ace013579bdf2468ace0', 
      karma: 7650, 
      tier: 'Trusted',
      change: 42
    },
    { 
      rank: 7, 
      user: '0x3579bdf12468ace03579bdf12468ace03579bdf1', 
      karma: 6540, 
      tier: 'Trusted',
      change: 88
    },
    { 
      rank: 8, 
      user: '0x468ace023579bdf1468ace023579bdf1468ace02', 
      karma: 5430, 
      tier: 'Regular',
      change: 65
    },
    { 
      rank: 9, 
      user: '0x579bdf13468ace02579bdf13468ace02579bdf13', 
      karma: 4320, 
      tier: 'Regular',
      change: 32
    },
    { 
      rank: 10, 
      user: '0x68ace024579bdf1368ace024579bdf1368ace024', 
      karma: 3210, 
      tier: 'Regular',
      change: 45
    },
  ];

  // Current user data (mock)
  const currentUser = {
    rank: 42,
    user: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karma: 1250,
    tier: 'Trusted'
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
            <h1 className="text-3xl font-bold mb-2">Karma Leaderboard</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how you rank against other community members based on your karma score.
            </p>
          </GlassCard>
        </motion.div>

        {/* Your Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="border border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">#{currentUser.rank}</span>
                </div>
                <div>
                  <h3 className="font-bold">Your Position</h3>
                  <p className="text-sm text-gray-400 truncate max-w-xs">
                    {currentUser.user.substring(0, 6)}...{currentUser.user.substring(currentUser.user.length - 4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentUser.karma}</div>
                <div className="text-sm text-gray-400">{currentUser.tier} Tier</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard>
            <h2 className="text-xl font-bold mb-6">Top Contributors</h2>
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div 
                  key={user.rank} 
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    user.user === currentUser.user 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:glass-effect-hover'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      index === 2 ? 'bg-amber-800/20 text-amber-700' :
                      'bg-gray-700/50 text-gray-400'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user.user.substring(0, 6)}...{user.user.substring(user.user.length - 4)}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.tier === 'Influencer' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          user.tier === 'Trusted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {user.tier}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.karma.toLocaleString()}</div>
                    <div className="text-sm text-green-400 flex items-center justify-end">
                      <span>+{user.change}</span>
                      <span className="ml-1">↑</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="btn-glass px-6 py-3 rounded-lg font-medium">
                Load More
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard>
            <h2 className="text-xl font-bold mb-4">How Karma Leaderboard Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect p-4 rounded-lg">
                <div className="text-primary text-2xl mb-2">1</div>
                <h3 className="font-bold mb-2">Earn Karma</h3>
                <p className="text-sm text-gray-400">
                  Participate in the community by posting, commenting, and engaging with others.
                </p>
              </div>
              <div className="glass-effect p-4 rounded-lg">
                <div className="text-primary text-2xl mb-2">2</div>
                <h3 className="font-bold mb-2">Stake Tokens</h3>
                <p className="text-sm text-gray-400">
                  Stake KARMA tokens to boost your multiplier and climb the leaderboard faster.
                </p>
              </div>
              <div className="glass-effect p-4 rounded-lg">
                <div className="text-primary text-2xl mb-2">3</div>
                <h3 className="font-bold mb-2">Climb Ranks</h3>
                <p className="text-sm text-gray-400">
                  Higher karma scores place you higher on the leaderboard and unlock benefits.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </MainLayout>
  );
}