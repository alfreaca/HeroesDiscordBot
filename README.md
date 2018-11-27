Heroes Discord Bot
=================

This bot is intended for use on the Heroes Discord server and this project contains the main files for said bot.

It is based on the Guidebot by AnIdiotsGuide and uses the discord.js library.

It is hosted for free using glitch.com but keep in mind that it shuts down every 12 hours and then needs to be restarted (can be done automagically).

There are specific files (i.e. the .env file) excluded from GitHub since they contain sensitive information.

-----------------

Here are some useful links that helped me out a lot whilst creating this bot.

-----------------

Very easy and good to get started on something just to gain a slight understanding.
Simple Bot Creation - https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

-----------------

Official Discord sites you will need.
Discord Application Site - https://discordapp.com/developers/applications/
Discord Developer Doc - https://discordapp.com/developers/docs/intro

To add a bot to server get your client id and desired permission level from the discord application site.
Sample Invite URL -  https://discordapp.com/oauth2/authorize?&client_id=012345678901234567&scope=bot&permissions=0

-----------------

The documentation of the library this bot uses.
Discord.js Doc - https://discord.js.org/#/docs/main/stable/general/welcome

The most used classes in the library.
Discord.js Message class - https://discord.js.org/#/docs/main/stable/class/Message
Discord.js Member class - https://discord.js.org/#/docs/main/stable/class/GuildMember
Discord.js TextChannel class - https://discord.js.org/#/docs/main/stable/class/TextChannel
Discord.js Server class - https://discord.js.org/#/docs/main/stable/class/Guild

-----------------

This is what the bot is currently based on.
The Guidebot - https://github.com/AnIdiotsGuide/guidebot

This is what I might switch to since it doesn't use Enmap.
abcdan bot.js - https://github.com/abcdan/bot.js/

-----------------

About glitch.com

Glitch is a free website that allows you to create node.js based applications and run them online. Meaning that you can run a node based discord bot on it.
(There seems to also be some way of running python on their site but as far as I could tell that is in beta.)
Glitch will automatically shutdown a project that isn't in use after 5 minutes, but by pinging the projects URL you can keep it alive for up to 12 hours. After that it will force a shutdown. However simply pinging the URL again will revive it and the project will continue working as before.

Glitch is set up to read specific entries from the package.json on startup and will start any files you have configured there.
Since Glitch autosaves everything and then restarts, which is pretty bad for a discord bot, the timer is modified in the watch.json file.

-----------------

How to get the bot running on your local PC.

This is way more complicated than I would like since it requires you to install all of the node packages you use in your project, which you install using node package manager.

1. Install node.js on your PC from their website https://nodejs.org/en/download/
2. Open console in the bots main directory
3. Run "npm install" for all used packages.
    These should be most of them (if in doubt look at the package.json depencencies):
      discord.js
      chalk
      moment
      moment-duration-format
      express
      ontime
      sequelize
      sqlite3
      request

      enmap
      enmap-sqlite
      (Enmap requires special treatment because it is a bitch.)

4. Enmap special treatment
    I don't even know if this works at the moment since they updated the package after I installed it and stuff seems to be messed up.
    https://enmap.evie.codes/install

5. Run "node mainbot.js" to start the bot

-----------------

As mentioned the .env file is excluded in GitHub. It contains the bots authentication token, glitch URL and a few Discord IDs, that I don't wish to share with the interwebz.
