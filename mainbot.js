
// Main file for bot

// Create web page using express provided by glitch.com
// Could prob actually change this to show discord bot commands or other relevant information
const express = require('express');
const http = require('http');

var app = express();
app.use(express.static('web/public'));
app.get('/', function(request, response) { response.sendFile(__dirname + '/web/views/index.html'); });

var listener = app.listen(process.env.PORT,
                          function() { console.log('Your webapp is running and listening on port ' + listener.address().port); });


if(true) { // just an easy to use turn the bot on or off true false clause


//getting glitch to host your discord bot for you
//https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/other-guides/hosting-on-glitchcom.html

// Make app keep itself alive by calling blank http request every 4 mins 40 secs
app.get("/wake", (request, response) => { /*console.log(Date.now() + " Ping Received from outside source");*/
                                          response.sendStatus(200); });
app.get("/selfwake", (request, response) => { /*console.log(Date.now() + " Ping Received from self");*/
                                          response.sendStatus(200); });
setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/selfwake`); }, 280000);
// Also set uptimerobot to ping (http.../wake) site every 5 mins to check if it is alive or wake it up if it isnt


// ================================================================================


// Create actual discord.js based bot
// Bot based on the https://github.com/AnIdiotsGuide/guidebot Discord GuideBot

// Check for correct node.js version
if (Number(process.version.slice(1).split(".")[0]) < 8)
	throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-sqlite");

// Create the discord bot client
const client = new Discord.Client({ disableEveryone: true });

// Here we load the config file that contains our TOKEN and our PREFIX values.
client.config = require("./config.js");

// Require our logger
client.logger = require("./modules/logger");

// Start by getting some useful functions that we'll use throughout the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Aliases and commands are put in collections where they can be read from, catalogued, listed, etc.
client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome Enhanced Map module, which essentially saves a collection to disk.
// This is great for per-server configs, and makes things extremely easy for this purpose.
client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

// We're doing real fancy nodejs 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.
const init = async () => {

	// Here we load **commands** into memory, as a collection, so they're accessible everywhere.
	const cmdFiles = await readdir("./commands/");
	client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
	cmdFiles.forEach(f => {
		if (!f.endsWith(".js")) return;
		const response = client.loadCommand(f);
		if (response) console.log(response);
	});

	// Then we load events, which will include our message and ready event.
	const evtFiles = await readdir("./events/");
	client.logger.log(`Loading a total of ${evtFiles.length} events.`);
	evtFiles.forEach(file => {
		const eventName = file.split(".")[0];
		client.logger.log(`Loading Event: ${eventName}`);
		const event = require(`./events/${file}`);
		// Bind the client to any event, before the existing arguments provided by the discord.js event.
		client.on(eventName, event.bind(null, client));
	});

	// Generate a cache of client permissions for pretty perm names in commands.
	client.levelCache = {};
	for (let i = 0; i < client.config.permLevels.length; i++) {
		const thisLevel = client.config.permLevels[i];
		client.levelCache[thisLevel.name] = thisLevel.level;
	}

	// Here we login the client.
	client.login(client.config.token)
    .catch( err => { console.log('PROBLEM ON DISCORD LOGIN:   ' + err + ' :  ' + err.message + '    -> Restarting in 3 mins.'); setTimeout(function(){ console.log('SHUTTING DOWN NOW'); process.exit(1); }, 180000); } );

};

init();

} //end if for running bot
