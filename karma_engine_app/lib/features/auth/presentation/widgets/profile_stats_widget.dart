import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/user_model.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

class ProfileStatsWidget extends StatelessWidget {
  final UserModel user;
  final List<ActivityModel> activities;

  const ProfileStatsWidget({
    super.key,
    required this.user,
    required this.activities,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Overall Stats Cards
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Total Karma',
                user.karmaPoints.toString(),
                Icons.star,
                Colors.orange,
                context,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Staked',
                user.stakedAmount.toStringAsFixed(0),
                Icons.savings,
                Colors.green,
                context,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Multiplier',
                '${user.multiplier}x',
                Icons.trending_up,
                Colors.blue,
                context,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Activities',
                activities.length.toString(),
                Icons.timeline,
                Colors.purple,
                context,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Activity Breakdown Chart
        if (activities.isNotEmpty) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Activity Breakdown',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 200,
                    child: PieChart(
                      PieChartData(
                        sections: _getActivitySections(),
                        centerSpaceRadius: 40,
                        sectionsSpace: 2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildLegend(),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],

        // Recent Performance
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Recent Performance',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                _buildPerformanceMetrics(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    BuildContext context,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 28, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  List<PieChartSectionData> _getActivitySections() {
    final activityCounts = <String, int>{};
    final activityColors = {
      'post': Colors.blue,
      'comment': Colors.green,
      'like': Colors.orange,
      'repost': Colors.purple,
      'report': Colors.red,
    };

    // Count activities by type
    for (final activity in activities) {
      activityCounts[activity.type] = (activityCounts[activity.type] ?? 0) + 1;
    }

    final total = activities.length;
    return activityCounts.entries.map((entry) {
      final percentage = (entry.value / total) * 100;
      return PieChartSectionData(
        color: activityColors[entry.key] ?? Colors.grey,
        value: entry.value.toDouble(),
        title: '${percentage.toStringAsFixed(1)}%',
        radius: 60,
        titleStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      );
    }).toList();
  }

  Widget _buildLegend() {
    final activityCounts = <String, int>{};
    final activityColors = {
      'post': Colors.blue,
      'comment': Colors.green,
      'like': Colors.orange,
      'repost': Colors.purple,
      'report': Colors.red,
    };

    final activityNames = {
      'post': 'Posts',
      'comment': 'Comments',
      'like': 'Likes',
      'repost': 'Reposts',
      'report': 'Reports',
    };

    // Count activities by type
    for (final activity in activities) {
      activityCounts[activity.type] = (activityCounts[activity.type] ?? 0) + 1;
    }

    return Wrap(
      spacing: 16,
      runSpacing: 8,
      children: activityCounts.entries.map((entry) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: activityColors[entry.key] ?? Colors.grey,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 4),
            Text(
              '${activityNames[entry.key] ?? entry.key} (${entry.value})',
              style: const TextStyle(fontSize: 12),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildPerformanceMetrics() {
    if (activities.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text(
            'No activity data available',
            style: TextStyle(color: Colors.grey),
          ),
        ),
      );
    }

    // Calculate metrics
    final totalKarmaEarned = activities.fold<int>(
      0,
      (sum, activity) => sum + activity.finalKarma,
    );

    final averageKarmaPerActivity = totalKarmaEarned / activities.length;

    final last7DaysActivities = activities.where((activity) {
      final now = DateTime.now();
      final sevenDaysAgo = now.subtract(const Duration(days: 7));
      return activity.timestamp.isAfter(sevenDaysAgo);
    }).length;

    final averageMultiplier = activities.fold<double>(
      0,
      (sum, activity) => sum + activity.multiplier,
    ) / activities.length;

    return Column(
      children: [
        _buildMetricRow('Total Karma Earned', totalKarmaEarned.toString()),
        _buildMetricRow('Average per Activity', averageKarmaPerActivity.toStringAsFixed(1)),
        _buildMetricRow('Last 7 Days', '$last7DaysActivities activities'),
        _buildMetricRow('Average Multiplier', '${averageMultiplier.toStringAsFixed(2)}x'),
        _buildMetricRow('Most Active Day', _getMostActiveDay()),
      ],
    );
  }

  Widget _buildMetricRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  String _getMostActiveDay() {
    if (activities.isEmpty) return 'No data';

    final dayCount = <String, int>{};
    for (final activity in activities) {
      final day = DateFormat('EEEE').format(activity.timestamp);
      dayCount[day] = (dayCount[day] ?? 0) + 1;
    }

    final mostActiveEntry = dayCount.entries.reduce(
      (a, b) => a.value > b.value ? a : b,
    );

    return '${mostActiveEntry.key} (${mostActiveEntry.value})';
  }
}
