const mongoose = require('mongoose');
const config = require('./src/config');
const Activity = require('./src/models/Activity');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkActivities() {
  try {
    console.log('Checking activities in database...');
    
    // Find activities for our test user
    const activities = await Activity.find({
      walletAddress: 'GCQMT7WECE2L4H5WIJDKYTHTBICVJZ4HEW62CXTSLWNPOS7YGPBYCILA'
    }).sort({ timestamp: -1 });
    
    console.log(`Found ${activities.length} activities:`);
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. Type: ${activity.type}, Value: ${activity.value}, Final Karma: ${activity.finalKarma}, Timestamp: ${activity.timestamp}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking activities:', error);
    mongoose.connection.close();
  }
}

checkActivities();