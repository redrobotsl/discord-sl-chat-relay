const logger = require('../modules/Logger.js');
module.exports = async client => {
  // Log that the bot is online.
  logger.success(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  
/// this sets the activity, so the bot is being silly. 
  client.user.setActivity(`with the Metaverse`, { type: "PLAYING" });
};
