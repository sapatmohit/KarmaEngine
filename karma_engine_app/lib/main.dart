import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:karma_engine_app/core/utils/theme.dart';
import 'package:karma_engine_app/features/auth/presentation/screens/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Karma Engine',
        theme: AppTheme.darkTheme,
        themeMode: ThemeMode.dark,
        home: const SplashScreen(),
        debugShowCheckedModeBanner: false,
      );
}
