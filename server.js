// server.js

//Additional server that I needed to test if my bot was IP banned...
//Turns out the server it was running on was...
//That was confusing...


// init project
var express = require('express');
var app = express();

var request = require('request');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('web/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/web/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


const http = require('http');
app.get("/wake", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
//setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/wake`); }, 280000);


var discordapi = request('http://discordapp.com/api/v7/gateway', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});


var ipapi = request('http://api.myip.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
