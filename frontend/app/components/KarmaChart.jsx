'use client';

import { useState, useEffect } from 'react';
import { useKarma } from '../contexts/KarmaContext';

const KarmaChart = ({ karmaData = [] }) => {
  const { karmaBalance } = useKarma();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);

  // Generate static karma data based on current karma balance
  useEffect(() => {
    const staticData = generateStaticKarmaData(karmaBalance, selectedTimeframe);
    setChartData(staticData);
  }, [karmaBalance, selectedTimeframe]);

  const generateStaticKarmaData = (currentKarma, timeframe) => {
    const now = new Date();
    const data = [];
    let points = 24; // Default for 1D
    
    switch (timeframe) {
      case '1H':
        points = 12;
        break;
      case '1W':
        points = 7;
        break;
      case '1M':
        points = 30;
        break;
      case '1Y':
        points = 12;
        break;
    }

    // Generate static data points that all show the current karma value
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i - 1) * (timeframe === '1H' ? 5 * 60 * 1000 : timeframe === '1W' ? 24 * 60 * 60 * 1000 : timeframe === '1M' ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000));
      data.push({
        timestamp,
        karma: currentKarma,
        activities: Math.floor(Math.random() * 5) + 1
      });
    }
    return data;
  };

  const timeframes = ['1H', '1D', '1W', '1M', '1Y'];
  
  const currentKarma = karmaBalance;
  const minKarma = Math.min(...chartData.map(d => d.karma));
  const maxKarma = Math.max(...chartData.map(d => d.karma));

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    switch (selectedTimeframe) {
      case '1H':
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      case '1D':
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      case '1W':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '1M':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '1Y':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };

  const getPathData = () => {
    if (chartData.length === 0) return '';
    
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const xStep = (width - 2 * padding) / (chartData.length - 1);
    const yRange = maxKarma - minKarma;
    const yStep = yRange > 0 ? (height - 2 * padding) / yRange : 0;
    
    return chartData.map((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (point.karma - minKarma) * yStep;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>Karma</span>
            <span>›</span>
            <span className="text-white">Your Score</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Your Karma Score</h1>
          </div>
        </div>
      </div>

      {/* Karma Value Display */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          {currentKarma.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <span className="text-sm">Your Current Karma Score</span>
        </div>
      </div>

      {/* Static Chart */}
      <div className="mb-6">
        <div className="relative h-48 bg-gray-800/30 rounded-xl p-4">
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(75, 85, 99, 0.3)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Static horizontal line representing karma value */}
            <line
              x1="20"
              y1="100"
              x2="380"
              y2="100"
              stroke="#00C2A8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Karma indicator point */}
            <circle
              cx="200"
              cy="100"
              r="6"
              fill="#00C2A8"
              stroke="#ffffff"
              strokeWidth="2"
            />
            
            {/* Karma value label */}
            <text
              x="200"
              y="85"
              textAnchor="middle"
              className="text-sm font-bold fill-white"
            >
              Your Karma: {currentKarma.toLocaleString()}
            </text>
            
            {/* Y-axis labels */}
            <text
              x="10"
              y="105"
              textAnchor="end"
              className="text-xs fill-gray-400"
            >
              {currentKarma.toLocaleString()}
            </text>
          </svg>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white">
            <option>Karma</option>
            <option>Activities</option>
            <option>Multiplier</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Current Karma</div>
          <div className="text-xl font-bold text-[#00C2A8]">
            {currentKarma.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className="text-xl font-bold text-green-400">
            Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarmaChart;
