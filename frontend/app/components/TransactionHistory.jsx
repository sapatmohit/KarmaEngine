'use client';

import { useState } from 'react';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [copiedId, setCopiedId] = useState(null);
  const [displayedTransactions, setDisplayedTransactions] = useState(8);

  // Mock transaction data with karma activity types
  const allTransactions = [
    {
      id: 1,
      time: '48s',
      type: 'Post',
      karmaAmount: '5.0',
      network: 'Instagram',
      xlmAmount: '0.5',
      transactionId: '0xaFE1...671A',
      fullTransactionHash: 'aFE1b2c3d4e5f6789012345678901234567890abcd671A'
    },
    {
      id: 2,
      time: '48s',
      type: 'Comment',
      karmaAmount: '3.0',
      network: 'Facebook',
      xlmAmount: '0.3',
      transactionId: '0xeCa2...6456',
      fullTransactionHash: 'eCa2b3c4d5e6f789012345678901234567890abcde6456'
    },
    {
      id: 3,
      time: '48s',
      type: 'Like',
      karmaAmount: '1.0',
      network: 'X',
      xlmAmount: '0.1',
      transactionId: '0x73ad...5805',
      fullTransactionHash: '73adc4d5e6f789012345678901234567890abcdef5805'
    },
    {
      id: 4,
      time: '48s',
      type: 'Repost',
      karmaAmount: '2.0',
      network: 'Instagram',
      xlmAmount: '0.2',
      transactionId: '0xe9Fb...b442',
      fullTransactionHash: 'e9Fbc5d6e7f890123456789012345678901bcdefgb442'
    },
    {
      id: 5,
      time: '1m',
      type: 'Report',
      karmaAmount: '-5.0',
      network: 'Facebook',
      xlmAmount: '-0.5',
      transactionId: '0xC5cE...77E0',
      fullTransactionHash: 'C5cEd6e7f890123456789012345678901cdefgh77E0'
    },
    {
      id: 6,
      time: '2m',
      type: 'Post',
      karmaAmount: '4.5',
      network: 'X',
      xlmAmount: '0.45',
      transactionId: '0x9B2f...3A1C',
      fullTransactionHash: '9B2fe7f890123456789012345678901defghij3A1C'
    },
    {
      id: 7,
      time: '3m',
      type: 'Comment',
      karmaAmount: '2.5',
      network: 'Instagram',
      xlmAmount: '0.25',
      transactionId: '0x4D7e...8F9B',
      fullTransactionHash: '4D7ef890123456789012345678901efghijk8F9B'
    },
    {
      id: 8,
      time: '5m',
      type: 'Like',
      karmaAmount: '1.5',
      network: 'Facebook',
      xlmAmount: '0.15',
      transactionId: '0x2A8c...6E3D',
      fullTransactionHash: '2A8cf90123456789012345678901fghijkl6E3D'
    },
    {
      id: 9,
      time: '7m',
      type: 'Post',
      karmaAmount: '6.0',
      network: 'Instagram',
      xlmAmount: '0.6',
      transactionId: '0x1B3d...9C2E',
      fullTransactionHash: '1B3df0123456789012345678901ghijklm9C2E'
    },
    {
      id: 10,
      time: '8m',
      type: 'Comment',
      karmaAmount: '3.5',
      network: 'Facebook',
      xlmAmount: '0.35',
      transactionId: '0x7F4a...5D8B',
      fullTransactionHash: '7F4af1234567890123456789012hijklmn5D8B'
    },
    {
      id: 11,
      time: '10m',
      type: 'Like',
      karmaAmount: '2.0',
      network: 'X',
      xlmAmount: '0.2',
      transactionId: '0x9E5b...3F7C',
      fullTransactionHash: '9E5bf2345678901234567890123ijklmno3F7C'
    },
    {
      id: 12,
      time: '12m',
      type: 'Repost',
      karmaAmount: '4.0',
      network: 'Instagram',
      xlmAmount: '0.4',
      transactionId: '0x2C6d...8A9E',
      fullTransactionHash: '2C6df3456789012345678901234jklmnop8A9E'
    }
  ];

  const transactions = allTransactions.slice(0, displayedTransactions);

  const handleLoadMore = () => {
    setDisplayedTransactions(prev => Math.min(prev + 8, allTransactions.length));
  };

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
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'twitter':
      case 'x':
        return (
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
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

  const handleTransactionClick = (transactionHash) => {
    const stellarExplorerUrl = `https://stellar.expert/explorer/testnet/tx/${transactionHash}`;
    window.open(stellarExplorerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyTransactionId = async (transactionHash, transactionId) => {
    try {
      await navigator.clipboard.writeText(transactionHash);
      setCopiedId(transactionId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy transaction ID:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = transactionHash;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(transactionId);
      setTimeout(() => setCopiedId(null), 2000);
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
              <tr
                key={transaction.id}
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
                <td className="py-3 px-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTransactionClick(transaction.fullTransactionHash)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 font-mono transition-colors group"
                      title="View on Stellar Explorer"
                    >
                      <span>{transaction.transactionId}</span>
                      <svg 
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCopyTransactionId(transaction.fullTransactionHash, transaction.transactionId)}
                      className="p-1 text-gray-500 hover:text-green-400 transition-colors group"
                      title="Copy transaction ID"
                    >
                      {copiedId === transaction.transactionId ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {displayedTransactions < allTransactions.length && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
