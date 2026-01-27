const logger = require("../modules/Logger.js");
module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  
  // Register slash commands globally so they work in DMs
  try {
    const globalCommands = client.container.slashcmds.map(cmd => cmd.data);
    await client.application?.commands.set(globalCommands);
    logger.log(`Registered ${globalCommands.length} global slash commands`, "ready");
  } catch (error) {
    logger.log(`Failed to register global commands: ${error.message}`, "error");
  }
  
/// this sets the activity, so the bot is being silly. 
  client.user.setActivity(`with the Metaverse`, { type: "PLAYING" });
};
