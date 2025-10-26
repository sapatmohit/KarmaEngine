import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/utils/theme.dart';

class GlassButton extends StatelessWidget {
  const GlassButton({
    super.key,
    required this.child,
    required this.onPressed,
    this.variant = GlassButtonVariant.defaultVariant,
    this.padding = const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
    this.borderRadius = 12.0,
    this.isLoading = false,
    this.disabled = false,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final GlassButtonVariant variant;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final bool isLoading;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final isDisabled = disabled || isLoading || onPressed == null;

    return GestureDetector(
      onTap: isDisabled ? null : onPressed,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: padding,
        decoration: _getDecoration(),
        child: isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : child,
      ),
    );
  }

  BoxDecoration _getDecoration() {
    switch (variant) {
      case GlassButtonVariant.primary:
        return AppTheme.primaryGlassDecoration;
      case GlassButtonVariant.secondary:
        return AppTheme.secondaryGlassDecoration;
      case GlassButtonVariant.defaultVariant:
      default:
        return AppTheme.glassDecoration;
    }
  }
}

enum GlassButtonVariant {
  defaultVariant,
  primary,
  secondary,
}
