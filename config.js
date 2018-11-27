
//Config File for bot
const config = {
	// Bot Owner, level 10 by default. The owners discord user ID.
	"ownerID": process.env.USER_DISCORD_ID_MIKE,
	// Bot Admins, level 9 by default. Array of user ID strings.
	"admins": [process.env.USER_DISCORD_ID_MOCAP],
	// Bot Support, level 8 by default. Array of user ID strings
	"support": [],

	// Your Bot's Token. Available on https://discordapp.com/developers/applications/me
	"token": process.env.TOKEN,
	
	// Default per-server settings. New guilds have these settings. 
	"defaultSettings" : {
		"prefix": "-",
		"modLogChannel": "mod-log",
		"modRole": "Viceroys of Justice(Mods)",
		"adminRole": "The Protectors (Admins)",
		"systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
		"welcomeChannel": "welcome",
		"welcomeMessage": "Say Hello World to {{user}}! ...uhhh... I mean System.out.println(\"Hello World\"!);",
		"welcomeEnabled": "false"
	},
	
	// PERMISSION LEVEL DEFINITIONS.
	permLevels: [
		// This is the lowest permisison level, this is for non-roled users.
		{ 	level: 0,
			name: "User", 
			// Don't bother checking, just return true which allows them to execute basic commands.
			check: () => true
		},
    
    //space to add more inbetween user and mod for more customisable access to commands

		// Permission level for server moderators should always be above the rest of the roles.
		{ 	level: 3,
			name: "Moderator",
			// Will only allow command execution if check returns true.
			check: (message) => {
				try {
					const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
					if (modRole && message.member.roles.has(modRole.id)) return true;
				} catch (e) {
					return false;
				}
			}
		},

		// Permission level for server admin.
		{ 	level: 4,
			name: "Administrator", 
			check: (message) => {
				try {
					const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
					return (adminRole && message.member.roles.has(adminRole.id));
				} catch (e) {
					return false;
				}
			}
		},
		
		// Permission level for server owner.
		{ 	level: 5,
			name: "Server Owner", 
			// Simple check, if the guild owner id matches the message author's ID.
			check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
		},

		// Bot Support is a special inbetween level that has the equivalent of server owner access.
		{ 	level: 8,
			name: "Bot Support",
			// The check is by reading if an ID is part of this array.
			check: (message) => config.support.includes(message.author.id)
		},

		// Bot Admin has some limited access like rebooting the bot or reloading commands.
		{ 	level: 9,
			name: "Bot Admin",
			check: (message) => config.admins.includes(message.author.id)
		},

		// Highest permission level available FOR OWNER ONLY. Can use dangerous commands like eval and exec.
		{ 	level: 10,
			name: "Bot Owner", 
			// Another simple check, compares the message author id to the one stored in the config file.
			check: (message) => message.client.config.ownerID === message.author.id
		}
	]
};

module.exports = config;
