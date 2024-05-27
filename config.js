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
		 ["22ca10b6-3ca5-f677-04e4-572b30e6703c", "1179885198675038249"], // Red Robot Main Group (Client: dark.nebula)
                ["1b6af450-96e2-8fad-291c-74fc4928f0b1", "1176644698027331745"],
                ["ced9a7f0-9f9c-de9f-7998-a9470553d0a0", "1174495747702530058"], // Heterocera Equestrian (Client: dark.nebula)
                ["dc3d6223-1569-a0c8-dfdf-781278984752", "1167986074224705536"], // Morgantown Land Group (Client: ozy09)
                ["580d69f5-6382-2053-ed77-9abbbebed200", "1179887813286690927"], // Bridgerton County (Client: josephtucker)
                ["04ed96ac-3e3f-bc88-d6ae-a7576fd5867e", "1061738641736613898"], // Bridgerton County RP Group (Client: josephtucker)
		["0a293f01-534c-4c81-e108-b1d1a6fb4d70", "1221903973561139220"], // Shark County
		["e4e7c3d7-e863-721b-dd45-eabfaf17c2a6", "1225976476491321344"],  // The Mast Yacht Club and Marina
  ["e77b6e9c-d87b-ded2-72e9-dc47010c55e6", "1228507279838547968"], // For Multiple relays you need a comma after each bracket but the last one
    ["05cb8e7d-4ef3-a0c6-30dc-652bc924b191", "1228505866349842482"]		  	 
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
