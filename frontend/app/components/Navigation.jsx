'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Track', path: '/activities' },
    { name: 'Explore', path: '/leaderboard' },
    { name: 'Pool', path: '/staking' },
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 py-4 px-6 flex justify-between items-center mb-8">
      {/* Left Section */}
      <div className="flex items-center space-x-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-white text-xl font-bold">Karma Engine</span>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${
                pathname === item.path
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              } transition-colors duration-200`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Center Search Bar */}
      <div className="flex-1 flex justify-center px-8">
        <div className={`relative ${isSearchFocused ? 'w-96' : 'w-80'} transition-all duration-300`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search karma activities and users"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded">/</kbd>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Button */}
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>

        {/* Connect Wallet Button */}
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navigation;