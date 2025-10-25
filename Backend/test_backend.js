/**
 * Simple test script to verify backend functionality
 */

const axios = require('axios');

// Test data
const testUser = {
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  name: "Test User",
  dateOfBirth: "1990-01-01",
  instagram: "testuser",
  facebook: "testuser",
  twitter: "testuser"
};

const baseURL = 'http://localhost:3000/api';

async function testBackend() {
  console.log('Testing Karma Engine Backend...\n');
  
  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${baseURL}/users/register`, testUser);
    console.log('Registration Response:', registerResponse.data.message);
    console.log('Username:', registerResponse.data.user.username);
    console.log('Avatar:', registerResponse.data.user.avatar);
    console.log('Karma Points:', registerResponse.data.user.karmaPoints);
    console.log('Is Over 18:', registerResponse.data.user.isOver18);
    console.log('---\n');
    
    // Test 2: Get User
    console.log('2. Testing Get User...');
    const getUserResponse = await axios.get(`${baseURL}/users/${testUser.walletAddress}`);
    console.log('User Name:', getUserResponse.data.user.name);
    console.log('Social Media:', getUserResponse.data.user.socialMedia);
    console.log('---\n');
    
    // Test 3: Record Activity
    console.log('3. Testing Record Activity...');
    const activityData = {
      walletAddress: testUser.walletAddress,
      type: "post",
      metadata: {
        content: "This is a test post"
      }
    };
    const activityResponse = await axios.post(`${baseURL}/activities`, activityData);
    console.log('Activity Recorded:', activityResponse.data.message);
    console.log('Karma Earned:', activityResponse.data.activity.finalKarma);
    console.log('---\n');
    
    // Test 4: Get Activities
    console.log('4. Testing Get Activities...');
    const getActivitiesResponse = await axios.get(`${baseURL}/activities/${testUser.walletAddress}`);
    console.log('Activities Count:', getActivitiesResponse.data.activities.length);
    console.log('---\n');
    
    // Test 5: Get Karma Balance
    console.log('5. Testing Get Karma Balance...');
    const karmaResponse = await axios.get(`${baseURL}/karma/balance/${testUser.walletAddress}`);
    console.log('Karma Points:', karmaResponse.data.user.databaseKarma);
    console.log('---\n');
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testBackend();