
var Sequelize = require('sequelize');

// ------------------- 

const notifydb = new Sequelize('notifydb', process.env.DB_USER, process.env.DB_PASS, {
                    host: '0.0.0.0',
                    dialect: 'sqlite',
                    pool: {
                      max: 5,
                      min: 0,
                      idle: 10000
                    },
                    storage: '.data/discordnotifydb.sqlite'
                  });

function getTable(client, message, db){
  db.authenticate()
      .then(() => { client.logger.log('Connection was established successfully.'); })
      .catch(err => {return client.logger.error('Unable to connect to the database:', err); });

  var servernotifytable = db.define('table' + message.guild.id + 'notify', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      identifier: { type: Sequelize.STRING },
      tagroleid: { type: Sequelize.STRING },
      reqroleid: { type: Sequelize.STRING }
    } , { 
      timestamps: true
  } );
  
  return servernotifytable;
}

// ------------------- 

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
  if(!args[0]) return message.reply('No identifier.');
  var identifierarg = args[0].toLowerCase();
  
  if(identifierarg === 'list'){
    
    var servernotifytable = getTable(client, message, notifydb);

    servernotifytable.sync();
    
    var notifyentries = [];
    servernotifytable.findAll().then(function(entries) {
      entries.forEach(function(singleentry) {
        let identif = singleentry.identifier;
        let tagrolename = message.guild.roles.find(r => r.id === singleentry.tagroleid).name;
        let reqrolename = message.guild.roles.find(r => r.id === singleentry.reqroleid).name;
        notifyentries.push(identif + ': ' + tagrolename + ' (' + reqrolename + ') ');
      });
      message.reply('Identifiers for Taggable roles (Required roles) are: \n' + notifyentries.join(' | '));
    });
    
    return;
    
  }
  
  if(!args[1]) return message.author.send('No attached message.');
  args.splice(0,1);
  var attachedmessage = args.join(' ');
  
  var servernotifytable = getTable(client, message, notifydb);
  servernotifytable.sync();
  
  servernotifytable.findOne({where: {identifier: identifierarg}})
  .then( function(singleentry) {
    
    if(!singleentry) return message.author.send('Identifier (' + identifierarg + ') not found.');
    
    var tr = singleentry.tagroleid;
    var rr = singleentry.reqroleid;
    
    if(!tr || !rr) return message.author.send('Something weird happened. Were any of the roles deleted?');
    
    var tagrole = message.guild.roles.find(r => r.id === tr);
    var reqrole = message.member.roles.find(r => r.id === rr);
    var reqrolename = message.guild.roles.find(r => r.id === rr).name;
    if(reqrole !== null) {
      
      var additionalinfo = '[These kind of notifications require specific roles to use.]';
      tagrole.setMentionable(true);
      setTimeout(function(){ message.channel.send(`${tagrole} Notification sent by ${message.author}: \n${attachedmessage} \n\n${additionalinfo}`, { disableEveryone: true } ); }, 2000);
      setTimeout(function(){ tagrole.setMentionable(false) }, 4000);
      message.delete(2000);
      
    } else {
      message.author.send(`No. \nYou do not have the required role: ${reqrolename} to do this.`);
    }

  } );
  
  return;
  
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Server Owner"
};

exports.help = {
	name: "notify",
	category: "Role Management",
	description: "Notification command for conditional Tags.",
	usage: "notify [identifier] [attached message] \n\t\tnotify [list]"
};
