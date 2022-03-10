# SL Discord Relay Bot

A Discord and Second Life bot capable of relaying messages between inworld Second Life Groups, and Discord Channels, supports (theoretically) as many groups as the second life allows(42 for normal accounts, 70 for premium). This has not been tested with more than 10 groups, your available memory is also a limitation. 



## Install 

- Clone a copy of the repository to your machine 
- Run npm install on the folder
- Copy .env and config.js example files to .env and config.js
- Insert the Discord Bot Token and Second Life Login Info in .env
- Insert the Mapping of SL Groups to Discord Channels in config.js
- If needed, add the ignored listings to the config file as well. 

```bash
git clone github.com/redrobotsl/sl-discord-relay.git
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
