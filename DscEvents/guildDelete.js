const logger = require("../modules/Logger.js");

// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  if (!guild.available) return; // If there is an outage, return.
  
  logger.info(`[GUILD LEAVE] ${guild.id} removed the bot.`);
 
};
