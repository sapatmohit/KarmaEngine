import 'package:karma_engine_app/core/api/api_service.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';

class ActivityRepository {
  static Future<ActivityModel> recordActivity(
    Map<String, dynamic> activityData,
  ) async {
    try {
      final response = await ApiService.recordActivity(activityData);
      if (response.statusCode == 201) {
        return ActivityModel.fromJson(response.data['activity']);
      } else {
        throw Exception('Failed to record activity: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to record activity: $e');
    }
  }

  static Future<List<ActivityModel>> getUserActivities(
    String walletAddress,
  ) async {
    try {
      final response = await ApiService.getUserActivities(walletAddress);
      if (response.statusCode == 200) {
        final List<ActivityModel> activities = [];
        for (final activityData in response.data['activities']) {
          activities.add(ActivityModel.fromJson(activityData));
        }
        return activities;
      } else {
        throw Exception('Failed to get activities: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get activities: $e');
    }
  }
}
