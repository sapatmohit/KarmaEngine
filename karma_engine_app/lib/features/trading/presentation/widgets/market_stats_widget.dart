import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';

class MarketStatsWidget extends StatelessWidget {
  final KarmaTokenModel token;

  const MarketStatsWidget({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Stats',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Stats grid
          Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    _buildStatItem('TVL', NumberFormat.compact().format(token.totalSupply)),
                    const SizedBox(height: 16),
                    _buildStatItem('Market cap', NumberFormat.compact().format(token.marketCap)),
                    const SizedBox(height: 16),
                    _buildStatItem('FDV', NumberFormat.compact().format(token.marketCap * 1.2)),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  children: [
                    _buildStatItem('1 day volume', NumberFormat.compact().format(token.volume24h)),
                    const SizedBox(height: 16),
                    _buildStatItem('Karma Score', NumberFormat('#,###').format(token.karmaScore)),
                    const SizedBox(height: 16),
                    _buildStatItem('Holders', '1,247'),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Info section
          const Row(
            children: [
              Icon(Icons.info_outline, color: Colors.grey, size: 16),
              SizedBox(width: 8),
              Text(
                'Info',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          // Social links
          Row(
            children: [
              _buildSocialButton(Icons.language, 'Etherscan'),
              const SizedBox(width: 12),
              _buildSocialButton(Icons.public, 'Website'),
              const SizedBox(width: 12),
              _buildSocialButton(Icons.close, 'Twitter'),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Description
          if (token.description != null) ...[
            Text(
              token.description!,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
                height: 1.5,
              ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildSocialButton(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF334155),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.grey, size: 14),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
