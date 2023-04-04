# SL Discord Relay Bot
[![GitHub issues](https://img.shields.io/github/issues/redrobotsl/sl-discord-relay)](https://github.com/redrobotsl/sl-discord-relay/issues)
[![GitHub forks](https://img.shields.io/github/forks/redrobotsl/sl-discord-relay)](https://github.com/redrobotsl/sl-discord-relay/network)
[![GitHub stars](https://img.shields.io/github/stars/redrobotsl/sl-discord-relay)](https://github.com/redrobotsl/sl-discord-relay/stargazers)
[![GitHub license](https://img.shields.io/github/license/redrobotsl/sl-discord-relay)](https://github.com/redrobotsl/sl-discord-relay/blob/master/LICENSE)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/73735db5bf0a441591c1e312a1ed3b17)](https://www.codacy.com/gh/redrobotsl/sl-discord-relay/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=redrobotsl/sl-discord-relay&amp;utm_campaign=Badge_Grade)


A Discord and Second Life bot capable of relaying messages between inworld Second Life Groups, and Discord Channels, supports (theoretically) as many groups as the second life allows(42 for normal accounts, 70 for premium). This has not been tested with more than 10 groups, your available memory is also a limitation. 



## Install 

- Clone a copy of the repository to your machine 
- Run npm install on the folder
- Copy .env and config.js example files to .env and config.js
- Insert the Discord Bot Token and Second Life Login Info in .env
- Insert the Mapping of SL Groups to Discord Channels in config.js
- If needed, add the ignored listings to the config file as well.
- You should now be able to run the index.js via node index.js and run the bot. 

```bash
git clone https://github.com/redrobotsl/discord-sl-chat-relay.git 
npm install --no-dev
cp .env-example .env
cp config.js.example config.js
```


## Todo
- Add Region Restart Evasion with Fallback Regions in the Config File(On Region Restart notice, teleport to a fallback region, as well as on login, if can't login to the main region, teleport to a fallback region, don't want your bots sticking around somewhere you don't want it)
- Add Reload Capability of SL and Discord Commands/Event files. 



## License

Licensed under the MIT License.

## Credits

- CasperTech for their implementation of the SL Client in Node.js https://github.com/CasperTech/node-metaverse
