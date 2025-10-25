import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/leaderboard_model.dart';

class LeaderboardList extends StatelessWidget {
  const LeaderboardList({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock leaderboard data
    final leaderboard = [
      LeaderboardModel(
        rank: 1,
        walletAddress: 'GABCDEFG1234567890ABCDEFG1234567890ABCDEFG',
        karmaPoints: 5420,
        stakedAmount: 150.0,
        multiplier: 2.0,
      ),
      LeaderboardModel(
        rank: 2,
        walletAddress: 'GHIJKLMN1234567890HIJKLMN1234567890HIJKLMN',
        karmaPoints: 4890,
        stakedAmount: 120.0,
        multiplier: 1.5,
      ),
      LeaderboardModel(
        rank: 3,
        walletAddress: 'OPQRSTUV1234567890QRSTUV1234567890QRSTUV',
        karmaPoints: 4210,
        stakedAmount: 100.0,
        multiplier: 1.5,
      ),
      LeaderboardModel(
        rank: 4,
        walletAddress: 'WXYZABCD1234567890WXYZABCD1234567890WXYZ',
        karmaPoints: 3870,
        stakedAmount: 80.0,
        multiplier: 1.0,
      ),
      LeaderboardModel(
        rank: 5,
        walletAddress: 'EFGHIJKL1234567890EFGHIJKL1234567890EFGHIJKL',
        karmaPoints: 3560,
        stakedAmount: 70.0,
        multiplier: 1.0,
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Top Users',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),

        Expanded(
          child: ListView.builder(
            itemCount: leaderboard.length,
            itemBuilder: (context, index) {
              final user = leaderboard[index];
              return _buildLeaderboardItem(user, index == 0);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildLeaderboardItem(LeaderboardModel user, bool isTop) => Card(
    margin: const EdgeInsets.only(bottom: 12),
    elevation: isTop ? 4 : 2,
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          // Rank
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isTop ? Colors.amber : Colors.grey.withOpacity(0.3),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${user.rank}',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isTop ? Colors.black : Colors.black,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),

          // Wallet info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _shortenWalletAddress(user.walletAddress),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${user.karmaPoints} karma points',
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),

          // Staking info
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${user.stakedAmount} XLM',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                '${user.multiplier}x multiplier',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ],
      ),
    ),
  );

  String _shortenWalletAddress(String address) {
    if (address.length <= 10) return address;
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  }
}
