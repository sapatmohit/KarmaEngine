'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Trade', href: '/trade', active: pathname.startsWith('/trade') },
    { name: 'Explore', href: '/explore', active: pathname.startsWith('/explore') },
    { name: 'Pool', href: '/pool', active: pathname.startsWith('/pool') }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Uniswap</span>
            </Link>

            <nav className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tokens and pools"
                className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="inline-flex items-center px-2 py-1 border border-slate-600 rounded text-xs text-gray-400">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-sm">0xa88C...f6dd</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
