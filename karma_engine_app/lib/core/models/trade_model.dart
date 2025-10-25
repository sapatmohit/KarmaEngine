enum TradeType { buy, sell }

enum TradeStatus { pending, completed, failed, cancelled }

class TradeModel {
  TradeModel({
    required this.id,
    required this.userId,
    required this.targetUserId,
    required this.type,
    required this.amount,
    required this.price,
    required this.totalValue,
    required this.status,
    required this.createdAt,
    this.completedAt,
    this.transactionHash,
    this.fees,
  });

  factory TradeModel.fromJson(Map<String, dynamic> json) => TradeModel(
    id: json['id'] ?? '',
    userId: json['userId'] ?? '',
    targetUserId: json['targetUserId'] ?? '',
    type: TradeType.values.firstWhere(
      (e) => e.name == json['type'],
      orElse: () => TradeType.buy,
    ),
    amount: (json['amount'] ?? 0.0).toDouble(),
    price: (json['price'] ?? 0.0).toDouble(),
    totalValue: (json['totalValue'] ?? 0.0).toDouble(),
    status: TradeStatus.values.firstWhere(
      (e) => e.name == json['status'],
      orElse: () => TradeStatus.pending,
    ),
    createdAt: DateTime.parse(
      json['createdAt'] ?? DateTime.now().toIso8601String(),
    ),
    completedAt: json['completedAt'] != null
        ? DateTime.parse(json['completedAt'])
        : null,
    transactionHash: json['transactionHash'],
    fees: json['fees'] != null ? (json['fees'] as num).toDouble() : null,
  );

  final String id;
  final String userId;
  final String targetUserId;
  final TradeType type;
  final double amount;
  final double price;
  final double totalValue;
  final TradeStatus status;
  final DateTime createdAt;
  final DateTime? completedAt;
  final String? transactionHash;
  final double? fees;

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'targetUserId': targetUserId,
    'type': type.name,
    'amount': amount,
    'price': price,
    'totalValue': totalValue,
    'status': status.name,
    'createdAt': createdAt.toIso8601String(),
    'completedAt': completedAt?.toIso8601String(),
    'transactionHash': transactionHash,
    'fees': fees,
  };
}

class MarketStats {
  MarketStats({
    required this.totalVolume24h,
    required this.totalMarketCap,
    required this.activeTraders24h,
    required this.totalTrades24h,
    required this.topGainers,
    required this.topLosers,
  });

  factory MarketStats.fromJson(Map<String, dynamic> json) => MarketStats(
    totalVolume24h: (json['totalVolume24h'] ?? 0.0).toDouble(),
    totalMarketCap: (json['totalMarketCap'] ?? 0.0).toDouble(),
    activeTraders24h: json['activeTraders24h'] ?? 0,
    totalTrades24h: json['totalTrades24h'] ?? 0,
    topGainers: List<String>.from(json['topGainers'] ?? []),
    topLosers: List<String>.from(json['topLosers'] ?? []),
  );

  final double totalVolume24h;
  final double totalMarketCap;
  final int activeTraders24h;
  final int totalTrades24h;
  final List<String> topGainers;
  final List<String> topLosers;

  Map<String, dynamic> toJson() => {
    'totalVolume24h': totalVolume24h,
    'totalMarketCap': totalMarketCap,
    'activeTraders24h': activeTraders24h,
    'totalTrades24h': totalTrades24h,
    'topGainers': topGainers,
    'topLosers': topLosers,
  };
}
