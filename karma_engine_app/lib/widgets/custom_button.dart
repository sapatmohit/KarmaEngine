import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({
    required this.text,
    required this.onPressed,
    super.key,
    this.isLoading = false,
    this.color,
    this.textColor,
  });
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Color? color;
  final Color? textColor;

  @override
  Widget build(BuildContext context) => ElevatedButton(
    onPressed: isLoading ? null : onPressed,
    style: ElevatedButton.styleFrom(
      backgroundColor: color ?? Theme.of(context).primaryColor,
      foregroundColor: textColor ?? Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
    child:
        isLoading
            ? const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            )
            : Text(
              text,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
  );
}
