import 'package:flutter_riverpod/flutter_riverpod.dart';

class WalletState {
  WalletState({
    this.walletAddress = '',
    this.xlmBalance = 0.0,
    this.isLoading = false,
    this.error,
  });
  final String walletAddress;
  final double xlmBalance;
  final bool isLoading;
  final String? error;

  WalletState copyWith({
    String? walletAddress,
    double? xlmBalance,
    bool? isLoading,
    String? error,
  }) => WalletState(
    walletAddress: walletAddress ?? this.walletAddress,
    xlmBalance: xlmBalance ?? this.xlmBalance,
    isLoading: isLoading ?? this.isLoading,
    error: error ?? this.error,
  );
}

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>(
  (ref) => WalletNotifier(),
);

class WalletNotifier extends StateNotifier<WalletState> {
  WalletNotifier() : super(WalletState());

  void setWallet(String address, double balance) {
    state = state.copyWith(
      walletAddress: address,
      xlmBalance: balance,
      isLoading: false,
      error: null,
    );
  }

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String error) {
    state = state.copyWith(error: error, isLoading: false);
  }
}
