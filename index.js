var app = require('express');
var express = app();
var http = require('http').Server(express);
var io = require('socket.io')(http);

express.use(app.static('app'));

//Username
var users = [];

//Channels

var channels = ['chan1', 'chan2', 'chan3', 'chan4']; 

express.get('/', function(req, res){
  res.sendFile(__dirname + '/app/templates/pages/dashboard.html');
});

express.get('/channel', function(req, res){
	res.sendFile(__dirname + '/app/templates/pages/');
});

io.on('connection', function(socket){
  socket.on('adduser', function (value){

  	socket.pseudo = value;
  	console.log(socket.pseudo);

  	socket.channel = channels[0]; 
  	user = {
  		id: socket.id,
  		name: value,
  		channel: channels[0],
  	};
  	users.push(user);

  	socket.join('chan1');

  	socket.emit('updatechat', 'SERVER', 'vous êtes connecté au chan1');

  	socket.broadcast.to('chan1').emit('updatechat', 'SERVER', socket.pseudo + " s'est connecté au chan1" );
	//socket.emit('updatechan', channels, 'chan1');
  });	

  socket.on('edit name', function (value){
  	var str2 = value.replace(/\s+/g, '');
  	var str = "/nick";

  	var start = str.length;
  	//console.log(start);
  	var cut = str2.substr(start);
  	socket.pseudo = cut;

  	console.log('change: ', socket.pseudo);

  });

  socket.on('list users', function (){
  	//var userList = io.sockets.clients(socket.channel);
  	//var currentChan = io.sockets.adapter.rooms[socket.channel];
  	var res = [];
  	io.socket.socket.map(function(user){
  		res.push(user);
	});
  	return res;
  	/*for (var i = 0; i < users.length; i++) {
  		if (users[i.channel] == socket.channel) {
  			res.push(users[i]);
  		};
  	};
  	return res;*/
	
  });   

  socket.on('chat message', function(msg){
    io.emit('chat message', socket.username + " dit: " + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});