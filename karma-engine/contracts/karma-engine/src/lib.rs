#![no_std]
use soroban_sdk::{contract, contractimpl, contractmeta, contracttype, Address, Env, Map, Vec, Symbol, String, symbol_short};
use soroban_sdk::token::TokenClient;

// Metadata for the contract
contractmeta!(
    key = "Description",
    val = "Karma Engine - A decentralized reputation protocol for tracking user karma points"
);

// Define constants for activity karma values
const POST_KARMA: i32 = 5;
const COMMENT_KARMA: i32 = 3;
const LIKE_KARMA: i32 = 1;
const REPOST_KARMA: i32 = 2;
const REPORT_PENALTY: i32 = -5;

// Define constants for staking multipliers
const REGULAR_MULTIPLIER: u32 = 10; // 1.0x (stored as 10 with 1 decimal place)
const TRUSTED_MULTIPLIER: u32 = 15; // 1.5x (stored as 15 with 1 decimal place)
const INFLUENCER_MULTIPLIER: u32 = 20; // 2x (stored as 20 with 1 decimal place)

// Define thresholds for staking tiers
const TRUSTED_TIER_THRESHOLD: i128 = 100;
const INFLUENCER_TIER_THRESHOLD: i128 = 500;

// Conversion rate: 10 karma points = 1 XLM (represented as 10000000 stroops)
const DEFAULT_KARMA_TO_XLM_RATE: i128 = 10;

// Maximum activity history to store per user
const MAX_ACTIVITY_HISTORY: u32 = 20;

// Error codes
#[contracttype]
#[derive(Clone, Copy)]
pub enum KarmaError {
    InsufficientBalance = 1,
    InvalidAmount = 2,
    UserNotRegistered = 3,
    AlreadyRegistered = 4,
    InsufficientKarma = 5,
    Unauthorized = 6,
    ContractPaused = 7,
}

// Storage keys
const OWNER: Symbol = symbol_short!("OWNER");
const USERS: Symbol = symbol_short!("USERS");
const STAKES: Symbol = symbol_short!("STAKES");
const ACTIVITY: Symbol = symbol_short!("ACTIVITY");
const KARMATOK: Symbol = symbol_short!("KARMATOK"); // Token contract for XLM
const KARMART: Symbol = symbol_short!("KARMART"); // Conversion rate (shortened to 7 chars)
const PAUSED: Symbol = symbol_short!("PAUSED"); // Contract pause status

// User data structure
#[contracttype]
#[derive(Clone)]
pub struct UserData {
    pub karma_points: i32,
    pub registered: bool,
}

// Activity record structure
#[contracttype]
#[derive(Clone)]
pub struct ActivityRecord {
    pub activity_type: String,
    pub karma_change: i32,
    pub timestamp: u64,
}

#[contract]
pub struct KarmaEngineContract;

#[contractimpl]
impl KarmaEngineContract {
    /// Initialize the contract with an owner and XLM token contract
    pub fn initialize(e: Env, owner: Address, xlm_token: Address) {
        if e.storage().instance().has(&OWNER) {
            panic!("Already initialized");
        }
        e.storage().instance().set(&OWNER, &owner);
        e.storage().instance().set(&KARMATOK, &xlm_token);
        e.storage().instance().set(&KARMART, &DEFAULT_KARMA_TO_XLM_RATE);
        e.storage().instance().set(&PAUSED, &false);
    }

    /// Register a new user
    pub fn register_user(e: Env, user: Address) {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        let mut users: Map<Address, UserData> = e.storage().instance().get(&USERS).unwrap_or_else(|| Map::new(&e));
        
        if users.contains_key(user.clone()) {
            panic!("User already registered");
        }
        
        let user_data = UserData {
            karma_points: 0,
            registered: true,
        };
        
        users.set(user.clone(), user_data);
        e.storage().instance().set(&USERS, &users);
        
        // Also initialize their stake
        let mut stakes: Map<Address, i128> = e.storage().instance().get(&STAKES).unwrap_or_else(|| Map::new(&e));
        stakes.set(user, 0);
        e.storage().instance().set(&STAKES, &stakes);
    }

    /// Get user karma points
    pub fn get_karma(e: Env, user: Address) -> i32 {
        let users: Map<Address, UserData> = e.storage().instance().get(&USERS).unwrap_or_else(|| Map::new(&e));
        
        if !users.contains_key(user.clone()) {
            panic!("User not registered");
        }
        
        let user_data = users.get(user).unwrap();
        user_data.karma_points
    }

    /// Get user staking amount
    pub fn get_stake(e: Env, user: Address) -> i128 {
        let stakes: Map<Address, i128> = e.storage().instance().get(&STAKES).unwrap_or_else(|| Map::new(&e));
        stakes.get(user).unwrap_or(0)
    }

