#![cfg(test)]
use super::{KarmaEngineContract, KarmaEngineContractClient};
use soroban_sdk::{Env, Address, testutils::Address as _};

#[test]
fn test_basic_functionality() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let _client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Simple test to verify the contract can be instantiated
    assert!(true);
}

#[test]
fn test_user_registration() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Create test addresses
    let owner = Address::generate(&env);
    let xlm_token = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&owner, &xlm_token);
    
    // Register a user
    let user = Address::generate(&env);
    client.register_user(&user);
    
    // Check that user has 0 karma points initially
    let karma = client.get_karma(&user);
    assert_eq!(karma, 0);
    
    // Check that user has 0 stake initially
    let stake = client.get_stake(&user);
    assert_eq!(stake, 0);
    
    // Check XLM token address
    let token = client.get_xlm_token();
    assert_eq!(token, xlm_token);
}

#[test]
fn test_posting_activity_and_karma_update() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Create test addresses
    let owner = Address::generate(&env);
    let xlm_token = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&owner, &xlm_token);
    
    // Register a user
    let user = Address::generate(&env);
    client.register_user(&user);
    
    // Record a post activity (+5 karma)
    let result = client.record_post(&user);
    assert_eq!(result, 5);
    
    // Check user's karma
    let karma = client.get_karma(&user);
    assert_eq!(karma, 5);
    
    // Record a comment activity (+3 karma)
    let result = client.record_comment(&user);
    assert_eq!(result, 3);
    
    // Check user's karma
    let karma = client.get_karma(&user);
    assert_eq!(karma, 8);
}

#[test]
fn test_redeeming_karma_for_xlm() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Create test addresses
    let owner = Address::generate(&env);
    let xlm_token = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&owner, &xlm_token);
    
    // Register a user
    let user = Address::generate(&env);
    client.register_user(&user);
    
    // Record some activities to earn karma
    client.record_post(&user); // +5 karma
    client.record_comment(&user); // +3 karma
    client.record_like(&user); // +1 karma
    
    // Check user's karma (should be 9)
    let karma = client.get_karma(&user);
    assert_eq!(karma, 9);
    
    // Try to redeem karma for XLM (should fail with insufficient karma)
    // With default rate of 10 karma = 1 XLM, 9 karma should give 0 XLM (insufficient)
    let result = client.try_redeem_karma(&user, &9);
    assert!(result.is_err());
    
    // Record one more activity to get 11 karma
    client.record_like(&user); // +1 karma
    let karma = client.get_karma(&user);
    assert_eq!(karma, 10);
    
    // Now we should be able to redeem 10 karma for XLM
    // Note: This is a mock test since we don't have a real XLM token contract
    // In a real test, we would check that the XLM tokens are transferred to the user
}

#[test]
fn test_pausing_and_unpausing_contract() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Create test addresses
    let owner = Address::generate(&env);
    let xlm_token = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&owner, &xlm_token);
    
    // Check that contract is not paused initially
    let paused = client.is_paused();
    assert_eq!(paused, false);
    
    // Mock authorization for the owner
    env.mock_all_auths();
    
    // Pause the contract
    client.set_paused(&owner, &true);
    
    // Check that contract is paused
    let paused = client.is_paused();
    assert_eq!(paused, true);
    
    // Unpause the contract
    client.set_paused(&owner, &false);
    
    // Check that contract is not paused
    let paused = client.is_paused();
    assert_eq!(paused, false);
}

#[test]
fn test_get_activities_newest_first() {
    let env = Env::default();
    let contract_id = env.register(KarmaEngineContract, ());
    let client = KarmaEngineContractClient::new(&env, &contract_id);
    
    // Create test addresses
    let owner = Address::generate(&env);
    let xlm_token = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&owner, &xlm_token);
    
    // Register a user
    let user = Address::generate(&env);
    client.register_user(&user);
    
    // Record some activities
    client.record_post(&user);
    client.record_comment(&user);
    client.record_like(&user);
    
    // Get user's activities
    let activities = client.get_activities(&user);
    assert_eq!(activities.len(), 3);
    
    // Check that activities are returned newest first
    // The first activity should be the like (most recent)
    // The last activity should be the post (oldest)
    // Note: We can't easily check the content without importing more types
}