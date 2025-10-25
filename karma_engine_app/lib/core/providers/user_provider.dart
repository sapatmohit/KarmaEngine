import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:karma_engine_app/core/models/user_model.dart';

class UserState {
  UserState({this.user, this.isLoading = false, this.error});
  final UserModel? user;
  final bool isLoading;
  final String? error;

  UserState copyWith({UserModel? user, bool? isLoading, String? error}) =>
      UserState(
        user: user ?? this.user,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
      );
}

final userProvider = StateNotifierProvider<UserNotifier, UserState>(
  (ref) => UserNotifier(),
);

class UserNotifier extends StateNotifier<UserState> {
  UserNotifier() : super(UserState());

  void setUser(UserModel user) {
    state = state.copyWith(user: user, isLoading: false, error: null);
  }

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String error) {
    state = state.copyWith(error: error, isLoading: false);
  }

  void clearUser() {
    state = state.copyWith(user: null, error: null);
  }
}
