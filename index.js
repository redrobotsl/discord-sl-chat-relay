// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// Load Node Meta
const nmv = require('@caspertech/node-metaverse');
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const  config  = require("./config.js");
const logger = require("./modules/Logger.js");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents, partials });

// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const aliases = new Collection();
const slashcmds = new Collection();

const {UUID} = nmv.UUID;

const loginParameters = new nmv.LoginParameters();
loginParameters.firstName = process.env.SL_FIRSTNAME;
loginParameters.lastName = process.env.SL_LASTNAME;
loginParameters.password = process.env.SL_PASSWORD;
loginParameters.start = process.env.SL_START;

const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;
const SLbot     = new nmv.Bot(loginParameters, options);


// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  aliases,
  slashcmds,
  levelCache,
  SLbot, 
  nmv
};

const GroupChatEventHandler = require("./SLevents/GroupChat.js");

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {


  
  client.container.SLbot.login().then((response) =>
{
  logger.log(`SL: Login Complete`, "log");

    //Establish circuit with region
    return client.container.SLbot.connectToSim();
}).then(() =>
{
  logger.log(`SL: Connected to Region`, "log");


}).then(async ()  => {

 //client.container.SLbot.clientEvents.onGroupChat.subscribe(groupChatEventFile.bind(client));

 client.container.SLbot.clientEvents.onGroupChat.subscribe((eventInfo) => {
	GroupChatEventHandler(client, eventInfo)
  
 });




 



}).catch((error) =>
{
    console.error(error);
});




  // Now we load any **slash** commands you may have in the ./slash directory.
  const slashFiles = readdirSync("./DscSlash").filter(file => file.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(`./DscSlash/${file}`);
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
    
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.commandData.name, command);
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./DscEvents/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Discord Event: ${eventName}. 👌`, "log");
    const event = require(`./DscEvents/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }  
/*
  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.
  client.on("threadCreate", (thread) => thread.join());
*/
  // Here we login the client.
  client.login();



// End top-level async/await function.
};

init();
