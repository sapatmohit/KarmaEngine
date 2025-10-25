// Trading types and interfaces

export const TradeType = {
  BUY: 'buy',
  SELL: 'sell'
};

export const TradeStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const TimeFrame = {
  '1H': '1H',
  '1D': '1D',
  '1W': '1W',
  '1M': '1M',
  '1Y': '1Y'
};

// Mock data generators
export const generateMockPriceData = (hours = 24) => {
  const now = new Date();
  const data = [];
  
  for (let i = hours - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const basePrice = 3943.51;
    const variation = (Math.random() - 0.5) * 200; // Random price movement
    data.push({
      timestamp: timestamp.toISOString(),
      price: basePrice + variation,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data;
};

export const generateMockTokens = () => [
  {
    userId: 'user1',
    username: 'ethereum_trader',
    name: 'Ethereum Trader',
    avatar: '/api/placeholder/40/40',
    currentPrice: 3943.51,
    priceChange24h: -30.87,
    priceChangePercentage24h: -0.87,
    marketCap: 474000000,
    volume24h: 12500000,
    totalSupply: 120000000,
    circulatingSupply: 120000000,
    karmaScore: 8750,
    priceHistory: generateMockPriceData(),
    isVerified: true,
    description: 'A smart contract platform that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform.'
  },
  {
    userId: 'user2',
    username: 'bitcoin_bull',
    name: 'Bitcoin Bull',
    avatar: '/api/placeholder/40/40',
    currentPrice: 2156.78,
    priceChange24h: 125.43,
    priceChangePercentage24h: 6.18,
    marketCap: 325000000,
    volume24h: 8900000,
    totalSupply: 150000000,
    circulatingSupply: 150000000,
    karmaScore: 9200,
    priceHistory: generateMockPriceData(),
    isVerified: true,
    description: 'Bitcoin maximalist with deep knowledge of cryptocurrency markets and blockchain technology.'
  },
  {
    userId: 'user3',
    username: 'defi_master',
    name: 'DeFi Master',
    avatar: '/api/placeholder/40/40',
    currentPrice: 1234.56,
    priceChange24h: -45.23,
    priceChangePercentage24h: -3.54,
    marketCap: 185000000,
    volume24h: 5600000,
    totalSupply: 150000000,
    circulatingSupply: 150000000,
    karmaScore: 7850,
    priceHistory: generateMockPriceData(),
    isVerified: false,
    description: 'Decentralized finance expert specializing in yield farming and liquidity provision strategies.'
  },
  {
    userId: 'user4',
    username: 'nft_collector',
    name: 'NFT Collector',
    avatar: '/api/placeholder/40/40',
    currentPrice: 567.89,
    priceChange24h: 78.12,
    priceChangePercentage24h: 15.95,
    marketCap: 95000000,
    volume24h: 3200000,
    totalSupply: 167000000,
    circulatingSupply: 167000000,
    karmaScore: 6420,
    priceHistory: generateMockPriceData(),
    isVerified: true,
    description: 'Digital art enthusiast and NFT collector with expertise in emerging blockchain art platforms.'
  },
  {
    userId: 'user5',
    username: 'yield_farmer',
    name: 'Yield Farmer',
    avatar: '/api/placeholder/40/40',
    currentPrice: 89.45,
    priceChange24h: 2.34,
    priceChangePercentage24h: 2.69,
    marketCap: 12000000,
    volume24h: 890000,
    totalSupply: 134000000,
    circulatingSupply: 134000000,
    karmaScore: 5670,
    priceHistory: generateMockPriceData(),
    isVerified: false,
    description: 'Experienced yield farmer with strategies for maximizing returns in DeFi protocols.'
  }
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};

export const formatPercentage = (percentage) => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};
