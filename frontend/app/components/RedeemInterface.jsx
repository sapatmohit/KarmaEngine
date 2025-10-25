'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const RedeemInterface = () => {
  const [activeTab, setActiveTab] = useState('redeem');
  const [karmaAmount, setKarmaAmount] = useState('');
  const [xlmAmount, setXlmAmount] = useState('');
  const [selectedKarmaToken, setSelectedKarmaToken] = useState('KARMA');
  const [selectedXlmToken, setSelectedXlmToken] = useState('XLM');

  // Mock exchange rate (1 KARMA = 0.1 XLM)
  const exchangeRate = 0.1;

  const handleKarmaChange = (value) => {
    setKarmaAmount(value);
    if (value && !isNaN(value)) {
      setXlmAmount((parseFloat(value) * exchangeRate).toFixed(6));
    } else {
      setXlmAmount('');
    }
  };

  const handleXlmChange = (value) => {
    setXlmAmount(value);
    if (value && !isNaN(value)) {
      setKarmaAmount((parseFloat(value) / exchangeRate).toFixed(2));
    } else {
      setKarmaAmount('');
    }
  };

  const handleMaxKarma = () => {
    setKarmaAmount('1250'); // Mock max karma
    setXlmAmount((1250 * exchangeRate).toFixed(6));
  };

  const handleRedeem = () => {
    if (karmaAmount && xlmAmount) {
      // Handle redeem logic here
      console.log(`Redeeming ${karmaAmount} KARMA for ${xlmAmount} XLM`);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'redeem', name: 'Redeem' },
            { id: 'limit', name: 'Limit' },
            { id: 'buy', name: 'Buy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Redeem Section */}
      <div className="space-y-4">
        {/* Karma Input */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Redeem</span>
            <span className="text-sm text-gray-400">Balance: 1,250 KARMA</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={karmaAmount}
              onChange={(e) => handleKarmaChange(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleMaxKarma}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              MAX
            </button>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            ≈ {(parseFloat(karmaAmount || 0) * exchangeRate).toFixed(6)} XLM
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0-4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>

        {/* XLM Output */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Receive</span>
            <span className="text-sm text-gray-400">Balance: 0 XLM</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={xlmAmount}
              onChange={(e) => handleXlmChange(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-500 focus:outline-none"
              readOnly
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            ≈ ${(parseFloat(xlmAmount || 0) * 0.5).toFixed(2)} USD
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-gray-800/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-white">1 KARMA = {exchangeRate} XLM</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white">0.001 XLM</span>
          </div>
        </div>

        {/* Redeem Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRedeem}
          disabled={!karmaAmount || !xlmAmount}
          className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
            karmaAmount && xlmAmount
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {karmaAmount && xlmAmount ? 'Redeem Karma' : 'Enter Amount'}
        </motion.button>

        {/* Connect Wallet Notice */}
        {!karmaAmount && (
          <div className="text-center py-8">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemInterface;
