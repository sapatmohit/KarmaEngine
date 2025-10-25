import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';
import 'package:karma_engine_app/features/trading/presentation/screens/trading_screen.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<KarmaTokenModel> tokens = [];
  List<KarmaTokenModel> filteredTokens = [];
  bool isLoading = true;
  String selectedFilter = 'All';

  final List<String> filters = ['All', 'Trending', 'Top Gainers', 'Top Losers', 'New'];

  @override
  void initState() {
    super.initState();
    _loadTokens();
    _searchController.addListener(_filterTokens);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadTokens() async {
    // Mock data - replace with actual API call
    await Future.delayed(const Duration(milliseconds: 800));
    
    final mockTokens = [
      KarmaTokenModel(
        userId: 'user1',
        username: 'ethereum_trader',
        name: 'Ethereum Trader',
        avatar: 'https://via.placeholder.com/40',
        currentPrice: 3943.51,
        priceChange24h: -30.87,
        priceChangePercentage24h: -0.87,
        marketCap: 474000000,
        volume24h: 12500000,
        totalSupply: 120000000,
        circulatingSupply: 120000000,
        karmaScore: 8750,
        priceHistory: [],
        isVerified: true,
      ),
      KarmaTokenModel(
        userId: 'user2',
        username: 'bitcoin_bull',
        name: 'Bitcoin Bull',
        avatar: 'https://via.placeholder.com/40',
        currentPrice: 2156.78,
        priceChange24h: 125.43,
        priceChangePercentage24h: 6.18,
        marketCap: 325000000,
        volume24h: 8900000,
        totalSupply: 150000000,
        circulatingSupply: 150000000,
        karmaScore: 9200,
        priceHistory: [],
        isVerified: true,
      ),
      KarmaTokenModel(
        userId: 'user3',
        username: 'defi_master',
        name: 'DeFi Master',
        avatar: 'https://via.placeholder.com/40',
        currentPrice: 1234.56,
        priceChange24h: -45.23,
        priceChangePercentage24h: -3.54,
        marketCap: 185000000,
        volume24h: 5600000,
        totalSupply: 150000000,
        circulatingSupply: 150000000,
        karmaScore: 7850,
        priceHistory: [],
        isVerified: false,
      ),
      KarmaTokenModel(
        userId: 'user4',
        username: 'nft_collector',
        name: 'NFT Collector',
        avatar: 'https://via.placeholder.com/40',
        currentPrice: 567.89,
        priceChange24h: 78.12,
        priceChangePercentage24h: 15.95,
        marketCap: 95000000,
        volume24h: 3200000,
        totalSupply: 167000000,
        circulatingSupply: 167000000,
        karmaScore: 6420,
        priceHistory: [],
        isVerified: true,
      ),
      KarmaTokenModel(
        userId: 'user5',
        username: 'yield_farmer',
        name: 'Yield Farmer',
        avatar: 'https://via.placeholder.com/40',
        currentPrice: 89.45,
        priceChange24h: 2.34,
        priceChangePercentage24h: 2.69,
        marketCap: 12000000,
        volume24h: 890000,
        totalSupply: 134000000,
        circulatingSupply: 134000000,
        karmaScore: 5670,
        priceHistory: [],
        isVerified: false,
      ),
    ];

    setState(() {
      tokens = mockTokens;
      filteredTokens = mockTokens;
      isLoading = false;
    });
  }

  void _filterTokens() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      filteredTokens = tokens.where((token) {
        final matchesSearch = token.name.toLowerCase().contains(query) ||
            token.username.toLowerCase().contains(query);
        
        if (selectedFilter == 'All') return matchesSearch;
        if (selectedFilter == 'Trending') return matchesSearch && token.volume24h > 5000000;
        if (selectedFilter == 'Top Gainers') return matchesSearch && token.priceChangePercentage24h > 0;
        if (selectedFilter == 'Top Losers') return matchesSearch && token.priceChangePercentage24h < 0;
        if (selectedFilter == 'New') return matchesSearch && token.karmaScore < 7000;
        
        return matchesSearch;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1421),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D1421),
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.explore, color: Color(0xFF7C3AED), size: 24),
            const SizedBox(width: 8),
            const Text(
              'Uniswap',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            _buildNavButton('Trade', false),
            const SizedBox(width: 16),
            _buildNavButton('Explore', true),
            const SizedBox(width: 16),
            _buildNavButton('Pool', false),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.account_circle, color: Colors.white, size: 20),
                SizedBox(width: 4),
                Text(
                  '0xa88C...f6dd',
                  style: TextStyle(color: Colors.white, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Header section
          Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Explore Karma Tokens',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Trade on other users\' karma growth. Buy low, sell high!',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 20),
                
                // Search bar
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: TextField(
                    controller: _searchController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      hintText: 'Search tokens and pools',
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(Icons.search, color: Colors.grey),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Filter chips
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: filters.length,
                    itemBuilder: (context, index) {
                      final filter = filters[index];
                      final isSelected = selectedFilter == filter;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            selectedFilter = filter;
                          });
                          _filterTokens();
                        },
                        child: Container(
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFF7C3AED) : const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF7C3AED) : const Color(0xFF334155),
                            ),
                          ),
                          child: Text(
                            filter,
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.grey,
                              fontSize: 14,
                              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          
          // Tokens list
          Expanded(
            child: isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Color(0xFF7C3AED)),
                  )
                : filteredTokens.isEmpty
                    ? const Center(
                        child: Text(
                          'No tokens found',
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        itemCount: filteredTokens.length,
                        itemBuilder: (context, index) {
                          final token = filteredTokens[index];
                          return _buildTokenCard(token);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavButton(String text, bool isActive) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFF7C3AED) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isActive ? Colors.white : Colors.grey,
          fontSize: 14,
          fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildTokenCard(KarmaTokenModel token) {
    final isPositive = token.priceChangePercentage24h >= 0;
    final formatter = NumberFormat.currency(symbol: '\$', decimalDigits: 2);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TradingScreen(initialTokenId: token.userId),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Row(
          children: [
            // Token avatar
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF7C3AED),
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: const Icon(
                Icons.person,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            
            // Token info
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
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '@${token.username}',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      if (token.isVerified) ...[
                        const SizedBox(width: 6),
                        const Icon(
                          Icons.verified,
                          color: Color(0xFF7C3AED),
                          size: 16,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        '${NumberFormat('#,###').format(token.karmaScore)} karma',
                        style: const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(width: 16),
                      const Icon(Icons.trending_up, color: Colors.grey, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        'Vol: ${NumberFormat.compact().format(token.volume24h)}',
                        style: const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Price info
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  formatter.format(token.currentPrice),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: isPositive 
                        ? const Color(0xFF10B981).withOpacity(0.2)
                        : const Color(0xFFEF4444).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '${isPositive ? '+' : ''}${token.priceChangePercentage24h.toStringAsFixed(2)}%',
                    style: TextStyle(
                      color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
