'use client';

import { motion } from 'framer-motion';
import {
	ArrowLeft,
	Award,
	Clock,
	Coins,
	Shield,
	Star,
	Target,
	TrendingUp,
	Zap,
} from 'lucide-react';
import { useState } from 'react';
import GlassButton from '../components/GlassButton';
import GlassCard from '../components/GlassCard';
import MainLayout from '../components/MainLayout';
import TierIndicator from '../components/TierIndicator';
import { useKarma } from '../contexts/KarmaContext';

export default function Staking() {
	const { karmaBalance, stakeAmount, stakeTokens, unstakeTokens } = useKarma();
	const [stakeInput, setStakeInput] = useState('');
	const [unstakeInput, setUnstakeInput] = useState('');
	const [activeTab, setActiveTab] = useState('stake'); // 'stake' or 'unstake'

	const userData = {
		walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
		karmaBalance: karmaBalance,
		stakeAmount: stakeAmount,
		tier:
			stakeAmount >= 500
				? 'Influencer'
				: stakeAmount >= 100
				? 'Trusted'
				: 'Regular',
		multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1,
	};

	const tiers = [
		{
			name: 'Regular',
			min: 0,
			max: 100,
			multiplier: '1x',
			color: 'from-gray-500 to-gray-700',
			benefits: ['Base karma rewards', 'Standard influence'],
			icon: Shield,
		},
		{
			name: 'Trusted',
			min: 100,
			max: 500,
			multiplier: '1.5x',
			color: 'from-blue-500 to-blue-700',
			benefits: [
				'1.5x karma rewards',
				'Priority in rewards',
				'Enhanced influence',
			],
			icon: Star,
		},
		{
			name: 'Influencer',
			min: 500,
			max: Infinity,
			multiplier: '2x',
			color: 'from-purple-500 to-purple-700',
			benefits: [
				'2x karma rewards',
				'Premium rewards',
				'Maximum influence',
				'Exclusive features',
			],
			icon: Award,
		},
	];

	const stakingStats = [
		{
			title: 'Total Staked',
			value: '2,847,392',
			unit: 'KARMA',
			change: '+12.5%',
			icon: TrendingUp,
		},
		{
			title: 'APY',
			value: '15.2',
			unit: '%',
			change: '+2.1%',
			icon: Target,
		},
		{
			title: 'Your Rewards',
			value: (userData.stakeAmount * 0.152).toFixed(2),
			unit: 'KARMA',
			change: 'This month',
			icon: Zap,
		},
	];

	const handleStake = async (e) => {
		e.preventDefault();
		if (!stakeInput || parseFloat(stakeInput) <= 0) return;

		try {
			await stakeTokens(stakeInput);
			setStakeInput('');
		} catch (error) {
			console.error('Error staking tokens:', error);
		}
	};

	const handleUnstake = async (e) => {
		e.preventDefault();
		if (!unstakeInput || parseFloat(unstakeInput) <= 0) return;

		try {
			await unstakeTokens(unstakeInput);
			setUnstakeInput('');
		} catch (error) {
			console.error('Error unstaking tokens:', error);
		}
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-700/50">
					<div className="flex items-center space-x-4">
						<button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
							<ArrowLeft className="w-5 h-5 text-slate-300" />
						</button>
						<h1 className="text-2xl font-bold text-white">Karma Staking</h1>
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50">
							<Coins className="w-5 h-5 text-primary" />
							<span className="text-white font-medium">KARMA</span>
							<span className="text-slate-400">Staking Pool</span>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="p-6 space-y-8">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{stakingStats.map((stat, index) => (
							<motion.div
								key={stat.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<GlassCard className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="p-2 bg-primary/20 rounded-lg">
											<stat.icon className="w-6 h-6 text-primary" />
										</div>
										<span className="text-green-400 text-sm font-medium">
											{stat.change}
										</span>
									</div>
									<div className="space-y-1">
										<div className="text-2xl font-bold text-white flex items-center">
											{stat.unit === 'KARMA' ? (
												<>
													<img src="./karma_token_icon.svg" alt="Karma Token" className="w-5 h-5 mr-1" />
													{stat.value}
												</>
											) : (
												<>
													{stat.value}{' '}
													<span className="text-slate-400 text-lg">
														{stat.unit}
													</span>
												</>
											)}
										</div>
										<div className="text-slate-400 text-sm">{stat.title}</div>
									</div>
								</GlassCard>
							</motion.div>
						))}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Left Panel - Staking Interface */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<GlassCard className="p-6">
								<h2 className="text-xl font-bold text-white mb-6">
									Stake KARMA
								</h2>

								{/* Tabs */}
								<div className="flex space-x-1 mb-6 bg-slate-800/30 p-1 rounded-lg">
									<button
										onClick={() => setActiveTab('stake')}
										className={`px-4 py-2 rounded-md font-medium transition-all ${
											activeTab === 'stake'
												? 'bg-primary/20 text-primary border border-primary/30'
												: 'text-slate-400 hover:text-white'
										}`}
									>
										Stake
									</button>
									<button
										onClick={() => setActiveTab('unstake')}
										className={`px-4 py-2 rounded-md font-medium transition-all ${
											activeTab === 'unstake'
												? 'bg-primary/20 text-primary border border-primary/30'
												: 'text-slate-400 hover:text-white'
										}`}
									>
										Unstake
									</button>
								</div>

								{activeTab === 'stake' ? (
									<form onSubmit={handleStake} className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-slate-300 mb-2">
												Amount to Stake
											</label>
											<div className="relative">
												<input
													type="number"
													value={stakeInput}
													onChange={(e) => setStakeInput(e.target.value)}
													placeholder="0.00"
													className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
												/>
												<div className="absolute inset-y-0 right-0 flex items-center pr-4">
													<span className="text-slate-400">KARMA</span>
												</div>
											</div>
											<div className="flex justify-between mt-2 text-sm text-slate-400">
												<span>Available: {userData.karmaBalance} KARMA</span>
												<button
													type="button"
													onClick={() =>
														setStakeInput(userData.karmaBalance.toString())
													}
													className="text-primary hover:underline"
												>
													Max
												</button>
											</div>
										</div>

										<div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
											<h4 className="font-medium text-white mb-3">
												Staking Summary
											</h4>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-slate-400">Current Stake:</span>
													<span className="text-white flex items-center">
														<img src="./karma_token_icon.svg" alt="Karma Token" className="w-4 h-4 mr-1" />
														{userData.stakeAmount} KARMA
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-slate-400">New Stake:</span>
													<span className="text-white flex items-center">
														<img src="./karma_token_icon.svg" alt="Karma Token" className="w-4 h-4 mr-1" />
														{userData.stakeAmount +
															(parseFloat(stakeInput) || 0)}{' '}
														KARMA
													</span>
												</div>
												<div className="flex justify-between pt-2 border-t border-slate-700">
													<span className="text-slate-400">New Tier:</span>
													<span className="font-medium text-primary">
														{userData.stakeAmount +
															(parseFloat(stakeInput) || 0) >=
														500
															? 'Influencer'
															: userData.stakeAmount +
																	(parseFloat(stakeInput) || 0) >=
															  100
															? 'Trusted'
															: 'Regular'}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-slate-400">Multiplier:</span>
													<span className="font-medium text-primary">
														{userData.stakeAmount +
															(parseFloat(stakeInput) || 0) >=
														500
															? '2x'
															: userData.stakeAmount +
																	(parseFloat(stakeInput) || 0) >=
															  100
															? '1.5x'
															: '1x'}
													</span>
												</div>
											</div>
										</div>

										<GlassButton
											variant="primary"
											className="w-full py-3"
											type="submit"
										>
											Stake KARMA
										</GlassButton>
									</form>
								) : (
									<form onSubmit={handleUnstake} className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-slate-300 mb-2">
												Amount to Unstake
											</label>
											<div className="relative">
												<input
													type="number"
													value={unstakeInput}
													onChange={(e) => setUnstakeInput(e.target.value)}
													placeholder="0.00"
													className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
												/>
												<div className="absolute inset-y-0 right-0 flex items-center pr-4">
													<span className="text-slate-400">KARMA</span>
												</div>
											</div>
											<div className="flex justify-between mt-2 text-sm text-slate-400">
												<span>Staked: {userData.stakeAmount} KARMA</span>
												<button
													type="button"
													onClick={() =>
														setUnstakeInput(userData.stakeAmount.toString())
													}
													className="text-primary hover:underline"
												>
													Max
												</button>
											</div>
										</div>

										<div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
											<h4 className="font-medium text-white mb-3">
												Unstaking Summary
											</h4>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-slate-400">Current Stake:</span>
												<span className="text-white flex items-center">
													<img src="./karma_token_icon.svg" alt="Karma Token" className="w-4 h-4 mr-1" />
													{userData.stakeAmount} KARMA
												</span>
												</div>
												<div className="flex justify-between">
													<span className="text-slate-400">New Stake:</span>
													<span className="text-white flex items-center">
														<img src="./karma_token_icon.svg" alt="Karma Token" className="w-4 h-4 mr-1" />
														{Math.max(
															0,
															userData.stakeAmount -
																(parseFloat(unstakeInput) || 0)
														)}{' '}
														KARMA
													</span>
												</div>
												<div className="flex justify-between pt-2 border-t border-slate-700">
													<span className="text-slate-400">New Tier:</span>
													<span className="font-medium text-primary">
														{Math.max(
															0,
															userData.stakeAmount -
																(parseFloat(unstakeInput) || 0)
														) >= 500
															? 'Influencer'
															: Math.max(
																	0,
																	userData.stakeAmount -
																		(parseFloat(unstakeInput) || 0)
															  ) >= 100
															? 'Trusted'
															: 'Regular'}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-slate-400">Multiplier:</span>
													<span className="font-medium text-primary">
														{Math.max(
															0,
															userData.stakeAmount -
																(parseFloat(unstakeInput) || 0)
														) >= 500
															? '2x'
															: Math.max(
																	0,
																	userData.stakeAmount -
																		(parseFloat(unstakeInput) || 0)
															  ) >= 100
															? '1.5x'
															: '1x'}
													</span>
												</div>
											</div>
										</div>

										<GlassButton
											variant="primary"
											className="w-full py-3"
											type="submit"
										>
											Unstake KARMA
										</GlassButton>
									</form>
								)}
							</GlassCard>
						</motion.div>

						{/* Right Panel - Tier Information */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<GlassCard className="p-6">
								<h2 className="text-xl font-bold text-white mb-6">
									Staking Tiers
								</h2>
								<div className="space-y-4">
									{tiers.map((tier, index) => (
										<div
											key={tier.name}
											className={`p-4 rounded-lg border transition-all ${
												userData.tier === tier.name
													? 'border-primary/50 bg-primary/10'
													: 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
											}`}
										>
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center space-x-3">
													<div
														className={`p-2 rounded-lg bg-gradient-to-r ${tier.color}`}
													>
														<tier.icon className="w-5 h-5 text-white" />
													</div>
													<div>
														<h3 className="font-bold text-white">
															{tier.name}
														</h3>
														<p className="text-sm text-slate-400">
															{tier.multiplier} Multiplier
														</p>
													</div>
												</div>
												{userData.tier === tier.name && (
													<div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
														Current
													</div>
												)}
											</div>

											<ul className="space-y-2 mb-4">
												{tier.benefits.map((benefit, i) => (
													<li key={i} className="flex items-start text-sm">
														<span className="text-green-500 mr-2 mt-0.5">
															✓
														</span>
														<span className="text-slate-300">{benefit}</span>
													</li>
												))}
											</ul>

											<div className="text-sm text-slate-400">
												{tier.max === Infinity
													? `Stake ${tier.min}+ KARMA`
													: `Stake ${tier.min}-${tier.max} KARMA`}
											</div>
										</div>
									))}
								</div>
							</GlassCard>
						</motion.div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
