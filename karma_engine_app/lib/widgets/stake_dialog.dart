import 'package:flutter/material.dart';

class StakeDialog extends StatefulWidget {
  const StakeDialog({
    required this.currentBalance,
    required this.onStake,
    super.key,
  });
  final double currentBalance;
  final Function(double amount) onStake;

  @override
  State<StakeDialog> createState() => _StakeDialogState();
}

class _StakeDialogState extends State<StakeDialog> {
  final TextEditingController _amountController = TextEditingController();
  double _amount = 0;

  @override
  void initState() {
    super.initState();
    _amountController.addListener(() {
      setState(() {
        _amount = double.tryParse(_amountController.text) ?? 0.0;
      });
    });
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: const Text('Stake XLM'),
    content: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Available Balance: ${widget.currentBalance} XLM'),
        const SizedBox(height: 16),
        TextField(
          controller: _amountController,
          decoration: const InputDecoration(
            labelText: 'Amount to Stake',
            hintText: 'Enter amount',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 16),
        Text('Multiplier: ${_calculateMultiplier(_amount)}x'),
      ],
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      ElevatedButton(
        onPressed:
            _amount > 0 && _amount <= widget.currentBalance
                ? () {
                  widget.onStake(_amount);
                  Navigator.pop(context);
                }
                : null,
        child: const Text('Stake'),
      ),
    ],
  );

  double _calculateMultiplier(double amount) {
    if (amount >= 500) return 2;
    if (amount >= 100) return 1.5;
    return 1;
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }
}
