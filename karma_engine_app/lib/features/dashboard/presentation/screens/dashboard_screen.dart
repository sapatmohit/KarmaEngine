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
import 'package:karma_engine_app/core/utils/theme.dart';
import 'package:karma_engine_app/widgets/glass_card.dart';
import 'package:karma_engine_app/widgets/glass_button.dart';

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
      return Container(
        color: AppTheme.darkBackground,
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryBlue),
              ),
              SizedBox(height: 16),
              Text(
                'Loading...',
                style: TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    if (currentUser == null) {
      return Container(
        color: AppTheme.darkBackground,
        child: const Center(
          child: Text(
            'Failed to load user data',
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    }

    return Container(
      color: AppTheme.darkBackground,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Dashboard',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Track your karma activities and staking progress',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
                // Tier indicator
                GlassCard(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppTheme.primaryBlue,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _getTierName(currentUser!.stakedAmount),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Stats Cards Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 1,
              childAspectRatio: 3.5,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                // Karma Balance Card
                GlassCard(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Karma Balance',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: AppTheme.primaryBlue,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Icon(
                              Icons.star,
                              color: Colors.white,
                              size: 12,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            currentUser!.karmaPoints.toString(),
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryBlue.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _getKarmaBadge(currentUser!.karmaPoints),
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.primaryBlue,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Staked Amount Card
                GlassCard(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Staked Amount',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                          fontWeight: FontWeight.w500,
                        ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                        '${currentUser!.stakedAmount.toString()} XLM',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryPink.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Multiplier: x${currentUser!.multiplier}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.secondaryPink,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                    ),
                  ],
                ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Main Content
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Column(
                    children: [
                      // Karma Chart Placeholder
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Karma Chart',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
                            Container(
                              height: 200,
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurface.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Center(
                                child: Text(
                                  'Chart Coming Soon',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ),
                            ),
                          ],
                        ),
            ),
            const SizedBox(height: 16),

                      // Transaction History
                      const ActivityHistoryWidget(),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    children: [
                      // Redeem Interface
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Redeem Karma',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
            ),
            const SizedBox(height: 16),
                            GlassButton(
                              variant: GlassButtonVariant.primary,
                              onPressed: () {
                                // Implement redeem functionality
                              },
                              child: const Text(
                                'Redeem',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
            ),
            const SizedBox(height: 16),

                      // Recent Activities
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Recent Activities',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'No recent activities',
                              style: TextStyle(color: Colors.grey),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Start engaging to earn karma!',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 16),
                            GlassButton(
                              variant: GlassButtonVariant.defaultVariant,
                              onPressed: () {
                                // Navigate to activities
                              },
                              child: const Text(
                                'View All Activities',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _getTierName(double stakeAmount) {
    if (stakeAmount >= 500) return 'Influencer';
    if (stakeAmount >= 100) return 'Trusted';
    return 'Regular';
  }

  String _getKarmaBadge(int karmaPoints) {
    if (karmaPoints >= 10000) return 'Elite';
    if (karmaPoints >= 5000) return 'Advanced';
    if (karmaPoints >= 1000) return 'Intermediate';
    return 'Beginner';
  }
}
