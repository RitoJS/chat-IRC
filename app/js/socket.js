$(document).ready(function (){

//init
var socket = io(); 


//Partie messages
    $("#go").click(function() {
		//socket = io.connect('http://localhost:3000');
		console.log("je passe");
		socket.emit('adduser', $('#m').val());
        
        $('#m').val('');
        return false;
    });
    //Keypress
    $('#m').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#go').focus().click();
		}
	});
    socket.on('chat message', function(msg){
        $('#you').append($('<p>').text(msg));
    });

//Partie task
	
	$("#request").click(function() {
		var value = $("#task").val();
		if (value.indexOf("/nick") >= 0) {
			
			if (value != "/nick") {
				rename(value);
			} else {
				socket.emit('chat message', $('#task').val());
				$('#task').val('');
				return false;
			}

		} else if (value.indexOf("/list") >= 0) {

				list(value);

		} else if (value.indexOf("/join") >= 0) {
			
			if (value != "/join" ) {
				joinChan(value);
			} else {
				socket.emit('chat message', $('#task').val());
				$('#task').val('');
				return false;
			}

		} else if (value.indexOf("/part") >= 0) {
			
			if (value != "/part") {
				part(value);
			} else {
				socket.emit('chat message', $('#task').val());
				$('#task').val('');
				return false;
			}

		} else if (value === "/users") {

			users();

		} else if (value.indexOf("/msg") >= 0) {
			
			if (value != "/msg") {
				msgUser(value);
			} else {
				socket.emit('chat message', $('#task').val());
				$('#task').val('');
				return false;
			}

		} else {
			socket.emit('chat message', $('#task').val());
			$('#task').val('');
			return false;
		}
	});

	//end partie task

	//keypress

	$('#task').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#request').focus().click();
		}
	});

	//!--keypress

	//function

	function rename(value) {
		socket.emit('edit name', value);
		$("#task").val('');
	}

	function users() {
		socket.emit('list users');

		socket.on('listU', function(data){
			console.log("create tab: ", data );

			$("#bold").append($('<p>').text("Liste des utilisateurs:"));

			for (var i = 0; i < data.length; i++) {
				console.log("nom: ", data[i]);
				$('#result').append($('<p>').text(data[i].name));
			};	
			$('#task').val('');
		})

  	}

  	function list(value) {
  		socket.emit('list channel', value);

  		socket.on('result channels', function(data) {
  			if (data.length == 0) {
  				$("#bold").val('');
  				$("#bold").append($('<p>').text("Aucun channel disponible correspondant a votre recherche. :("));
  			} else {
  				$("#bold").val('');
  				$("#result").val('');
  				$("#bold").append($('<p>').text("Voici la liste des channels disponibles:"));
  				for (var i = 0; i < data.length; i++) {
  					$("#result").append($('<p>').text(data[i]));
  				};

  			}
  		})
  	}

  	function joinChan(value) {
  		socket.emit('join channel', value);

  		socket.on('update channel', function(data){
  			socket.emit('update', data);
  		})

  		socket.on('result join', function(data, name) {
  			$("#bold").val('');
  			if (data == "cool") {
  				$("#bold").append($('<p>').text("Vous avez bien rejoint le " + name));
  			} else {
  				$("#bold").append($('<p>').text("Aucun channel disponible correspondant a votre recherche. :("));
  			}
  		})
  	}

  	function part(value) {
  		socket.emit('leave channel', value);
  		$("#bold").val('');
  		socket.on('result leave', function(data, name) {
  			if (data == "sucess"){
  				$("#you").append($('<p>').text( name + " a quitter ce channel"));
  			} else {
  				$("#bold").append($('<p>').text("Aucun channel disponible correspondant a votre recherche. :("));
  			}
  		})
  	}
	
  	function msgUser(value) {
  		socket.emit('msg user', value);

  		socket.on('send user', function(data){
  			$("#you").append($('<p>').text(data));
  		}) 	
  	}

  	//end function
})
