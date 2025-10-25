'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TradingAPI from '../services/tradingApi';
import TokenHeader from '../components/trading/TokenHeader';
import PriceChart from '../components/trading/PriceChart';
import TradingPanel from '../components/trading/TradingPanel';
import MarketStats from '../components/trading/MarketStats';
import Navigation from '../components/trading/Navigation';

export default function TradePage() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('token') || 'user1';
  
  const [selectedToken, setSelectedToken] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeframes = ['1H', '1D', '1W', '1M', '1Y'];

  useEffect(() => {
    loadTokenData();
  }, [tokenId, selectedTimeframe]);

  const loadTokenData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load token data
      const tokenResponse = await TradingAPI.getKarmaToken(tokenId);
      if (!tokenResponse.success) {
        throw new Error(tokenResponse.error);
      }

      // Load price history
      const priceResponse = await TradingAPI.getPriceHistory(tokenId, selectedTimeframe);
      if (!priceResponse.success) {
        throw new Error(priceResponse.error);
      }

      setSelectedToken(tokenResponse.data);
      setPriceHistory(priceResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error loading token data</div>
          <div className="text-gray-400">{error}</div>
          <button 
            onClick={loadTokenData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selectedToken) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Token not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex">
        {/* Left Side - Chart and Token Info */}
        <div className="flex-1 p-6">
          {/* Token Header */}
          <TokenHeader token={selectedToken} />

          {/* Price Chart */}
          <div className="mt-6 bg-slate-800 rounded-xl p-6">
            {/* Chart Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTimeframeChange(timeframe)}
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
              
              <div className="flex space-x-2">
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

            {/* Chart Component */}
            <PriceChart 
              data={priceHistory} 
              timeframe={selectedTimeframe}
              token={selectedToken}
            />
          </div>

          {/* Market Stats */}
          <MarketStats token={selectedToken} />
        </div>

        {/* Right Side - Trading Panel */}
        <div className="w-96 bg-slate-800 border-l border-slate-700">
          <TradingPanel token={selectedToken} />
        </div>
      </div>
    </div>
  );
}
