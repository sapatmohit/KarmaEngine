'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data for search
  const mockSearchData = [
    { id: 1, type: 'user', name: 'CryptoKing', avatar: '👤' },
    { id: 2, type: 'user', name: 'DeFiMaster', avatar: '👤' },
    { id: 3, type: 'user', name: 'BlockchainPro', avatar: '👤' },
    { id: 4, type: 'activity', name: 'Post Activity', description: 'Earn karma from posts' },
    { id: 5, type: 'activity', name: 'Comment Activity', description: 'Earn karma from comments' },
    { id: 6, type: 'activity', name: 'Like Activity', description: 'Earn karma from likes' },
    { id: 7, type: 'activity', name: 'Repost Activity', description: 'Earn karma from reposts' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = mockSearchData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filtered);
  };

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('ke_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user data');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ke_user');
      localStorage.removeItem('ke_wallet');
    }
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/auth/login');
  };

  // Hide navigation on auth pages
  if (pathname?.includes('/auth/')) {
    return null;
  }
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    // { name: 'Track', path: '/activities' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Staking', path: '/staking' },
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 py-4 px-6 flex justify-between items-center mb-8">
      {/* Left Section */}
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-2">
          <img src="./karma_token_icon.svg" alt="Karma Token" className="w-6 h-6 mr-1 rounded-full" />
          <span className="text-white text-xl font-bold">Karma Engine</span>
        </div>
        
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
      <div className="flex-1 flex justify-center px-4">
        <div className={`relative w-full max-w-md transition-all duration-300`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search karma activities and users"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded">/</kbd>
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-[100] max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setIsSearchFocused(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-800/30 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        {result.type === 'user' ? (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                              {result.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{result.name}</p>
                              <p className="text-xs text-gray-400">User</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm">
                              ⚡
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{result.name}</p>
                              <p className="text-xs text-gray-400">{result.description}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
                  <p className="text-gray-500 text-xs mt-1">Try searching for users or activities</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* User Profile or Auth Buttons */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="hidden sm:inline text-sm">{user.name?.split(' ')[0] || 'User'}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.walletAddress}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;