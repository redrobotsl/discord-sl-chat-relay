const { SlashCommandBuilder } = require("discord.js");

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
      logger.log(`SL: Error when logging out client`, "error");
      logger.log(error, "error");
    }
    
    process.exit(0);
  },
};