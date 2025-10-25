/**
 * Test script for user registration
 * This script demonstrates how the registration endpoint works
 */

const { generateRandomUsername, generateRandomAvatar, isOver18, calculateAge } = require('./helpers');

// Test data
const testUser = {
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  name: 'John Doe',
  dateOfBirth: '1990-05-15',
  instagram: 'johndoe_insta',
  facebook: 'johndoe_fb',
  twitter: 'johndoe_twitter'
};

console.log('=== User Registration Test ===');
console.log('Test User Data:', testUser);

// Test username generation
const username = generateRandomUsername();
console.log('Generated Username:', username);

// Test avatar generation
const avatar = generateRandomAvatar();
console.log('Generated Avatar URL:', avatar);

// Test age calculation
const age = calculateAge(testUser.dateOfBirth);
console.log('User Age:', age);

// Test age verification
const over18 = isOver18(testUser.dateOfBirth);
console.log('Is Over 18:', over18);

console.log('=== Test Complete ===');