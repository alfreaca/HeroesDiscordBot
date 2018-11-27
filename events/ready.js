
var Sequelize = require('sequelize');
var Ontime = require('ontime');

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

function getTable(client, guild, db){
  db.authenticate()
      .then(() => { client.logger.log('Connection was established successfully.'); })
      .catch(err => {return client.logger.error('Unable to connect to the database:', err); });

  var serverscrambleroletable = db.define('table' + guild.id + 'scramblerole', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      startroleid: { type: Sequelize.STRING },
      endroleid: { type: Sequelize.STRING }
    } , { 
      timestamps: true
  } );
  
  return serverscrambleroletable;
}

// ------------------- 

function rotateRoles(client, guild, db) {
  
  var serverscrambleroletable = getTable(client, guild, db);

  serverscrambleroletable.sync();


  serverscrambleroletable.findAll().then(function(entries) {
    var srb;
    var erb;
    entries.forEach(function(singleentry) {
      srb = guild.roles.find(r => r.id === singleentry.startroleid);
      erb = guild.roles.find(r => r.id === singleentry.endroleid);
    });
    // so when you change the position of a role to X then the roles from the now free Slot up to the Slot X to be taken will shift into the 'empty' space
    if(!srb) return client.logger.log('Heroes ScrambleRolesDB is empty. Use the set argument first.');
    var startrole = guild.roles.find( role => role.position === (srb.position - 1) );
    if(!startrole) return client.logger.log('Something went wrong.');
    startrole.setPosition( erb.position + 1 ).then( updated => client.logger.log(`Ontime Event on Heroes Server changed Role position of ${updated.name} to ${updated.position}`) );
  });
  return; 

}

// ------------------- 

module.exports = async client => {
	// Log that the bot is online.
	client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

	// Make the bot "play the game" which is the help command with default prefix.
	client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});
  
  
  
  // Set up daily activities i.e. rotating roles
  if(true) {
    var heroesserver = client.guilds.find(g => g.id === process.env.HEROES_GUILD_ID);
    if(!(!heroesserver)) {
      Ontime({
        cycle: [ '03:45:00' ], //, '17:00:00' , '21:00:00' ], //'10' , '20' , '30' , '40' , '50' , '00' ], //
        utc: true,
        single: true
      }, function (ot) {
        rotateRoles(client, heroesserver, scrambleroledb);
        ot.done();
        return;
      });
    }
  }
  
  
};
