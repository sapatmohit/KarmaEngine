'use client';

import GlassCard from '../components/GlassCard';
import KarmaBadge from '../components/KarmaBadge';
import { useKarma } from '../contexts/KarmaContext';
import MainLayout from '../components/MainLayout';

export default function Leaderboard() {
  const { leaderboard } = useKarma();

  // Mock data with new structure for tabular format
  const leaderboardData = [
    { 
      rank: 1, 
      username: 'CryptoKing', 
      user: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4', 
      karma: 15420, 
      tier: 'Influencer',
      growth1H: 2.5,
      growth1D: 12.8,
      usdValue: 1542.00,
      volume: 125000,
      chartData: [100, 102, 98, 105, 108, 110, 112, 115, 118, 120]
    },
    { 
      rank: 2, 
      username: 'DeFiMaster', 
      user: '0xa1b2c3d4e5f6789012345678901234567890abcd', 
      karma: 12850, 
      tier: 'Influencer',
      growth1H: 1.8,
      growth1D: 8.5,
      usdValue: 1285.00,
      volume: 98000,
      chartData: [100, 98, 101, 103, 105, 107, 108, 110, 112, 115]
    },
    { 
      rank: 3, 
      username: 'BlockchainPro', 
      user: '0x456789012345678901234567890123456789def0', 
      karma: 11230, 
      tier: 'Influencer',
      growth1H: 3.2,
      growth1D: 15.2,
      usdValue: 1123.00,
      volume: 87000,
      chartData: [100, 103, 101, 106, 108, 111, 113, 116, 118, 120]
    },
    { 
      rank: 4, 
      username: 'NFTCollector', 
      user: '0xfedcba0987654321fedcba0987654321fedcba09', 
      karma: 9870, 
      tier: 'Trusted',
      growth1H: 1.2,
      growth1D: 6.8,
      usdValue: 987.00,
      volume: 75000,
      chartData: [100, 99, 101, 102, 104, 105, 106, 107, 108, 109]
    },
    { 
      rank: 5, 
      username: 'Web3Builder', 
      user: '0x13579bdf02468ace13579bdf02468ace13579bdf', 
      karma: 8760, 
      tier: 'Trusted',
      growth1H: 2.1,
      growth1D: 9.5,
      usdValue: 876.00,
      volume: 65000,
      chartData: [100, 102, 100, 103, 105, 106, 107, 109, 110, 112]
    },
    { 
      rank: 6, 
      username: 'TokenTrader', 
      user: '0x2468ace013579bdf2468ace013579bdf2468ace0', 
      karma: 7650, 
      tier: 'Trusted',
      growth1H: 0.8,
      growth1D: 4.2,
      usdValue: 765.00,
      volume: 55000,
      chartData: [100, 100, 99, 100, 101, 102, 103, 104, 105, 106]
    },
    { 
      rank: 7, 
      username: 'CryptoNewbie', 
      user: '0x3579bdf12468ace03579bdf12468ace03579bdf1', 
      karma: 6540, 
      tier: 'Trusted',
      growth1H: 1.5,
      growth1D: 7.2,
      usdValue: 654.00,
      volume: 45000,
      chartData: [100, 101, 100, 102, 103, 104, 105, 106, 107, 108]
    },
    { 
      rank: 8, 
      username: 'BlockchainDev', 
      user: '0x468ace023579bdf1468ace023579bdf1468ace02', 
      karma: 5430, 
      tier: 'Regular',
      growth1H: 0.5,
      growth1D: 3.1,
      usdValue: 543.00,
      volume: 35000,
      chartData: [100, 100, 99, 100, 101, 101, 102, 102, 103, 103]
    },
    { 
      rank: 9, 
      username: 'DeFiUser', 
      user: '0x579bdf13468ace02579bdf13468ace02579bdf13', 
      karma: 4320, 
      tier: 'Regular',
      growth1H: 0.3,
      growth1D: 2.1,
      usdValue: 432.00,
      volume: 25000,
      chartData: [100, 100, 100, 100, 101, 101, 101, 102, 102, 102]
    },
    { 
      rank: 10, 
      username: 'CryptoFan', 
      user: '0x68ace024579bdf1368ace024579bdf1368ace024', 
      karma: 3210, 
      tier: 'Regular',
      growth1H: 0.2,
      growth1D: 1.5,
      usdValue: 321.00,
      volume: 18000,
      chartData: [100, 100, 100, 100, 100, 100, 101, 101, 101, 101]
    },
  ];

  // Current user data (mock)
  const currentUser = {
    rank: 42,
    username: 'You',
    user: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karma: 1250,
    tier: 'Trusted',
    growth1H: 0.1,
    growth1D: 0.8,
    usdValue: 125.00,
    volume: 5000,
    chartData: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Your Rank */}
        <div>
          <GlassCard className="border border-primary/30">
            <h3 className="text-lg font-bold mb-4">Your Position</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">#</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Username</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Karma Token</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1H</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1D</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">USD</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Volume</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1D Chart</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800/50 bg-primary/10">
                    {/* Rank */}
                    <td className="py-3 px-2 text-sm">
                      <div className="bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-primary">
                        {currentUser.rank}
                      </div>
                    </td>
                    
                    {/* Username with Profile Icon */}
                    <td className="py-3 px-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {currentUser.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{currentUser.username}</div>
                          <div className="text-xs text-gray-400">
                            {currentUser.user.substring(0, 6)}...{currentUser.user.substring(currentUser.user.length - 4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Karma Token */}
                    <td className="py-3 px-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">K</span>
                        </div>
                        <span className="text-white font-mono">{currentUser.karma.toLocaleString()}</span>
                      </div>
                    </td>
                    
                    {/* 1H Growth */}
                    <td className="py-3 px-2 text-sm">
                      <span className={`font-medium ${
                        currentUser.growth1H >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currentUser.growth1H >= 0 ? '+' : ''}{currentUser.growth1H}%
                      </span>
                    </td>
                    
                    {/* 1D Growth */}
                    <td className="py-3 px-2 text-sm">
                      <span className={`font-medium ${
                        currentUser.growth1D >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currentUser.growth1D >= 0 ? '+' : ''}{currentUser.growth1D}%
                      </span>
                    </td>
                    
                    {/* USD Value */}
                    <td className="py-3 px-2 text-sm">
                      <span className="text-white font-mono">${currentUser.usdValue.toLocaleString()}</span>
                    </td>
                    
                    {/* Volume */}
                    <td className="py-3 px-2 text-sm">
                      <span className="text-gray-300">${currentUser.volume.toLocaleString()}</span>
                    </td>
                    
                    {/* 1D Chart */}
                    <td className="py-3 px-2 text-sm">
                      <div className="w-16 h-8">
                        <svg width="100%" height="100%" viewBox="0 0 64 32" className="overflow-visible">
                          <path
                            d={`M 0 ${32 - (currentUser.chartData[0] / 120) * 32} ${currentUser.chartData.map((value, i) => 
                              `L ${(i / (currentUser.chartData.length - 1)) * 64} ${32 - (value / 120) * 32}`
                            ).join(' ')}`}
                            stroke={currentUser.growth1D >= 0 ? "#10b981" : "#ef4444"}
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

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
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1H</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1D</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">USD</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Volume</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">1D Chart</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={user.rank}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        user.user === currentUser.user ? 'bg-primary/10' : ''
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
                              {user.user.substring(0, 6)}...{user.user.substring(user.user.length - 4)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Karma Token */}
                      <td className="py-3 px-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">K</span>
                          </div>
                          <span className="text-white font-mono">{user.karma.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* 1H Growth */}
                      <td className="py-3 px-2 text-sm">
                        <span className={`font-medium ${
                          user.growth1H >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {user.growth1H >= 0 ? '+' : ''}{user.growth1H}%
                        </span>
                      </td>
                      
                      {/* 1D Growth */}
                      <td className="py-3 px-2 text-sm">
                        <span className={`font-medium ${
                          user.growth1D >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {user.growth1D >= 0 ? '+' : ''}{user.growth1D}%
                        </span>
                      </td>
                      
                      {/* USD Value */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-white font-mono">${user.usdValue.toLocaleString()}</span>
                      </td>
                      
                      {/* Volume */}
                      <td className="py-3 px-2 text-sm">
                        <span className="text-gray-300">${user.volume.toLocaleString()}</span>
                      </td>
                      
                      {/* 1D Chart */}
                      <td className="py-3 px-2 text-sm">
                        <div className="w-16 h-8">
                          <svg width="100%" height="100%" viewBox="0 0 64 32" className="overflow-visible">
                            <path
                              d={`M 0 ${32 - (user.chartData[0] / 120) * 32} ${user.chartData.map((value, i) => 
                                `L ${(i / (user.chartData.length - 1)) * 64} ${32 - (value / 120) * 32}`
                              ).join(' ')}`}
                              stroke={user.growth1D >= 0 ? "#10b981" : "#ef4444"}
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center">
              <button className="btn-glass px-6 py-3 rounded-lg font-medium">
                Load More
              </button>
            </div>
          </GlassCard>
        </div>

      </div>
    </MainLayout>
  );
}