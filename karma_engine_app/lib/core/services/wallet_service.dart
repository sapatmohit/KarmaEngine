import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart';

class WalletService {
  static final StellarSDK _sdk = StellarSDK.TESTNET;

  // Generate a new testnet wallet
  static KeyPair generateWallet() => KeyPair.random();

  // Get account details
  static Future<AccountResponse> getAccountDetails(String publicKey) async {
    try {
      final account = await _sdk.accounts.account(publicKey);
      return account;
    } catch (e) {
      throw Exception('Failed to get account details: $e');
    }
  }

  // Get account balance
  static Future<double> getAccountBalance(String publicKey) async {
    try {
      final account = await getAccountDetails(publicKey);
      final balance = account.balances.firstWhere(
        (balance) => balance.assetType == 'native',
        orElse: () => AccountBalance(assetType: 'native', balance: '0'),
      );
      return double.parse(balance.balance);
    } catch (e) {
      throw Exception('Failed to get account balance: $e');
    }
  }

  // Check if account exists
  static Future<bool> accountExists(String publicKey) async {
    try {
      await getAccountDetails(publicKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
