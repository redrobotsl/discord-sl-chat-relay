const logger = require("../modules/Logger.js");
// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  logger.log(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  
  // Global commands are already registered in clientReady event
  // No need to register them again here since they work in DMs and all guilds now
  logger.log(`Global slash commands are available in guild ${guild.id}`, "log");
};
