const { SlashCommandBuilder } = require('@discordjs/builders');

function parseSLURL(slurl) {
    // Example: http://maps.secondlife.com/secondlife/Lars%20Continuum/172/174/1055
    // TODO: Add support for other formats
    const match = slurl.match(/secondlife\/([^/]+)\/(\d+)\/(\d+)\/(\d+)/);
    if (!match) return null;
    return {
        region: decodeURIComponent(match[1]),
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
        z: parseInt(match[4], 10)
    };
}

const { permlevel } = require('../modules/functions.js');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teleport')
        .setDescription('Teleport the bot to a Second Life SLURL')
        .addStringOption(option =>
            option.setName('slurl')
                .setDescription('Second Life SLURL (e.g., http://maps.secondlife.com/secondlife/Region/x/y/z)')
                .setRequired(true)),
    async execute(interaction) {
        const userPermLevel = permlevel(interaction);
        const requiredLevel = config.permLevels.find(l => l.name === 'Bot Admin')?.level || 10;
        if (userPermLevel < requiredLevel) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        await interaction.deferReply();
        const slurl = interaction.options.getString('slurl');
        const loc = parseSLURL(slurl);

        if (!loc) {
            return interaction.editReply('Invalid SLURL format. Please use a link like http://maps.secondlife.com/secondlife/Region/x/y/z');
        }

        await interaction.editReply(`Attempting teleport to ${loc.region} (${loc.x}, ${loc.y}, ${loc.z})...`);

        try {
            const { Vector3 } = interaction.client.container.nmv;
            const position = new Vector3(loc.x, loc.y, loc.z);
            const lookAt = position;
            await interaction.client.container.SLbot.clientCommands.teleport.teleportTo(loc.region, position, lookAt);
            await interaction.followUp(`Teleport successful to ${loc.region} (${loc.x}, ${loc.y}, ${loc.z})`);
        } catch (err) {
            await interaction.followUp(`Teleport failed: ${err.message}`);
        }
    },
};