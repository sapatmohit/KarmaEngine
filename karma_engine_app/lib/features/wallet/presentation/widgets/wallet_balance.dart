import 'package:flutter/material.dart';

class WalletBalance extends StatelessWidget {
  const WalletBalance({
    required this.walletAddress,
    required this.xlmBalance,
    super.key,
  });
  final String walletAddress;
  final double xlmBalance;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Wallet Balance',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          // XLM balance
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'XLM Balance',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Text(
                '$xlmBalance XLM',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // USD equivalent (mock)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'USD Equivalent',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Text(
                '\$${(xlmBalance * 0.12).toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
