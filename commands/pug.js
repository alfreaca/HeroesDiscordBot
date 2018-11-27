
var amountrun = 0;
var lastTime = 1539079089629; //No, this number has no special purpose.
const confirmRequest = 'Are you sure that you want to send it? \n\n\tBE AWARE THAT PEOPLE GET VERY ANNOYED BY UNNECESSARY PINGS. \n\nIf you are sure that you want to send it then \nreply with yes in THIS channel in the next 30 secs to confirm.';
  
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
	let hostrole = message.member.roles.find(r => r.name.toLowerCase() === 'host');
	if(hostrole === null) return message.author.send('You do not have the host role.');
	
	//if(!args[0]) return message.channel.send('No role provided.');
	
	if(!args[0]) return message.author.send('No attached message.');
	
	let pugrole = message.guild.roles.find(r => r.name.toLowerCase() === 'pug');
	if (pugrole === null) return message.author.send('Pugrole not found');

  if(amountrun >= 3) return message.author.send('Pug command was already executed 3 times today. Basically no. Go ask Mike or MoCap if you think that you arent going to annoy anyone.');
  
  let currentTime = (new Date()).getTime();
  if( currentTime - lastTime < 2700000 ) return message.author.send('Only ' + Math.floor((currentTime - lastTime) / 60000) + ' mins have passed since last use. At least 45 mins have to pass between uses.');
  
  if(amountrun === 2) {
    let check = await message.author.send(confirmRequest);

    const filter = m => m.content.toLowerCase() === 'yes';
    let col = check.channel.createMessageCollector( filter, { time: 30000 } );

    col.on('collect', function(){ check.channel.send('Confirmed.'); col.stop(); 
                                
                                //possibly change this to guild.owner.user
                                const userMoCap = message.guild.members.find(m => m.user.id === process.env.USER_DISCORD_ID_MOCAP).user || 'MoCap';

                                const msgAppendix = `[Only members with the ${hostrole} role can announce pugs. They are here to help, so if you have any complaints or questions don\'t hesitate to` + 
                                                    ` tell them or talk to ${userMoCap} for issues regarding any ${hostrole}.] \nInvite for your friends: https://discord.gg/rsD2ayx `;
                                pugrole.setMentionable(true);
                                setTimeout(function(){ message.channel.send(
                                  `${pugrole} Message sent by ${message.author}: \n ${args.join(' ')} \n\n${msgAppendix}`
                                  , { disableEveryone: true } ); }, 2000);
                                setTimeout(function(){ pugrole.setMentionable(false) }, 4000);

                                message.delete(2000);
                                amountrun += 1;
                                lastTime = currentTime;
  
                                } );
    col.on('end', function(){ check.channel.send('Message Collector was closed.'); } );
  }
  else {
    //possibly change this to guild.owner.user
    const userMoCap = message.guild.members.find(m => m.user.id === process.env.USER_DISCORD_ID_MOCAP).user || 'MoCap';

    const msgAppendix = `[Only members with the ${hostrole} role can announce pugs. They are here to help, so if you have any complaints or questions don\'t hesitate to` + 
                        ` tell them or talk to ${userMoCap} for issues regarding any ${hostrole}.] \nInvite for your friends: https://discord.gg/rsD2ayx `;
    pugrole.setMentionable(true);
    setTimeout(function(){ message.channel.send(
      `${pugrole} Message sent by ${message.author}: \n ${args.join(' ')} \n\n${msgAppendix}`
      , { disableEveryone: true } ); }, 2000);
    setTimeout(function(){ pugrole.setMentionable(false) }, 4000);
    
    message.delete(2000);
    amountrun += 1;
    lastTime = currentTime;
  
  }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "pug",
	category: "Role Management",
	description: "Notification command for pugs.",
	usage: "pug [attached message]"
};
