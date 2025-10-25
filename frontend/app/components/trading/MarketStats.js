'use client';

import { formatNumber } from '../../types/trading';

export default function MarketStats({ token }) {
  const stats = [
    { label: 'TVL', value: formatNumber(token.totalSupply) },
    { label: 'Market cap', value: formatNumber(token.marketCap) },
    { label: 'FDV', value: formatNumber(token.marketCap * 1.2) },
    { label: '1 day volume', value: formatNumber(token.volume24h) },
    { label: 'Karma Score', value: formatNumber(token.karmaScore) },
    { label: 'Holders', value: '1,247' }
  ];

  const socialLinks = [
    { 
      name: 'Etherscan', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Website', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="mt-6 bg-slate-800 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-semibold text-white">Stats</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="text-white font-semibold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="border-t border-slate-700 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-white font-medium">Info</h4>
        </div>

        {/* Social Links */}
        <div className="flex space-x-3 mb-4">
          {socialLinks.map((link, index) => (
            <button
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        {token.description && (
          <div className="text-gray-400 text-sm leading-relaxed">
            {token.description}
          </div>
        )}
      </div>
    </div>
  );
}
