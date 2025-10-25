import 'package:flutter/material.dart';

class LoadingIndicator extends StatelessWidget {
  const LoadingIndicator({super.key, this.message = 'Loading...'});
  final String message;

  @override
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const CircularProgressIndicator(),
        const SizedBox(height: 16),
        Text(message, style: const TextStyle(fontSize: 16)),
      ],
    ),
  );
}
