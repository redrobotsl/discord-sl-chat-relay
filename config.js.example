const { Intents } = require("discord.js");

/* config */
const config = {
  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],
  // To be implemented, fallback regions if the .env main region can't be reached. 
  fallbackRegions: new Map([
    ["regioname", "uri"]
  ]),

  ////// This maps inworld group UUIDs to Discord Channels. 
   relays: new Map([
    ["6948be72-bed2-8e8a-cb68-ae7104b73b75", "950236448156692530"], // Fox Hollow
    ["650509ad-7e70-0ec7-ed2a-39545ab9ab87", "950414366308708423"], // Fox Hollow Roleplay
    ["18f2cf1d-7b12-f8ff-9b54-9f3123f4c784", "950525543370067998"],  // Foxwood Academy
    ["7e3b3cba-c9bd-b389-b9a7-a4058ba8b9ea", "949477291501703219"], // JF I
    ["7a998f53-2f6a-144b-e7bb-42aa29be3a5a", "950525975106568232"]// Foxwood Academy PTO
  ]),
// Array of SL UUIDs to Ignore and not relay, say if you have a bot that regularly posts in group chat or something. 
  "ignored": [],
  /*
  * Intents the bot needs.
  * By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
  * For join messages to work you need Guild Members, which is privileged and requires extra setup.
  * For more info about intents see the README.
  */
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES ],
  // Partials your bot may need should go here, CHANNEL is required for DM's
  partials: ["CHANNEL"],

  /*
  * Default per-server settings. These settings are entered in a database on first load, 
  * And are then completely ignored from this file. To modify default settings, use the `conf` command.
  * DO NOT REMOVE THIS BEFORE YOUR BOT IS LOADED AND FUNCTIONAL.
  */
  "defaultSettings" : {
    "prefix": "~",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permission level, this is for users without a role.
    { level: 0,
      name: "User", 
      /*
      * Don't bother checking, just return true which allows them to execute any command their
      * level allows them to.
      */
      check: () => true
    },
//// Level 3 and Level 2 Perm Levels reserved for Moderator and Administrator roles if ever needed. 
    
    // This is the server owner.
    { level: 4,
      name: "Server Owner", 
      /*
      * Simple check, if the guild owner id matches the message author's ID, then it will return true.
      * Otherwise it will return false.
      */
      check: (message) => {
        const serverOwner = message.author ?? message.user;
        return message.guild?.ownerId === serverOwner.id;
      }
    },
    
    /*
    * Bot Support is a special in between level that has the equivalent of server owner access
    * to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    */
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => {
        const botSupport = message.author ?? message.user;
        return config.support.includes(botSupport.id);
      }
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => {
        const botAdmin = message.author ?? message.user;
        return config.admins.includes(botAdmin.id);
      }
    },
    
    /*
    * This is the bot owner, this should be the highest permission level available.
    * The reason this should be the highest level is because of dangerous commands such as eval
    * or exec (if the owner has that).
    * Updated to utilize the Teams type from the Application, pulls a list of "Owners" from it.
    */
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to a list of owners found in the bot application.
      check: (message) => {
        const owner = message.author ?? message.user;
        return owner.id === process.env.OWNER;
      }
    }
  ]
};

module.exports = config;
