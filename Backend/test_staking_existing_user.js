const axios = require('axios');

// Test staking functionality with existing user
async function testStakingExistingUser() {
  try {
    console.log('Testing staking functionality with existing user...');
    
    // Get existing user
    const getUserResponse = await axios.get('http://localhost:5000/api/users/wallet/GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA');
    
    console.log('Current user data:', getUserResponse.data);
    
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
    console.error('Error testing staking with existing user:', error.response?.data || error.message);
  }
}

testStakingExistingUser();