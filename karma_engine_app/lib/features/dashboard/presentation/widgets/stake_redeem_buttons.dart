import 'package:flutter/material.dart';

class StakeRedeemButtons extends StatelessWidget {
  final VoidCallback onStake;
  final VoidCallback onRedeem;

  const StakeRedeemButtons({
    super.key,
    required this.onStake,
    required this.onRedeem,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Stake button
        Expanded(
          child: ElevatedButton(
            onPressed: onStake,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.all(16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.add_circle_outline, size: 24),
                SizedBox(height: 8),
                Text(
                  'Stake',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 16),

        // Redeem button
        Expanded(
          child: ElevatedButton(
            onPressed: onRedeem,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.all(16),
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.redeem, size: 24),
                SizedBox(height: 8),
                Text(
                  'Redeem',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
