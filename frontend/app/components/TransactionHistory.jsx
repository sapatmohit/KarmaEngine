'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  // Mock transaction data with karma activity types
  const transactions = [
    {
      id: 1,
      time: '48s',
      type: 'Post',
      karmaAmount: '5.0',
      network: 'Instagram',
      xlmAmount: '0.5',
      transactionId: '0xaFE1...671A'
    },
    {
      id: 2,
      time: '48s',
      type: 'Comment',
      karmaAmount: '3.0',
      network: 'Facebook',
      xlmAmount: '0.3',
      transactionId: '0xeCa2...6456'
    },
    {
      id: 3,
      time: '48s',
      type: 'Like',
      karmaAmount: '1.0',
      network: 'Twitter',
      xlmAmount: '0.1',
      transactionId: '0x73ad...5805'
    },
    {
      id: 4,
      time: '48s',
      type: 'Repost',
      karmaAmount: '2.0',
      network: 'Instagram',
      xlmAmount: '0.2',
      transactionId: '0xe9Fb...b442'
    },
    {
      id: 5,
      time: '1m',
      type: 'Report',
      karmaAmount: '-5.0',
      network: 'Facebook',
      xlmAmount: '-0.5',
      transactionId: '0xC5cE...77E0'
    },
    {
      id: 6,
      time: '2m',
      type: 'Post',
      karmaAmount: '4.5',
      network: 'Twitter',
      xlmAmount: '0.45',
      transactionId: '0x9B2f...3A1C'
    },
    {
      id: 7,
      time: '3m',
      type: 'Comment',
      karmaAmount: '2.5',
      network: 'Instagram',
      xlmAmount: '0.25',
      transactionId: '0x4D7e...8F9B'
    },
    {
      id: 8,
      time: '5m',
      type: 'Like',
      karmaAmount: '1.5',
      network: 'Facebook',
      xlmAmount: '0.15',
      transactionId: '0x2A8c...6E3D'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'post':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          </div>
        );
      case 'comment':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          </div>
        );
      case 'like':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          </div>
        );
      case 'repost':
        return (
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          </div>
        );
      case 'report':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
          </div>
        );
    }
  };

  const getSocialMediaIcon = (network) => {
    switch (network.toLowerCase()) {
      case 'instagram':
        return (
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">I</span>
          </div>
        );
      case 'facebook':
        return (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
        );
      case 'twitter':
        return (
          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">?</span>
          </div>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'post':
        return 'text-blue-400';
      case 'comment':
        return 'text-green-400';
      case 'like':
        return 'text-yellow-400';
      case 'repost':
        return 'text-purple-400';
      case 'report':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-6">
        {[
          { id: 'transactions', name: 'Transactions' },
          { id: 'pools', name: 'Pools' }
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Time</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400 flex items-center">
                ◊ Type
                <svg className="w-4 h-4 ml-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Karma</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">For</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">XLM</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: transaction.id * 0.1 }}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-2 text-sm text-gray-300">{transaction.time}</td>
                <td className="py-3 px-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {/* {getActivityIcon(transaction.type)} */}
                    <span className={getTypeColor(transaction.type)}>{transaction.type}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-sm text-white font-mono">{transaction.karmaAmount}</td>
                <td className="py-3 px-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {getSocialMediaIcon(transaction.network)}
                    <span className="text-gray-300">{transaction.network}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-sm text-white">{transaction.xlmAmount}</td>
                <td className="py-3 px-2 text-sm text-gray-400 font-mono">{transaction.transactionId}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
          Load More Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
