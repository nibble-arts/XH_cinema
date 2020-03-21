/*
 * Cinema_XH plugin player class
 *
 * @author: Thomas H Winkler
 * @copyright: 2020
 */


class Player {


	// ==========================================
	// construct player class
	constructor(options) {

		var self = this;

		// vimeo player
		this.player = false;

		this.player_local = false;	// remote control
		this.played = false;

		this.options = options;
		this.name = options.name;
		this.user = options.user;

		// set to remote control

		// add local play control 
		// set remote events
		jQuery(".cinema_player_play").click(function() {

			self.player_local = true;	// local control

			jQuery(".cinema_player_play").hide();
			jQuery(".cinema_player_pause").show();

			self.play();
		});

		jQuery(".cinema_player_pause").click(function() {
			self.player_local = false;	// remote control

			jQuery(".cinema_player_play").show();
			jQuery(".cinema_player_pause").hide();

			self.pause();
		});

		// activate preview button
		// jQuery(".cinema_player_play").show();

		// fullscreen toggle
		jQuery("#cinema_fullscreen_button").click(function() {

			// switch to fullscreen
			if (jQuery(this).hasClass("cinema_fullscreen_grow")) {
				self.fullscreen();
			}

			else {
				self.shrink();
			}

		});

		// start loop
		setInterval(this.status_get.bind(this), 1000);
	}


	// ==========================================
	// get status
	status_get() {

		var self = this;
		var url = "?cinema_action=status&name=" + this.name + "&user=" + this.user;

		if (this.options.uuid) {
			url += "&uuid=" + this.options.uuid;
		}

		// send ajax request to api
		jQuery.ajax({
			"url": url,
			"dataType": "json",
			"success": function(result) {

				// add options to select
				if (result.status != "") {

					result = result.status;

					// create player if id and no player
					if (result.id && !self.player) {
						self.create_player(result);
						self.played = false;
					}

					// destroy if no id
					if (self.player && !result.id) {
						self.stop();
					}

					// control player
					if (self.player) {
						switch(result.status) {

							case "pause":
								if (!self.player_local) {
									self.player.pause();
								}
								break;

							case "play":

								// play if not played
								if (!self.played) {
									self.player.play();
								}
								break;

							case "replay":

								self.player.play();
								break;
						}
					}

					// no player > clear title
//TODO get title from options
					else {
						self.title("Das virtuelle Kino");
					}
				}
			}
		});

		console.log(self.played);
	}


	// ==========================================
	// VIMEO PLAYER SECTION
	create_player(data) {

//TODO set from program configuration
		var self = this;

		var vimeo_options = {
			width: this.options.width,
			height: this.options.height,
			id: data.id,
			controls: false,
			background: true,
			loop: false,
			playsinline: false,
			portrait: true
		};

		this.player = new Vimeo.Player("cinema_player", vimeo_options);


		this.player.on('timeupdate', function(data) {
			self.update(data);
		})

		// set player events
		this.player.on('play', function() {
			self.title("(spielt)");
	    });

		this.player.on('pause', function() {
			self.title("(pausiert)");
	    });

		this.player.on('ended', function(data) {
			self.title("Beendet");
			self.played = true;
		});

			// play on loaded to get remote control access
		this.player.on("loaded", function(loaded) {
			self.play();
		})
	}


	play() {
	    this.player.play();
		this.player.setVolume(1);
	}

	pause() {
		this.player_local = false;	// remote control
	}

	stop() {
		this.player.destroy();
		this.player = "";
	}


	// ==========================================
	// update status screen
	update(data) {

		if (data.seconds) {
			jQuery(".cinema_player_status").html(parseInt(data.seconds) + " sek. - Länge: " + parseInt(data.duration));
		}
		else {
			jQuery(".cinema_player_status").html("Keine Angaben zur Laufzeit");
		}

	}


	title(text) {

		if (this.player) {		
			this.player.getVideoTitle().then(function(title) {
				jQuery(".cinema_player_title").html(title + " " + text);
			});
		}

		else {
			jQuery(".cinema_player_title").html(text);
		}
	}

	// ==========================================
	// toggle fullscreen
	fullscreen() {

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
	shrink() {

		// link back to placeholder
		jQuery('#cinema_wrapper').detach().insertAfter('#cinema_fullscreen_placeholder');

		// remove placeholder and fullscreen
		jQuery('#cinema_fullscreen').remove();
		// jQuery('#cinema_fullscreen_placeholder').remove();

		jQuery('#cinema_fullscreen_button')
			.removeClass("cinema_fullscreen_shrink")
			.addClass("cinema_fullscreen_grow");
	}

}