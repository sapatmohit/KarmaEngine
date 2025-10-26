'use client';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useKarma } from '../contexts/KarmaContext';
import { FullscreenChartModal, ImageCaptureModal, SocialShareModal } from './ChartModals';

const KarmaChart = ({ karmaData = [] }) => {
  const { karmaBalance } = useKarma();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [chartView, setChartView] = useState('area'); // 'area' | 'bar'
  const chartRef = useRef(null);

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

  // Interactive functions
  const handleCopyChart = async () => {
    if (chartRef.current) {
      try {
        // Hide action buttons during capture
        const actionButtons = chartRef.current.querySelectorAll('.chart-action-button');
        actionButtons.forEach(btn => btn.style.display = 'none');
        
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#1e293b',
          scale: 2,
          useCORS: true
        });
        const imageData = canvas.toDataURL('image/png');
        
        // Restore action buttons
        actionButtons.forEach(btn => btn.style.display = '');
        
        setCapturedImage(imageData);
        setShowImageModal(true);
      } catch (error) {
        console.error('Error capturing chart:', error);
      }
    }
  };

  const handleShareChart = () => {
    setShowShareModal(true);
  };

  const handleExpandChart = () => {
    setIsFullscreen(true);
  };


  const handleImageShare = () => {
    setShowImageModal(false);
    setShowShareModal(true);
  };

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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6" ref={chartRef}>
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
              <div className="w-12 h-12">
                <img src="./karma_token_icon.svg" alt="Karma Token" className="w-12 h-12" />
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
                {/* Graph icon */}
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 13l3 3 5-7 4 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chart style toggle icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartView('area')}
              className={`chart-action-button inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
                chartView === 'area' ? 'bg-white/10 border-slate-600 text-white' : 'bg-slate-900 border-slate-700 text-gray-300 hover:text-white'
              }`}
              title="Area chart"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="M7 15l4-6 4 5 3-4"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setChartView('bar')}
              className={`chart-action-button inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
                chartView === 'bar' ? 'bg-white/10 border-slate-600 text-white' : 'bg-slate-900 border-slate-700 text-gray-300 hover:text-white'
              }`}
              title="Bar chart"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <rect x="6" y="10" width="3" height="7"/>
                <rect x="11" y="7" width="3" height="10"/>
                <rect x="16" y="12" width="3" height="5"/>
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

      {/* Timeframe Controls - segmented */}
      <div className="mt-6 mb-6 inline-flex rounded-full bg-slate-900 p-1 border border-slate-700">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-white/10 text-white border border-slate-600 shadow-inner'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorKarma" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={formatTimestamp} domain={["dataMin", "dataMax"]} type="number" scale="time" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} domain={["dataMin - 50", "dataMax + 50"]} orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="karma" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth={2} fill="url(#colorKarma)" dot={false} activeDot={{ r: 4, fill: isPositive ? "#10b981" : "#ef4444", stroke: '#1e293b', strokeWidth: 2 }} />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={formatTimestamp} domain={["dataMin", "dataMax"]} type="number" scale="time" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="activities" fill="#64748b" radius={[4,4,0,0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom-left chart action buttons */}
      <div className="mt-4 inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full p-1">
        <button type="button" onClick={handleCopyChart} className="chart-action-button inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-300 hover:text-white hover:bg-white/5" title="Copy image">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <button type="button" onClick={handleShareChart} className="chart-action-button inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-300 hover:text-white hover:bg-white/5" title="Share">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <path d="M8.59 13.51l6.83 3.98"/>
            <path d="M15.41 6.51L8.59 10.5"/>
          </svg>
        </button>
        <button type="button" onClick={handleExpandChart} className="chart-action-button inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-300 hover:text-white hover:bg-white/5" title="Expand">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6"/>
            <path d="M21 3l-7 7"/>
            <path d="M9 21H3v-6"/>
            <path d="M3 21l7-7"/>
          </svg>
        </button>
      </div>

      {/* Modals */}
      <ImageCaptureModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        capturedImage={capturedImage}
        onShare={handleImageShare}
      />
      
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={window.location.href}
        shareText={`Check out my Karma Score: ${currentKarma.toLocaleString()} KARMA!`}
      />
      
      <FullscreenChartModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full h-full flex flex-col">
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
                  <div className="w-12 h-12">
                    <img src="./karma_token_icon.svg" alt="Karma Token" className="w-12 h-12" />
                  </div>
                </div>

                {/* Token Details */}
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-white">Your Karma Score</h1>
                    <span className="text-gray-400 text-lg">KARMA</span>
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
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

          {/* Timeframe Controls - segmented */}
          <div className="mt-6 mb-6 inline-flex rounded-full bg-slate-900 p-1 border border-slate-700">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-white/10 text-white border border-slate-600 shadow-inner'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorKarmaFullscreen" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorKarmaFullscreen)"
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

          {/* Bottom chart controls removed per design (fullscreen) */}
        </div>
      </FullscreenChartModal>
    </div>
  );
};

export default KarmaChart;
