# Karma Engine Smart Contract

This is a smart contract for the Karma Engine, a decentralized reputation protocol built on the Stellar network using Soroban.

## Features

- User registration and management
- Karma point tracking based on social activities
- Staking mechanism to increase karma multipliers
- Activity recording and history tracking
- Tiered staking system (Regular, Trusted, Influencer)

## Contract Functions

### Core Functions

- `initialize(owner)`: Initialize the contract with an owner address
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

## Staking Tiers

- **Regular User**: 0-100 tokens staked (1.0x multiplier)
- **Trusted Contributor**: 100-500 tokens staked (1.5x multiplier)
- **Influencer**: 500+ tokens staked (2.0x multiplier)

## Building

To build the contract:

```bash
cargo build --target wasm32-unknown-unknown --release
```

## Testing

To run tests:

```bash
cargo test
```
