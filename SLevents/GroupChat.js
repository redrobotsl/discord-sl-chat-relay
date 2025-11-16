const config = require('../config.js');
const axios = require('axios').default;
const nmv = require('@caspertech/node-metaverse');
const logger = require('../modules/Logger.js');
const { UUID } = nmv;

module.exports = async (client, GroupChatEvent) => {
  const SLbot = client.container.SLbot;

  const currentBot = `${process.env.SL_FIRSTNAME} ${process.env.SL_LASTNAME}`;
  if (GroupChatEvent.fromName === currentBot) return;
  if (config.ignoredSet?.has(GroupChatEvent.from.toString()) || config.ignored.includes(GroupChatEvent.from.toString())) return;

  let img = 'bfc51542-be49-4595-9784-aec1e3f612dc';

  if (config.relays.has(GroupChatEvent.groupID.toString())) {
    try {
      let message = GroupChatEvent.message;
      if (message.startsWith('/me')) {
        message = `*${message.replace('/me', '').trim()}*`;
      }

      try {
        // TODO: Need to make this a Regex of some sort I think
        const profile = await axios.get(`http://world.secondlife.com/resident/${GroupChatEvent.from}`);
        const match = profile.data.match(/<meta name="imageid" content="([^"]+)"/);
        if (match) img = match[1];
      } catch (error) {
        logger.error("Failed fetching profile image:", error.message);
      }

      const channel = client.channels.cache.get(config.relays.get(GroupChatEvent.groupID.toString()));
      if (!channel) return;
      // Get all the webhooks for the channel, then get the first token available, we don't care who made it, it's gonna be ours now :)
      let webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find(wh => wh.token);
      // If there is no webhook, create one, use a default image for it. 
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'relay-bot',
          avatar: 'https://i.imgur.com/AfFp7pu.png',
        });
        logger.info(`Created webhook`);
      }
      // Attempt to send the message that came from inworld  via the webhoo, and if there is a image, guess we can use a profile image.
      // TODO: Create configuration settings maybe for if it's a OpenSimulator Bot, it'll default to something, since obviously the SL Image Service wouldn't be available.
      await webhook.send({
        content: message,
        username: `${GroupChatEvent.fromName} (inworld)`,
        avatarURL: `https://picture-service.secondlife.com/${img}/320x240.jpg`,
        allowedMentions: { parse: [] },
      });

    } catch (error) {
      // Note the error, and dump.
      logger.error('Failed to relay to Discord:', error.message);
    }
  }
};
