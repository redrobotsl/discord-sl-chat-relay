const { EmbedBuilder, version } = require("discord.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();
const packageinfo = require("../package.json");
const name = packageinfo.name;
const bot_version = packageinfo.version;
const dependencies = packageinfo.dependencies;
console.log(`package name: ${name}`);
console.log(`package version: ${bot_version}`);
console.log(`dependencies:`, dependencies);
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);

  const statsEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('STATISTICS')
    .addFields(
      { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
      { name: 'Uptime', value: duration, inline: true },
      { name: 'Users', value: (client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)).toLocaleString(), inline: true },
      { name: 'Servers', value: client.guilds.cache.size.toLocaleString(), inline: true },
      { name: 'Channels', value: client.channels.cache.size.toLocaleString(), inline: true },
      { name: 'Discord.js', value: `v${version}`, inline: true },
      { name: 'Node.js', value: process.version, inline: true },
      { name: 'Bot Version', value: `v${bot_version}`, inline: true },
    )
    .setTimestamp();

  await interaction.reply({ embeds: [statsEmbed] });
};

exports.commandData = {
  name: "stats",
  description: "Show's the bots stats.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};
