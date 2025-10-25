module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/karmaengine',
  jwtSecret: process.env.JWT_SECRET || 'karmaengine_jwt_secret',
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'hardhat',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    rpcUrl: process.env.RPC_URL || 'http://localhost:8545'
  }
};