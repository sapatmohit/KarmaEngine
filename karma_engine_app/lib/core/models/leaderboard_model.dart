class LeaderboardModel {
  final int rank;
  final String walletAddress;
  final int karmaPoints;
  final double stakedAmount;
  final double multiplier;

  LeaderboardModel({
    required this.rank,
    required this.walletAddress,
    required this.karmaPoints,
    required this.stakedAmount,
    required this.multiplier,
  });

  factory LeaderboardModel.fromJson(Map<String, dynamic> json) {
    return LeaderboardModel(
      rank: json['rank'] ?? 0,
      walletAddress: json['walletAddress'] ?? '',
      karmaPoints: json['karmaPoints'] ?? 0,
      stakedAmount: (json['stakedAmount'] ?? 0).toDouble(),
      multiplier: (json['multiplier'] ?? 1.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rank': rank,
      'walletAddress': walletAddress,
      'karmaPoints': karmaPoints,
      'stakedAmount': stakedAmount,
      'multiplier': multiplier,
    };
  }
}
