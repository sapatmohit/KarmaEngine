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

/**
 * Generate a random funny username
 * @returns {string} - Random funny username
 */
const generateRandomUsername = () => {
  const adjectives = [
    'Funny', 'Crazy', 'Wild', 'Silly', 'Wacky', 'Goofy', 'Cheeky', 'Spunky',
    'Zany', 'Quirky', 'Nutty', 'Dorky', 'Whacky', 'Kooky', 'Sassy', 'Bubbly',
    'Groovy', 'Funky', 'Jazzy', 'Snazzy'
  ];
  
  const nouns = [
    'Panda', 'Unicorn', 'Dragon', 'Ninja', 'Pirate', 'Robot', 'Alien', 'Wizard',
    'Monkey', 'Penguin', 'Dolphin', 'Tiger', 'Eagle', 'Shark', 'Phoenix', 'Griffin',
    'Yeti', 'Goblin', 'Elf', 'Dwarf'
  ];
  
  const numbers = Math.floor(Math.random() * 1000);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${numbers}`;
};

/**
 * Generate a random avatar URL
 * @returns {string} - Random avatar URL
 */
const generateRandomAvatar = () => {
  // In a real application, this would connect to an avatar service
  // For now, we'll generate a placeholder URL
  const baseUrl = 'https://api.dicebear.com/7.x';
  const styles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles', 'fun-emoji', 'lorelei'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const seed = Math.random().toString(36).substring(2, 15);
  
  return `${baseUrl}/${randomStyle}/png?seed=${seed}`;
};

/**
 * Calculate age from date of birth
 * @param {Date} dateOfBirth - User's date of birth
 * @returns {number} - Age in years
 */
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if user is over 18
 * @param {Date} dateOfBirth - User's date of birth
 * @returns {boolean} - Whether user is over 18
 */
const isOver18 = (dateOfBirth) => {
  return calculateAge(dateOfBirth) >= 18;
};

module.exports = {
  isValidWalletAddress,
  formatWalletAddress,
  calculateMultiplier,
  sleep,
  generateRandomUsername,
  generateRandomAvatar,
  calculateAge,
  isOver18
};