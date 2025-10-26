import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../models/activity_model.dart';
import '../models/staking_model.dart';
import '../utils/constants.dart';

class ApiService {
  factory ApiService() => _instance;
  ApiService._internal();
  static String get baseUrl => Constants.baseUrl;

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();

  // HTTP headers
  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // Generic HTTP request handler
  Future<Map<String, dynamic>> _makeRequest(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      print('Making $method request to: $url'); // Debug log
      late http.Response response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(url, headers: _headers);
          break;
        case 'POST':
          response = await http.post(
            url,
            headers: _headers,
            body: body != null ? jsonEncode(body) : null,
          );
          break;
        case 'PUT':
          response = await http.put(
            url,
            headers: _headers,
            body: body != null ? jsonEncode(body) : null,
          );
          break;
        case 'DELETE':
          response = await http.delete(url, headers: _headers);
          break;
        default:
          throw Exception('Unsupported HTTP method: $method');
      }

      print('Response status: ${response.statusCode}'); // Debug log
      print('Response body: ${response.body}'); // Debug log

      final responseData = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return responseData;
      } else {
        throw ApiException(
          message: responseData['message'] ?? 'Unknown error occurred',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      print('API Error: $e'); // Debug log
      if (e is ApiException) rethrow;

      // Provide more specific error messages
      String errorMessage = 'Network error: ${e.toString()}';
      if (e.toString().contains('No route to host')) {
        errorMessage =
            'Cannot connect to server. Please check:\n1. Backend is running on port 5000\n2. Device and computer are on same network\n3. Firewall allows connections';
      } else if (e.toString().contains('Connection refused')) {
        errorMessage =
            'Connection refused. Backend server may not be running on port 5000';
      } else if (e.toString().contains('SocketException')) {
        errorMessage =
            'Network connection failed. Check your internet connection and server status';
      }

      throw ApiException(message: errorMessage, statusCode: 0);
    }
  }

  // User API methods
  Future<UserModel> registerUserWithEmail({
    required String email,
    required String password,
    required String name,
    required DateTime dateOfBirth,
    String? instagram,
    String? facebook,
    String? twitter,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/users/register-email',
      body: {
        'email': email,
        'password': password,
        'name': name,
        'dateOfBirth': dateOfBirth.toIso8601String(),
        'instagram': instagram,
        'facebook': facebook,
        'twitter': twitter,
      },
    );

    return UserModel.fromJson(response['user']);
  }

  Future<UserModel> registerUser({
    required String walletAddress,
    required String name,
    required DateTime dateOfBirth,
    String? instagram,
    String? facebook,
    String? twitter,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/users/register',
      body: {
        'walletAddress': walletAddress,
        'name': name,
        'dateOfBirth': dateOfBirth.toIso8601String(),
        'instagram': instagram,
        'facebook': facebook,
        'twitter': twitter,
      },
    );

    return UserModel.fromJson(response['user']);
  }

  Future<UserModel> getUserByWallet(String walletAddress) async {
    final response = await _makeRequest('GET', '/users/wallet/$walletAddress');
    return UserModel.fromJson(response['user']);
  }

  Future<UserModel> authenticateUser(String email, String password) async {
    final response = await _makeRequest(
      'POST',
      '/users/login',
      body: {'email': email, 'password': password},
    );
    return UserModel.fromJson(response['user']);
  }

  Future<UserModel> updateUserKarma(
    String walletAddress,
    int karmaPoints,
  ) async {
    final response = await _makeRequest(
      'PUT',
      '/users/$walletAddress/karma',
      body: {'karmaPoints': karmaPoints},
    );
    return UserModel.fromJson(response['user']);
  }

  // Activity API methods
  Future<ActivityModel> recordActivity({
    required String walletAddress,
    required String type,
    required int value,
    double multiplier = 1.0,
    Map<String, dynamic>? metadata,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/activities',
      body: {
        'walletAddress': walletAddress,
        'type': type,
        'value': value,
        'multiplier': multiplier,
        'metadata': metadata,
      },
    );

    return ActivityModel.fromJson(response['activity']);
  }

  Future<List<ActivityModel>> getUserActivities(String walletAddress) async {
    final response = await _makeRequest(
      'GET',
      '/activities/user/$walletAddress',
    );
    final activities = response['activities'] as List;
    return activities
        .map((activity) => ActivityModel.fromJson(activity))
        .toList();
  }

  Future<Map<String, dynamic>> getActivityStats(String walletAddress) async {
    final response = await _makeRequest(
      'GET',
      '/activities/$walletAddress/stats',
    );
    return response['stats'];
  }

  // Staking API methods
  Future<StakingModel> stakeTokens({
    required String walletAddress,
    required double amount,
    required String transactionHash,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/staking/stake',
      body: {
        'walletAddress': walletAddress,
        'amount': amount,
        'transactionHash': transactionHash,
      },
    );

    return StakingModel.fromJson(response['staking']);
  }

  Future<StakingModel> unstakeTokens({
    required String walletAddress,
    required double amount,
    required String transactionHash,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/staking/unstake',
      body: {
        'walletAddress': walletAddress,
        'amount': amount,
        'transactionHash': transactionHash,
      },
    );

    return StakingModel.fromJson(response['staking']);
  }

  Future<Map<String, dynamic>> redeemKarma({
    required String walletAddress,
    required int karmaAmount,
    required String transactionHash,
  }) async {
    final response = await _makeRequest(
      'POST',
      '/staking/redeem',
      body: {
        'walletAddress': walletAddress,
        'karmaAmount': karmaAmount,
        'transactionHash': transactionHash,
      },
    );

    return response;
  }

  Future<List<StakingModel>> getUserStakingRecords(String walletAddress) async {
    final response = await _makeRequest('GET', '/staking/$walletAddress');
    final stakingRecords = response['stakingRecords'] as List;
    return stakingRecords
        .map((record) => StakingModel.fromJson(record))
        .toList();
  }

  // Karma API methods (if you have karma routes)
  Future<Map<String, dynamic>> getKarmaHistory(String walletAddress) async {
    try {
      final response = await _makeRequest(
        'GET',
        '/karma/history/$walletAddress',
      );
      return response;
    } catch (e) {
      // Return empty history if endpoint doesn't exist
      return {'history': []};
    }
  }

  Future<List<Map<String, dynamic>>> getLeaderboard() async {
    try {
      final response = await _makeRequest('GET', '/karma/leaderboard');
      return List<Map<String, dynamic>>.from(response['leaderboard']);
    } catch (e) {
      // Return empty leaderboard if endpoint doesn't exist
      return [];
    }
  }

  // Health check
  Future<bool> checkConnection() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/health'));
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

// Custom exception class for API errors
class ApiException implements Exception {
  ApiException({required this.message, required this.statusCode});
  final String message;
  final int statusCode;

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';
}
