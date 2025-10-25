import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:karma_engine_app/core/models/karma_token_model.dart';

class PriceChartWidget extends StatelessWidget {
  final List<PricePoint> priceHistory;
  final String timeframe;

  const PriceChartWidget({
    super.key,
    required this.priceHistory,
    required this.timeframe,
  });

  @override
  Widget build(BuildContext context) {
    if (priceHistory.isEmpty) {
      return const Center(
        child: Text(
          'No price data available',
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    final spots = priceHistory.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value.price);
    }).toList();

    final minPrice = priceHistory.map((p) => p.price).reduce((a, b) => a < b ? a : b);
    final maxPrice = priceHistory.map((p) => p.price).reduce((a, b) => a > b ? a : b);
    final priceRange = maxPrice - minPrice;
    
    // Determine if the overall trend is positive
    final isPositiveTrend = priceHistory.last.price > priceHistory.first.price;

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: priceRange / 4,
          getDrawingHorizontalLine: (value) {
            return FlLine(
              color: const Color(0xFF334155).withOpacity(0.3),
              strokeWidth: 1,
            );
          },
        ),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 80,
              interval: priceRange / 4,
              getTitlesWidget: (value, meta) {
                return Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: Text(
                    '\$${NumberFormat('#,###.##').format(value)}',
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                );
              },
            ),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              interval: (priceHistory.length / 4).floorToDouble(),
              getTitlesWidget: (value, meta) {
                final index = value.toInt();
                if (index >= 0 && index < priceHistory.length) {
                  final timestamp = priceHistory[index].timestamp;
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      _formatTimestamp(timestamp, timeframe),
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                  );
                }
                return const Text('');
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0,
        maxX: (priceHistory.length - 1).toDouble(),
        minY: minPrice - (priceRange * 0.1),
        maxY: maxPrice + (priceRange * 0.1),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            gradient: LinearGradient(
              colors: [
                isPositiveTrend 
                    ? const Color(0xFF10B981)
                    : const Color(0xFFEF4444),
                isPositiveTrend 
                    ? const Color(0xFF10B981).withOpacity(0.3)
                    : const Color(0xFFEF4444).withOpacity(0.3),
              ],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            barWidth: 2,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient(
                colors: [
                  isPositiveTrend 
                      ? const Color(0xFF10B981).withOpacity(0.1)
                      : const Color(0xFFEF4444).withOpacity(0.1),
                  Colors.transparent,
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
        ],
        lineTouchData: LineTouchData(
          enabled: true,
          touchTooltipData: LineTouchTooltipData(
            tooltipBgColor: const Color(0xFF1E293B),
            tooltipBorder: const BorderSide(color: Color(0xFF334155)),
            tooltipRoundedRadius: 8,
            getTooltipItems: (List<LineBarSpot> touchedBarSpots) {
              return touchedBarSpots.map((barSpot) {
                final index = barSpot.x.toInt();
                if (index >= 0 && index < priceHistory.length) {
                  final point = priceHistory[index];
                  return LineTooltipItem(
                    '\$${NumberFormat('#,###.##').format(point.price)}\n',
                    const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    children: [
                      TextSpan(
                        text: _formatTimestamp(point.timestamp, timeframe),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      TextSpan(
                        text: '\nVolume: ${NumberFormat.compact().format(point.volume)}',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ],
                  );
                }
                return null;
              }).toList();
            },
          ),
          touchCallback: (FlTouchEvent event, LineTouchResponse? touchResponse) {
            // Handle touch events if needed
          },
          handleBuiltInTouches: true,
        ),
      ),
    );
  }

  String _formatTimestamp(DateTime timestamp, String timeframe) {
    switch (timeframe) {
      case '1H':
        return DateFormat('HH:mm').format(timestamp);
      case '1D':
        return DateFormat('HH:mm').format(timestamp);
      case '1W':
        return DateFormat('MM/dd').format(timestamp);
      case '1M':
        return DateFormat('MM/dd').format(timestamp);
      case '1Y':
        return DateFormat('MM/yy').format(timestamp);
      default:
        return DateFormat('HH:mm').format(timestamp);
    }
  }
}
