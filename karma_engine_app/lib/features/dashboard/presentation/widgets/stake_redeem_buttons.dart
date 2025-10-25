import 'package:flutter/material.dart';

class StakeRedeemButtons extends StatelessWidget {
  final double karmaBalance;
  final double stakedAmount;
  final Function(double) onStake;
  final Function(double) onRedeem;

  const StakeRedeemButtons({
    super.key,
    required this.karmaBalance,
    required this.stakedAmount,
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
            onPressed: karmaBalance > 0 ? () => _showStakeDialog(context) : null,
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
            onPressed: stakedAmount > 0 ? () => _showRedeemDialog(context) : null,
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

  void _showStakeDialog(BuildContext context) {
    final TextEditingController controller = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Stake Karma'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Available: ${karmaBalance.toStringAsFixed(0)} KARMA'),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount to stake',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final amount = double.tryParse(controller.text) ?? 0;
              if (amount > 0 && amount <= karmaBalance) {
                onStake(amount);
                Navigator.pop(context);
              }
            },
            child: const Text('Stake'),
          ),
        ],
      ),
    );
  }

  void _showRedeemDialog(BuildContext context) {
    final TextEditingController controller = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Redeem Karma'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Staked: ${stakedAmount.toStringAsFixed(0)} KARMA'),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount to redeem',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final amount = double.tryParse(controller.text) ?? 0;
              if (amount > 0 && amount <= stakedAmount) {
                onRedeem(amount);
                Navigator.pop(context);
              }
            },
            child: const Text('Redeem'),
          ),
        ],
      ),
    );
  }
}
