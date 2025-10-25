'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated, isLoading, connectWallet, emailLogin } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [walletAddress, setWalletAddress] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isConnecting, setIsConnecting] = useState(false);
	const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'wallet'

	// Redirect to dashboard if already authenticated
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push('/dashboard');
		}
	}, [isAuthenticated, isLoading, router]);

	// If already authenticated, don't show the login form
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
					<p className="text-gray-400">Loading...</p>
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return null; // Will redirect immediately
	}

	const handleWalletLogin = async () => {
		try {
			setIsConnecting(true);
			setError('');
			setSuccess('');

			// If wallet address is provided manually, use it
			if (walletAddress) {
				// For demo purposes, we'll create a mock user
				const mockUserData = {
					walletAddress: walletAddress,
					name: 'User ' + walletAddress.substring(0, 6),
					dateOfBirth: '1990-01-01',
					instagram: '',
					facebook: '',
					twitter: '',
				};

				// In a real app, this would redirect to a registration page
				// For now, we'll simulate registration
				localStorage.setItem('walletAddress', walletAddress);
				setSuccess('Wallet connected! Redirecting to dashboard...');
				setTimeout(() => router.push('/dashboard'), 1500);
			} else {
				// Use the existing connectWallet function from AuthContext
				const result = await connectWallet();

				if (result.isNewUser) {
					// For demo purposes, we'll create a mock user
					const mockUserData = {
						walletAddress: result.walletAddress,
						name: 'User ' + result.walletAddress.substring(0, 6),
						dateOfBirth: '1990-01-01',
						instagram: '',
						facebook: '',
						twitter: '',
					};

					// In a real app, this would redirect to a registration page
					// For now, we'll simulate registration
					localStorage.setItem('walletAddress', result.walletAddress);
					setSuccess('Wallet connected! Redirecting to dashboard...');
					setTimeout(() => router.push('/dashboard'), 1500);
				} else {
					setSuccess('Wallet connected! Redirecting to dashboard...');
					setTimeout(() => router.push('/dashboard'), 1500);
				}
			}
		} catch (err) {
			setError(err.message || 'Failed to connect wallet');
		} finally {
			setIsConnecting(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (loginMethod === 'email') {
			if (!email || !password) {
				setError('Please fill in all fields');
				return;
			}

			try {
				// Use the emailLogin function from AuthContext
				await emailLogin({ email, password });

				setSuccess('Login successful! Redirecting to dashboard...');

				// Redirect to dashboard after a short delay
				setTimeout(() => router.push('/dashboard'), 1500);
			} catch (err) {
				setError(err.message || 'Invalid email or password');
			}
		} else {
			// Wallet login
			await handleWalletLogin();
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

			{/* Login Card */}
			<div className="relative z-10 w-full max-w-md">
				<div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
					{/* Header */}
					<h1 className="text-3xl font-bold text-center mb-2 text-white">
						Sign in
					</h1>
					<p className="text-center text-slate-400 text-sm mb-8">
						Not a member?{' '}
						<Link
							href="/auth/register"
							className="text-purple-400 hover:text-purple-300 font-medium"
						>
							Register now!
						</Link>
					</p>

					{/* Login Method Toggle */}
					<div className="flex mb-6 bg-slate-800/50 rounded-lg p-1">
						<button
							type="button"
							onClick={() => setLoginMethod('email')}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
								loginMethod === 'email'
									? 'bg-purple-600 text-white'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							Email
						</button>
						<button
							type="button"
							onClick={() => setLoginMethod('wallet')}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
								loginMethod === 'wallet'
									? 'bg-purple-600 text-white'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							Wallet
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{loginMethod === 'email' ? (
							<>
								{/* Email Input */}
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Email
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
								</div>

								{/* Password Input */}
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Your password
									</label>
									<div className="relative">
										<input
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
										>
											{showPassword ? (
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
													<path
														fillRule="evenodd"
														d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
														clipRule="evenodd"
													/>
												</svg>
											) : (
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 .846 2.511 2.554 4.658 4.807 6.052l1.828-1.828A4 4 0 0110 7a3.976 3.976 0 013.348 1.97l1.828-1.828C13.158 5.251 11.666 4 10 4zm6.293 6.293A9.906 9.906 0 0119.542 10c-1.274-4.057-5.064-7-9.542-7a9.95 9.95 0 00-2.293.293l1.602 1.602A4 4 0 0110 9a3.976 3.976 0 013.348 1.97l1.602-1.602z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</button>
									</div>
								</div>
							</>
						) : (
							<>
								{/* Wallet Address Input */}
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Wallet Address
									</label>
									<input
										type="text"
										value={walletAddress}
										onChange={(e) => setWalletAddress(e.target.value)}
										placeholder="Enter your wallet address"
										className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
									<p className="mt-2 text-xs text-slate-400">
										Or connect directly with your wallet extension
									</p>
								</div>

								{/* Connect Wallet Button */}
								<button
									type="button"
									onClick={handleWalletLogin}
									disabled={isConnecting}
									className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
								>
									{isConnecting ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Connecting...
										</>
									) : (
										<>
											<svg
												className="w-5 h-5 mr-2"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												></path>
											</svg>
											Connect Wallet
										</>
									)}
								</button>
							</>
						)}

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

						{/* Sign In Button */}
						{loginMethod === 'email' && (
							<button
								type="submit"
								className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
							>
								Sign in with Email
							</button>
						)}
					</form>

					{/* Forgot Password Link */}
					{loginMethod === 'email' && (
						<div className="text-center mt-6">
							<Link
								href="/auth/forgot-password"
								className="text-slate-400 hover:text-purple-400 text-sm transition"
							>
								Forgot your password?
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}