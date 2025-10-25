'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';

const MainLayout = ({ children }) => {
	const [isMounted, setIsMounted] = useState(false);
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/auth/login');
		}
	}, [isLoading, isAuthenticated, router]);

	if (!isMounted || isLoading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
					<p className="text-gray-400">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null; // Will redirect to login
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
