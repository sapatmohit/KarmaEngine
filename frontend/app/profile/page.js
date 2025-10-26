'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useKarma } from '../contexts/KarmaContext';
import ApiService from '../services/api';

export default function Profile() {
  const router = useRouter();
  const { karmaBalance, stakeAmount } = useKarma();
  const { user, connectWallet, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletConnectionError, setWalletConnectionError] = useState('');
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
      if (!user) {
        router.push('/auth/login');
      } else {
        setUserData(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          dateOfBirth: user.dateOfBirth || '',
          instagram: user.socialMedia?.instagram || '',
          facebook: user.socialMedia?.facebook || '',
          twitter: user.socialMedia?.twitter || '',
        });
      }
    }
    setIsLoading(false);
  }, [user, router]);

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
      if (userData && userData.walletAddress) {
        const profileData = {
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter
        };
        
        const response = await ApiService.updateUserProfile(userData.walletAddress, profileData);
        
        // Update user data in localStorage
        if (typeof window !== 'undefined') {
          const updatedUser = {
            ...userData,
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
          setUserData(updatedUser);
          setIsEditing(false);
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    setWalletConnectionError('');
    
    try {
      const result = await connectWallet();
      if (result.isNewUser) {
        // Handle new user registration if needed
        console.log('New wallet connected:', result.walletAddress);
      } else {
        // User already exists
        setUserData(result.user);
      }
    } catch (err) {
      setWalletConnectionError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const getTierInfo = (stake) => {
    if (stake >= 500) return { name: 'Influencer', color: 'from-purple-500 to-pink-500' };
    if (stake >= 100) return { name: 'Trusted', color: 'from-blue-500 to-cyan-500' };
    return { name: 'Regular', color: 'from-gray-500 to-gray-600' };
  };

  const getMultiplier = (stake) => {
    if (stake >= 500) return 2;
    if (stake >= 100) return 1.5;
    return 1;
  };

  const tierInfo = getTierInfo(stakeAmount);
  const multiplier = getMultiplier(stakeAmount);

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

  if (!userData) {
    return null;
  }

  // Mock data for additional wallets
  const connectedWallets = [
    { id: 1, name: 'Stellar', address: userData.walletAddress, type: 'primary', balance: '1,245.32 XLM' },
    // Add more wallets as needed
  ];

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
            <GlassCard className="text-center">
              <div className="flex flex-col items-center">
                {/* User Avatar */}
                <div className="relative mb-4">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                      onError={(e) => {
                        // Fallback to initial-based avatar if image fails to load
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        document.getElementById('fallback-avatar').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback avatar with user's initial */}
                  <div 
                    id="fallback-avatar"
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ display: userData.avatar ? 'none' : 'flex' }}
                  >
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">{userData.name || 'User'}</h2>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${tierInfo.color} text-white`}>
                    {tierInfo.name} Tier
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Multiplier: <span className="font-bold">x{multiplier}</span>
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Karma Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Karma Balance</span>
                    <span className="font-bold text-white flex items-center">
                      <img src="./karma_token_icon.svg" alt="Karma Token" className="w-4 h-4 mr-1" />
                      {karmaBalance}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (karmaBalance / 1000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Staked Amount</span>
                    <span className="font-bold text-white">{stakeAmount} XLM</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stakeAmount / 500) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Multiplier</span>
                  <span className="font-bold text-white">x{multiplier}</span>
                </div>
              </div>
            </GlassCard>

            {/* Wallet Section */}
            <GlassCard>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Wallets</h3>
                <button 
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                  className="text-sm px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all disabled:opacity-50"
                >
                  {isConnectingWallet ? 'Connecting...' : 'Add Wallet'}
                </button>
              </div>
              
              {walletConnectionError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  {walletConnectionError}
                </div>
              )}
              
              <div className="space-y-3">
                {connectedWallets.map((wallet) => (
                  <div 
                    key={wallet.id} 
                    className={`p-3 rounded-lg border ${wallet.type === 'primary' ? 'border-purple-500/50 bg-purple-900/20' : 'border-gray-700 bg-gray-800/30'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{wallet.name}</span>
                          {wallet.type === 'primary' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Primary</span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-gray-400 mt-1 truncate">{wallet.address}</p>
                      </div>
                      <span className="text-sm font-medium text-white">{wallet.balance}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button 
                  onClick={logout}
                  className="w-full py-2 text-center text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  Disconnect All Wallets
                </button>
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
                        {userData.name || 'Not set'}
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
                        {userData.email || 'Not set'}
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
                        {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
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
                      {userData.socialMedia?.instagram && (
                        <a
                          href={`https://instagram.com/${userData.socialMedia.instagram.replace('@', '')}`}
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
                      {userData.socialMedia?.facebook && (
                        <a
                          href={`https://facebook.com/${userData.socialMedia.facebook}`}
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
                      {userData.socialMedia?.twitter && (
                        <a
                          href={`https://twitter.com/${userData.socialMedia.twitter.replace('@', '')}`}
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
                      {!userData.socialMedia?.instagram && !userData.socialMedia?.facebook && !userData.socialMedia?.twitter && (
                        <p className="text-gray-400 text-sm">No social media accounts linked</p>
                      )}
                    </div>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-md font-bold text-white mb-4">Wallet Information</h4>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Primary Wallet Address</p>
                      <p className="font-mono text-sm break-all text-gray-300">{userData.walletAddress}</p>
                    </div>
                  </div>
                )}
              </form>
            </GlassCard>
            
            {/* Additional Features Card */}
            <GlassCard className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Notifications</h4>
                  <p className="text-sm text-gray-400 mb-3">Manage your notification preferences</p>
                  <button className="text-sm text-purple-400 hover:text-purple-300">Configure</button>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Security</h4>
                  <p className="text-sm text-gray-400 mb-3">Update your password and security settings</p>
                  <button className="text-sm text-purple-400 hover:text-purple-300">Manage</button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}