import 'package:dio/dio.dart';
import '../utils/constants.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: Constants.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  )..interceptors.add(InterceptorsWrapper(
      onError: (DioException e, ErrorInterceptorHandler handler) {
        // Handle network errors specifically
        if (e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.receiveTimeout ||
            e.type == DioExceptionType.sendTimeout ||
            e.type == DioExceptionType.unknown) {
          // Re-throw with a more descriptive message
          return handler.next(DioException(
            error:
                'Network error: Unable to connect to the server. Please check if the backend is running on ${Constants.baseUrl}',
            type: e.type,
            requestOptions: e.requestOptions,
          ));
        }
        return handler.next(e);
      },
    ));

  // User endpoints
  static Future<Response> registerUser(Map<String, dynamic> data) async =>
      _dio.post('/users/register', data: data);

  static Future<Response> getUser(String walletAddress) async =>
      _dio.get('/users/$walletAddress');

  // Karma endpoints
  static Future<Response> getKarmaBalance(String walletAddress) async =>
      _dio.get('/karma/balance/$walletAddress');

  static Future<Response> syncKarma(String walletAddress) async =>
      _dio.post('/karma/sync/$walletAddress');

  static Future<Response> getLeaderboard() async =>
      _dio.get('/karma/leaderboard');

  // Activity endpoints
  static Future<Response> recordActivity(Map<String, dynamic> data) async =>
      _dio.post('/activities', data: data);

  static Future<Response> getUserActivities(String walletAddress) async =>
      _dio.get('/activities/$walletAddress');

  // Staking endpoints
  static Future<Response> stakeTokens(Map<String, dynamic> data) async =>
      _dio.post('/staking/stake', data: data);

  static Future<Response> unstakeTokens(Map<String, dynamic> data) async =>
      _dio.post('/staking/unstake', data: data);

  static Future<Response> redeemKarma(Map<String, dynamic> data) async =>
      _dio.post('/staking/redeem', data: data);

  static Future<Response> getUserStakingRecords(String walletAddress) async =>
      _dio.get('/staking/$walletAddress');

  // Generic HTTP methods for trading
  static Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async =>
      _dio.get(path, queryParameters: queryParameters);

  static Future<Response> post(
    String path, {
    data,
    Map<String, dynamic>? queryParameters,
  }) async =>
      _dio.post(path, data: data, queryParameters: queryParameters);
}
