// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
	
	// It's good practice to ignore other bots and itself and not get into a spam loop ("botception").
	if (message.author.bot) return;

  // exclude update channel
  if(message.channel.id === '376019692575391754') return;
  
	// Grab the settings for this server from Enmap. (Or default Configs)
	const settings = message.settings = client.getGuildSettings(message.guild);

	// Checks if the bot was mentioned, with no message after it, returns the prefix.
	const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
	if (message.content.match(prefixMention)) {
		return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
	}

  
	// Check every message for specific content
	const hasUserMentions = message.mentions.users.first();
  const hasRoleMentions = message.mentions.roles.first();
	
	if(hasUserMentions !== undefined || hasRoleMentions !== undefined){
		const command = 'mentioned';
		const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
		const args = undefined;
		const level = client.permlevel(message);
		client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
		cmd.run(client, message, args, level);
	}
	
  // Aimee challenged me.
  //if(message.author.id === process.env.USER_DISCORD_ID_AIMEE) message.author.send('But you are to nice to insult...');
  
	
	// Also good practice to ignore any message that does not start with our prefix.
	if (message.content.indexOf(settings.prefix) !== 0) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// If the member on a guild is invisible or not cached, fetch them.
	if (message.guild && !message.member) await message.guild.fetchMember(message.author);

	// Get the user or member's permission level from the elevation
	const level = client.permlevel(message);

	// Check whether the command, or alias, exist in the collections defined in app.js.
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	// using this const varName = thing OR otherthing; is a pretty efficient and clean way to grab one of 2 values!
	if (!cmd) return;

	// Some commands may not be useable in DMs. This prevents those from running and says no to that bitch.
	if (cmd && !message.guild && cmd.conf.guildOnly)
		return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

	if (level < client.levelCache[cmd.conf.permLevel]) {
		if (settings.systemNotice === "true") {
			return message.channel.send(`You do not have permission to use this command.
		Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
		This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
		} else {
			return;
		}
	}

	// To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
	// The "level" command module argument will be deprecated in the future.
	message.author.permLevel = level;

	message.flags = [];
	while (args[0] && args[0][0] === "-") {
		message.flags.push(args.shift().slice(1));
	}
	// If the command exists, **AND** the user has permission, run it.
	client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
	cmd.run(client, message, args, level);
};
