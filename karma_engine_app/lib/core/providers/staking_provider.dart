import 'package:flutter_riverpod/flutter_riverpod.dart';

class StakingState {
  StakingState({
    this.stakedAmount = 0.0,
    this.multiplier = 1.0,
    this.isLoading = false,
    this.error,
  });
  final double stakedAmount;
  final double multiplier;
  final bool isLoading;
  final String? error;

  StakingState copyWith({
    double? stakedAmount,
    double? multiplier,
    bool? isLoading,
    String? error,
  }) => StakingState(
    stakedAmount: stakedAmount ?? this.stakedAmount,
    multiplier: multiplier ?? this.multiplier,
    isLoading: isLoading ?? this.isLoading,
    error: error ?? this.error,
  );
}

final stakingProvider = StateNotifierProvider<StakingNotifier, StakingState>(
  (ref) => StakingNotifier(),
);

class StakingNotifier extends StateNotifier<StakingState> {
  StakingNotifier() : super(StakingState());

  void setStakingInfo(double stakedAmount, double multiplier) {
    state = state.copyWith(
      stakedAmount: stakedAmount,
      multiplier: multiplier,
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
