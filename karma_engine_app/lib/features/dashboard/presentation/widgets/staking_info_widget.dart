import 'package:flutter/material.dart';

class StakingInfoWidget extends StatelessWidget {
  const StakingInfoWidget({
    required this.stakedAmount,
    required this.multiplier,
    super.key,
  });
  final double stakedAmount;
  final double multiplier;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Staking Info',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),

          // Staked amount
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Staked Amount',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Text(
                '$stakedAmount XLM',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Multiplier
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Multiplier',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${multiplier}x',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
