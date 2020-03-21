// cinema plugin script
var program_name;
var played;
var player_options;
var player_id
var player_local;

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

	player_local = false;	// remote control
	player_options = options;

	program_name = options.name;

	// set to remote control
	played = false;

	// add local play control 
	// set remote events
	jQuery(".cinema_player_play").click(function() {
		player_local = true;	// local control

		jQuery(".cinema_player_play").hide();
		jQuery(".cinema_player_pause").show();

		cinema_player_play();
	});

	jQuery(".cinema_player_pause").click(function() {
		player_local = false;	// remote control

		jQuery(".cinema_player_play").show();
		jQuery(".cinema_player_pause").hide();

		cinema_player_pause();
	});

	// activate preview button
	// jQuery(".cinema_player_play").show();

	// add chat button
	jQuery("#cinema_chat_hide").click(function() {
		cinema_chat_unfold();
	});

	// fullscreen toggle
	jQuery("#cinema_fullscreen_button").click(function() {

		// switch to fullscreen
		if (jQuery(this).hasClass("cinema_fullscreen_grow")) {
			cinema_player_fullscreen();
		}

		else {
			cinema_player_shrink();
		}

	});

// cinema_player_fullscreen();


	// start loop
	setInterval(cinema_player_poll, 1000);
}


// fullscreen
function cinema_player_fullscreen() {

	// create fullscreen div
	jQuery('<div id="cinema_fullscreen">&nbsp;</div>').appendTo("body");

	// create placeholdeer
	jQuery('<div id="cinema_fullscreen_placeholder"></div>').insertBefore("#cinema_wrapper");
	jQuery('#cinema_wrapper').detach().appendTo('#cinema_fullscreen');

	jQuery('#cinema_fullscreen_button')
		.removeClass("cinema_fullscreen_grow")
		.addClass("cinema_fullscreen_shrink");
}


// fullscreen off
function cinema_player_shrink() {

	// link back to placeholder
	jQuery('#cinema_wrapper').detach().insertAfter('#cinema_fullscreen_placeholder');

	// remove placeholder and fullscreen
	jQuery('#cinema_fullscreen').remove();
	// jQuery('#cinema_fullscreen_placeholder').remove();

	jQuery('#cinema_fullscreen_button')
		.removeClass("cinema_fullscreen_shrink")
		.addClass("cinema_fullscreen_grow");
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
							if (!player_local) {
								player.pause();
							}
							break;

						case "play":

							// play if not played
							if (!played) {
								player.play();
							}
							break;
					}
				}

				// no player > clear title
//TODO get title from options
				else {
					cinema_player_title("Das virtuelle Kino");
				}
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
		controls: false,
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
	});

		// play on loaded to get remote control access
	player.on("loaded", function(loaded) {
		cinema_player_play();
	})
}


function cinema_player_play() {
    player.play();
	player.setVolume(1);
}


function cinema_player_pause() {
	player_local = false;	// remote control
}

function cinema_player_stop() {
	player.destroy();
	player = "";
}

function cinema_player_title(text) {

	if (player) {		
		player.getVideoTitle().then(function(title) {
			jQuery(".cinema_player_title").html(title + " " + text);
		});
	}

	else {
		jQuery(".cinema_player_title").html(text);
	}
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
	setInterval(cinema_chat_get, 1000);
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
			}
		}
	});
}


// send action with params (data), send result to callback	
function cinema_chat_get(data) {

	var url = "?cinema_action=chat&name=" + program_name;

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


function cinema_chat_unfold() {

	var width = jQuery("#cinema_chat").css("width");

	cinema_chat_clear_new();

	// show chat
	if (jQuery("#cinema_chat").css("right") == "0px") {
		jQuery("#cinema_chat").css("right", "-"+width);
	}
	else {
		jQuery("#cinema_chat").css("right", 0);
	}
}


function cinema_chat_update(data) {

	// check for new messages
	jQuery.each(data, function(time, message) {

		// add new messages
		if (chat_time == undefined || time >= Math.floor(chat_time)) {

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

			cinema_chat_set_new();
		}
	});

	chat_time = Math.floor(Date.now());
}


function cinema_chat_set_new() {

	// if folded > show new
	if (jQuery("#cinema_chat").css("right") != "0px") {
		jQuery("#cinema_chat_hide").removeClass("cinema_chat_button");
		jQuery("#cinema_chat_hide").addClass("cinema_chat_new");
	}
}


function cinema_chat_clear_new() {
		jQuery("#cinema_chat_hide").addClass("cinema_chat_button");
	jQuery("#cinema_chat_hide").removeClass("cinema_chat_new");
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

		id = jQuery("input[name=cinema_host_vid]").val();

		if (id) {
			player_id = id;
		}

// 329757457
		cinema_host_send("set", {id: player_id, status: "pause"});

		jQuery(".cinema_player_play").show();
		jQuery(".cinema_player_pause").hide();

		jQuery("input[name=cinema_host_vid").hide();
	})

	jQuery(".cinema_host_stop").click(function() {

		player_id = false;

		cinema_host_send("stop", "");

		// hide local play control
		jQuery(".cinema_player_play").hide();
		jQuery(".cinema_player_pause").hide();

		// show vid input field
		jQuery("input[name=cinema_host_vid").show();
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

console.log(url);

	// send ajax request
	jQuery.ajax({
		"url": url,
		"dataType": "json",
		"success": function(result) {

console.log(result);
			// add options to select
			if (result != "") {
				cinema_host_update_screen(result);
			}
		}
	});
}


function cinema_host_poll() {
	cinema_host_send("status", "");
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
			// show load, hide stop and status
			jQuery(".cinema_host_load").show();
			jQuery(".cinema_host_vid").hide();
			jQuery(".cinema_host_stop").hide();
			jQuery(".cinema_player_status").hide();

			// hide host play control
			jQuery(".cinema_host_play").hide();
			jQuery(".cinema_host_pause").hide();
			break;
	}
}
