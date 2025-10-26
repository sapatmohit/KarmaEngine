const axios = require('axios');

// Test base URL
const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  walletAddress: 'GD6Z4V3O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
  name: 'Test User',
  dateOfBirth: '1990-01-01',
  instagram: 'testuser',
  facebook: 'testuser',
  twitter: 'testuser'
};

const testEmailUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test Email User',
  dateOfBirth: '1990-01-01',
  instagram: 'testuser',
  facebook: 'testuser',
  twitter: 'testuser'
};

async function testEndpoints() {
  console.log('Testing Karma Engine Backend Endpoints...\n');

  try {
    // Test 1: Basic API test
    console.log('1. Testing basic API endpoint...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✓ Basic API test passed:', testResponse.data.message);

    // Test 2: User registration (wallet-based)
    console.log('\n2. Testing user registration (wallet-based)...');
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('✓ User registration passed:', registerResponse.data.message);

    // Test 3: Get user by wallet address
    console.log('\n3. Testing get user by wallet address...');
    const getUserResponse = await axios.get(`${BASE_URL}/users/wallet/${testUser.walletAddress}`);
    console.log('✓ Get user by wallet address passed:', getUserResponse.data.user.name);

    // Test 4: User registration (email-based)
    console.log('\n4. Testing user registration (email-based)...');
    const registerEmailResponse = await axios.post(`${BASE_URL}/users/register-email`, testEmailUser);
    console.log('✓ Email user registration passed:', registerEmailResponse.data.message);
    const token = registerEmailResponse.data.token;

    // Test 5: User login (email-based)
    console.log('\n5. Testing user login (email-based)...');
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: testEmailUser.email,
      password: testEmailUser.password
    });
    console.log('✓ User login passed:', loginResponse.data.message);

    // Test 6: Get current user (protected route)
    console.log('\n6. Testing get current user (protected route)...');
    const getCurrentUserResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✓ Get current user passed:', getCurrentUserResponse.data.user.name);

    // Test 7: Update user profile
    console.log('\n7. Testing update user profile...');
    const updateProfileResponse = await axios.put(`${BASE_URL}/users/profile/${testUser.walletAddress}`, {
      name: 'Updated Test User',
      instagram: 'updatedtestuser'
    });
    console.log('✓ Update user profile passed:', updateProfileResponse.data.message);

    // Test 8: Update user karma
    console.log('\n8. Testing update user karma...');
    const updateKarmaResponse = await axios.put(`${BASE_URL}/users/${testUser.walletAddress}/karma`, {
      karmaPoints: 100
    });
    console.log('✓ Update user karma passed:', updateKarmaResponse.data.message);

    // Test 9: Record activity
    console.log('\n9. Testing record activity...');
    const recordActivityResponse = await axios.post(`${BASE_URL}/activities/`, {
      walletAddress: testUser.walletAddress,
      type: 'post',
      metadata: {
        content: 'Test post content',
        network: 'twitter'
      }
    });
    console.log('✓ Record activity passed:', recordActivityResponse.data.message);

    // Test 10: Get user activities
    console.log('\n10. Testing get user activities...');
    const getActivitiesResponse = await axios.get(`${BASE_URL}/activities/${testUser.walletAddress}`);
    console.log('✓ Get user activities passed:', `${getActivitiesResponse.data.activities.length} activities found`);

    // Test 11: Get activity stats
    console.log('\n11. Testing get activity stats...');
    const getActivityStatsResponse = await axios.get(`${BASE_URL}/activities/${testUser.walletAddress}/stats`);
    console.log('✓ Get activity stats passed:', `${getActivityStatsResponse.data.stats.length} stat types found`);

    // Test 12: Get karma balance
    console.log('\n12. Testing get karma balance...');
    const getKarmaBalanceResponse = await axios.get(`${BASE_URL}/karma/balance/${testUser.walletAddress}`);
    console.log('✓ Get karma balance passed:', getKarmaBalanceResponse.data.user.databaseKarma);

    // Test 13: Get karma history
    console.log('\n13. Testing get karma history...');
    const getKarmaHistoryResponse = await axios.get(`${BASE_URL}/karma/history/${testUser.walletAddress}`);
    console.log('✓ Get karma history passed:', `${getKarmaHistoryResponse.data.history.length} history items found`);

    // Test 14: Get leaderboard
    console.log('\n14. Testing get leaderboard...');
    const getLeaderboardResponse = await axios.get(`${BASE_URL}/karma/leaderboard`);
    console.log('✓ Get leaderboard passed:', `${getLeaderboardResponse.data.leaderboard.length} users found`);

    // Test 15: Get user staking records
    console.log('\n15. Testing get user staking records...');
    const getStakingRecordsResponse = await axios.get(`${BASE_URL}/staking/${testUser.walletAddress}`);
    console.log('✓ Get user staking records passed:', `${getStakingRecordsResponse.data.stakingRecords.length} records found`);

    console.log('\n🎉 All tests passed! The backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the tests
testEndpoints();