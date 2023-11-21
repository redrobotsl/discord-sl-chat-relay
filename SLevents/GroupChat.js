/* eslint-disable no-unused-vars */
const { permlevel,
} = require('../modules/functions.js');
const config = require('../config.js');
const axios = require('axios').default;
const nmv = require('@caspertech/node-metaverse');
const { MessageEmbed, WebhookClient } = require('discord.js');
// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const { UUID } = nmv.UUID;
module.exports = async (client, GroupChatEvent) => {
	const SLbot = client.container.SLbot;
	// console.log('Group chat: ' + GroupChatEvent.fromName + ': ' + GroupChatEvent.message);
	//   console.log(SLbot);
	//  console.log(client.container);
	const currentBot = process.env.SL_FIRSTNAME + ' ' + process.env.SL_LASTNAME;
	if (GroupChatEvent.fromName === currentBot) return;
	if (config.ignored.includes(GroupChatEvent.from.toString())) return;
	const id = new nmv.UUID(GroupChatEvent.from);
	let img = 'bfc51542-be49-4595-9784-aec1e3f612dc';
	// if (GroupChatEvent.groupID.toString() === config.roleplayUUID) {
	if (config.relays.has(GroupChatEvent.groupID.toString())) {
		try {
			if (GroupChatEvent.message.startsWith('/me')) {
				GroupChatEvent.message = `*${GroupChatEvent.message.replace('/me', '').trim()}*`;
			}
			if (id) {
				try {
					const profile = await axios.get(`http://world.secondlife.com/resident/${id}`);
					img = await profile.data.split('<meta name="imageid" content="')[1].split('">')[0];
				//	console.log("Image UUID Recieved: " + img);
				}
				catch (error) {
					console.error(error);
				}
				finally {
					const channel = client.channels.cache.get(config.relays.get(GroupChatEvent.groupID.toString()));
					try {
						let webhooks = await channel.fetchWebhooks();
						let webhook = webhooks.find(wh => wh.token);
						if (!webhook) {
							await channel.createWebhook('Some-username', {
								avatar: 'https://i.imgur.com/AfFp7pu.png',
							})
								.then(


									webhook => console.log(`Created webhook ${webhook} as there was not one before.`),


								)
								.catch(console.error);

						}
						 webhooks = await channel.fetchWebhooks();
						 webhook = webhooks.find(wh => wh.token);
						await webhook.send({
							content: GroupChatEvent.message,
							username: GroupChatEvent.fromName + ' (inworld)',
							avatarURL: 'https://picture-service.secondlife.com/' + img + '/320x240.jpg',
						});
					}
					catch (error) {
						console.error('Error trying to send a message: ', error);
					}
				}
			}
		}
		catch (error) {
			console.error('Failed to relay to discord.');
			console.error(error);
		}
	}
};