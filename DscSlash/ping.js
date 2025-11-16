const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pongs when pinged."),
  async execute(interaction) {
    const botPing = Date.now() - interaction.createdTimestamp;
    await interaction.reply({
      content: `Pong! Latency is **${botPing}ms**. API Latency is **${Math.round(interaction.client.ws.ping)}ms**.`,
      ephemeral: true,
    });
  },
};



