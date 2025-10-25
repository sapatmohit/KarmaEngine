import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';

class ActivityFeed extends StatelessWidget {
  const ActivityFeed({super.key});

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
        timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
        metadata: {'content': 'Just joined the Karma Engine community!'},
      ),
      ActivityModel(
        id: '2',
        type: 'comment',
        value: 3,
        multiplier: 1.5,
        finalKarma: 4,
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        metadata: {'content': 'Great project! Looking forward to seeing more.'},
      ),
      ActivityModel(
        id: '3',
        type: 'like',
        value: 1,
        multiplier: 1.5,
        finalKarma: 1,
        timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      ActivityModel(
        id: '4',
        type: 'post',
        value: 5,
        multiplier: 1.5,
        finalKarma: 7,
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        metadata: {'content': 'How does the staking mechanism work exactly?'},
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Recent Activities',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),

        Expanded(
          child: ListView.builder(
            itemCount: activities.length,
            itemBuilder: (context, index) {
              final activity = activities[index];
              return _buildActivityItem(activity);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActivityItem(ActivityModel activity) => Card(
    margin: const EdgeInsets.only(bottom: 16),
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Activity header
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF6A1B9A).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Icon(
                    activity.icon,
                    size: 20,
                    color: const Color(0xFF6A1B9A),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      activity.displayType,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      _formatTime(activity.timestamp),
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color:
                      activity.finalKarma > 0
                          ? Colors.green.withOpacity(0.1)
                          : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${activity.finalKarma > 0 ? '+' : ''}${activity.finalKarma}',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: activity.finalKarma > 0 ? Colors.green : Colors.red,
                  ),
                ),
              ),
            ],
          ),

          // Activity content
          if (activity.metadata != null &&
              activity.metadata!['content'] != null)
            Padding(
              padding: const EdgeInsets.only(top: 12.0),
              child: Text(
                activity.metadata!['content'] as String,
                style: const TextStyle(fontSize: 14),
              ),
            ),
        ],
      ),
    ),
  );

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
