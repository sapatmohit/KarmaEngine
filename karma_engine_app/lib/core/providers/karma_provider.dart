import 'package:flutter_riverpod/flutter_riverpod.dart';

class KarmaState {
  final int karmaPoints;
  final double xlmEquivalent;
  final double multiplier;
  final bool isLoading;
  final String? error;

  KarmaState({
    this.karmaPoints = 0,
    this.xlmEquivalent = 0.0,
    this.multiplier = 1.0,
    this.isLoading = false,
    this.error,
  });

  KarmaState copyWith({
    int? karmaPoints,
    double? xlmEquivalent,
    double? multiplier,
    bool? isLoading,
    String? error,
  }) {
    return KarmaState(
      karmaPoints: karmaPoints ?? this.karmaPoints,
      xlmEquivalent: xlmEquivalent ?? this.xlmEquivalent,
      multiplier: multiplier ?? this.multiplier,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

final karmaProvider = StateNotifierProvider<KarmaNotifier, KarmaState>((ref) {
  return KarmaNotifier();
});

class KarmaNotifier extends StateNotifier<KarmaState> {
  KarmaNotifier() : super(KarmaState());

  void updateKarma(int karmaPoints, double multiplier) {
    final xlmEquivalent = karmaPoints * 0.01;
    state = state.copyWith(
      karmaPoints: karmaPoints,
      xlmEquivalent: xlmEquivalent,
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
