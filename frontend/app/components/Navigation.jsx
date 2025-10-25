'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Track', path: '/activities' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Staking', path: '/staking' },
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

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left">
              <div className="text-white font-medium text-sm">{user?.name || 'User'}</div>
              <div className="text-gray-400 text-xs">{user?.karmaPoints || 0} Karma</div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">@{user?.username}</div>
                    <div className="text-purple-400 text-sm">{user?.karmaPoints || 0} Karma Points</div>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
                <div className="border-t border-slate-700 my-2"></div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;