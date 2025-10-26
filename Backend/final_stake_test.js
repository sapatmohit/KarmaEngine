const axios = require('axios');

async function finalStakeTest() {
  try {
    console.log('Testing final staking...');
    
    // Test staking
    const stakeResponse = await axios.post('http://localhost:5000/api/staking/stake', {
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA',
      amount: 25
    });
    
    console.log('Stake response:', stakeResponse.data);
    
  } catch (error) {
    console.error('Error testing staking:', error.response?.data || error.message);
  }
}

finalStakeTest();