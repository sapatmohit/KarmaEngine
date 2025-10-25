import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';

class ActivityHistoryWidget extends StatelessWidget {
  const ActivityHistoryWidget({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock activity data
    final activities = [
      ActivityModel(
        id: '1',
        type: 'post',
        value: 5,
        multiplier: 1.5,
        finalKarma: 7,
        timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      ),
      ActivityModel(
        id: '2',
        type: 'comment',
        value: 3,
        multiplier: 1.5,
        finalKarma: 4,
        timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      ),
      ActivityModel(
        id: '3',
        type: 'like',
        value: 1,
        multiplier: 1.5,
        finalKarma: 1,
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Activity',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Activity list
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: activities.length,
              itemBuilder: (context, index) {
                final activity = activities[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    children: [
                      // Activity icon
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Theme.of(
                            context,
                          ).primaryColor.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Icon(
                            _getIconData(activity.iconName),
                            size: 20,
                            color: Theme.of(context).primaryColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Activity details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              activity.displayType,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              '${activity.finalKarma} karma points',
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Timestamp
                      Text(
                        _formatTime(activity.timestamp),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'article':
        return Icons.article;
      case 'comment':
        return Icons.comment;
      case 'thumb_up':
        return Icons.thumb_up;
      case 'repeat':
        return Icons.repeat;
      case 'flag':
        return Icons.flag;
      case 'star':
        return Icons.star;
      default:
        return Icons.star;
    }
  }

  String _formatTime(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }
}
