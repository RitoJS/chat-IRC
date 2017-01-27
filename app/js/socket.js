$(document).ready(function (){

//init
var socket = io(); 


//Partie messages
    $("#go").click(function() {
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
    	console.log("je passe");
        $('#block-text').append("<p class='item'>"+ msg.text + "</p>");
        $('#block-text ').animate({
        	scrollTop: $(' #block-text .item:last-child').position().top
    	}, 'slow');
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

		

  	}

  	function list(value) {
  		socket.emit('list channel', value);

  		
  	}

  	function joinChan(value) {
  		socket.emit('join channel', value);

  		
  		

  		
  	}

  	function part(value) {
  		socket.emit('leave channel', value);
  		$("#bold").val('');
  		
  	}
	
  	function msgUser(value) {
  		socket.emit('msg user', value);

  		 	
  	}

  	//end function

  	//socket on

  		socket.on('welcome message', function(data){
  			$("#block-text").append("<h1 class='bold'>Bienvenue " + data + "!</h1>");
  			$('#block-text ').animate({
        		scrollTop: $(' #block-text .bold:last-child').position().top
    		}, 'slow');	
  		})

  		socket.on('rename user', function(data){
  			$("#block-text").append("<p class='italic'>"+ data + "</p>");
  			$('#block-text ').animate({
        		scrollTop: $(' #block-text .bold:last-child').position().top
    		}, 'slow');
  		})

  		socket.on('update channel', function(data){
  			socket.emit('update', data);
  		})

  		socket.on('result join', function(data, name) {
  			$("#bold").val('');
  			if (data == "cool") {
  				$("#block-text").append("<p class='italic'>Vous avez bien rejoint le " + name + "</p>");
  				$('#block-text ').animate({
        			scrollTop: $(' #block-text .italic:last-child').position().top
    			}, 'slow');
  				$('#task').val('');
  			} else {
  				$("#block-text").append("<p class='italic'>Vous êtes déjà sur ce channel</p>");
  				$('#block-text ').animate({
        			scrollTop: $(' #block-text .italic:last-child').position().top
    			}, 'slow');
  				$('#task').val('');
  			}
  		})

  		socket.on('send user', function(data){
  			$("#block-text").append("<p class='item'>" + data.text + "</p>" );
  			$('#block-text ').animate({
        		scrollTop: $(' #block-text .item:last-child').position().top
    		}, 'slow');
    		$('#task').val('');
  		})

  		socket.on('result leave', function(data, name) {
  			if (data == "success"){
  				$("#block-text").empty();
  				$("#block-text").append("<p class='italic'>"+ name + " a quitter ce channel</p>");
  			} else {
  				$("#block-text").append("<p class='italic'>Aucun channel disponible correspondant a votre recherche. :(</p>");
  				$('#block-text ').animate({
        			scrollTop: $(' #block-text .italic:last-child').position().top
    			}, 'slow');
  			}
  		})


  		socket.on('result channels', function(data) {
  			if (data.length == 0) {
  				$("#block-text").append("<p class='italic'>Aucun channel disponible correspondant a votre recherche. :(</p>");
  				$('#block-text ').animate({
        			scrollTop: $(' #block-text .italic:last-child').position().top
    			}, 'slow');
  			} else {
  				
  				$("#result").val('');
  				$("#block-text").append("<p class='italic'>Voici la liste des channels disponibles:</p>");
  				for (var i = 0; i < data.length; i++) {
  					$("#block-text").append("<p class='italic'>" + data[i] + "</p>");
  					
  				};
  				$('#block-text').animate({
        			scrollTop: $(' #block-text .italic:last-child').position().top
    			}, 'slow');

  			}
  		})

  		socket.on('listU', function(data){
			

			$("#block-text").append("<p class='italic'>Liste des utilisateurs:</p>");

			for (var i = 0; i < data.length; i++) {
				$('#block-text').append("<p class='italic'>" + data[i].name + "</p>");

			};	
			$('#block-text ').animate({
        		scrollTop: $(' #block-text .italic:last-child').position().top
    		}, 'slow');
			$('#task').val('');
		})

		socket.on('not in', function(){
  			$("#bold").append("<p class='italic'>Aucun channel disponible correspondant a votre recherche. :(</p>");
  			$('#block-text ').animate({
        		scrollTop: $(' #block-text .italic:last-child').position().top
    		}, 'slow');
  			$('#task').val('');
  		})
})
