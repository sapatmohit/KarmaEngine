const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/database/connection');

const PORT = config.port || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
	console.log(`Karma Engine Backend Server is running on port ${PORT}`);
});
