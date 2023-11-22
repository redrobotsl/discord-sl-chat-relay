const { Intents } = require('discord.js');

/* config */
const config = {
	// Bot Admins, level 9 by default. Array of user ID strings.
	'admins': [],

	// Bot Support, level 8 by default. Array of user ID strings
	'support': [],
	// To be implemented, fallback regions if the .env main region can't be reached.
	fallbackRegions: new Map([
		['regioname', 'uri'],
	]),

	// //// This maps inworld group UUIDs to Discord Channels.
	relays: new Map([
		['1b6af450-96e2-8fad-291c-74fc4928f0b1', '1176644698027331745'],
	  ]),
	// Array of SL UUIDs to Ignore and not relay, say if you have a bot that regularly posts in group chat or something.
	'ignored': ['49d6a705-de90-4458-b166-ccf56401053c'],
	/*


Settings for local chat relay
*/
	// Enable Local Chat Relay
	'relayLocal': true,

	// Discord Channel to Relay to
	'relayChannel': '1176658491239305266',
	/*


  * Intents the bot needs.
  * By default GuideBot needs Guilds and Guild Messages to work.
  */
	intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ],
	// Partials your bot may need should go here, CHANNEL is required for DM's
	partials: ['CHANNEL'],


	// PERMISSION LEVEL DEFINITIONS.

	permLevels: [
		// This is the lowest permission level, this is for users without a role.
		{ level: 0,
			name: 'User',
			/*
      * Don't bother checking, just return true which allows them to execute any command their
      * level allows them to.
      */
			check: () => true,
		},

		// This is the server owner.
		{ level: 1,
			name: 'Server Owner',
			/*
      * Simple check, if the guild owner id matches the message author's ID, then it will return true.
      * Otherwise it will return false.
      */
			check: (message) => {
				const serverOwner = message.author ?? message.user;
				return message.guild?.ownerId === serverOwner.id;
			},
		},

		// Bot Admin has some limited access like rebooting the bot or reloading commands.
		{ level: 2,
			name: 'Bot Admin',
			check: (message) => {
				const botAdmin = message.author ?? message.user;
				return config.admins.includes(botAdmin.id);
			},
		},

		/*
    * This is the bot owner, this should be the highest permission level available.
    * The reason this should be the highest level is because of dangerous commands such as eval
    * or exec (if the owner has that).
    * Updated to utilize the Teams type from the Application, pulls a list of "Owners" from it.
    */
		{ level: 10,
			name: 'Bot Owner',
			// Another simple check, compares the message author id to a list of owners found in the bot application.
			check: (message) => {
				const owner = message.author ?? message.user;
				return owner.id === process.env.OWNER;
			},
		},
	],
};

module.exports = config;
