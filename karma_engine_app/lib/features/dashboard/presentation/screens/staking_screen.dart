import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/staking_info_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/stake_redeem_buttons.dart';

class StakingScreen extends StatefulWidget {
  const StakingScreen({super.key});

  @override
  State<StakingScreen> createState() => _StakingScreenState();
}

class _StakingScreenState extends State<StakingScreen> {
  double karmaBalance = 1250.0;
  double stakedAmount = 350.0;
  double multiplier = 1.5;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staking'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Staking Overview Card
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Staking Overview',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Available Karma',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                            Text(
                              '${karmaBalance.toStringAsFixed(0)} KARMA',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Staked Amount',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                            Text(
                              '${stakedAmount.toStringAsFixed(0)} KARMA',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.blue.withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.trending_up, color: Colors.blue),
                          const SizedBox(width: 8),
                          Text(
                            'Current Multiplier: ${multiplier.toStringAsFixed(1)}x',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Staking Info Widget
            StakingInfoWidget(
              stakedAmount: stakedAmount,
              multiplier: multiplier,
            ),
            const SizedBox(height: 20),

            // Stake/Redeem Buttons
            StakeRedeemButtons(
              karmaBalance: karmaBalance,
              stakedAmount: stakedAmount,
              onStake: (amount) {
                setState(() {
                  karmaBalance -= amount;
                  stakedAmount += amount;
                  // Update multiplier based on staked amount
                  if (stakedAmount >= 500) {
                    multiplier = 2.0;
                  } else if (stakedAmount >= 100) {
                    multiplier = 1.5;
                  } else {
                    multiplier = 1.0;
                  }
                });
              },
              onRedeem: (amount) {
                setState(() {
                  karmaBalance += amount;
                  stakedAmount -= amount;
                  // Update multiplier based on staked amount
                  if (stakedAmount >= 500) {
                    multiplier = 2.0;
                  } else if (stakedAmount >= 100) {
                    multiplier = 1.5;
                  } else {
                    multiplier = 1.0;
                  }
                });
              },
            ),

            const SizedBox(height: 20),

            // Staking Benefits
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Staking Benefits',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 20),
                        SizedBox(width: 8),
                        Text('Earn karma multipliers on all activities'),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 20),
                        SizedBox(width: 8),
                        Text('Higher tier status and recognition'),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 20),
                        SizedBox(width: 8),
                        Text('Access to exclusive features'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
