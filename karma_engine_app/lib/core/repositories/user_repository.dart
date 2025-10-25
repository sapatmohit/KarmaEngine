import 'package:karma_engine_app/core/api/api_service.dart';
import 'package:karma_engine_app/core/models/user_model.dart';

class UserRepository {
  static Future<UserModel> registerUser(Map<String, dynamic> userData) async {
    try {
      final response = await ApiService.registerUser(userData);
      if (response.statusCode == 201) {
        return UserModel.fromJson(response.data['user']);
      } else {
        throw Exception('Failed to register user: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to register user: $e');
    }
  }

  static Future<UserModel> getUser(String walletAddress) async {
    try {
      final response = await ApiService.getUser(walletAddress);
      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user']);
      } else {
        throw Exception('Failed to get user: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get user: $e');
    }
  }
}
