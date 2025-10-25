# Karma Engine Smart Contract

This is a smart contract for the Karma Engine, a decentralized reputation protocol built on the Stellar network using Soroban.

## Overview

KarmaChain is a decentralized reputation protocol designed to establish trust and accountability in social ecosystems. It evaluates user behavior through an on-chain Karma Score derived from activities such as posts, comments, likes, reposts, and reports.

Each user starts with zero karma upon registration. All actions performed post-registration are evaluated and rewarded or penalized transparently using blockchain logic — without relying on any oracle.

KarmaChain integrates a staking mechanism, allowing users to lock tokens to amplify their influence and engagement credibility within the system.

## New Feature: Redeemable Karma

Users can now convert their accumulated Karma points into XLM tokens on the Stellar Testnet. This feature allows users to directly withdraw their earned rewards to their connected testnet wallet.

- Conversion rate: 10 Karma points = 1 XLM
- Redemptions occur directly on the Stellar Testnet
- Withdrawals can be made directly to the user's connected testnet wallet

## Features

- User registration and management
- Karma point tracking based on social activities
- Staking mechanism to increase karma multipliers
- Activity recording and history tracking
- Tiered staking system (Regular, Trusted, Influencer)
- **NEW**: Redeemable karma points for XLM tokens

## Contract Functions

### Core Functions

- `initialize(owner, xlm_token)`: Initialize the contract with an owner and XLM token contract
- `register_user(user)`: Register a new user in the system
- `get_karma(user)`: Get a user's current karma points
- `get_stake(user)`: Get a user's current staking amount

### Activity Functions

- `record_post(user)`: Record a post activity (+5 karma)
- `record_comment(user)`: Record a comment activity (+3 karma)
- `record_like(user)`: Record a like activity (+1 karma)
- `record_repost(user)`: Record a repost activity (+2 karma)
- `record_report(user)`: Record a report activity (-5 karma)

### Staking Functions

- `stake_tokens(user, token, amount)`: Stake tokens to increase karma multiplier
- `withdraw_stake(user, token, amount)`: Withdraw staked tokens
- `get_multiplier(user)`: Get user's current karma multiplier based on stake

### Redemption Functions

- `redeem_karma(user, karma_amount)`: Convert karma points to XLM tokens
- `get_xlm_token()`: Get the XLM token contract address

### Activity History

- `get_activities(user)`: Get a user's activity history

## Staking Tiers

- **Regular User**: 0-100 tokens staked (1.0x multiplier)
- **Trusted Contributor**: 100-500 tokens staked (1.5x multiplier)
- **Influencer**: 500+ tokens staked (2.0x multiplier)

## Redeemable Karma

Users can convert their accumulated Karma points into XLM tokens at a rate of 10 Karma points = 1 XLM.

### How it works:

1. Users accumulate Karma points through social activities
2. Users can redeem their Karma points for XLM tokens
3. The contract automatically calculates the XLM amount based on the conversion rate
4. XLM tokens are transferred directly to the user's wallet

### Conversion Rate

- 10 Karma points = 1 XLM token
- Minimum redemption: 10 Karma points (1 XLM)
- No maximum limit on redemptions

## Prerequisites

- Rust toolchain
- Soroban CLI
- Stellar testnet account with funded wallet

## Building

To build the contract:

```bash
cargo build --target wasm32-unknown-unknown --release
```

This will generate a WASM file in `target/wasm32-unknown-unknown/release/karma_engine.wasm`.

## Deploying

To deploy the contract to the Stellar testnet:

```bash
# First, build the contract
cargo build --target wasm32-unknown-unknown --release

# Deploy using soroban CLI
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/karma_engine.wasm \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

## Interacting with the Contract

### Initialize the Contract

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- initialize \
  --owner ACCOUNT_PUBLIC_KEY \
  --xlm_token XLM_TOKEN_CONTRACT_ID
```

### Register a User

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- register_user \
  --user USER_PUBLIC_KEY
```

### Record Activities

```bash
# Record a post (+5 karma)
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- record_post \
  --user USER_PUBLIC_KEY

# Record a comment (+3 karma)
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- record_comment \
  --user USER_PUBLIC_KEY

# Record a like (+1 karma)
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- record_like \
  --user USER_PUBLIC_KEY

# Record a repost (+2 karma)
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- record_repost \
  --user USER_PUBLIC_KEY

# Record a report (-5 karma)
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- record_report \
  --user USER_PUBLIC_KEY
```

### Staking Operations

```bash
# Stake tokens
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- stake_tokens \
  --user USER_PUBLIC_KEY \
  --token TOKEN_CONTRACT_ID \
  --amount 100

# Withdraw staked tokens
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- withdraw_stake \
  --user USER_PUBLIC_KEY \
  --token TOKEN_CONTRACT_ID \
  --amount 50
```

### Redeem Karma for XLM

```bash
# Redeem karma points for XLM tokens
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- redeem_karma \
  --user USER_PUBLIC_KEY \
  --karma_amount 100
```

### Query Functions

```bash
# Get user's karma points
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_karma \
  --user USER_PUBLIC_KEY

# Get user's staked amount
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_stake \
  --user USER_PUBLIC_KEY

# Get user's karma multiplier
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_multiplier \
  --user USER_PUBLIC_KEY

# Get user's activity history
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_activities \
  --user USER_PUBLIC_KEY

# Get XLM token contract address
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_xlm_token
```

## Testing

To run tests:

```bash
cargo test
```

## Project Structure

```
karma-engine/
├── Cargo.toml
├── Makefile
└── src/
    ├── lib.rs      # Main contract implementation
    └── test.rs     # Unit tests
```

## Error Codes

- `1`: Insufficient balance
- `2`: Invalid amount
- `3`: User not registered
- `4`: User already registered
- `5`: Insufficient karma

## Future Enhancements

- Integration with social media platforms for automatic activity tracking
- DAO-based moderation system for community-led governance
- NFT reputation badges for milestone achievements
- Cross-platform integration with social networks and web3 communities
- Karma-based airdrops and incentives for verified contributors
- AI-driven activity validation to prevent manipulation or spam