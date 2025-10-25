import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class KarmaCardWidget extends StatelessWidget {
  const KarmaCardWidget({
    required this.karmaPoints,
    required this.stakedAmount,
    required this.multiplier,
    super.key,
  });
  final int karmaPoints;
  final double stakedAmount;
  final double multiplier;

  @override
  Widget build(BuildContext context) => Card(
    elevation: 4,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    child: Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your Karma',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          // Karma points display
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Points',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Text(
                NumberFormat('#,##0').format(karmaPoints),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // XLM equivalent
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'XLM Equivalent',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              Text(
                '${(karmaPoints * 0.01).toStringAsFixed(2)} XLM',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Multiplier info
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
