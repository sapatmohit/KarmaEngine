import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/dashboard/presentation/screens/dashboard_screen.dart';
import 'package:karma_engine_app/features/dashboard/presentation/screens/staking_screen.dart';
import 'package:karma_engine_app/features/activity/presentation/screens/activity_screen.dart';
import 'package:karma_engine_app/features/leaderboard/presentation/screens/leaderboard_screen.dart';
import 'package:karma_engine_app/features/wallet/presentation/screens/wallet_screen.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardScreen(),
    StakingScreen(),
    ActivityScreen(),
    LeaderboardScreen(),
    WalletScreen(),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    body: _screens[_currentIndex],
    bottomNavigationBar: BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      currentIndex: _currentIndex,
      onTap: (index) {
        setState(() {
          _currentIndex = index;
        });
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.savings), label: 'Staking'),
        BottomNavigationBarItem(icon: Icon(Icons.feed), label: 'Activity'),
        BottomNavigationBarItem(
          icon: Icon(Icons.leaderboard),
          label: 'Leaderboard',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_balance_wallet),
          label: 'Wallet',
        ),
      ],
    ),
  );
}
