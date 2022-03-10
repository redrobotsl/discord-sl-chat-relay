exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    const reply = await interaction.editReply("Bot initiating logout and shutdown");
    // await interaction.editReply(`Bot initiating logout and shutdown`);
      try
      {
          await client.container.SLbot.close();
      }
      catch (error)
      {
        logger.log(`SL: Error when logging out client`, "error");
        logger.log(error, "error");
      }
      process.exit(0);

  };
  
  exports.commandData = {
    name: "reboot",
    description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
    options: [],
    defaultPermission: true,
  };
  
  // Set guildOnly to true if you want it to be available on guilds only.
  // Otherwise false is global.
  exports.conf = {
    permLevel: "Bot Admin",
    guildOnly: false
  };