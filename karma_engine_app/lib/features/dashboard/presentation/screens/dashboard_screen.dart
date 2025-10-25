import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/karma_card_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/stake_redeem_buttons.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/activity_history_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/staking_info_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String walletAddress = '';
  int karmaPoints = 0;
  double stakedAmount = 0;
  double multiplier = 1;

  @override
  void initState() {
    super.initState();
    _loadWalletData();
  }

  Future<void> _loadWalletData() async {
    final prefs = await SharedPreferences.getInstance();
    final address = prefs.getString(Constants.walletAddressKey) ?? '';

    setState(() {
      walletAddress = address;
    });

    // In a real app, you would fetch user data from the API here
    // For now, we'll use mock data
    setState(() {
      karmaPoints = 1250;
      stakedAmount = 50.0;
      multiplier = 1.5;
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Dashboard'),
      actions: [
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () async {
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(Constants.walletAddressKey);

            if (mounted) {
              Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
            }
          },
        ),
      ],
    ),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Wallet address display
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Wallet Address',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    walletAddress,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Karma card
          KarmaCardWidget(
            karmaPoints: karmaPoints,
            stakedAmount: stakedAmount,
            multiplier: multiplier,
          ),
          const SizedBox(height: 16),

          // Staking info
          StakingInfoWidget(stakedAmount: stakedAmount, multiplier: multiplier),
          const SizedBox(height: 16),

          // Stake/Redeem buttons
          StakeRedeemButtons(
            onStake: () {
              // Implement stake functionality
            },
            onRedeem: () {
              // Implement redeem functionality
            },
          ),
          const SizedBox(height: 16),

          // Activity history
          const ActivityHistoryWidget(),
        ],
      ),
    ),
  );
}
