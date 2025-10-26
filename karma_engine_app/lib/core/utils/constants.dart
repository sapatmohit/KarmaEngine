class Constants {
  static const String appName = 'Karma Engine';
  static const String baseUrl =
      'http://172.27.0.1:5000'; // Docker network IP - try this first
  // Alternative IPs to try if this doesn't work:
  // 'http://10.0.2.2:5000' - Android emulator
  // 'http://172.28.4.94:5000' - Your local network IP
  // 'http://localhost:5000' - iOS simulator

  // SharedPreferences keys
  static const String walletAddressKey = 'wallet_address';
  static const String userEmailKey = 'user_email';
  static const String userNameKey = 'user_name';
  static const String userAvatarKey = 'user_avatar';

  // Activity types
  static const String activityPost = 'post';
  static const String activityComment = 'comment';
  static const String activityLike = 'like';
  static const String activityRepost = 'repost';
  static const String activityReport = 'report';

  // Karma values
  static const int karmaPost = 5;
  static const int karmaComment = 3;
  static const int karmaLike = 1;
  static const int karmaRepost = 2;
  static const int karmaReport = -5;

  // Theme preferences
  static const String themePreferenceKey = 'theme_preference';
}
