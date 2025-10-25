class StakingModel {
  StakingModel({
    required this.id,
    required this.userId,
    required this.walletAddress,
    required this.amount,
    required this.multiplier,
    required this.startDate,
    required this.isActive,
    required this.transactionHash,
    this.endDate,
  });

  factory StakingModel.fromJson(Map<String, dynamic> json) => StakingModel(
    id: json['_id'] ?? json['id'] ?? '',
    userId: json['userId'] ?? '',
    walletAddress: json['walletAddress'] ?? '',
    amount: (json['amount'] ?? 0).toDouble(),
    multiplier: (json['multiplier'] ?? 1.0).toDouble(),
    startDate: DateTime.parse(
      json['startDate'] ?? DateTime.now().toIso8601String(),
    ),
    endDate: json['endDate'] != null 
        ? DateTime.parse(json['endDate'])
        : null,
    isActive: json['isActive'] ?? true,
    transactionHash: json['transactionHash'] ?? '',
  );

  final String id;
  final String userId;
  final String walletAddress;
  final double amount;
  final double multiplier;
  final DateTime startDate;
  final DateTime? endDate;
  final bool isActive;
  final String transactionHash;

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'walletAddress': walletAddress,
    'amount': amount,
    'multiplier': multiplier,
    'startDate': startDate.toIso8601String(),
    'endDate': endDate?.toIso8601String(),
    'isActive': isActive,
    'transactionHash': transactionHash,
  };

  // Helper methods
  Duration get stakingDuration {
    final end = endDate ?? DateTime.now();
    return end.difference(startDate);
  }

  double get earnedRewards {
    final days = stakingDuration.inDays;
    return amount * multiplier * (days / 365) * 0.1; // 10% APY example
  }
}
