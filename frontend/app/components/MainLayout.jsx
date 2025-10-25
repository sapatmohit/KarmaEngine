'use client';

import Navigation from './Navigation';
import { useState, useEffect } from 'react';

const MainLayout = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="glass-effect h-16 mb-8 rounded-xl"></div>
            <div className="space-y-6">
              <div className="glass-effect h-64 rounded-xl"></div>
              <div className="glass-effect h-32 rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-effect h-48 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;