    /// Stake tokens to increase karma multiplier
    pub fn stake_tokens(e: Env, user: Address, token: Address, amount: i128) {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        user.require_auth();
        
        // Transfer tokens from user to contract
        let token_client = TokenClient::new(&e, &token);
        token_client.transfer(&user, &e.current_contract_address(), &amount);
        
        // Update user's stake
        let mut stakes: Map<Address, i128> = e.storage().instance().get(&STAKES).unwrap_or_else(|| Map::new(&e));
        let current_stake = stakes.get(user.clone()).unwrap_or(0);
        stakes.set(user, current_stake + amount);
        e.storage().instance().set(&STAKES, &stakes);
    }

    /// Withdraw staked tokens
    pub fn withdraw_stake(e: Env, user: Address, token: Address, amount: i128) {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        user.require_auth();
        
        let mut stakes: Map<Address, i128> = e.storage().instance().get(&STAKES).unwrap_or_else(|| Map::new(&e));
        let current_stake = stakes.get(user.clone()).unwrap_or(0);
        
        if amount > current_stake {
            panic!("Insufficient stake balance");
        }
        
        // Update user's stake
        stakes.set(user.clone(), current_stake - amount);
        e.storage().instance().set(&STAKES, &stakes);
        
        // Transfer tokens back to user
        let token_client = TokenClient::new(&e, &token);
        token_client.transfer(&e.current_contract_address(), &user, &amount);
    }

    /// Record a post activity and update karma
    pub fn record_post(e: Env, user: Address) -> i32 {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        Self::record_activity(e.clone(), user, String::from_str(&e, "post"), POST_KARMA)
    }

    /// Record a comment activity and update karma
    pub fn record_comment(e: Env, user: Address) -> i32 {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        Self::record_activity(e.clone(), user, String::from_str(&e, "comment"), COMMENT_KARMA)
    }

    /// Record a like activity and update karma
    pub fn record_like(e: Env, user: Address) -> i32 {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        Self::record_activity(e.clone(), user, String::from_str(&e, "like"), LIKE_KARMA)
    }

    /// Record a repost activity and update karma
    pub fn record_repost(e: Env, user: Address) -> i32 {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        Self::record_activity(e.clone(), user, String::from_str(&e, "repost"), REPOST_KARMA)
    }

    /// Record a report activity and update karma (negative)
    pub fn record_report(e: Env, user: Address) -> i32 {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        Self::record_activity(e.clone(), user, String::from_str(&e, "report"), REPORT_PENALTY)
    }

    /// Get user's activity history
    pub fn get_activities(e: Env, user: Address) -> Vec<ActivityRecord> {
        let activities_store: Map<Address, Vec<ActivityRecord>> = e.storage().instance().get(&ACTIVITY).unwrap_or_else(|| Map::new(&e));
        activities_store.get(user).unwrap_or_else(|| Vec::new(&e))
    }

    /// Get user's karma multiplier based on their stake with normalized tiers
    pub fn get_multiplier(e: Env, user: Address) -> u32 {
        let stake = Self::get_stake(e, user);
        
        // Normalize staking via simplified scaling to prevent whale dominance
        if stake >= INFLUENCER_TIER_THRESHOLD {
            // For large stakes, use simplified scaling
            // Instead of logarithmic, we'll use a simple formula that scales slower
            let scaled_stake = stake / 100; // Reduce the impact of large stakes
            let multiplier = INFLUENCER_MULTIPLIER + (scaled_stake as u32).min(30); // Cap additional multiplier at 30
            // Cap the total multiplier to prevent excessive influence
            multiplier.min(50) // Maximum 5x multiplier
        } else if stake >= TRUSTED_TIER_THRESHOLD {
            TRUSTED_MULTIPLIER
        } else {
            REGULAR_MULTIPLIER
        }
    }

    /// Redeem karma points for XLM tokens
    pub fn redeem_karma(e: Env, user: Address, karma_amount: i32) {
        // Check if contract is paused
        if Self::is_paused(e.clone()) {
            panic!("Contract is paused");
        }
        
        user.require_auth();
        
        // Check if user is registered
        let mut users: Map<Address, UserData> = e.storage().instance().get(&USERS).unwrap_or_else(|| Map::new(&e));
        
        if !users.contains_key(user.clone()) {
            panic!("User not registered");
        }
        
        // Check if user has enough karma
        let mut user_data = users.get(user.clone()).unwrap();
        if user_data.karma_points < karma_amount {
            panic!("Insufficient karma balance");
        }
        
        // Calculate XLM amount using current conversion rate
        let karma_rate: i128 = e.storage().instance().get(&KARMART).unwrap_or(DEFAULT_KARMA_TO_XLM_RATE);
        let xlm_amount = (karma_amount as i128) / karma_rate;
        if xlm_amount == 0 {
            panic!("Karma amount too small to redeem");
        }
        
        // Deduct karma from user
        user_data.karma_points -= karma_amount;
        users.set(user.clone(), user_data);
        e.storage().instance().set(&USERS, &users);
        
        // Transfer XLM tokens to user
        let xlm_token: Address = e.storage().instance().get(&KARMATOK).unwrap();
        let token_client = TokenClient::new(&e, &xlm_token);
        token_client.transfer(&e.current_contract_address(), &user, &xlm_amount);
    }

