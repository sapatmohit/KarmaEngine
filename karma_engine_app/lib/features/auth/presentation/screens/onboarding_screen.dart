import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/auth/presentation/widgets/wallet_input_widget.dart';
import 'package:karma_engine_app/features/dashboard/presentation/widgets/main_layout.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _walletController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _checkExistingWallet();
  }

  Future<void> _checkExistingWallet() async {
    final prefs = await SharedPreferences.getInstance();
    final walletAddress = prefs.getString(Constants.walletAddressKey);

    if (walletAddress != null && walletAddress.isNotEmpty) {
      // Navigate to dashboard if wallet already exists
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainLayout()),
        );
      }
    }
  }

  Future<void> _connectWallet() async {
    if (_walletController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a wallet address')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Save wallet address to shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(Constants.walletAddressKey, _walletController.text);

      if (mounted) {
        // Navigate to dashboard
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainLayout()),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // App logo
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Text(
                  'KE',
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // App title
            const Text(
              'Karma Engine',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Description
            const Text(
              'Decentralized reputation and staking protocol on Stellar/Soroban',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 48),

            // Wallet input
            WalletInputWidget(
              controller: _walletController,
              onSubmitted: _connectWallet,
            ),
            const SizedBox(height: 24),

            // Connect button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _connectWallet,
                child:
                    _isLoading
                        ? const CircularProgressIndicator()
                        : const Text(
                          'Connect Wallet',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
              ),
            ),
            const SizedBox(height: 16),

            // Generate wallet button
            TextButton(
              onPressed: () {
                // In a real app, this would generate a new testnet wallet
                _walletController.text =
                    'G${List.generate(55, (index) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')..shuffle()).map((e) => e.first).join()}';
              },
              child: const Text('Generate Test Wallet'),
            ),
          ],
        ),
      ),
    ),
  );

  @override
  void dispose() {
    _walletController.dispose();
    super.dispose();
  }
}
