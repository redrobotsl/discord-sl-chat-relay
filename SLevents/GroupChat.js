const config = require('../config.js');
const axios = require('axios').default;
const nmv = require('@caspertech/node-metaverse');

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
        const profile = await axios.get(`http://world.secondlife.com/resident/${GroupChatEvent.from}`);
        const match = profile.data.match(/<meta name="imageid" content="([^"]+)"/);
        if (match) img = match[1];
      } catch (error) {
        console.error("Failed fetching profile image:", error.message);
      }

      const channel = client.channels.cache.get(config.relays.get(GroupChatEvent.groupID.toString()));
      if (!channel) return;

      let webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find(wh => wh.token);

      if (!webhook) {
        webhook = await channel.createWebhook('RelayBot', {
          avatar: 'https://i.imgur.com/AfFp7pu.png',
        });
        console.log(`Created webhook ${webhook}`);
      }

      await webhook.send({
        content: message,
        username: `${GroupChatEvent.fromName} (inworld)`,
        avatarURL: `https://picture-service.secondlife.com/${img}/320x240.jpg`,
        allowedMentions: { parse: [] },
      });

    } catch (error) {
      console.error('Failed to relay to Discord:', error.message);
    }
  }
};
