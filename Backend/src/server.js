const app = require('./app');
const config = require('./config');

let server;

// Simple in-memory storage for testing
const users = new Map();

// Mock database connection for testing
console.log('Using mock database for testing');

// Start server without database connection
server = app.listen(config.port, () => {
  console.log(`Karma Engine server running on port ${config.port}`);
  console.log('Using mock database for testing - no MongoDB connection required');
});

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports = server;