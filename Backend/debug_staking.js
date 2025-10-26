const mongoose = require('mongoose');
const config = require('./src/config');
const User = require('./src/models/User');
const Activity = require('./src/models/Activity');

// Connect to MongoDB
mongoose.connect(config.mongoURI);

async function debugStaking() {
  try {
    console.log('Debugging staking activities...');
    
    // Find our test user
    const user = await User.findOne({
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA'
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.walletAddress);
    console.log('User karma points:', user.karmaPoints);
    console.log('User staked amount:', user.stakedAmount);
    
    // Try to manually create an activity record
    console.log('Creating test activity record...');
    const testActivity = new Activity({
      userId: user._id,
      walletAddress: user.walletAddress,
      type: 'stake',
      value: 100,
      multiplier: 1.5,
      finalKarma: -100,
      timestamp: new Date(),
      metadata: {
        stakingId: 'test-staking-id',
        transactionHash: 'test-transaction-hash'
      }
    });
    
    await testActivity.save();
    console.log('Test activity saved successfully');
    
    // Check if it was saved
    const activities = await Activity.find({
      walletAddress: user.walletAddress
    });
    
    console.log(`Found ${activities.length} activities after test:`);
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. Type: ${activity.type}, Value: ${activity.value}, Final Karma: ${activity.finalKarma}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Debug error:', error);
    mongoose.connection.close();
  }
}

debugStaking();