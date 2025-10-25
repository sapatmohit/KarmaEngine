import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/activity/presentation/widgets/activity_buttons.dart';
import 'package:karma_engine_app/features/activity/presentation/widgets/activity_feed.dart';

class ActivityScreen extends StatefulWidget {
  const ActivityScreen({super.key});

  @override
  State<ActivityScreen> createState() => _ActivityScreenState();
}

class _ActivityScreenState extends State<ActivityScreen> {
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Activity Feed')),
    body: const Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Activity buttons
          ActivityButtons(),
          SizedBox(height: 24),

          // Activity feed
          Expanded(child: ActivityFeed()),
        ],
      ),
    ),
  );
}
