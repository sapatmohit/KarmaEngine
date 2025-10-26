const axios = require('axios');

// Test staking functionality
async function testStaking() {
  try {
    console.log('Testing staking functionality...');
    
    // Test staking
    const stakeResponse = await axios.post('http://localhost:5000/api/staking/stake', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      amount: 10
    });
    
    console.log('Stake response:', stakeResponse.data);
    
    // Test unstaking
    const unstakeResponse = await axios.post('http://localhost:5000/api/staking/unstake', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      amount: 5
    });
    
    console.log('Unstake response:', unstakeResponse.data);
    
    // Test redemption
    const redeemResponse = await axios.post('http://localhost:5000/api/staking/redeem', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      karmaPoints: 50
    });
    
    console.log('Redeem response:', redeemResponse.data);
    
  } catch (error) {
    console.error('Error testing staking:', error.response?.data || error.message);
  }
}

testStaking();