import 'package:karma_engine_app/core/api/api_service.dart';

class KarmaRepository {
  static Future<Map<String, dynamic>> getKarmaBalance(
    String walletAddress,
  ) async {
    try {
      final response = await ApiService.getKarmaBalance(walletAddress);
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception(
          'Failed to get karma balance: ${response.statusMessage}',
        );
      }
    } catch (e) {
      throw Exception('Failed to get karma balance: $e');
    }
  }

  static Future<Map<String, dynamic>> syncKarma(String walletAddress) async {
    try {
      final response = await ApiService.syncKarma(walletAddress);
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to sync karma: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to sync karma: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getLeaderboard() async {
    try {
      final response = await ApiService.getLeaderboard();
      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(response.data['leaderboard']);
      } else {
        throw Exception('Failed to get leaderboard: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get leaderboard: $e');
    }
  }
}
