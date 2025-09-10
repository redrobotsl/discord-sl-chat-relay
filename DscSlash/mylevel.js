const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.js");
const { permlevel } = require("../modules/functions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mylevel")
    .setDescription("Gives Bot Command Access Level"),
  async execute(interaction) {
    const level = permlevel(interaction);
    const friendly = config.permLevels.find(l => l.level === level).name;
    
    await interaction.reply(`Your permission level is: **${level}** - **${friendly}**`);
  },
};