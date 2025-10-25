import 'package:karma_engine_app/core/api/api_service.dart';

class StakingRepository {
  static Future<Map<String, dynamic>> stakeTokens(
    Map<String, dynamic> stakeData,
  ) async {
    try {
      final response = await ApiService.stakeTokens(stakeData);
      if (response.statusCode == 201) {
        return response.data;
      } else {
        throw Exception('Failed to stake tokens: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to stake tokens: $e');
    }
  }

  static Future<Map<String, dynamic>> unstakeTokens(
    Map<String, dynamic> unstakeData,
  ) async {
    try {
      final response = await ApiService.unstakeTokens(unstakeData);
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to unstake tokens: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to unstake tokens: $e');
    }
  }

  static Future<Map<String, dynamic>> redeemKarma(
    Map<String, dynamic> redeemData,
  ) async {
    try {
      final response = await ApiService.redeemKarma(redeemData);
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to redeem karma: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to redeem karma: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getUserStakingRecords(
    String walletAddress,
  ) async {
    try {
      final response = await ApiService.getUserStakingRecords(walletAddress);
      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(response.data['stakingRecords']);
      } else {
        throw Exception(
          'Failed to get staking records: ${response.statusMessage}',
        );
      }
    } catch (e) {
      throw Exception('Failed to get staking records: $e');
    }
  }
}
