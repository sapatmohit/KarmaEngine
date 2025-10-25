'use client';

import { useState, useEffect } from 'react';
import { useKarma } from '../contexts/KarmaContext';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';

const KarmaChart = ({ karmaData = [] }) => {
  const { karmaBalance } = useKarma();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);

  // Generate realistic karma data with variations
  useEffect(() => {
    const realisticData = generateRealisticKarmaData(karmaBalance, selectedTimeframe);
    setChartData(realisticData);
  }, [karmaBalance, selectedTimeframe]);

  const generateRealisticKarmaData = (currentKarma, timeframe) => {
    const now = new Date();
    const data = [];
    let points = 24; // Default for 1D
    let intervalMs = 60 * 60 * 1000; // 1 hour
    
    switch (timeframe) {
      case '1H':
        points = 12;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        break;
      case '1D':
        points = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case '1W':
        points = 7;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1M':
        points = 30;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1Y':
        points = 12;
        intervalMs = 30 * 24 * 60 * 60 * 1000; // 1 month
        break;
    }

    // Generate realistic karma progression
    let baseKarma = Math.max(100, currentKarma - 200); // Start lower
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i - 1) * intervalMs);
      
      // Add realistic growth pattern
      const progress = i / (points - 1);
      const growth = (currentKarma - baseKarma) * progress;
      const variation = (Math.random() - 0.5) * 50; // Random variation
      
      const karma = Math.max(0, baseKarma + growth + variation);
      
      data.push({
        timestamp: timestamp.getTime(),
        karma: Math.round(karma),
        activities: Math.floor(Math.random() * 5) + 1,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    // Ensure the last point matches current karma
    data[data.length - 1].karma = currentKarma;
    
    return data;
  };

  const timeframes = ['1H', '1D', '1W', '1M', '1Y'];
  
  const currentKarma = karmaBalance;
  const firstKarma = chartData.length > 0 ? chartData[0].karma : currentKarma;
  const lastKarma = chartData.length > 0 ? chartData[chartData.length - 1].karma : currentKarma;
  const karmaChange = lastKarma - firstKarma;
  const karmaChangePercent = firstKarma > 0 ? ((karmaChange / firstKarma) * 100) : 0;
  const isPositive = karmaChange >= 0;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    switch (selectedTimeframe) {
      case '1H':
        return format(date, 'HH:mm');
      case '1D':
        return format(date, 'HH:mm');
      case '1W':
        return format(date, 'MM/dd');
      case '1M':
        return format(date, 'MM/dd');
      case '1Y':
        return format(date, 'MM/yy');
      default:
        return format(date, 'HH:mm');
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 shadow-lg">
          <div className="text-white font-semibold">
            {data.karma.toLocaleString()} KARMA
          </div>
          <div className="text-gray-400 text-sm">
            {formatTimestamp(data.timestamp)}
          </div>
          <div className="text-gray-400 text-sm">
            Activities: {data.activities}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      {/* Header */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Karma</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">Your Score</span>
        </nav>

        {/* Token Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Token Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white font-bold text-lg">K</span>
              </div>
            </div>

            {/* Token Details */}
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">Your Karma Score</h1>
                <span className="text-gray-400 text-lg">KARMA</span>
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Price Information */}
        <div className="flex items-end space-x-6">
          <div className="text-4xl font-bold text-white">
            {currentKarma.toLocaleString()}
          </div>
          <div className="flex items-center space-x-3 pb-1">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <svg className={`w-4 h-4 ${isPositive ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span className="font-semibold">
                {isPositive ? '+' : ''}{karmaChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{karmaChange.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="flex space-x-2 mt-6 mb-6">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorKarma" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={formatTimestamp}
              domain={['dataMin', 'dataMax']}
              type="number"
              scale="time"
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
              domain={['dataMin - 50', 'dataMax + 50']}
              orientation="right"
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="karma"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorKarma)"
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositive ? "#10b981" : "#ef4444",
                stroke: '#1e293b',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Controls at Bottom */}
      <div className="flex justify-end space-x-2 mt-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default KarmaChart;
