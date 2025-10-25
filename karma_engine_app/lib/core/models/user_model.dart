class UserModel {
  UserModel({
    required this.id,
    required this.walletAddress,
    required this.name,
    required this.username,
    required this.avatar,
    required this.karmaPoints,
    required this.stakedAmount,
    required this.multiplier,
    required this.createdAt,
    required this.isActive,
    required this.isOver18,
    required this.dateOfBirth,
    this.lastActivity,
    this.socialMedia,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] ?? '',
    walletAddress: json['walletAddress'] ?? '',
    name: json['name'] ?? '',
    username: json['username'] ?? '',
    avatar: json['avatar'] ?? '',
    karmaPoints: json['karmaPoints'] ?? 0,
    stakedAmount: (json['stakedAmount'] ?? 0).toDouble(),
    multiplier: (json['multiplier'] ?? 1.0).toDouble(),
    createdAt: DateTime.parse(
      json['createdAt'] ?? DateTime.now().toIso8601String(),
    ),
    dateOfBirth: DateTime.parse(
      json['dateOfBirth'] ?? DateTime.now().toIso8601String(),
    ),
    lastActivity:
        json['lastActivity'] != null
            ? DateTime.parse(json['lastActivity'])
            : null,
    isActive: json['isActive'] ?? true,
    isOver18: json['isOver18'] ?? false,
    socialMedia: json['socialMedia'] != null 
        ? Map<String, String>.from(json['socialMedia'])
        : null,
  );
  final String id;
  final String walletAddress;
  final String name;
  final String username;
  final String avatar;
  final int karmaPoints;
  final double stakedAmount;
  final double multiplier;
  final DateTime createdAt;
  final DateTime dateOfBirth;
  final DateTime? lastActivity;
  final bool isActive;
  final bool isOver18;
  final Map<String, String>? socialMedia;

  Map<String, dynamic> toJson() => {
    'id': id,
    'walletAddress': walletAddress,
    'name': name,
    'username': username,
    'avatar': avatar,
    'karmaPoints': karmaPoints,
    'stakedAmount': stakedAmount,
    'multiplier': multiplier,
    'createdAt': createdAt.toIso8601String(),
    'dateOfBirth': dateOfBirth.toIso8601String(),
    'lastActivity': lastActivity?.toIso8601String(),
    'isActive': isActive,
    'isOver18': isOver18,
    'socialMedia': socialMedia,
  };

  UserModel copyWith({
    String? id,
    String? walletAddress,
    String? name,
    String? username,
    String? avatar,
    int? karmaPoints,
    double? stakedAmount,
    double? multiplier,
    DateTime? createdAt,
    DateTime? dateOfBirth,
    DateTime? lastActivity,
    bool? isActive,
    bool? isOver18,
    Map<String, String>? socialMedia,
  }) {
    return UserModel(
      id: id ?? this.id,
      walletAddress: walletAddress ?? this.walletAddress,
      name: name ?? this.name,
      username: username ?? this.username,
      avatar: avatar ?? this.avatar,
      karmaPoints: karmaPoints ?? this.karmaPoints,
      stakedAmount: stakedAmount ?? this.stakedAmount,
      multiplier: multiplier ?? this.multiplier,
      createdAt: createdAt ?? this.createdAt,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      lastActivity: lastActivity ?? this.lastActivity,
      isActive: isActive ?? this.isActive,
      isOver18: isOver18 ?? this.isOver18,
      socialMedia: socialMedia ?? this.socialMedia,
    );
  }
}
