import 'package:flutter/material.dart';

class TransactionHistory extends StatelessWidget {
  const TransactionHistory({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock transaction data
    final transactions = [
      {
        'type': 'Received',
        'amount': '+25.00 XLM',
        'date': '2023-05-15 14:30',
        'description': 'Staking rewards',
      },
      {
        'type': 'Sent',
        'amount': '-10.00 XLM',
        'date': '2023-05-12 09:15',
        'description': 'Staking deposit',
      },
      {
        'type': 'Received',
        'amount': '+5.50 XLM',
        'date': '2023-05-10 16:45',
        'description': 'Karma redemption',
      },
      {
        'type': 'Received',
        'amount': '+50.00 XLM',
        'date': '2023-05-08 11:20',
        'description': 'Faucet claim',
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Transaction History',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),

        Expanded(
          child: ListView.builder(
            itemCount: transactions.length,
            itemBuilder: (context, index) {
              final transaction = transactions[index];
              return _buildTransactionItem(transaction);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTransactionItem(Map<String, dynamic> transaction) {
    final isReceived = transaction['type'] == 'Received';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // Transaction icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color:
                    isReceived
                        ? Colors.green.withOpacity(0.1)
                        : Colors.red.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  isReceived ? Icons.arrow_downward : Icons.arrow_upward,
                  color: isReceived ? Colors.green : Colors.red,
                ),
              ),
            ),
            const SizedBox(width: 16),

            // Transaction details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    transaction['type'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    transaction['description'],
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  Text(
                    transaction['date'],
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),

            // Amount
            Text(
              transaction['amount'],
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isReceived ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
