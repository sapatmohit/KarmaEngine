'use client';

import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';
import ApiService from '../services/api';

export default function Leaderboard() {
  const { user } = useAuth();
  const { karmaBalance, stakeAmount } = useKarma();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getLeaderboard();
        
        // Process leaderboard data
        const processedData = response.leaderboard.map((user, index) => ({
          rank: index + 1,
          username: user.username || (user.walletAddress ? `User${user.walletAddress.substring(0, 6)}` : 'Anonymous'),
          user: user.walletAddress,
          karma: user.karmaPoints,
          tier: user.stakedAmount >= 500 ? 'Influencer' : user.stakedAmount >= 100 ? 'Trusted' : 'Regular',
          stakedAmount: user.stakedAmount,
          multiplier: user.multiplier,
        }));
        
        setLeaderboardData(processedData);
        
        // Find current user data
        if (user?.walletAddress) {
          const currentUser = processedData.find(u => u.user === user.walletAddress);
          if (currentUser) {
            setCurrentUserData(currentUser);
          } else {
            // If user is not in top 10, create a placeholder
            setCurrentUserData({
              rank: 'N/A',
              username: user.name || 'You',
              user: user.walletAddress,
              karma: karmaBalance,
              tier: stakeAmount >= 500 ? 'Influencer' : stakeAmount >= 100 ? 'Trusted' : 'Regular',
              stakedAmount: stakeAmount,
              multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1,
            });
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, karmaBalance, stakeAmount]);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Influencer':
        return 'from-purple-500 to-pink-500';
      case 'Trusted':
        return 'from-blue-500 to-cyan-500';
      case 'Regular':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

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
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Leaderboard</h3>
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
        {/* Your Rank */}
        {currentUserData && (
          <div>
            <GlassCard className="border border-purple-500/30">
              <h3 className="text-lg font-bold mb-4">Your Position</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">#</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Username</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Karma Token</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Staked</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800/50 bg-purple-500/10">
                      {/* Rank */}
                      <td className="py-3 px-2 text-sm">
                        <div className="bg-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-purple-300">
                          {currentUserData.rank}
                        </div>
                      </td>
                      
                      {/* Username with Profile Icon */}
                      <td className="py-3 px-2 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {currentUserData.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{currentUserData.username}</div>
                            <div className="text-xs text-gray-400">
                              {currentUserData.user ? `${currentUserData.user.substring(0, 6)}...${currentUserData.user.substring(currentUserData.user.length - 4)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Karma Token */}
                      <td className="py-3 px-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6">
                            <img src="./karma_token_icon.svg" alt="Karma Token" className="w-6 h-6" />
                          </div>
                          <span className="text-white font-mono">{currentUserData.karma?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      
                      {/* Staked Amount */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-white">{currentUserData.stakedAmount?.toLocaleString() || 0} XLM</span>
                      </td>
                      
                      {/* Multiplier */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-white">x{currentUserData.multiplier}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Leaderboard Table */}
        <div>
          <GlassCard>
            <h2 className="text-xl font-bold mb-6">Karma Leaderboard</h2>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">#</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Username</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Karma Token</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Staked</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={user.rank}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        user.user === currentUserData?.user ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-2 text-sm">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300' :
                          index === 2 ? 'bg-amber-800/20 text-amber-700' :
                          'bg-gray-700/50 text-gray-400'
                        }`}>
                          {user.rank}
                        </div>
                      </td>
                      
                      {/* Username with Profile Icon */}
                      <td className="py-3 px-2 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{user.username}</div>
                            <div className="text-xs text-gray-400">
                              {user.user ? `${user.user.substring(0, 6)}...${user.user.substring(user.user.length - 4)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Karma Token */}
                      <td className="py-3 px-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6">
                            <img src="./karma_token_icon.svg" alt="Karma Token" className="w-6 h-6" />
                          </div>
                          <span className="text-white font-mono">{user.karma?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      
                      {/* Staked Amount */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-white">{user.stakedAmount?.toLocaleString() || 0} XLM</span>
                      </td>
                      
                      {/* Multiplier */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-white">x{user.multiplier}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {leaderboardData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No leaderboard data available</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}