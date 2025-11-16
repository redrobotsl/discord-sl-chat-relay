const { Signale } = require('signale');

// Define custom configuration for the logger
// The rest of the options can be set in package.json if desired. 
const options = {
  types: {
    success: {
      badge: '✔',
      color: 'green',
      label: 'success',
    },
    error: {
      badge: '✖',
      color: 'red',
      label: 'error',
    },
    warn: {
      badge: '⚠',
      color: 'yellow',
      label: 'warn',
    },
    info: {
      badge: 'ℹ',
      color: 'cyan',
      label: 'info',
    },
    debug: {
      badge: '🐛',
      color: 'magenta',
      label: 'debug',
    },
  },
};

// Create a new Signale instance with the custom configuration
const logger = new Signale({ types: options.types });

// Export the logger for use in other files
module.exports = logger;