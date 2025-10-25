const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Karma Engine Backend Server is running on port ${PORT}`);
});