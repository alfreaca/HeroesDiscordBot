
const { RichEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
  if (!args[0]) {
		message.channel.send('No given argument.');
	} else {
		
		if (args[0] === 'nudes') {
      
			message.reply('I sent you the picture.');
			message.author.send(message.author.avatarURL);
		
    } /*else if (args[0] === 'embed') {
		
      // Read more about all that you can do with the RichEmbed constructor
			// over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
			const embed = new RichEmbed()
				.setTitle('A slick little embed')
				.setColor(0xFF0000)
				.setDescription('Hello, this is a slick embed!');
			message.author.send(embed);
		
    } */else {
		
      message.channel.send('Please specify a valid argument.');
		
    }
	}
	
	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "send",
	category: "Miscelaneous",
	description: "It sends you Stuff as a private message.",
	usage: "send [nudes]"
};
