
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
	
  var arg0 = args[0].toLowerCase();
  
  if(arg0 === 'add' && args[1] !== null){
    
    var identifierarg = args[1].toLowerCase();
    
    var tagrole = message.mentions.roles.first();
    var reqrole = message.mentions.roles.last();
    
    if(!tagrole || !reqrole) return message.reply('Role(s) not found.');
    
    var servernotifytable = getTable(client, message, notifydb);

    servernotifytable.sync();
    servernotifytable.create({ identifier: identifierarg, tagroleid: tagrole.id, reqroleid: reqrole.id });
    
    return message.reply(`Added [ ${identifierarg} with Taggable Role: ${tagrole} - Required Role: ${reqrole} ] to DB.`);
    
  }
  
  else if(arg0 === 'list'){
    
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
  
  else if(arg0 === 'delete' && args[1] !== null){
    
    var identifierarg = args[1].toLowerCase();
    
    var servernotifytable = getTable(client, message, notifydb);

    servernotifytable.sync();
    
    servernotifytable.destroy({
      where: {
        identifier: identifierarg
      }
    });
    
    return message.reply('Deleted any matching entries.');
    
  }
  
  else if(arg0 === 'deleteall'){
    
    var servernotifytable = getTable(client, message, notifydb);

    servernotifytable.sync({force: true});
    return message.reply('Deleted all entries and reset the DB.');
    
  }
  
  else return message.reply('Invalid arguments.');
  
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Server Owner"
};

exports.help = {
	name: "setnotify",
	category: "Role Management",
	description: "Configure Notification command. Roles have to be mentionable only to set up at first.",
	usage: "setnotify [add] [indentifier] [taggable role] [required role] \n\t\tsetnotify [list/deleteall] \n\t\tsetnotify [delete] [identifier] \n\nThe identifier is a single word that will be used as an argument in the notify command."
};
