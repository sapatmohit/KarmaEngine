import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';
import 'package:karma_engine_app/core/models/trade_model.dart';

class TradingPanelWidget extends StatefulWidget {
  final KarmaTokenModel token;
  final TabController tabController;
  final List<String> tabs;

  const TradingPanelWidget({
    super.key,
    required this.token,
    required this.tabController,
    required this.tabs,
  });

  @override
  State<TradingPanelWidget> createState() => _TradingPanelWidgetState();
}

class _TradingPanelWidgetState extends State<TradingPanelWidget> {
  final TextEditingController _sellAmountController = TextEditingController();
  final TextEditingController _buyAmountController = TextEditingController();
  
  String selectedSellToken = 'ETH';
  String selectedBuyToken = 'Select token';
  double sellAmount = 0.0;
  double buyAmount = 0.0;
  bool isSwapMode = true;

  @override
  void dispose() {
    _sellAmountController.dispose();
    _buyAmountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tab bar
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
            ),
            child: TabBar(
              controller: widget.tabController,
              indicator: BoxDecoration(
                color: const Color(0xFF7C3AED),
                borderRadius: BorderRadius.circular(6),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.grey,
              labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
              tabs: widget.tabs.map((tab) => Tab(text: tab)).toList(),
            ),
          ),
          const SizedBox(height: 24),

          // Trading form
          Expanded(
            child: TabBarView(
              controller: widget.tabController,
              children: [
                _buildSwapTab(),
                _buildLimitTab(),
                _buildBuyTab(),
                _buildSellTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSwapTab() {
    return Column(
      children: [
        // Sell section
        _buildTokenInputSection(
          label: 'Sell',
          controller: _sellAmountController,
          selectedToken: selectedSellToken,
          balance: '0.0',
          onTokenSelect: () => _showTokenSelector(true),
          onAmountChanged: (value) {
            setState(() {
              sellAmount = double.tryParse(value) ?? 0.0;
              // Calculate buy amount based on current price
              buyAmount = sellAmount * widget.token.currentPrice;
              _buyAmountController.text = buyAmount.toStringAsFixed(6);
            });
          },
        ),
        
        const SizedBox(height: 12),
        
        // Swap button
        Center(
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF334155),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF475569)),
            ),
            child: IconButton(
              icon: const Icon(Icons.swap_vert, color: Colors.white),
              onPressed: _swapTokens,
            ),
          ),
        ),
        
        const SizedBox(height: 12),
        
        // Buy section
        _buildTokenInputSection(
          label: 'Buy',
          controller: _buyAmountController,
          selectedToken: selectedBuyToken,
          balance: '0.0',
          onTokenSelect: () => _showTokenSelector(false),
          onAmountChanged: (value) {
            setState(() {
              buyAmount = double.tryParse(value) ?? 0.0;
              // Calculate sell amount based on current price
              sellAmount = buyAmount / widget.token.currentPrice;
              _sellAmountController.text = sellAmount.toStringAsFixed(6);
            });
          },
        ),
        
        const SizedBox(height: 24),
        
        // Price info
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children: [
              _buildPriceRow('Rate', '1 ${widget.token.username.toUpperCase()} = \$${widget.token.currentPrice.toStringAsFixed(2)}'),
              const SizedBox(height: 8),
              _buildPriceRow('Network cost', '~\$12.00'),
              const SizedBox(height: 8),
              _buildPriceRow('Price impact', '<0.01%'),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Swap button
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: sellAmount > 0 ? _executeSwap : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C3AED),
              disabledBackgroundColor: const Color(0xFF334155),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              sellAmount > 0 ? 'Swap' : 'Enter an amount',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLimitTab() {
    return const Center(
      child: Text(
        'Limit orders coming soon',
        style: TextStyle(color: Colors.grey),
      ),
    );
  }

  Widget _buildBuyTab() {
    return Column(
      children: [
        _buildTokenInputSection(
          label: 'You pay',
          controller: _buyAmountController,
          selectedToken: 'ETH',
          balance: '0.0',
          onTokenSelect: () {},
          onAmountChanged: (value) {
            setState(() {
              buyAmount = double.tryParse(value) ?? 0.0;
            });
          },
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: buyAmount > 0 ? () => _executeTrade(TradeType.buy) : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              disabledBackgroundColor: const Color(0xFF334155),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              buyAmount > 0 ? 'Buy ${widget.token.username.toUpperCase()}' : 'Enter an amount',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSellTab() {
    return Column(
      children: [
        _buildTokenInputSection(
          label: 'You sell',
          controller: _sellAmountController,
          selectedToken: widget.token.username.toUpperCase(),
          balance: '0.0',
          onTokenSelect: () {},
          onAmountChanged: (value) {
            setState(() {
              sellAmount = double.tryParse(value) ?? 0.0;
            });
          },
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: sellAmount > 0 ? () => _executeTrade(TradeType.sell) : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              disabledBackgroundColor: const Color(0xFF334155),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              sellAmount > 0 ? 'Sell ${widget.token.username.toUpperCase()}' : 'Enter an amount',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTokenInputSection({
    required String label,
    required TextEditingController controller,
    required String selectedToken,
    required String balance,
    required VoidCallback onTokenSelect,
    required Function(String) onAmountChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
              Text(
                'Balance: $balance',
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  decoration: const InputDecoration(
                    hintText: '0',
                    hintStyle: TextStyle(color: Colors.grey),
                    border: InputBorder.none,
                  ),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*')),
                  ],
                  onChanged: onAmountChanged,
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: onTokenSelect,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF334155),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (selectedToken != 'Select token')
                        Container(
                          width: 20,
                          height: 20,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Color(0xFF7C3AED),
                          ),
                          child: const Icon(
                            Icons.currency_bitcoin,
                            color: Colors.white,
                            size: 12,
                          ),
                        ),
                      const SizedBox(width: 6),
                      Text(
                        selectedToken,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.keyboard_arrow_down,
                        color: Colors.white,
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.grey, fontSize: 14),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontSize: 14),
        ),
      ],
    );
  }

  void _swapTokens() {
    setState(() {
      final tempToken = selectedSellToken;
      selectedSellToken = selectedBuyToken;
      selectedBuyToken = tempToken;
      
      final tempAmount = sellAmount;
      sellAmount = buyAmount;
      buyAmount = tempAmount;
      
      _sellAmountController.text = sellAmount.toStringAsFixed(6);
      _buyAmountController.text = buyAmount.toStringAsFixed(6);
    });
  }

  void _showTokenSelector(bool isSellToken) {
    // Implement token selector modal
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E293B),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Select a token',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            ListTile(
              leading: Container(
                width: 32,
                height: 32,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF7C3AED),
                ),
                child: const Icon(Icons.currency_bitcoin, color: Colors.white, size: 20),
              ),
              title: Text(
                widget.token.username.toUpperCase(),
                style: const TextStyle(color: Colors.white),
              ),
              subtitle: Text(
                widget.token.name,
                style: const TextStyle(color: Colors.grey),
              ),
              onTap: () {
                setState(() {
                  if (isSellToken) {
                    selectedSellToken = widget.token.username.toUpperCase();
                  } else {
                    selectedBuyToken = widget.token.username.toUpperCase();
                  }
                });
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _executeSwap() {
    // Implement swap logic
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Swap executed successfully!'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
  }

  void _executeTrade(TradeType type) {
    // Implement trade logic
    final action = type == TradeType.buy ? 'Buy' : 'Sell';
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$action order executed successfully!'),
        backgroundColor: type == TradeType.buy 
            ? const Color(0xFF10B981) 
            : const Color(0xFFEF4444),
      ),
    );
  }
}
