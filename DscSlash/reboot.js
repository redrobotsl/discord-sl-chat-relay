const { SlashCommandBuilder } = require("discord.js");
const logger = require("../modules/Logger.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reboot")
    .setDescription("Shuts down the bot. If running under PM2, bot will restart automatically."),

  async execute(interaction) {
    await interaction.reply({ content: "Bot initiating logout and shutdown..." });

    try {
      await interaction.client.container.SLbot.close();
    } catch (error) {
      // Assuming logger is defined elsewhere
      logger.error(`SL: Error when logging out client`, "error");
      logger.error(error, "error");
    }
    
    process.exit(0);
  },
};