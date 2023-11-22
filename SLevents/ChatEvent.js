/* eslint-disable no-unused-vars */
const { permlevel,
} = require('../modules/functions.js');
const config = require('../config.js');
const nmv = require('@caspertech/node-metaverse');
const { MessageEmbed, WebhookClient } = require('discord.js');
// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const { UUID } = nmv.UUID;
module.exports = async (client, ChatEvent) => {
	const SLbot = client.container.SLbot;
	const currentBot = process.env.SL_FIRSTNAME + ' ' + process.env.SL_LASTNAME;

};