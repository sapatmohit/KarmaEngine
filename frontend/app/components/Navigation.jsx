'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlassButton from './GlassButton';

const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Activities', path: '/activities' },
    { name: 'Staking', path: '/staking' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <nav className="glass-effect py-4 px-6 flex justify-between items-center mb-8">
      <div className="flex items-center space-x-10">
        <Link href="/" className="text-gradient text-2xl font-bold">
          KarmaChain
        </Link>
        
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${
                pathname === item.path
                  ? 'text-primary font-medium'
                  : 'text-gray-400 hover:text-white'
              } transition-colors duration-200`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <GlassButton variant="primary" className="px-4 py-2 text-sm">
          Connect Wallet
        </GlassButton>
      </div>
    </nav>
  );
};

export default Navigation;