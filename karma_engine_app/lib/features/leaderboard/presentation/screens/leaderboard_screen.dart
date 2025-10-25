import 'package:flutter/material.dart';
import 'package:karma_engine_app/features/leaderboard/presentation/widgets/leaderboard_list.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Leaderboard')),
    body: const Padding(
      padding: EdgeInsets.all(16.0),
      child: LeaderboardList(),
    ),
  );
}
