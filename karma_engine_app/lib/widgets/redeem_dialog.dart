import 'package:flutter/material.dart';

class RedeemDialog extends StatefulWidget {
  const RedeemDialog({
    required this.currentKarma,
    required this.onRedeem,
    super.key,
  });
  final int currentKarma;
  final Function(int points) onRedeem;

  @override
  State<RedeemDialog> createState() => _RedeemDialogState();
}

class _RedeemDialogState extends State<RedeemDialog> {
  final TextEditingController _pointsController = TextEditingController();
  int _points = 0;

  @override
  void initState() {
    super.initState();
    _pointsController.addListener(() {
      setState(() {
        _points = int.tryParse(_pointsController.text) ?? 0;
      });
    });
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: const Text('Redeem Karma'),
    content: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Available Karma: ${widget.currentKarma} points'),
        const SizedBox(height: 16),
        TextField(
          controller: _pointsController,
          decoration: const InputDecoration(
            labelText: 'Points to Redeem',
            hintText: 'Enter points',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 16),
        Text('You will receive: ${(_points * 0.01).toStringAsFixed(2)} XLM'),
      ],
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      ElevatedButton(
        onPressed:
            _points > 0 && _points <= widget.currentKarma
                ? () {
                  widget.onRedeem(_points);
                  Navigator.pop(context);
                }
                : null,
        child: const Text('Redeem'),
      ),
    ],
  );

  @override
  void dispose() {
    _pointsController.dispose();
    super.dispose();
  }
}
