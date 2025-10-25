import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';

class ActivityState {
  ActivityState({
    this.activities = const [],
    this.isLoading = false,
    this.error,
  });
  final List<ActivityModel> activities;
  final bool isLoading;
  final String? error;

  ActivityState copyWith({
    List<ActivityModel>? activities,
    bool? isLoading,
    String? error,
  }) => ActivityState(
    activities: activities ?? this.activities,
    isLoading: isLoading ?? this.isLoading,
    error: error ?? this.error,
  );
}

final activityProvider = StateNotifierProvider<ActivityNotifier, ActivityState>(
  (ref) => ActivityNotifier(),
);

class ActivityNotifier extends StateNotifier<ActivityState> {
  ActivityNotifier() : super(ActivityState());

  void setActivities(List<ActivityModel> activities) {
    state = state.copyWith(
      activities: activities,
      isLoading: false,
      error: null,
    );
  }

  void addActivity(ActivityModel activity) {
    final updatedActivities = [activity, ...state.activities];
    state = state.copyWith(
      activities: updatedActivities,
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
