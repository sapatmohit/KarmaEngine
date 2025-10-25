import 'package:karma_engine_app/core/api/api_service.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';
import 'package:karma_engine_app/core/models/trade_model.dart';

class TradingRepository {
  static Future<List<KarmaTokenModel>> getKarmaTokens({
    String? search,
    int limit = 50,
    int offset = 0,
  }) async {
    try {
      final response = await ApiService.get('/karma-tokens', queryParameters: {
        if (search != null) 'search': search,
        'limit': limit,
        'offset': offset,
      });
      
      if (response.statusCode == 200) {
        final List<dynamic> tokensData = response.data['tokens'] ?? [];
        return tokensData.map((json) => KarmaTokenModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get karma tokens: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get karma tokens: $e');
    }
  }

  static Future<KarmaTokenModel> getKarmaToken(String userId) async {
    try {
      final response = await ApiService.get('/karma-tokens/$userId');
      
      if (response.statusCode == 200) {
        return KarmaTokenModel.fromJson(response.data);
      } else {
        throw Exception('Failed to get karma token: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get karma token: $e');
    }
  }

  static Future<List<PricePoint>> getKarmaPriceHistory(
    String userId, {
    String timeframe = '24h',
  }) async {
    try {
      final response = await ApiService.get('/karma-tokens/$userId/price-history', 
        queryParameters: {'timeframe': timeframe});
      
      if (response.statusCode == 200) {
        final List<dynamic> historyData = response.data['priceHistory'] ?? [];
        return historyData.map((json) => PricePoint.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get price history: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get price history: $e');
    }
  }

  static Future<TradeModel> executeTrade({
    required String targetUserId,
    required TradeType type,
    required double amount,
    required double price,
  }) async {
    try {
      final response = await ApiService.post('/trades', data: {
        'targetUserId': targetUserId,
        'type': type.name,
        'amount': amount,
        'price': price,
      });
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        return TradeModel.fromJson(response.data);
      } else {
        throw Exception('Failed to execute trade: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to execute trade: $e');
    }
  }

  static Future<List<TradeModel>> getUserTrades(String userId) async {
    try {
      final response = await ApiService.get('/users/$userId/trades');
      
      if (response.statusCode == 200) {
        final List<dynamic> tradesData = response.data['trades'] ?? [];
        return tradesData.map((json) => TradeModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get user trades: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get user trades: $e');
    }
  }

  static Future<MarketStats> getMarketStats() async {
    try {
      final response = await ApiService.get('/market/stats');
      
      if (response.statusCode == 200) {
        return MarketStats.fromJson(response.data);
      } else {
        throw Exception('Failed to get market stats: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get market stats: $e');
    }
  }

  static Future<double> getKarmaPrice(String userId) async {
    try {
      final response = await ApiService.get('/karma-tokens/$userId/price');
      
      if (response.statusCode == 200) {
        return (response.data['price'] ?? 0.0).toDouble();
      } else {
        throw Exception('Failed to get karma price: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get karma price: $e');
    }
  }

  static Future<Map<String, dynamic>> getOrderBook(String userId) async {
    try {
      final response = await ApiService.get('/karma-tokens/$userId/orderbook');
      
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to get order book: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Failed to get order book: $e');
    }
  }
}
