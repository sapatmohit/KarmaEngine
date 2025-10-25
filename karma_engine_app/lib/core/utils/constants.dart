class Constants {
  static const String appName = 'Karma Engine';
  static const String baseUrl =
      'http://localhost:3000'; // Change this to your backend URL

  // SharedPreferences keys
  static const String walletAddressKey = 'wallet_address';
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
