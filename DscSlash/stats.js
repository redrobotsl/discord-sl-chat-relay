const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();
const packageinfo = require("../package.json");
const name = packageinfo.name;
const dversion = packageinfo.version;
const dependencies = packageinfo.dependencies;
console.log(`package name: ${name}`);
console.log(`package version: ${dversion}`);
console.log(`dependencies:`, dependencies);
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Show's the bots stats."),

  async execute(interaction) {
    const duration = durationFormatter.format(interaction.client.uptime);
    
    // Get region restart handler status
    const regionRestartHandler = interaction.client.container.regionRestartHandler;
    let currentLocation = 'Unknown';
    let evacuationStatus = 'Unknown';
    
    if (regionRestartHandler) {
      const status = regionRestartHandler.getStatus();
      currentLocation = status.currentRegion || 'Unknown';
      evacuationStatus = status.isEvacuating ? '🚨 Evacuating Region Restarts' : '✅ Normal';
    }
    
    const statsEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('STATISTICS')
      .addFields(
        { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: 'Uptime', value: duration, inline: true },
        { name: 'Users', value: (interaction.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)).toLocaleString(), inline: true },
        { name: 'Servers', value: interaction.client.guilds.cache.size.toLocaleString(), inline: true },
        { name: 'Channels', value: interaction.client.channels.cache.size.toLocaleString(), inline: true },
        { name: 'Discord.js', value: `v${version}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Bot Version', value: `v${dversion}`, inline: true },
        { name: 'Current Region', value: currentLocation, inline: true },
        { name: 'Restarts Evacuation Status', value: evacuationStatus, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [statsEmbed] });
  },
};