const config = require("../config.js");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { permlevel } = require("../modules/functions.js");
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    const level = permlevel(interaction);

    const friendly = config.permLevels.find(l => l.level === level).name;
    await interaction.deferReply();
    const reply = await interaction.editReply(`Your permission level is: ${level} - ${friendly}`);
  //  await interaction.editReply(`Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
  };
  
  exports.commandData = {
    name: "mylevel",
    description: "Gives Bot Command Access Level",
    options: [],
    defaultPermission: true,
  };
  
  // Set guildOnly to true if you want it to be available on guilds only.
  // Otherwise false is global.
  exports.conf = {
    permLevel: "User",
    guildOnly: false
  };