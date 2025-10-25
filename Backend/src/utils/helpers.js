/**
 * Utility functions for the Karma Engine
 */

/**
 * Validate wallet address format
 * @param {string} address - Wallet address to validate
 * @returns {boolean} - Whether the address is valid
 */
const isValidWalletAddress = (address) => {
  // Basic validation for Ethereum-style addresses
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Format wallet address for display
 * @param {string} address - Wallet address to format
 * @returns {string} - Formatted wallet address
 */
const formatWalletAddress = (address) => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Calculate karma multiplier based on staked amount
 * @param {number} stakedAmount - Amount of tokens staked
 * @returns {number} - Multiplier value
 */
const calculateMultiplier = (stakedAmount) => {
  if (stakedAmount >= 500) return 2.0;
  if (stakedAmount >= 100) return 1.5;
  return 1.0;
};

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after ms milliseconds
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  isValidWalletAddress,
  formatWalletAddress,
  calculateMultiplier,
  sleep
};