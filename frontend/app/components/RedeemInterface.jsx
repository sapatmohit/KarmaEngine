'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';

const RedeemInterface = () => {
  const { karmaBalance, redeemKarma } = useKarma();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('redeem');
  const [karmaAmount, setKarmaAmount] = useState('');
  const [xlmAmount, setXlmAmount] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Exchange rate from smart contract (10 karma = 1 XLM)
  const exchangeRate = 0.1; // 1 KARMA = 0.1 XLM

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
    setKarmaAmount(karmaBalance.toString());
    setXlmAmount((karmaBalance * exchangeRate).toFixed(6));
  };

  const handleRedeem = async () => {
    if (!karmaAmount || !xlmAmount) {
      setError('Please enter an amount to redeem');
      return;
    }

    const karmaValue = parseFloat(karmaAmount);
    if (karmaValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (karmaValue > karmaBalance) {
      setError('Insufficient karma balance');
      return;
    }

    setIsRedeeming(true);
    setError('');
    setSuccess('');

    try {
      await redeemKarma(karmaValue);
      setSuccess(`Successfully redeemed ${karmaAmount} KARMA for ${xlmAmount} XLM!`);
      setKarmaAmount('');
      setXlmAmount('');
    } catch (err) {
      setError(err.message || 'Failed to redeem karma');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
      {/* Header Title */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Redeem Karma</h3>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Swap Interface */}
      <div className="space-y-4">
        {/* Redeem Panel (Karma) */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Redeem</span>
            <span className="text-sm text-gray-400">Balance: {karmaBalance?.toLocaleString() || 0} KARMA</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                value={karmaAmount}
                onChange={(e) => handleKarmaChange(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none"
              />
              <div className="text-sm text-gray-400 mt-1">
                ≈ {(parseFloat(karmaAmount || 0) * exchangeRate).toFixed(6)} XLM
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleMaxKarma}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                MAX
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
                <div className="w-6 h-6">
                  <img src="./karma_token_icon.svg" alt="Karma Token" className="w-6 h-6" />
                </div>
                <span>KARMA</span>
              </button>
            </div>
          </div>
        </div>

        {/* XLM Panel */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">XLM</span>
            <span className="text-sm text-gray-400">Balance: 0 XLM</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                value={xlmAmount}
                onChange={(e) => handleXlmChange(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none"
                readOnly
              />
              <div className="text-sm text-gray-400 mt-1">
                ≈ ${(parseFloat(xlmAmount || 0) * 0.5).toFixed(2)} USD
              </div>
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">X</span>
              </div>
              <span>XLM</span>
            </button>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-gray-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-white">1 KARMA = {exchangeRate} XLM</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white">0.001 XLM</span>
          </div>
        </div>

        {/* Redeem Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRedeem}
          disabled={isRedeeming}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {isRedeeming ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Redeeming...
            </div>
          ) : (
            'Redeem'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default RedeemInterface;