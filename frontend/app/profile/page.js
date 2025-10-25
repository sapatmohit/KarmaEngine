'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import MainLayout from '../components/MainLayout';
import { useKarma } from '../contexts/KarmaContext';
import ApiService from '../services/api';

export default function Profile() {
  const router = useRouter();
  const { karmaBalance, stakeAmount } = useKarma();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('ke_user');
      if (!storedUser) {
        router.push('/auth/login');
      } else {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            dateOfBirth: userData.dateOfBirth || '',
            instagram: userData.socialMedia?.instagram || '',
            facebook: userData.socialMedia?.facebook || '',
            twitter: userData.socialMedia?.twitter || '',
          });
        } catch (e) {
          console.error('Failed to parse user data');
          router.push('/auth/login');
        }
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update user data in backend
      if (user && user.walletAddress) {
        const profileData = {
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter
        };
        
        const response = await ApiService.updateUserProfile(user.walletAddress, profileData);
        
        // Update user data in localStorage
        if (typeof window !== 'undefined') {
          const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            socialMedia: {
              instagram: formData.instagram,
              facebook: formData.facebook,
              twitter: formData.twitter
            }
          };
          
          localStorage.setItem('ke_user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setIsEditing(false);
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for display
  const userData = {
    walletAddress: user.walletAddress || '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    karmaBalance: karmaBalance,
    stakeAmount: stakeAmount,
    tier: stakeAmount >= 500 ? 'Influencer' : stakeAmount >= 100 ? 'Trusted' : 'Regular',
    multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{user.name || 'User'}</h2>
                <p className="text-gray-400 text-sm mt-1">{userData.tier} Tier</p>
                <div className="flex items-center mt-3 px-3 py-1 rounded-full bg-gray-800 text-sm">
                  <span className="text-gray-400 mr-2">Wallet:</span>
                  <span className="font-mono text-xs">
                    {userData.walletAddress.substring(0, 6)}...{userData.walletAddress.substring(userData.walletAddress.length - 4)}
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Karma Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Karma Balance</span>
                  <span className="font-bold text-white">{userData.karmaBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Staked Amount</span>
                  <span className="font-bold text-white">{userData.stakeAmount} XLM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Multiplier</span>
                  <span className="font-bold text-white">x{userData.multiplier}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white">
                        {user.name || 'Not set'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white">
                        {user.email || 'Not set'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-md font-bold text-white mb-4">Social Media</h4>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Instagram</label>
                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="@username"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Facebook</label>
                        <input
                          type="text"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleInputChange}
                          placeholder="username"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Twitter</label>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder="@username"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-gray-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {user.socialMedia?.instagram && (
                        <a
                          href={`https://instagram.com/${user.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                          title="Instagram"
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {user.socialMedia?.facebook && (
                        <a
                          href={`https://facebook.com/${user.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                          title="Facebook"
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {user.socialMedia?.twitter && (
                        <a
                          href={`https://twitter.com/${user.socialMedia.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                          title="Twitter/X"
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {!user.socialMedia?.instagram && !user.socialMedia?.facebook && !user.socialMedia?.twitter && (
                        <p className="text-gray-400 text-sm">No social media accounts linked</p>
                      )}
                    </div>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-md font-bold text-white mb-4">Wallet Information</h4>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                      <p className="font-mono text-sm break-all text-gray-300">{userData.walletAddress}</p>
                    </div>
                  </div>
                )}
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}