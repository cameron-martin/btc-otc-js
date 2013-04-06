var /*nickserv = require('nickserv'),*/
        irc = require('irc');
        
        

var client = new irc.Client('irc.freenode.net', 'nodebot3', { channels: ['#bitcoin-otc'] });

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.addListener('pm', function(from, text, message) {
  console.log('PM from '+from+': '+text);
});

client.connect(function() {
  console.log('Connected');
  client.say('#bitcoin-otc', 'Test post');
  /*
  nickserv.create(client);


  client.nickserv.register('password123', 'rottenrogue@veryrealemail.com', function(err) {
    console.log(err);
    console.log('Registered nick');
  });
  */
});