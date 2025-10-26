import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Color palette matching frontend
  static const Color primaryBlue = Color(0xFF0EA5E9);
  static const Color primaryBlueDark = Color(0xFF0284C7);
  static const Color secondaryPink = Color(0xFFEC4899);
  static const Color secondaryPinkDark = Color(0xFFDB2777);
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkSurfaceLight = Color(0xFF334155);
  static const Color glassBackground = Color(0x661E293B);
  static const Color glassBorder = Color(0x1AFFFFFF);

  static final darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: primaryBlue,
    scaffoldBackgroundColor: darkBackground,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.white,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
    colorScheme: const ColorScheme.dark(
      primary: primaryBlue,
      secondary: secondaryPink,
      surface: darkSurface,
      background: darkBackground,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: Colors.white,
      onBackground: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme().apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: glassBackground,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
      ),
    ),
    cardTheme: CardTheme(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0,
      color: glassBackground,
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: darkSurface,
      selectedItemColor: primaryBlue,
      unselectedItemColor: Colors.grey,
      type: BottomNavigationBarType.fixed,
    ),
  );

  // Glass morphism decoration
  static BoxDecoration get glassDecoration => BoxDecoration(
        color: glassBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: glassBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 30,
            offset: const Offset(0, 4),
          ),
        ],
      );

  // Primary glass button decoration
  static BoxDecoration get primaryGlassDecoration => BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0x990EA5E9), Color(0x990284C7)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0x4D0EA5E9)),
        boxShadow: [
          BoxShadow(
            color: primaryBlue.withOpacity(0.1),
            blurRadius: 30,
            offset: const Offset(0, 4),
          ),
        ],
      );

  // Secondary glass button decoration
  static BoxDecoration get secondaryGlassDecoration => BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0x99EC4899), Color(0x99DB2777)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0x4DEC4899)),
        boxShadow: [
          BoxShadow(
            color: secondaryPink.withOpacity(0.1),
            blurRadius: 30,
            offset: const Offset(0, 4),
          ),
        ],
      );

  // Text gradient style
  static ShaderMask textGradient(String text, TextStyle style) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [primaryBlue, secondaryPink],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ).createShader(bounds),
      child: Text(text, style: style),
    );
  }
}
