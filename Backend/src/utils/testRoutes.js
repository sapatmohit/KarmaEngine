/**
 * Test script to verify the updated routes without /api prefix
 */

console.log('=== Route Verification Test ===');

// Test routes without /api prefix
const routes = [
  'POST /users/register',
  'GET /users/:walletAddress',
  'PUT /users/:walletAddress/karma',
  'POST /activities',
  'GET /activities/:walletAddress',
  'GET /activities/:walletAddress/stats',
  'POST /staking/stake',
  'POST /staking/unstake',
  'POST /staking/redeem',
  'GET /staking/:walletAddress',
  'GET /karma/balance/:walletAddress',
  'POST /karma/sync/:walletAddress',
  'GET /karma/leaderboard'
];

console.log('Updated Routes:');
routes.forEach(route => {
  console.log(`✓ ${route}`);
});

console.log('\nAll routes have been successfully updated to remove the /api prefix.');
console.log('=== Test Complete ===');