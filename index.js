var app = require('express');
var express = app();
var http = require('http').Server(express);
var io = require('socket.io')(http);

express.use(app.static('app'));

//Username
var users = [];
var message = [];

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
  	//console.log("avant: ", users);
  	socket.pseudo = value;
  	//console.log(socket.pseudo);

  	socket.channel = channels[0]; 
  	user = {
  		id: socket.id,
  		name: value,
  		channel: [channels[0]],
  		current: channels[0],
  	};
  	users.push(user);

  	//console.log("après :" , users);

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
  	
  	//Update reference object
  	for (var i = 0; i < users.length; i++) {
  		if (socket.id == users[i].id) {
  			users[i].name = socket.pseudo;
  		};
  	};

  	console.log('change: ', socket.pseudo);

  });

  //List user in current channel
  socket.on('list users', function (){
  	var res = [];
	for (var i = 0; i < users.length; i++) {
		if (users[i].current == socket.channel) {
			res.push(users[i]);
			console.log(users[i]);
		};
	};
  	socket.emit('listU', res);
	
  });


  

  //List available channels
  socket.on('list channel', function(data) {
	var res = [];
  	if (data == "/list") {
  		for (var i = 0; i < channels.length; i++) {
  			res.push(channels[i]);
  		};
  	} else {
  		var str2 = data.replace(/\s+/g, '');
  		var str = "/list";

		var start = str.length;
		var cut = str2.substr(start);
		for (var i = 0; i < channels.length; i++) {
			if (channels[i].indexOf(cut) >= 0) {
				res.push(channels[i]);
			};
		};
  	}
  	
  	socket.emit('result channels', res);
  })

  //Join channel
  socket.on('join channel', function(data) {
  	var statut;
  	var str2 = data.replace(/\s+/g, '');
  	var str = "/join";

  	var start = str.length;
  	var cut = str2.substr(start);
  	//join
  	for (var i = 0; i < channels.length; i++) {
  		if(cut === channels[i]) {
  			
  			socket.emit('update channel', cut);
  			
  			return false;
  		} else {
  			statut = "pas cool";
  		}
  		
  	};
  	  	
  })

  //update channel reference
  socket.on('update', function(data){
  	var statut;
  	for (var i = 0; i < users.length; i++) {
  	//update reference object
  		if (socket.id == users[i].id && users[i].channel[i] != data) {
  			users[i].channel.push(data);
  			users[i].current = data;
  			socket.join(data);
  			socket.channel = data;
  			statut = "cool";
  			socket.emit('result join', statut, socket.channel);
 		} else {
 			console.log("nope");
 			statut = "pas cool";
 		}
  	};
  	console.log('tab: ', users);
  })

  //Leave channel
  socket.on('leave channel', function(data){
  	var str2 = data.replace(/\s+/g, '');
  	var str = "/part";

  	var start = str.length;
  	var cut = str2.substr(start);
  	var statut;
  	socket.leave(socket.channel);
  	statut = "success";
  	socket.emit('result leave', statut);

  })

  //send messages to specific user
  socket.on('msg user', function(data) {
  	//var str2 = data.replace(/\s+/g, '');
  	//var "/msg ";

  	if (data.substr(0, 5) === "/msg ") {
  		data = data.substr(5);
  		var val = data.indexOf(" ");
  		
  		if (val != -1) {
  			var nom = data.substring(0, val);
			var msg = data.substring(val + 1);  		
  		};	
  	};

  	
  	
  	console.log("nom: ", nom);
  	console.log("msg: ", msg);
  	for (var i = 0; i < users.length; i++) {
  		if (socket.channel == users[i].channel[i] && nom == users[i].name ) {
  			var mesu = users[i].name;
  			mesu.io.socket.emit('send user', socket.pseudo + " to " + name + ": " + msg);
  		};
  	};

  })

  //Send message
  socket.on('chat message', function(msg){
    io.emit('chat message', socket.pseudo + " dit: " + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});