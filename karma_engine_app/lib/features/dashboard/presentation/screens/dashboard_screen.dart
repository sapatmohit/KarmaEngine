import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/karma_card_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/stake_redeem_buttons.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/activity_history_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/staking_info_widget.dart';
import 'package:karma_engine_app/features/auth/presentation/screens/profile_screen.dart';
import 'package:karma_engine_app/core/services/api_service.dart';
import 'package:karma_engine_app/core/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String walletAddress = '';
  UserModel? currentUser;
  bool isLoading = true;

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

    if (address.isNotEmpty) {
      try {
        final user = await ApiService().getUserByWallet(address);
        setState(() {
          currentUser = user;
          isLoading = false;
        });
      } catch (e) {
        setState(() {
          isLoading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to load user data: ${e.toString()}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Dashboard')),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (currentUser == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Dashboard')),
        body: const Center(
          child: Text('Failed to load user data'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
              );
            },
            tooltip: 'Profile',
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
                      currentUser!.walletAddress,
                      style: const TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Karma card
            KarmaCardWidget(
              karmaPoints: currentUser!.karmaPoints,
              stakedAmount: currentUser!.stakedAmount,
              multiplier: currentUser!.multiplier,
            ),
            const SizedBox(height: 16),

            // Staking info
            StakingInfoWidget(
              stakedAmount: currentUser!.stakedAmount, 
              multiplier: currentUser!.multiplier,
            ),
            const SizedBox(height: 16),

            // Stake/Redeem buttons
            StakeRedeemButtons(
              karmaBalance: currentUser!.karmaPoints.toDouble(),
              stakedAmount: currentUser!.stakedAmount,
              onStake: (amount) async {
                try {
                  // TODO: Implement real staking with transaction hash
                  final updatedUser = await ApiService().updateUserKarma(
                    currentUser!.walletAddress,
                    currentUser!.karmaPoints - amount.toInt(),
                  );
                  setState(() {
                    currentUser = currentUser!.copyWith(
                      karmaPoints: updatedUser.karmaPoints,
                      stakedAmount: currentUser!.stakedAmount + amount,
                    );
                  });
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Staking failed: ${e.toString()}')),
                    );
                  }
                }
              },
              onRedeem: (amount) async {
                try {
                  // TODO: Implement real unstaking with transaction hash
                  final updatedUser = await ApiService().updateUserKarma(
                    currentUser!.walletAddress,
                    currentUser!.karmaPoints + amount.toInt(),
                  );
                  setState(() {
                    currentUser = currentUser!.copyWith(
                      karmaPoints: updatedUser.karmaPoints,
                      stakedAmount: currentUser!.stakedAmount - amount,
                    );
                  });
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Redeem failed: ${e.toString()}')),
                    );
                  }
                }
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
}
