/**
 * Simple logger utility
 */

const logLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const logLevel = process.env.LOG_LEVEL || logLevels.INFO;

const shouldLog = (level) => {
  const levels = [logLevels.ERROR, logLevels.WARN, logLevels.INFO, logLevels.DEBUG];
  return levels.indexOf(level) <= levels.indexOf(logLevel);
};

const logger = {
  error: (message, ...args) => {
    if (shouldLog(logLevels.ERROR)) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (shouldLog(logLevels.WARN)) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (shouldLog(logLevels.INFO)) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  debug: (message, ...args) => {
    if (shouldLog(logLevels.DEBUG)) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};

module.exports = logger;