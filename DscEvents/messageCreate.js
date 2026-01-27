const logger = require("../modules/Logger.js");
const {  permlevel } = require("../modules/functions.js");
const config = require("../config.js");
const nmv = require('@caspertech/node-metaverse');


// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {

  // Grab the container from the client to reduce line length.
  const { container } = client;
  // If it's a bot or if it's a webhook yeah nah fam. Ignore that
  if (message.author.bot) return;
  if (message.webhookId) return;



  // Checks if the bot was mentioned via regex, with no message after it,
  // returns the prefix. The reason why we used regex here instead of
  // message.mentions is because of the mention prefix later on in the
  // code, would render it useless.
  const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`This bot's commands can be used by slash commands`);
  }

    // Loop through the Mappings and see if this message was in a discord channel we are supposed to watch. 
    config.relays.forEach (async (value, key) => {
      // Oh boi it is. 
        if (value === message.channel.id) {

          // Check if SL bot is connected and ready before trying to use it
          if (!container.SLbot || !container.SLbot.clientCommands) {
            logger.log('SL bot not ready yet, skipping message relay', 'warn');
            return;
          }

          try {
            // console.debug("Discord Channel ID: " + message.channel.id + " maps to SL Group UUID: " + key + " " + typeof key + typeof message.channel.id);
            const groupID = new nmv.UUID(key);
            // Start a group chat session - equivalent to opening a group chat but not sending a message
            await container.SLbot.clientCommands.comms.startGroupChatSession(groupID, '');
            let guild = client.guilds.fetch(message.guild.id);
            const member = await message.guild.members.fetch(message.author);
            let nickname = member ? member.displayName : null;
            // Send a group message
            await container.SLbot.clientCommands.comms.sendGroupMessage(groupID, 'From Discord: ' + nickname + ': ' + message.content);
          } catch (error) {
            logger.log(`Failed to relay message to SL: ${error.message}`, 'error');
          }
        }

      })
};
