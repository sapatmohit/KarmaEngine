import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/user_model.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';

class Achievement {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final int requirement;
  final String type; // 'karma', 'activities', 'staking', 'streak'
  final bool isUnlocked;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.requirement,
    required this.type,
    required this.isUnlocked,
  });
}

class ProfileAchievementsWidget extends StatelessWidget {
  final UserModel user;
  final List<ActivityModel> activities;

  const ProfileAchievementsWidget({
    super.key,
    required this.user,
    required this.activities,
  });

  @override
  Widget build(BuildContext context) {
    final achievements = _getAchievements();
    final unlockedAchievements = achievements.where((a) => a.isUnlocked).toList();
    final lockedAchievements = achievements.where((a) => !a.isUnlocked).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Achievement Summary
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  Icons.emoji_events,
                  size: 32,
                  color: Colors.amber,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Achievements',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${unlockedAchievements.length} of ${achievements.length} unlocked',
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                CircularProgressIndicator(
                  value: unlockedAchievements.length / achievements.length,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.amber),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Unlocked Achievements
        if (unlockedAchievements.isNotEmpty) ...[
          const Text(
            'Unlocked Achievements',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...unlockedAchievements.map((achievement) => 
            _buildAchievementCard(achievement, true)),
          const SizedBox(height: 20),
        ],

        // Locked Achievements
        if (lockedAchievements.isNotEmpty) ...[
          const Text(
            'Locked Achievements',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...lockedAchievements.map((achievement) => 
            _buildAchievementCard(achievement, false)),
        ],
      ],
    );
  }

