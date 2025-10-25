import 'package:flutter/material.dart';

class ErrorHandler extends StatelessWidget {
  const ErrorHandler({
    required this.errorMessage,
    required this.onRetry,
    super.key,
  });
  final String errorMessage;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.error_outline, size: 48, color: Colors.red),
        const SizedBox(height: 16),
        Text(
          errorMessage,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 16, color: Colors.red),
        ),
        const SizedBox(height: 24),
        ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
      ],
    ),
  );
}
