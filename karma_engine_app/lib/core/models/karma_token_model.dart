class KarmaTokenModel {
  KarmaTokenModel({
    required this.userId,
    required this.username,
    required this.name,
    required this.avatar,
    required this.currentPrice,
    required this.priceChange24h,
    required this.priceChangePercentage24h,
    required this.marketCap,
    required this.volume24h,
    required this.totalSupply,
    required this.circulatingSupply,
    required this.karmaScore,
    required this.priceHistory,
    required this.isVerified,
    this.description,
  });

  factory KarmaTokenModel.fromJson(Map<String, dynamic> json) => KarmaTokenModel(
    userId: json['userId'] ?? '',
    username: json['username'] ?? '',
    name: json['name'] ?? '',
    avatar: json['avatar'] ?? '',
    currentPrice: (json['currentPrice'] ?? 0.0).toDouble(),
    priceChange24h: (json['priceChange24h'] ?? 0.0).toDouble(),
    priceChangePercentage24h: (json['priceChangePercentage24h'] ?? 0.0).toDouble(),
    marketCap: (json['marketCap'] ?? 0.0).toDouble(),
    volume24h: (json['volume24h'] ?? 0.0).toDouble(),
    totalSupply: (json['totalSupply'] ?? 0.0).toDouble(),
    circulatingSupply: (json['circulatingSupply'] ?? 0.0).toDouble(),
    karmaScore: json['karmaScore'] ?? 0,
    priceHistory: List<PricePoint>.from(
      (json['priceHistory'] ?? []).map((x) => PricePoint.fromJson(x)),
    ),
    isVerified: json['isVerified'] ?? false,
    description: json['description'],
  );

  final String userId;
  final String username;
  final String name;
  final String avatar;
  final double currentPrice;
  final double priceChange24h;
  final double priceChangePercentage24h;
  final double marketCap;
  final double volume24h;
  final double totalSupply;
  final double circulatingSupply;
  final int karmaScore;
  final List<PricePoint> priceHistory;
  final bool isVerified;
  final String? description;

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'username': username,
    'name': name,
    'avatar': avatar,
    'currentPrice': currentPrice,
    'priceChange24h': priceChange24h,
    'priceChangePercentage24h': priceChangePercentage24h,
    'marketCap': marketCap,
    'volume24h': volume24h,
    'totalSupply': totalSupply,
    'circulatingSupply': circulatingSupply,
    'karmaScore': karmaScore,
    'priceHistory': priceHistory.map((x) => x.toJson()).toList(),
    'isVerified': isVerified,
    'description': description,
  };
}

class PricePoint {
  PricePoint({
    required this.timestamp,
    required this.price,
    required this.volume,
  });

  factory PricePoint.fromJson(Map<String, dynamic> json) => PricePoint(
    timestamp: DateTime.parse(json['timestamp']),
    price: (json['price'] ?? 0.0).toDouble(),
    volume: (json['volume'] ?? 0.0).toDouble(),
  );

  final DateTime timestamp;
  final double price;
  final double volume;

  Map<String, dynamic> toJson() => {
    'timestamp': timestamp.toIso8601String(),
    'price': price,
    'volume': volume,
  };
}
