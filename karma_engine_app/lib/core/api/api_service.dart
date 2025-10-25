import 'package:dio/dio.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: Constants.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  );

  // User endpoints
  static Future<Response> registerUser(Map<String, dynamic> data) async =>
      await _dio.post('/users/register', data: data);

  static Future<Response> getUser(String walletAddress) async =>
      await _dio.get('/users/$walletAddress');

  // Karma endpoints
  static Future<Response> getKarmaBalance(String walletAddress) async =>
      await _dio.get('/karma/balance/$walletAddress');

  static Future<Response> syncKarma(String walletAddress) async =>
      await _dio.post('/karma/sync/$walletAddress');

  static Future<Response> getLeaderboard() async =>
      await _dio.get('/karma/leaderboard');

  // Activity endpoints
  static Future<Response> recordActivity(Map<String, dynamic> data) async =>
      await _dio.post('/activities', data: data);

  static Future<Response> getUserActivities(String walletAddress) async =>
      await _dio.get('/activities/$walletAddress');

  // Staking endpoints
  static Future<Response> stakeTokens(Map<String, dynamic> data) async =>
      await _dio.post('/staking/stake', data: data);

  static Future<Response> unstakeTokens(Map<String, dynamic> data) async =>
      await _dio.post('/staking/unstake', data: data);

  static Future<Response> redeemKarma(Map<String, dynamic> data) async =>
      await _dio.post('/staking/redeem', data: data);

  static Future<Response> getUserStakingRecords(String walletAddress) async =>
      await _dio.get('/staking/$walletAddress');

  // Generic HTTP methods for trading
  static Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async =>
      await _dio.get(path, queryParameters: queryParameters);

  static Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async =>
      await _dio.post(path, data: data, queryParameters: queryParameters);
}
