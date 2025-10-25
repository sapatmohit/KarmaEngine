import 'package:flutter/material.dart';

class ActivityModel {
  ActivityModel({
    required this.id,
    required this.type,
    required this.value,
    required this.multiplier,
    required this.finalKarma,
    required this.timestamp,
    this.metadata,
  });

  factory ActivityModel.fromJson(Map<String, dynamic> json) => ActivityModel(
    id: json['id'] ?? '',
    type: json['type'] ?? '',
    value: json['value'] ?? 0,
    multiplier: (json['multiplier'] ?? 1.0).toDouble(),
    finalKarma: json['finalKarma'] ?? 0,
    timestamp: DateTime.parse(
      json['timestamp'] ?? DateTime.now().toIso8601String(),
    ),
    metadata: json['metadata'],
  );
  final String id;
  final String type;
  final int value;
  final double multiplier;
  final int finalKarma;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'value': value,
    'multiplier': multiplier,
    'finalKarma': finalKarma,
    'timestamp': timestamp.toIso8601String(),
    'metadata': metadata,
  };

  String get displayType {
    switch (type) {
      case 'post':
        return 'Posted';
      case 'comment':
        return 'Commented';
      case 'like':
        return 'Liked';
      case 'repost':
        return 'Reposted';
      case 'report':
        return 'Reported';
      default:
        return type;
    }
  }

  String get iconName {
    switch (type) {
      case 'post':
        return 'article';
      case 'comment':
        return 'comment';
      case 'like':
        return 'thumb_up';
      case 'repost':
        return 'repeat';
      case 'report':
        return 'flag';
      default:
        return 'star';
    }
  }

  IconData get icon {
    switch (type) {
      case 'post':
        return Icons.article;
      case 'comment':
        return Icons.comment;
      case 'like':
        return Icons.thumb_up;
      case 'repost':
        return Icons.repeat;
      case 'report':
        return Icons.flag;
      default:
        return Icons.star;
    }
  }
}