  Widget _buildAchievementCard(Achievement achievement, bool isUnlocked) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: isUnlocked 
                ? achievement.color.withOpacity(0.2)
                : Colors.grey.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(
            achievement.icon,
            color: isUnlocked ? achievement.color : Colors.grey,
            size: 24,
          ),
        ),
        title: Text(
          achievement.title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isUnlocked ? null : Colors.grey,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              achievement.description,
              style: TextStyle(
                color: isUnlocked ? Colors.grey[600] : Colors.grey,
              ),
            ),
            const SizedBox(height: 4),
            if (!isUnlocked) _buildProgressBar(achievement),
          ],
        ),
        trailing: isUnlocked
            ? Icon(Icons.check_circle, color: achievement.color)
            : Icon(Icons.lock, color: Colors.grey),
      ),
    );
  }

  Widget _buildProgressBar(Achievement achievement) {
    double progress = _getProgress(achievement);
    int current = _getCurrentValue(achievement);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LinearProgressIndicator(
          value: progress,
          backgroundColor: Colors.grey[300],
          valueColor: AlwaysStoppedAnimation<Color>(achievement.color),
        ),
        const SizedBox(height: 4),
        Text(
          '$current / ${achievement.requirement}',
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  double _getProgress(Achievement achievement) {
    int current = _getCurrentValue(achievement);
    return (current / achievement.requirement).clamp(0.0, 1.0);
  }

  int _getCurrentValue(Achievement achievement) {
    switch (achievement.type) {
      case 'karma':
        return user.karmaPoints;
      case 'activities':
        return activities.length;
      case 'staking':
        return user.stakedAmount.toInt();
      case 'posts':
        return activities.where((a) => a.type == 'post').length;
      case 'comments':
        return activities.where((a) => a.type == 'comment').length;
      case 'likes':
        return activities.where((a) => a.type == 'like').length;
      default:
        return 0;
    }
  }

  List<Achievement> _getAchievements() {
    return [
      // Karma Achievements
      Achievement(
        id: 'first_karma',
        title: 'First Steps',
        description: 'Earn your first karma point',
        icon: Icons.star_outline,
        color: Colors.amber,
        requirement: 1,
        type: 'karma',
        isUnlocked: user.karmaPoints >= 1,
      ),
      Achievement(
        id: 'karma_100',
        title: 'Rising Star',
        description: 'Accumulate 100 karma points',
        icon: Icons.star,
        color: Colors.amber,
        requirement: 100,
        type: 'karma',
        isUnlocked: user.karmaPoints >= 100,
      ),
      Achievement(
        id: 'karma_500',
        title: 'Karma Master',
        description: 'Reach 500 karma points',
        icon: Icons.star_rate,
        color: Colors.orange,
        requirement: 500,
        type: 'karma',
        isUnlocked: user.karmaPoints >= 500,
      ),
      Achievement(
        id: 'karma_1000',
        title: 'Karma Legend',
        description: 'Achieve 1000 karma points',
        icon: Icons.stars,
        color: Colors.deepOrange,
        requirement: 1000,
        type: 'karma',
        isUnlocked: user.karmaPoints >= 1000,
      ),

      // Activity Achievements
      Achievement(
        id: 'first_activity',
        title: 'Getting Started',
        description: 'Complete your first activity',
        icon: Icons.play_arrow,
        color: Colors.green,
        requirement: 1,
        type: 'activities',
        isUnlocked: activities.isNotEmpty,
      ),
      Achievement(
        id: 'activities_10',
        title: 'Active Member',
        description: 'Complete 10 activities',
        icon: Icons.timeline,
        color: Colors.green,
        requirement: 10,
        type: 'activities',
        isUnlocked: activities.length >= 10,
      ),
      Achievement(
        id: 'activities_50',
        title: 'Super Active',
        description: 'Complete 50 activities',
        icon: Icons.trending_up,
        color: Colors.teal,
        requirement: 50,
        type: 'activities',
        isUnlocked: activities.length >= 50,
      ),

      // Staking Achievements
      Achievement(
        id: 'first_stake',
        title: 'Investor',
        description: 'Stake your first karma',
        icon: Icons.savings,
        color: Colors.blue,
        requirement: 1,
        type: 'staking',
        isUnlocked: user.stakedAmount >= 1,
      ),
      Achievement(
        id: 'stake_100',
        title: 'Committed Staker',
        description: 'Stake 100 karma points',
        icon: Icons.account_balance,
        color: Colors.blue,
        requirement: 100,
        type: 'staking',
        isUnlocked: user.stakedAmount >= 100,
      ),
      Achievement(
        id: 'stake_500',
        title: 'High Roller',
        description: 'Stake 500 karma points',
        icon: Icons.diamond,
        color: Colors.indigo,
        requirement: 500,
        type: 'staking',
        isUnlocked: user.stakedAmount >= 500,
      ),

      // Content Achievements
      Achievement(
        id: 'posts_5',
        title: 'Content Creator',
        description: 'Create 5 posts',
        icon: Icons.article,
        color: Colors.purple,
        requirement: 5,
        type: 'posts',
        isUnlocked: activities.where((a) => a.type == 'post').length >= 5,
      ),
      Achievement(
        id: 'comments_10',
        title: 'Conversationalist',
        description: 'Make 10 comments',
        icon: Icons.comment,
        color: Colors.cyan,
        requirement: 10,
        type: 'comments',
        isUnlocked: activities.where((a) => a.type == 'comment').length >= 10,
      ),
      Achievement(
        id: 'likes_25',
        title: 'Supporter',
        description: 'Give 25 likes',
        icon: Icons.thumb_up,
        color: Colors.pink,
        requirement: 25,
        type: 'likes',
        isUnlocked: activities.where((a) => a.type == 'like').length >= 25,
      ),

      // Special Achievements
      Achievement(
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Join Karma Engine in its early days',
        icon: Icons.rocket_launch,
        color: Colors.deepPurple,
        requirement: 1,
        type: 'special',
        isUnlocked: user.createdAt.isBefore(DateTime(2024, 6, 1)),
      ),
      Achievement(
        id: 'verified_user',
        title: 'Verified User',
        description: 'Complete age verification',
        icon: Icons.verified,
        color: Colors.blue,
        requirement: 1,
        type: 'special',
        isUnlocked: user.isOver18,
      ),
    ];
  }
}
