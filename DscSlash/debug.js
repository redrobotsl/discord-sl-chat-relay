const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Displays debug information."),

  async execute(interaction) {
    const botPing = Date.now() - interaction.createdTimestamp; // Calculate bot latency
    const DebugEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('STATISTICS')
      .addFields(
        { name: 'System OS', value: `${os.type()} ${os.release()} (${os.arch()})`, inline: false },
        { name: 'CPU', value: `${os.cpus()[0].model}`, inline: false },
        { name: 'Total Memory', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, inline: false },
        { name: 'Free Memory', value: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`, inline: false },
        { name: 'Ping', value: `Bot: **${botPing}ms**\nAPI: **${interaction.client.ws.ping}ms**`, inline: false },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [DebugEmbed] });
  },
};