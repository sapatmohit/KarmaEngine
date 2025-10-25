import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';

class TokenInfoWidget extends StatelessWidget {
  final KarmaTokenModel token;

  const TokenInfoWidget({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
    final isPositive = token.priceChangePercentage24h >= 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Breadcrumb navigation
        Row(
          children: [
            const Text(
              'Explore',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 16),
            const Text(
              'Tokens',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 16),
            Text(
              token.username.toUpperCase(),
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Token header
        Row(
          children: [
            // Token avatar
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF7C3AED),
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: const Icon(
                Icons.currency_bitcoin,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            
            // Token name and symbol
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        token.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        token.username.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 16,
                        ),
                      ),
                      if (token.isVerified) ...[
                        const SizedBox(width: 8),
                        const Icon(
                          Icons.verified,
                          color: Color(0xFF7C3AED),
                          size: 20,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.grey, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        'Karma Score: ${NumberFormat('#,###').format(token.karmaScore)}',
                        style: const TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Action buttons
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.copy, color: Colors.grey),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.share, color: Colors.grey),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.favorite_border, color: Colors.grey),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.more_horiz, color: Colors.grey),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 24),

        // Price information
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              formatter.format(token.currentPrice),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isPositive 
                    ? const Color(0xFF10B981).withOpacity(0.2)
                    : const Color(0xFFEF4444).withOpacity(0.2),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isPositive ? Icons.trending_up : Icons.trending_down,
                    color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${isPositive ? '+' : ''}${token.priceChangePercentage24h.toStringAsFixed(2)}%',
                    style: TextStyle(
                      color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Text(
              '${isPositive ? '+' : ''}${formatter.format(token.priceChange24h)}',
              style: TextStyle(
                color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                fontSize: 16,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
