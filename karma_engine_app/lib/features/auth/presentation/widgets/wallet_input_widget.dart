import 'package:flutter/material.dart';

class WalletInputWidget extends StatelessWidget {
  const WalletInputWidget({
    required this.controller,
    required this.onSubmitted,
    super.key,
  });
  final TextEditingController controller;
  final VoidCallback onSubmitted;

  @override
  Widget build(BuildContext context) => TextField(
    controller: controller,
    decoration: const InputDecoration(
      labelText: 'Testnet Wallet Address',
      hintText: 'Enter your Stellar testnet wallet address',
      border: OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(12)),
      ),
      prefixIcon: Icon(Icons.account_balance_wallet),
    ),
    keyboardType: TextInputType.text,
    textInputAction: TextInputAction.done,
    onSubmitted: (_) => onSubmitted(),
  );
}
