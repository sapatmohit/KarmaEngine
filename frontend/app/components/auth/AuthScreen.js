'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthScreen() {
  const { connectWallet, registerUser, isConnecting } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setError('');
      const result = await connectWallet();
      
      if (result.isNewUser) {
        setWalletAddress(result.walletAddress);
        setShowRegister(true);
      }
      // If not new user, they'll be automatically logged in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');

    try {
      const userData = {
        walletAddress,
        ...formData,
      };

      await registerUser(userData);
      // User will be automatically logged in after registration
    } catch (error) {
      setError(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!showRegister ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl"
            >
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">K</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Karma Engine</h1>
                <p className="text-gray-400">Connect your wallet to get started</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Connect Wallet Button */}
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>

              {/* Features */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm">Earn karma through activities</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-sm">Stake karma for multipliers</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm">Secure blockchain integration</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Complete Registration</h1>
                <p className="text-gray-400 text-sm">Fill in your details to get started</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Social Media (Optional)</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Profile URL"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
