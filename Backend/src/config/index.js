module.exports = {
	port: process.env.PORT || 5000,
	mongoURI:
		process.env.MONGO_URI ||
		'mongodb+srv://karma_engine:karma%40123@cluster0.7jfispf.mongodb.net/karmaengine?retryWrites=true&w=majority',
	jwtSecret: process.env.JWT_SECRET || 'karmaengine_jwt_secret_2025',
	blockchain: {
		network: process.env.BLOCKCHAIN_NETWORK || 'soroban-testnet',
		contractAddress: process.env.CONTRACT_ADDRESS || '',
		rpcUrl: process.env.RPC_URL || 'https://soroban-testnet.stellar.org:443',
	},
};