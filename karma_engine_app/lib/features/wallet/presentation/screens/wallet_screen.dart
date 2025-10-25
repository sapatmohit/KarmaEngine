import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/wallet/presentation/widgets/wallet_balance.dart';
import 'package:karma_engine_app/features/wallet/presentation/widgets/transaction_history.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  String walletAddress = '';
  double xlmBalance = 0;

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

    // In a real app, you would fetch the balance from the Stellar network
    // For now, we'll use mock data
    setState(() {
      xlmBalance = 125.50;
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Wallet')),
    body: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Wallet address display
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Wallet Address',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    walletAddress,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Wallet balance
          WalletBalance(walletAddress: walletAddress, xlmBalance: xlmBalance),
          const SizedBox(height: 16),

          // Transaction history
          const Expanded(child: TransactionHistory()),
        ],
      ),
    ),
  );
}