    /// Get the XLM token contract address
    pub fn get_xlm_token(e: Env) -> Address {
        e.storage().instance().get(&KARMATOK).unwrap()
    }

    /// Get the current karma to XLM conversion rate
    pub fn get_karma_rate(e: Env) -> i128 {
        e.storage().instance().get(&KARMART).unwrap_or(DEFAULT_KARMA_TO_XLM_RATE)
    }

    /// Check if contract is paused
    pub fn is_paused(e: Env) -> bool {
        e.storage().instance().get(&PAUSED).unwrap_or(false)
    }

    /// ADMIN FUNCTIONS ///

    /// Pause/unpause the contract (admin only)
    pub fn set_paused(e: Env, admin: Address, paused: bool) {
        admin.require_auth();
        
        let owner: Address = e.storage().instance().get(&OWNER).unwrap();
        if admin != owner {
            panic!("Unauthorized");
        }
        
        e.storage().instance().set(&PAUSED, &paused);
    }

    /// Adjust the karma to XLM conversion rate (admin only)
    pub fn set_karma_rate(e: Env, admin: Address, rate: i128) {
        admin.require_auth();
        
        let owner: Address = e.storage().instance().get(&OWNER).unwrap();
        if admin != owner {
            panic!("Unauthorized");
        }
        
        if rate <= 0 {
            panic!("Invalid rate");
        }
        
        e.storage().instance().set(&KARMART, &rate);
    }

    /// Reset a user's karma and stake (admin only, for testing)
    pub fn reset_user(e: Env, admin: Address, user: Address) {
        admin.require_auth();
        
        let owner: Address = e.storage().instance().get(&OWNER).unwrap();
        if admin != owner {
            panic!("Unauthorized");
        }
        
        // Reset user's karma
        let mut users: Map<Address, UserData> = e.storage().instance().get(&USERS).unwrap_or_else(|| Map::new(&e));
        if users.contains_key(user.clone()) {
            let mut user_data = users.get(user.clone()).unwrap();
            user_data.karma_points = 0;
            users.set(user.clone(), user_data);
            e.storage().instance().set(&USERS, &users);
        }
        
        // Reset user's stake
        let mut stakes: Map<Address, i128> = e.storage().instance().get(&STAKES).unwrap_or_else(|| Map::new(&e));
        stakes.set(user, 0);
        e.storage().instance().set(&STAKES, &stakes);
    }

    /// Internal function to record any activity and update karma
    fn record_activity(e: Env, user: Address, activity_type: String, base_karma: i32) -> i32 {
        // Check if user is registered
        let mut users: Map<Address, UserData> = e.storage().instance().get(&USERS).unwrap_or_else(|| Map::new(&e));
        
        if !users.contains_key(user.clone()) {
            panic!("User not registered");
        }
        
        // Calculate karma with multiplier
        let multiplier = Self::get_multiplier(e.clone(), user.clone());
        // Apply multiplier (multiplier is stored with 1 decimal place, so divide by 10)
        let karma_change = (base_karma as i64 * multiplier as i64 / 10) as i32;
        
        // Update user's karma
        let mut user_data = users.get(user.clone()).unwrap();
        user_data.karma_points += karma_change;
        users.set(user.clone(), user_data);
        e.storage().instance().set(&USERS, &users);
        
        // Record activity with limit on history size
        let mut activities_store: Map<Address, Vec<ActivityRecord>> = e.storage().instance().get(&ACTIVITY).unwrap_or_else(|| Map::new(&e));
        let mut user_activities = activities_store.get(user.clone()).unwrap_or_else(|| Vec::new(&e));
        
        let activity_record = ActivityRecord {
            activity_type,
            karma_change,
            timestamp: e.ledger().timestamp(),
        };
        
        // Add new activity to the front of the list
        user_activities.push_front(activity_record);
        
        // Limit the history to MAX_ACTIVITY_HISTORY entries
        if user_activities.len() > MAX_ACTIVITY_HISTORY {
            // Remove the oldest entries (from the back)
            while user_activities.len() > MAX_ACTIVITY_HISTORY {
                user_activities.pop_back();
            }
        }
        
        activities_store.set(user, user_activities);
        e.storage().instance().set(&ACTIVITY, &activities_store);
        
        karma_change
    }
}

mod test;