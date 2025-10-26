const axios = require('axios');

// Test user registration and staking functionality
async function testUserAndStaking() {
  try {
    console.log('Testing user registration and staking functionality...');
    
    // Test user registration
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      name: 'Test User',
      dateOfBirth: '1990-01-01'
    });
    
    console.log('User registration response:', registerResponse.data);
    
    // Update user karma points to have enough for staking
    const updateKarmaResponse = await axios.put('http://localhost:5000/api/users/GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA/karma', {
      karmaPoints: 1000
    });
    
    console.log('Update karma response:', updateKarmaResponse.data);
    
    // Test staking
    const stakeResponse = await axios.post('http://localhost:5000/api/staking/stake', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      amount: 100
    });
    
    console.log('Stake response:', stakeResponse.data);
    
    // Test unstaking
    const unstakeResponse = await axios.post('http://localhost:5000/api/staking/unstake', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      amount: 50
    });
    
    console.log('Unstake response:', unstakeResponse.data);
    
    // Test redemption
    const redeemResponse = await axios.post('http://localhost:5000/api/staking/redeem', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      karmaPoints: 50
    });
    
    console.log('Redeem response:', redeemResponse.data);
    
  } catch (error) {
    console.error('Error testing user and staking:', error.response?.data || error.message);
  }
}

testUserAndStaking();