const logger = require("../modules/Logger.js");
const { permlevel } = require("../modules/functions.js");
const config = require("../config.js");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const settings = config.defaultSettings;

  const level = permlevel(interaction);
  
  const cmd = client.container.slashcmds.get(interaction.commandName);
  
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
    logger.info(`${config.permLevels.find(l => l.level === level).name} ${interaction.user.id} ran slash command ${interaction.commandName}`, "cmd");

  } catch (e) {
    console.error(e);
    if (interaction.replied || interaction.deferred) 
      await interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error("An error occurred following up on an error", e));
    else 
      await interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error("An error occurred replying on an error", e));
  }
};