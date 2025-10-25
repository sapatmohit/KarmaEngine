# Karma Engine Mobile App

A modern, cross-platform Flutter mobile app for Karma Engine, a decentralized reputation and staking protocol deployed on the Stellar/Soroban testnet.

## Features

- **User Registration**: Connect or generate a testnet wallet address
- **Dashboard**: View karma points, XLM equivalent, and staking information
- **Activity Feed**: Perform actions like posting, commenting, liking, and reporting
- **Leaderboard**: View top users ranked by karma points
- **Wallet Management**: View wallet balance and transaction history
- **Staking**: Stake and unstake XLM tokens
- **Redemption**: Redeem karma points for XLM tokens

## Tech Stack

- **Framework**: Flutter 3 with Material 3 design
- **State Management**: Riverpod
- **Networking**: Dio for API calls
- **Storage**: SharedPreferences for local data caching
- **Wallet Integration**: stellar_flutter_sdk for Stellar testnet interactions

## Folder Structure

```
lib/
├── main.dart
├── core/
│   ├── api/
│   │   └── api_service.dart
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── activity_model.dart
│   │   └── leaderboard_model.dart
│   ├── providers/
│   │   ├── user_provider.dart
│   │   ├── karma_provider.dart
│   │   ├── wallet_provider.dart
│   │   ├── activity_provider.dart
│   │   ├── leaderboard_provider.dart
│   │   └── staking_provider.dart
│   ├── repositories/
│   │   ├── user_repository.dart
│   │   ├── karma_repository.dart
│   │   ├── activity_repository.dart
│   │   └── staking_repository.dart
│   ├── services/
│   │   ├── wallet_service.dart
│   │   └── animation_service.dart
│   └── utils/
│       ├── constants.dart
│       └── theme.dart
├── features/
│   ├── auth/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── onboarding_screen.dart
│   │       └── widgets/
│   │           └── wallet_input_widget.dart
│   ├── dashboard/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── dashboard_screen.dart
│   │       └── widgets/
│   │           ├── karma_card_widget.dart
│   │           ├── stake_redeem_buttons.dart
│   │           ├── activity_history_widget.dart
│   │           └── staking_info_widget.dart
│   ├── activity/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── activity_screen.dart
│   │       └── widgets/
│   │           ├── activity_buttons.dart
│   │           └── activity_feed.dart
│   ├── wallet/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── wallet_screen.dart
│   │       └── widgets/
│   │           ├── wallet_balance.dart
│   │           └── transaction_history.dart
│   └── leaderboard/
│       └── presentation/
│           ├── screens/
│           │   └── leaderboard_screen.dart
│           └── widgets/
│               └── leaderboard_list.dart
└── widgets/
    ├── custom_button.dart
    ├── karma_card.dart
    ├── stake_dialog.dart
    ├── redeem_dialog.dart
    ├── error_handler.dart
    └── loading_indicator.dart
```

## Getting Started

### Prerequisites

- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- Android Studio or VS Code with Flutter extensions
- Android Emulator or iOS Simulator

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd karma_engine_app
   ```

3. Install dependencies:
   ```bash
   flutter pub get
   ```

4. Run the app:
   ```bash
   flutter run
   ```

## Backend API

The app connects to a backend API that interacts with the KarmaEngine smart contract on the Stellar/Soroban testnet. The API provides endpoints for:

- User registration and management
- Karma point tracking
- Activity recording
- Staking and redemption
- Leaderboard information

## Design

The app follows Material 3 design guidelines with:
- Light/dark mode support
- Gradient backgrounds
- Neumorphic cards
- Smooth animations and transitions
- Google Fonts (Poppins)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.