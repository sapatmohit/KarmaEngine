import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';
import 'package:karma_engine_app/core/models/trade_model.dart';
import 'package:karma_engine_app/features/trading/presentation/widgets/price_chart_widget.dart';
import 'package:karma_engine_app/features/trading/presentation/widgets/trading_panel_widget.dart';
import 'package:karma_engine_app/features/trading/presentation/widgets/token_info_widget.dart';
import 'package:karma_engine_app/features/trading/presentation/widgets/market_stats_widget.dart';

class TradingScreen extends StatefulWidget {
  final String? initialTokenId;
  
  const TradingScreen({super.key, this.initialTokenId});

  @override
  State<TradingScreen> createState() => _TradingScreenState();
}

class _TradingScreenState extends State<TradingScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  KarmaTokenModel? selectedToken;
  String selectedTimeframe = '1H';
  bool isLoading = true;

  final List<String> timeframes = ['1H', '1D', '1W', '1M', '1Y'];
  final List<String> tabs = ['Swap', 'Limit', 'Buy', 'Sell'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: tabs.length, vsync: this);
    _loadInitialData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadInitialData() async {
    // Mock data for demonstration - replace with actual API calls
    await Future.delayed(const Duration(milliseconds: 500));
    
    setState(() {
      selectedToken = KarmaTokenModel(
        userId: widget.initialTokenId ?? 'eth_user',
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
        priceHistory: _generateMockPriceData(),
        isVerified: true,
        description: 'A smart contract platform that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.',
      );
      isLoading = false;
    });
  }

  List<PricePoint> _generateMockPriceData() {
    final now = DateTime.now();
    final List<PricePoint> points = [];
    
    for (int i = 23; i >= 0; i--) {
      final timestamp = now.subtract(Duration(hours: i));
      final basePrice = 3943.51;
      final variation = (i * 0.5) - 12; // Create some price movement
      points.add(PricePoint(
        timestamp: timestamp,
        price: basePrice + variation,
        volume: 500000 + (i * 10000),
      ));
    }
    
    return points;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1421),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D1421),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
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
            _buildNavButton('Trade', true),
            const SizedBox(width: 16),
            _buildNavButton('Explore', false),
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
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF7C3AED)),
            )
          : selectedToken == null
              ? const Center(
                  child: Text(
                    'No token selected',
                    style: TextStyle(color: Colors.white),
                  ),
                )
              : Row(
                  children: [
                    // Left side - Chart and token info
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Token header
                            TokenInfoWidget(token: selectedToken!),
                            const SizedBox(height: 24),
                            
                            // Price chart
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1E293B),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  children: [
                                    // Chart controls
                                    Row(
                                      children: [
                                        ...timeframes.map((timeframe) =>
                                            _buildTimeframeButton(timeframe)),
                                        const Spacer(),
                                        IconButton(
                                          icon: const Icon(Icons.fullscreen,
                                              color: Colors.grey),
                                          onPressed: () {},
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.show_chart,
                                              color: Colors.grey),
                                          onPressed: () {},
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    
                                    // Chart
                                    Expanded(
                                      child: PriceChartWidget(
                                        priceHistory: selectedToken!.priceHistory,
                                        timeframe: selectedTimeframe,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            
                            const SizedBox(height: 16),
                            
                            // Market stats
                            MarketStatsWidget(token: selectedToken!),
                          ],
                        ),
                      ),
                    ),
                    
                    // Right side - Trading panel
                    Container(
                      width: 400,
                      decoration: const BoxDecoration(
                        color: Color(0xFF1E293B),
                        border: Border(
                          left: BorderSide(color: Color(0xFF334155), width: 1),
                        ),
                      ),
                      child: TradingPanelWidget(
                        token: selectedToken!,
                        tabController: _tabController,
                        tabs: tabs,
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

  Widget _buildTimeframeButton(String timeframe) {
    final isSelected = selectedTimeframe == timeframe;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedTimeframe = timeframe;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF7C3AED) : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          timeframe,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
