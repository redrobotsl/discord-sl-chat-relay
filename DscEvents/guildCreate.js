const logger = require("../modules/Logger.js");
// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  logger.info(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
   // We'll partition the slash commands based on the guildOnly boolean.
  // Separating them into the correct objects defined in the array below.
  const [globalCmds, guildCmds] = client.container.slashcmds.partition(c => !c.conf.guildOnly);

  // We'll use set but please keep in mind that `set` is overkill for a singular command.
  // Set the guild commands like 
  client.guilds.cache.get(guild.id)?.commands.set(guildCmds.map(c => c.commandData));

  // Then set the global commands like 
client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));
};
