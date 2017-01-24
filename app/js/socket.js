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
			rename(value);
		} else if (value.indexOf("/list") >= 0) {
			list(value);
		} else if (value.indexOf("/join") >= 0) {
			joinChan(value);
		} else if (value === "/part") {
			part();
		} else if (value === "/users") {
			users();
		} else {
			socket.emit('chat message', $('#m').val());
			return false;
		}
	});

	//keypress

	$('#task').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#request').focus().click();
		}
	});

	function rename(value) {
		socket.emit('edit name', value);
		$("#task").val('');
	}

	function users() {
		var users = socket.emit('list users');
		//console.log(users.id);
		console.log(users); 
  	}
})
