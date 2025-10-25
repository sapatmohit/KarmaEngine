import 'package:flutter/material.dart';

class AnimationService {
  // Fade transition
  static PageRouteBuilder fadeTransitionPageRoute(Widget page) =>
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder:
            (context, animation, secondaryAnimation, child) =>
                FadeTransition(opacity: animation, child: child),
      );

  // Slide transition
  static PageRouteBuilder slideTransitionPageRoute(Widget page) =>
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.easeInOut;

          final tween = Tween(
            begin: begin,
            end: end,
          ).chain(CurveTween(curve: curve));
          final offsetAnimation = animation.drive(tween);

          return SlideTransition(position: offsetAnimation, child: child);
        },
      );

  // Scale transition
  static PageRouteBuilder scaleTransitionPageRoute(Widget page) =>
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final scale = Tween<double>(begin: 0.0, end: 1.0).animate(animation);
          return ScaleTransition(scale: scale, child: child);
        },
      );
}
