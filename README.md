<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-URL]
[![Forks][forks-shield]][forks-URL]
[![Stargazers][stars-shield]][stars-URL]
[![Issues][issues-shield]][issues-URL]
[![MIT License][license-shield]][license-URL]

<!-- PROJECT LOGO -->
<br />
<!-- <div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">SL Discord Relay Bot</h3>

  <p align="center">
A Discord and Second Life bot capable of relaying messages between inworld Second Life Groups, and Discord Channels. 
    <br />
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
A Discord and Second Life bot capable of relaying messages between inworld Second Life Groups, and Discord Channels, supports (theoretically) as many groups as second life allows(42 for normal accounts, 70 for premium, 140 for premium plus). This has **NOT** been tested with more than 10 groups, your available memory(ram) is also a limitation.

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) --> 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
  [![NodeJS-Icon]][NodeJs-URL]
  [![NPM-icon]][NPM-URL]
  [![JavaScript-Icon]][JavaScript-URL]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* The Latest NPM:
  ```sh
  npm install npm@latest -g
  ```
*  Node:
    * Refer to [Installing Node.js](https://nodejs.org/en/download/current) 
    *  If you are confused [Installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is a good place to start. 
*  A Discord Bot Token:
    * Refer to [This Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) if you are not sure how to do this.
* Discord Channel ID:
    * This is a good [video](https://www.youtube.com/watch?v=NLWtSHWKbAI)
* Second Life Group UUID:
    * [This](https://community.secondlife.com/forums/topic/358216-how-doi-find-a-group-uuid-key/) SL Forums explains how
    * In world the bot must be in the groups you want it to relay.
* Add your bot to a discord server using this link(add your CLIENT ID from your bot where specified)
    * https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=137976335360
    * This gives the bot the following permissions: View Channels, Manage Webhooks, Send Messages, Embed Links, Use External Stickers and Emojis, Mention All Roles, and Read Message History.
    * Visit this [link](https://support-dev.discord.com/hc/en-us/articles/360028717192-Where-can-I-find-my-Application-Team-Server-ID) to find out how to get your CLIENT ID. 
    * Discord may refer to **Client ID** as **Application ID**, its the same thing.
* Add your Second Life Bot account(**NOT YOUR ACCOUNT, THE BOTS!**) to all the groups you want to relay. Make sure it has Join Chat enabled!

## Installation

1. Clone the repo and open the repository folder:
   ```sh
   git clone https://github.com/redrobotsl/discord-sl-chat-relay.git && cd discord-sl-chat-relay
   ```
2. Run npm install in the folder:
   ```sh
   npm install --no-dev
   ```
3. Copy the `.env-example` to `.env`:
    ```sh
    cp .env-example .env
    ```
4. Copy `config.js.example` to `config.js`:
    ```sh 
    cp config.js.example .config.js
     ```
5. Fill out `.env` with the required environment variables:
   ```ini
   DISCORD_TOKEN= 
   OWNER= 
   SL_FIRSTNAME= 
   SL_LASTNAME= 
   SL_PASSWORD= 
   SL_START=
   ```
6. Edit `config.js` to map the inworld group UUIDS to the Discord Channel IDS:
   ```js
    relays: new Map([
     ["SL GROUP UUID", "DISCORD CHANNEL ID"] // For just one group no comma after the bracket
    ]),
   ```

   For Multiple:
    
 
    ```js
	relays: new Map([
	 ["SL Group UUID", "Discord Channel ID"], // For Multiple relays you need a comma after each bracket but the last one
	 ["SL Group UUID", "Discord Channel ID"], // For Multiple relays you need a comma after each bracket but the last one
	 ["SL Group UUID", "Discord Channel ID"], // For Multiple relays you need a comma after each bracket but the last one
	 ["SL Group UUID", "Discord Channel ID"], // For Multiple relays you need a comma after each bracket but the last one
	 ["SL Group UUID", "Discord Channel ID"], // For Multiple relays you need a comma after each bracket but the last one
	 ["SL Group UUID", "Discord Channel ID"] //  No Comma After the final bracket.
	 ]),
   ```

7. Start the bot using:
 
   ```sh
   node index.js
   ```

8. Invite the bot to your server:  
    * [Here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) is how to do it
  

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add Region Restart Evasion with Fallback Regions in the Config File
    - On Region Restart notice, teleport to a fallback region, as well as on login, if can't login to the main region, teleport to a fallback region, don't want your bots sticking around somewhere you don't want it
- [ ] Add Reload Capability of SL and Discord Commands/Event files.

See the [open issues](https://github.com/redrobotsl/discord-sl-chat-relay/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. 
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

* CasperTech for their implementation of the SL Client in Node.js https://github.com/CasperTech/node-metaverse
<!-- * []() --> 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/redrobotsl/discord-sl-chat-relay.svg?style=for-the-badge
[contributors-URL]: https://github.com/redrobotsl/discord-sl-chat-relay/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/redrobotsl/discord-sl-chat-relay.svg?style=for-the-badge
[forks-URL]: https://github.com/redrobotsl/discord-sl-chat-relay/network/members
[stars-shield]: https://img.shields.io/github/stars/redrobotsl/discord-sl-chat-relay.svg?style=for-the-badge
[stars-URL]: https://github.com/redrobotsl/discord-sl-chat-relay/stargazers
[issues-shield]: https://img.shields.io/github/issues/redrobotsl/discord-sl-chat-relay.svg?style=for-the-badge
[issues-URL]: https://github.com/redrobotsl/discord-sl-chat-relay/issues
[license-shield]: https://img.shields.io/github/license/redrobotsl/discord-sl-chat-relay.svg?style=for-the-badge
[license-URL]: https://github.com/redrobotsl/discord-sl-chat-relay/blob/master/LICENSE
[JavaScript-Icon]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-URL]: https://www.javascript.com/
[NPM-Icon]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white 
[NPM-URL]:  https://www.npmjs.com/
[NodeJs-Icon]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-URL]: https://nodejs.org/en
