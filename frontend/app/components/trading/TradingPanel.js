'use client';

import { useState } from 'react';
import { formatPrice } from '../../types/trading';
import TradingAPI from '../../services/tradingApi';

export default function TradingPanel({ token }) {
  const [activeTab, setActiveTab] = useState('Swap');
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedSellToken, setSelectedSellToken] = useState('ETH');
  const [selectedBuyToken, setSelectedBuyToken] = useState('Select token');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['Swap', 'Limit', 'Buy', 'Sell'];

  const handleSellAmountChange = (value) => {
    setSellAmount(value);
    if (value && !isNaN(value)) {
      const calculatedBuyAmount = (parseFloat(value) * token.currentPrice).toFixed(6);
      setBuyAmount(calculatedBuyAmount);
    } else {
      setBuyAmount('');
    }
  };

  const handleBuyAmountChange = (value) => {
    setBuyAmount(value);
    if (value && !isNaN(value)) {
      const calculatedSellAmount = (parseFloat(value) / token.currentPrice).toFixed(6);
      setSellAmount(calculatedSellAmount);
    } else {
      setSellAmount('');
    }
  };

  const handleSwapTokens = () => {
    const tempToken = selectedSellToken;
    setSelectedSellToken(selectedBuyToken);
    setSelectedBuyToken(tempToken);
    
    const tempAmount = sellAmount;
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  const handleTrade = async (type) => {
    if (!sellAmount && !buyAmount) return;
    
    setIsLoading(true);
    try {
      const tradeData = {
        targetUserId: token.userId,
        type: type,
        amount: parseFloat(type === 'buy' ? buyAmount : sellAmount),
        price: token.currentPrice
      };

      const result = await TradingAPI.executeTrade(tradeData);
      
      if (result.success) {
        // Show success message
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} order executed successfully!`);
        setSellAmount('');
        setBuyAmount('');
      } else {
        alert(`Trade failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Trade failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const TokenInputSection = ({ 
    label, 
    amount, 
    onAmountChange, 
    selectedToken, 
    onTokenSelect, 
    balance = '0.0' 
  }) => (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-600">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-gray-400 text-xs">Balance: {balance}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="flex-1 bg-transparent text-white text-2xl font-bold placeholder-gray-500 focus:outline-none"
        />
        
        <button
          onClick={onTokenSelect}
          className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-full transition-colors"
        >
          {selectedToken !== 'Select token' && (
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          )}
          <span className="text-white font-medium">{selectedToken}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );

  const SwapTab = () => (
    <div className="space-y-4">
      <TokenInputSection
        label="Sell"
        amount={sellAmount}
        onAmountChange={handleSellAmountChange}
        selectedToken={selectedSellToken}
        onTokenSelect={() => {}}
      />
      
      <div className="flex justify-center">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>
      
      <TokenInputSection
        label="Buy"
        amount={buyAmount}
        onAmountChange={handleBuyAmountChange}
        selectedToken={selectedBuyToken}
        onTokenSelect={() => setSelectedBuyToken(token.username.toUpperCase())}
      />
      
      <div className="bg-slate-900 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Rate</span>
          <span className="text-white">1 {token.username.toUpperCase()} = {formatPrice(token.currentPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Network cost</span>
          <span className="text-white">~$12.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price impact</span>
          <span className="text-white">&lt;0.01%</span>
        </div>
      </div>
      
      <button
        onClick={() => handleTrade('swap')}
        disabled={!sellAmount || isLoading}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {isLoading ? 'Processing...' : sellAmount ? 'Swap' : 'Enter an amount'}
      </button>
    </div>
  );

  const BuyTab = () => (
    <div className="space-y-4">
      <TokenInputSection
        label="You pay"
        amount={buyAmount}
        onAmountChange={setBuyAmount}
        selectedToken="ETH"
        onTokenSelect={() => {}}
      />
      
      <button
        onClick={() => handleTrade('buy')}
        disabled={!buyAmount || isLoading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {isLoading ? 'Processing...' : buyAmount ? `Buy ${token.username.toUpperCase()}` : 'Enter an amount'}
      </button>
    </div>
  );

  const SellTab = () => (
    <div className="space-y-4">
      <TokenInputSection
        label="You sell"
        amount={sellAmount}
        onAmountChange={setSellAmount}
        selectedToken={token.username.toUpperCase()}
        onTokenSelect={() => {}}
      />
      
      <button
        onClick={() => handleTrade('sell')}
        disabled={!sellAmount || isLoading}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {isLoading ? 'Processing...' : sellAmount ? `Sell ${token.username.toUpperCase()}` : 'Enter an amount'}
      </button>
    </div>
  );

  const LimitTab = () => (
    <div className="flex items-center justify-center h-40">
      <div className="text-center text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Limit orders coming soon</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Swap':
        return <SwapTab />;
      case 'Buy':
        return <BuyTab />;
      case 'Sell':
        return <SellTab />;
      case 'Limit':
        return <LimitTab />;
      default:
        return <SwapTab />;
    }
  };

  return (
    <div className="p-6 h-full">
      {/* Tab Navigation */}
      <div className="bg-slate-900 rounded-lg p-1 mb-6">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
