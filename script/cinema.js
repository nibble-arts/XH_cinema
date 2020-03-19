// cinema plugin script
var program_name;
var played;
var player_options;
var player_id

var player;

var chat_time;
var chat_user;



// ==========================================================================
// init cinema plugin scripts
function cinema_init(options) {

	cinema_player_init(options);
	cinema_host_init(options);
	cinema_chat_init(options);
}


// ==========================================================================
// PLAYER section

function cinema_player_init(options) {

	player_options = options;

	program_name = options.name;
	played = false;

	// add local play control 
	// set remote events
	jQuery(".cinema_player_start").click(function() {
		cinema_play();
	})

	jQuery(".cinema_player_stop").click(function() {
		cinema_pause();
	})

	// start loop
	setInterval(cinema_player_poll, 1000);
}


// poll api and execute commands
function cinema_player_poll() {

	var url = "?cinema_action=status&name=" + program_name;

	if (player_options.uuid) {
		url += "&uuid=" + player_options.uuid;
	}


	// send ajax request to api
	jQuery.ajax({
		"url": url,
		"dataType": "json",
		"success": function(result) {

			// add options to select
			if (result != "") {

				// create player if id and no player
				if (result.id && !player) {
					cinema_player_create_player(result);
					played = false;
				}

				// destroy if no id
				if (player && !result.id) {
					cinema_player_stop();
				}

				// control player
				if (player) {
					switch(result.status) {

						case "pause":
							player.pause();
							break;

						case "play":

							// play if not played
							if (!played) {
								player.play();
							}
							break;
					}
				}
			}

			// no data > disable
			else {
			}
		}
	});
}


// update screen
function cinema_player_update_screen(data) {

	if (data.seconds) {
		jQuery(".cinema_player_status").html(parseInt(data.seconds) + " sek. - Länge: " + parseInt(data.duration));
	}
	else {
		jQuery(".cinema_player_status").html("Keine Angaben zur Laufzeit");
	}

}


function cinema_player_create_player(data) {

//TODO set from program configuration

	var vimeo_options = {
		width: player_options.width,
		height: player_options.height,
		id: data.id,
		controls: true,
		background: true,
		loop: false,
		playsinline: false,
		portrait: true
	};

	player = new Vimeo.Player("cinema_player", vimeo_options);


	player.on('timeupdate', function(data) {
		cinema_player_update_screen(data);
	})

	// set player events
	player.on('play', function() {
		cinema_player_title("(spielt)");
    });

	player.on('pause', function() {
		cinema_player_title("(pausiert)");
    });

	player.on('ended', function(data) {
		cinema_player_title("Beendet");
		played = true;
		// cinema_player_stop();
	});

		// play on loaded to get remote control access
	player.on("loaded", function(loaded) {
		cinema_player_play();
	})
}


function cinema_player_play() {
    player.play();
}


function cinema_player_pause() {
    player.pause();
}

function cinema_player_stop() {
	player.destroy();
	player = "";
}

function cinema_player_title(text) {

	player.getVideoTitle().then(function(title) {
		jQuery(".cinema_player_title").html(title + " " + text);
	});
}


// ==========================================================================
// CHAT section

function cinema_chat_init(options) {

	chat_user = options.user;

	// wait for ENTER
	jQuery(".cinema_chat_input").keypress(function (e) {
		if (e.which == 13) {

			// send message and clear input field
			cinema_chat_send({"text": jQuery(this).val(), "self": "true"});
			jQuery(this).val("");

		}
	});

	// start chat loop
	setInterval(cinema_chat_send, 1000);
}


// send action with params (data), send result to callback	
function cinema_chat_send(data) {

	var url = "?cinema_action=chat&name=" + program_name + "&user=" + chat_user;

	if (data) {	
		jQuery.each(data, function (k, v) {
			url += "&" + k + "=" + v;
		});
	}


	// send ajax request
	jQuery.ajax({
		"url": url,
		"dataType": "json",
		"success": function(result) {

			// add options to select
			if (result != "") {
				cinema_chat_update(result);
			}
		}
	});
}


function cinema_chat_update(data) {

	// check for new messages
	jQuery.each(data, function(time, message) {

		// add new messages
		if (chat_time == undefined || time > Math.floor(chat_time)) {

			hTime = new Date(time * 1000).toISOString().slice(-13, -5);

			var htmlString = "";

			// add message
			if (message.user != chat_user) {
				htmlString += '<div class="cinema_message">';
			}

			// add own message
			else {
				htmlString += '<div class="cinema_own_message">';
			}

			// add message
			htmlString += '<div class="cinema_message_user">' + message.user + ' ' + hTime + '</div>';
			htmlString += message.text + '</div>';

			// prepend to list
			jQuery(".cinema_chat_list").prepend(htmlString);
		}
	});

	chat_time = Math.floor(Date.now() / 1000);
}


// ==========================================================================
// HOST section

// cinema plugin script


function cinema_host_init(options) {

	program_name = options.name;

	// set remote events
	jQuery(".cinema_host_play").click(function() {
		cinema_host_send("set", {status: "play"});
	})

	jQuery(".cinema_host_pause").click(function() {
		cinema_host_send("set", {status: "pause"});
	})

	jQuery(".cinema_host_load").click(function() {
		cinema_host_send("set", {id: 329757457, status: "pause"});
	})

	jQuery(".cinema_host_stop").click(function() {
		cinema_host_send("stop", "");
	})


	// start loop
	setInterval(cinema_host_poll, 1000);
}


// send play
function cinema_host_play() {

}


// send stop


// send action with params (data), send result to callback	
function cinema_host_send(action, data) {

	var url = "?cinema_action=" + action + "&name=" + program_name;

	if (data) {	
		jQuery.each(data, function (k, v) {
			url += "&" + k + "=" + v;
		});
	}


	// send ajax request
	jQuery.ajax({
		"url": url,
		"dataType": "json",
		"success": function(result) {

			// add options to select
			if (result != "") {
				cinema_host_update_screen(result);
			}
		}
	});
}


function cinema_host_poll() {
	cinema_host_send("status", "", cinema_host_update_screen);
}



function cinema_host_update_screen(data) {

	jQuery(".cinema_host_status").html(data.status);
	jQuery(".cinema_host_vid").html(data.id);

	jQuery(".cinema_host_clients").html(data.clients);

	switch (data.status) {

		case "play":
			jQuery(".cinema_host_load").hide();
			jQuery(".cinema_host_stop").show();
			jQuery(".cinema_host_vid").show();
			jQuery(".cinema_player_status").show();

			jQuery(".cinema_host_play").hide();
			jQuery(".cinema_host_pause").show();
			break;

		case "pause":
			jQuery(".cinema_host_load").hide();
			jQuery(".cinema_host_stop").show();
			jQuery(".cinema_host_vid").show();
			jQuery(".cinema_player_status").show();

			jQuery(".cinema_host_play").show();
			jQuery(".cinema_host_pause").hide();
			break;

		default:
			jQuery(".cinema_host_load").show();
			jQuery(".cinema_host_vid").hide();
			jQuery(".cinema_host_stop").hide();
			jQuery(".cinema_player_status").hide();

			jQuery(".cinema_host_play").hide();
			jQuery(".cinema_host_pause").hide();
			break;
	}

}