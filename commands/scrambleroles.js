
var Sequelize = require('sequelize');

// ------------------- 

const scrambleroledb = new Sequelize('scrambleroledb', process.env.DB_USER, process.env.DB_PASS, {
                        host: '0.0.0.0',
                        dialect: 'sqlite',
                        pool: {
                          max: 5,
                          min: 0,
                          idle: 10000
                        },
                        storage: '.data/discordscrambleroledb.sqlite'
                      });

function getTable(client, message, db){
  db.authenticate()
      .then(() => { client.logger.log('Connection was established successfully.'); })
      .catch(err => {return client.logger.error('Unable to connect to the database:', err); });

  var serverscrambleroletable = db.define('table' + message.guild.id + 'scramblerole', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      startroleid: { type: Sequelize.STRING },
      endroleid: { type: Sequelize.STRING }
    } , { 
      timestamps: true
  } );
  
  return serverscrambleroletable;
}

// ------------------- 

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
  var arg0 = args[0].toLowerCase();
  
  if(arg0 === 'rotate') {
    
    var serverscrambleroletable = getTable(client, message, scrambleroledb);

    serverscrambleroletable.sync();
    
    serverscrambleroletable.findAll().then(function(entries) {
      var srb;
      var erb;
      entries.forEach(function(singleentry) {
        srb = message.guild.roles.find(r => r.id === singleentry.startroleid);
        erb = message.guild.roles.find(r => r.id === singleentry.endroleid);
      });
      // so when you change the position of a role to X then the roles from the now free Slot up to the Slot X to be taken will shift into the 'empty' space
      if(!srb) return message.reply('DB is empty. Use the set argument first.');
      var startrole = message.guild.roles.find( role => role.position === (srb.position - 1) );
      if(!startrole) return message.reply('Something went wrong.');
      startrole.setPosition( erb.position + 1 ).then( updated => message.reply(`Changed Role position of ${updated.name} to ${updated.position}`) );
    });
    
    return; 

  }
  else if(arg0 === 'reset') {
    
    var serverscrambleroletable = getTable(client, message, scrambleroledb);


    serverscrambleroletable.sync({force:true});
    message.reply('Reset DB.');
    
  }
  else if(arg0 === 'set') { 
    
    var startrole = message.mentions.roles.first();
    var endrole = message.mentions.roles.last();
    
    if(!startrole || !endrole) return message.reply('Role(s) not found.');
    if(startrole.id === endrole.id) return message.reply('Start and Endrole are the same.');
    
    if(startrole.position - 1 <= endrole.position + 1) return message.reply('There should be at least 2 roles between the Start and Endrole.');
    if(!startrole.editable || !endrole.editable) return message.reply('Roles not editable by client. (Higher than this Bots role)');
    
    var serverscrambleroletable = getTable(client, message, scrambleroledb);

    serverscrambleroletable.sync();
    serverscrambleroletable.create({ startroleid: startrole.id, endroleid: endrole.id });
    
    message.reply(`Roles will be scrambled between ${startrole} (Pos: ${startrole.position}) and ${endrole} (Pos: ${endrole.position}).`);

  }
  else if(arg0 === 'list') {
    
    var serverscrambleroletable = getTable(client, message, scrambleroledb);
    
    serverscrambleroletable.findAll().then(function(entries) {
      var startname = 'null';
      var endname = 'null';
      entries.forEach(function(singleentry) {
        startname = message.guild.roles.find(r => r.id === singleentry.startroleid);
        endname = message.guild.roles.find(r => r.id === singleentry.endroleid);
      });
      message.reply(`Roles to be scrambled are all roles between ${startname} and ${endname}.`);
    });
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
	name: "scrambleroles",
	category: "Role Management",
	description: "Randomly order roles BETWEEN the set start and end roles to display different members each day.",
	usage: "scrambleroles [set] [@startrole] [@endrole] \n\t\tscrambleroles [rotate/list/reset]"
};
