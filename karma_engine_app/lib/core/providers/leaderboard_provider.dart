import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:karma_engine_app/core/models/leaderboard_model.dart';

class LeaderboardState {
  final List<LeaderboardModel> leaderboard;
  final bool isLoading;
  final String? error;

  LeaderboardState({
    this.leaderboard = const [],
    this.isLoading = false,
    this.error,
  });

  LeaderboardState copyWith({
    List<LeaderboardModel>? leaderboard,
    bool? isLoading,
    String? error,
  }) {
    return LeaderboardState(
      leaderboard: leaderboard ?? this.leaderboard,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

final leaderboardProvider = StateNotifierProvider<LeaderboardNotifier, LeaderboardState>((ref) {
  return LeaderboardNotifier();
});

class LeaderboardNotifier extends StateNotifier<LeaderboardState> {
  LeaderboardNotifier() : super(LeaderboardState());

  void setLeaderboard(List<LeaderboardModel> leaderboard) {
    state = state.copyWith(leaderboard: leaderboard, isLoading: false, error: null);
  }

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String error) {
    state = state.copyWith(error: error, isLoading: false);
  }
}