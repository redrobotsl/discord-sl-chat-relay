// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split('.')[0]) < 16) throw new Error('Node 16.x or higher is required. Update Node on your system.');
require('dotenv').config();

// Load up the discord.js library
const { Client, Collection, Events } = require('discord.js');
// Load Node Meta
const nmv = require('@caspertech/node-metaverse');
// We also load the rest of the things we need in this file:
const { readdirSync } = require('fs');
const { intents, partials, permLevels } = require('./config.js');
const config = require('./config.js');
const logger = require('./modules/Logger.js');
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const packageinfo = require("../package.json");
const client = new Client({ intents, partials });
const slashcmds = new Collection();

const { UUID } = nmv;

const loginParameters = new nmv.LoginParameters();
loginParameters.firstName = process.env.SL_FIRSTNAME;
loginParameters.lastName = process.env.SL_LASTNAME;
loginParameters.password = process.env.SL_PASSWORD;
loginParameters.start = process.env.SL_START;

const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;
const SLbot = new nmv.Bot(loginParameters, options);


// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};


// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
    slashcmds,
    levelCache,
    SLbot,
    nmv,
};

const GroupChatEventHandler = require('./SLevents/GroupChat.js');
const ChatEventHandler = require('./SLevents/ChatEvent.js');

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {


    client.container.SLbot.login().then((response) => {
        logger.log('SL: Login Complete', 'log');

        // Establish circuit with region
        return client.container.SLbot.connectToSim();
    }).then(() => {
        logger.log('SL: Connected to Region', 'log');


    }).then(async () => {

        // client.container.SLbot.clientEvents.onGroupChat.subscribe(groupChatEventFile.bind(client));

        client.container.SLbot.clientEvents.onGroupChat.subscribe((eventInfo) => {
            GroupChatEventHandler(client, eventInfo);

        });
        client.container.SLbot.clientEvents.onNearbyChat.subscribe((eventInfo) => {
            ChatEventHandler(client, eventInfo);
        
        });
        // TODO: add mappings for Group Notices


    }).catch((error) => {
        console.error(error);
    });

    // NOW LOADING DISCORD SIDE OF THE BOT

    // Now we load any **slash** commands you may have in the ./slash directory.
    const slashFiles = readdirSync('./DscSlash').filter(file => file.endsWith('.js'));
    for (const file of slashFiles) {
        const command = require(`./DscSlash/${file}`);
        const commandName = file.split('.')[0];
        logger.log(`Loading Slash command: ${commandName}. `, 'log');

        // This is the corrected way to load modern commands.
        // It now checks for the correct 'data' and 'execute' properties.
        if ('data' in command && 'execute' in command) {
            client.container.slashcmds.set(command.data.name, command);
        } else {
            logger.log(`[WARNING] The command at ${commandName}.js is missing a required "data" or "execute" property.`, 'error');
        }
    }

    // Then we load events, which will include our message and ready event.
    const eventFiles = readdirSync('./DscEvents/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const eventName = file.split('.')[0];
        logger.log(`Loading Discord Event: ${eventName}. `, 'log');
        const event = require(`./DscEvents/${file}`);
        // Bind the client to any event, before the existing arguments
        // provided by the discord.js event.
        // This line is awesome by the way. Just sayin'.
        client.on(eventName, event.bind(null, client));
    }

    // --- NEW: Add the interaction handler and ready event ---
    // This event handler is critical for all slash commands.
    client.on(Events.InteractionCreate, async interaction => {
        // If the interaction isn't a slash command, do nothing.
        if (!interaction.isChatInputCommand()) return;

        const command = client.container.slashcmds.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // This logs a message to the console once the bot has successfully logged in.
    client.once(Events.ClientReady, c => {
        const packageinfo = require("./package.json"); 
        const dversion = packageinfo.version;
        const name = packageinfo.name;
        console.log(`Ready! Logged in as ${c.user.tag}`);
        logger.log(`package name: ${name}`);
        logger.log(`package version: ${dversion}`);
    const pkg = require('./package.json');
        Object.entries(pkg.dependencies || {}).forEach(([dep, ver]) => {
            logger.log(`dependency: ${dep}@${ver}`);
        });


    });
    
    // This adds an error listener
    client.on('error', (err) => {
        console.error('Discord.js Error:', err);
    });


    // Here we login the client.
    client.login();


// End top-level async/await function.
};

init();
