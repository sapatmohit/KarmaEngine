'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userAPI } from '../../utils/api';
import * as FreighterAPI from '@stellar/freighter-api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    country: '',
    referralCode: '',
    referralCode2: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullname || formData.fullname.trim().length < 2) {
      setError('Please enter a valid full name');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.country) {
      setError('Please select your country');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.walletAddress) {
      setError('Please provide a wallet address either by connecting your wallet or pasting it manually');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      // Mock registration - in a real app, this would call an actual registration API
      // For now, we'll simulate a successful registration and store user data
      
      // Create mock user data
      const mockUser = {
        id: 'user_' + Date.now(),
        email: formData.email,
        name: formData.fullname,
        walletAddress: formData.walletAddress,
        registered: true,
        createdAt: new Date().toISOString()
      };
      
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('ke_user', JSON.stringify(mockUser));
      }
      
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if Freighter is available on component mount
    const checkFreighter = async () => {
      try {
        console.log('Checking Freighter availability...');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('Not in browser environment, skipping Freighter check');
          return;
        }
        
        // Check if Freighter API is available
        if (typeof FreighterAPI === 'undefined') {
          console.warn('Freighter API is not available');
          return;
        }
        
        console.log('FreighterAPI object:', FreighterAPI);
        console.log('window.freighter:', window.freighter);
        
        const isAllowed = await FreighterAPI.isAllowed();
        console.log('Freighter isAllowed:', isAllowed);
        if (!isAllowed) {
          console.warn('Freighter wallet extension not detected or not allowed');
          // Try to request access
          if (typeof FreighterAPI.requestAccess === 'function') {
            console.log('Freighter requestAccess function is available');
          } else {
            console.log('Freighter requestAccess function is NOT available');
          }
        } else {
          console.log('Freighter wallet extension detected and allowed');
        }
      } catch (err) {
        console.warn('Freighter check failed:', err);
      }
    };
    
    checkFreighter();
  }, []);

  const connectWallet = async () => {
    setError('');
    setIsConnectingWallet(true);
    console.log('Attempting to connect wallet...');

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        const errorMessage = 'Wallet connection is only available in browser environment.';
        console.error(errorMessage);
        setError(errorMessage);
        setIsConnectingWallet(false);
        return;
      }

      // Check if Freighter API is available
      console.log('FreighterAPI object:', FreighterAPI);
      if (typeof FreighterAPI === 'undefined') {
        const errorMessage = 'Freighter API is not available. Please install the Freighter wallet extension.';
        console.error(errorMessage);
        setError(errorMessage);
        setIsConnectingWallet(false);
        return;
      }

      // Also check if Freighter is available on window object (alternative method)
      console.log('window.freighter:', window.freighter);
      
      // Check if Freighter is allowed
      console.log('Checking if Freighter is allowed...');
      const isAllowed = await FreighterAPI.isAllowed();
      console.log('Freighter isAllowed result:', isAllowed);
      
      if (!isAllowed) {
        // Try alternative method to check if extension is installed
        if (typeof window.freighter === 'undefined') {
          const errorMessage = 'Freighter wallet extension is not installed. Please install it from the Chrome Web Store.';
          console.error(errorMessage);
          setError(errorMessage);
          setIsConnectingWallet(false);
          return;
        }
        
        // If extension is installed but not allowed, request permission
        if (typeof FreighterAPI.requestAccess === 'function') {
          console.log('Requesting access to Freighter...');
          const accessGranted = await FreighterAPI.requestAccess();
          console.log('Access granted:', accessGranted);
          if (!accessGranted) {
            const errorMessage = 'Access to Freighter wallet was denied.';
            console.error(errorMessage);
            setError(errorMessage);
            setIsConnectingWallet(false);
            return;
          }
        } else {
          const errorMessage = 'Freighter wallet extension is not allowed. Please enable it in your browser extensions.';
          console.error(errorMessage);
          setError(errorMessage);
          setIsConnectingWallet(false);
          return;
        }
      }

      // Request public key from Freighter
      console.log('Requesting public key from Freighter...');
      const publicKey = await FreighterAPI.getPublicKey();
      console.log('Public key received:', publicKey);
      
      if (publicKey) {
        setFormData((prev) => ({
          ...prev,
          walletAddress: publicKey,
        }));
        const successMessage = 'Wallet connected successfully!';
        console.log(successMessage);
        setSuccess(successMessage);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorMessage = 'Failed to get public key from wallet.';
        console.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      if (err.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Wallet connection was rejected by user.';
        } else if (err.message.includes('not connected')) {
          errorMessage = 'Wallet is not connected. Please check your Freighter extension.';
        } else {
          errorMessage = `Wallet connection error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Gradient lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl"></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-2 text-white">Register</h1>
          <p className="text-center text-slate-400 text-sm mb-8">
            Already have an account? Please go to{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fullname */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Fullname *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your fullname"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Referral Code</label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Enter referral code"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 .846 2.511 2.554 4.658 4.807 6.052l1.828-1.828A4 4 0 0110 9a3.976 3.976 0 013.348 1.97l1.828-1.828C13.158 5.251 11.666 4 10 4zm6.293 6.293A9.906 9.906 0 0119.542 10c-1.274-4.057-5.064-7-9.542-7a9.95 9.95 0 00-2.293.293l1.602 1.602A4 4 0 0110 9a3.976 3.976 0 013.348 1.97l1.602-1.602z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 .846 2.511 2.554 4.658 4.807 6.052l1.828-1.828A4 4 0 0110 9a3.976 3.976 0 013.348 1.97l1.828-1.828C13.158 5.251 11.666 4 10 4zm6.293 6.293A9.906 9.906 0 0119.542 10c-1.274-4.057-5.064-7-9.542-7a9.95 9.95 0 00-2.293.293l1.602 1.602A4 4 0 0110 9a3.976 3.976 0 013.348 1.97l1.602-1.602z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Address Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white mb-2">Wallet Address *</label>
              
              {/* Wallet Address Input */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="Enter your wallet address or connect via extension"
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
                
                {/* Connect Wallet Button */}
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnectingWallet}
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {isConnectingWallet ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-400">
                You can either paste your wallet address manually or connect using the Freighter wallet extension.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}