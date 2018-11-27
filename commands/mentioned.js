
//Rest of code in ./events/message.js.

const { RichEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
  
	const memberMike = message.guild.members.find(m => m.user.id === process.env.USER_DISCORD_ID_MIKE);
	if(memberMike !== null) {
    const hasMikeMention = message.mentions.users.find(u => u.id === process.env.USER_DISCORD_ID_MIKE);
    if(hasMikeMention === memberMike.user) {
      const embed = new RichEmbed()
        .setTitle(`${memberMike.nickname || memberMike.user.username} says`)
        .setColor(0xFF0000)
        .setImage('https://cdn.glitch.com/878fe048-29ab-45e6-aeb4-620e4cadb3b0%2Fwhopingedme.gif');
      message.author.send(embed);
      client.logger.log(`Sent \'Who pinged me gif\' to ${message.author.username} because of a Mike mention.`);
    }
  }
  
  const memberPip = message.guild.members.find(m => m.user.id === process.env.USER_DISCORD_ID_PIP);
	if(memberPip !== null) {
    const hasPipMention = message.mentions.users.find(u => u.id === process.env.USER_DISCORD_ID_PIP);
    const hasPipRoleMention = message.mentions.roles.find(r => memberPip.roles.has(r.id));
    if(hasPipMention === memberPip.user || hasPipRoleMention !== null) {
      const embed = new RichEmbed()
        .setTitle(`${memberPip.nickname || memberPip.user.username} says`)
        .setColor(0xFF0000)
        //.setImage('https://cdn.glitch.com/878fe048-29ab-45e6-aeb4-620e4cadb3b0%2FDont_ping_me.jpg');
        //.setImage('https://cdn.discordapp.com/attachments/426003478738108436/502133080186683392/Communist_Dont_Ping_me.jpg');
        .setImage('https://cdn.glitch.com/878fe048-29ab-45e6-aeb4-620e4cadb3b0%2FCommunist_Dont_Ping_me.png');
      message.channel.send(embed);
      client.logger.log(`Sent \'Dont ping me Pic\' in ${message.channel.name} because of a Pip mention.`);
      
      memberPip.user.send('NIGGAFAGGOT');
      
    }
  }
  
  const memberAimee = message.guild.members.find(m => m.user.id === process.env.USER_DISCORD_ID_AIMEE);
	if(memberAimee !== null) {
    const hasAimeeMention = message.mentions.users.find(u => u.id === process.env.USER_DISCORD_ID_AIMEE);
    if(hasAimeeMention === memberAimee.user) {
      const embed = new RichEmbed()
        .setTitle(`${memberAimee.nickname || memberAimee.user.username} says`)
        .setColor(0xFF0000)
        .setImage('https://cdn.glitch.com/878fe048-29ab-45e6-aeb4-620e4cadb3b0%2Fsupermom.gif');
      message.channel.send(embed);
      client.logger.log(`Sent \'Super Mom Gif\' in ${message.channel.name} because of an Aimee mention.`);
    }
  }
  
  
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Bot Owner"
};

exports.help = {
	name: "mentioned",
	category: "Miscelaneous",
	description: "Checks messages for mentions.",
	usage: " none "
};
