'use client';

import * as FreighterAPI from '@stellar/freighter-api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
	const router = useRouter();
	const { emailRegister } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isConnectingWallet, setIsConnectingWallet] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullname: '',
		email: '',
		dateOfBirth: '',
		instagram: '',
		facebook: '',
		twitter: '',
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
		if (!formData.dateOfBirth) {
			setError('Please enter your date of birth');
			return false;
		}
		// Check if user is over 18
		const today = new Date();
		const birthDate = new Date(formData.dateOfBirth);
		const age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}
		if (age < 18) {
			setError('You must be at least 18 years old to register');
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

			// Use the emailRegister function from AuthContext
			await emailRegister({
				email: formData.email,
				password: formData.password,
				name: formData.fullname,
				dateOfBirth: formData.dateOfBirth,
				instagram: formData.instagram,
				facebook: formData.facebook,
				twitter: formData.twitter,
			});

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
				const isAllowed = await FreighterAPI.isAllowed();
				if (!isAllowed) {
					console.warn('Freighter wallet extension not detected');
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

		try {
			// Check if Freighter is available
			const isAllowed = await FreighterAPI.isAllowed();

			if (!isAllowed) {
				setError(
					'Freighter wallet extension is not installed. Please install it to continue.'
				);
				setIsConnectingWallet(false);
				return;
			}

			// Request public key from Freighter
			const publicKey = await FreighterAPI.getPublicKey();

			if (publicKey) {
				setFormData((prev) => ({
					...prev,
					walletAddress: publicKey,
				}));
				setSuccess('Wallet connected successfully!');
				setTimeout(() => setSuccess(''), 3000);
			}
		} catch (err) {
			console.error('Wallet connection error:', err);
			if (err.message && err.message.includes('User rejected')) {
				setError('Wallet connection was rejected');
			} else {
				setError('Failed to connect wallet. Please try again.');
			}
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
					<h1 className="text-3xl font-bold text-center mb-2 text-white">
						Register
					</h1>
					<p className="text-center text-slate-400 text-sm mb-8">
						Already have an account? Please go to{' '}
						<Link
							href="/auth/login"
							className="text-purple-400 hover:text-purple-300 font-medium"
						>
							Sign in
						</Link>
					</p>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Two Column Layout */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Fullname */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Fullname *
								</label>
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
								<label className="block text-sm font-medium text-white mb-2">
									Email *
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Enter your email"
									className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
								/>
							</div>

							{/* Date of Birth */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Date of Birth *
								</label>
								<input
									type="date"
									name="dateOfBirth"
									value={formData.dateOfBirth}
									onChange={handleChange}
									className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
								/>
							</div>

							{/* Instagram */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Instagram (optional)
								</label>
								<input
									type="text"
									name="instagram"
									value={formData.instagram}
									onChange={handleChange}
									placeholder="@username"
									className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
								/>
							</div>

							{/* Facebook */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Facebook (optional)
								</label>
								<input
									type="text"
									name="facebook"
									value={formData.facebook}
									onChange={handleChange}
									placeholder="Facebook username"
									className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
								/>
							</div>

							{/* Twitter */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Twitter (optional)
								</label>
								<input
									type="text"
									name="twitter"
									value={formData.twitter}
									onChange={handleChange}
									placeholder="@username"
									className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
								/>
							</div>

							{/* Password */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Password"
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

							{/* Confirm Password */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Confirm password
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Confirm password"
										className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
									>
										{showConfirmPassword ? (
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

						{/* Register Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
						>
							{isLoading ? 'Creating Account...' : 'Register'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
