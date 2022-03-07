const logger = require("../modules/Logger.js");
const { getSettings, permlevel } = require("../modules/functions.js");
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

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = getSettings(message.guild);

  // Checks if the bot was mentioned via regex, with no message after it,
  // returns the prefix. The reason why we used regex here instead of
  // message.mentions is because of the mention prefix later on in the
  // code, would render it useless.
  const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // It's also good practice to ignore any and all messages that do not start
  // with our prefix, or a bot mention.
  const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${settings.prefix}`).exec(message.content);
// If it's not a command, treat it as a relay if it matches our relay channel. 
  if (!prefix){
    // If it is a relay channel for Main
    
    config.relays.forEach (async (value, key) => {
        if (value === message.channel.id) {
          console.log("Discord Channel ID: " + message.channel.id + " maps to SL Group UUID: " + key + " " + typeof key + typeof message.channel.id);
          const groupID = new nmv.UUID(key);
          // Start a group chat session - equivalent to opening a group chat but not sending a message
          await container.SLbot.clientCommands.comms.startGroupChatSession(groupID, '');
          let guild = client.guilds.fetch(message.guild.id);
          const member = await message.guild.members.fetch(message.author);
          let nickname = member ? member.displayName : null;
          // Send a group message
          await container.SLbot.clientCommands.comms.sendGroupMessage(groupID, 'From Discord: ' + nickname + ': ' + message.content);
        }

      })





  }else{
  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Get the user or member's permission level from the elevation
  const level = permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
  // using this const varName = thing OR otherThing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (!cmd.conf.enabled) return;

  if (level < container.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${config.permLevels.find(l => l.level === level).name})
This command requires level ${container.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  try {
    await cmd.run(client, message, args, level);
    logger.log(`${config.permLevels.find(l => l.level === level).name} ${message.author.id} ran command ${cmd.help.name}`, "cmd");
  } catch (e) {
    console.error(e);
    message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
      .catch(e => console.error("An error occurred replying on an error", e));
  }

}
};
