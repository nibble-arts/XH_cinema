/*
 * Cinema_XH plugin host class
 *
 * @author: Thomas H Winkler
 * @copyright: 2020
 */


 class Host {


	// ==========================================
	// construct host class
 	constructor(options) {


 		var self = this;
		this.name = options.name;
		this.user = options.user;
		this.id = false;

		// set remote events
		jQuery(".cinema_host_play").click(function() {
			self.post(self, "set", {status: "play"});
		})

		jQuery(".cinema_host_pause").click(function() {
			self.post(self, "set", {status: "pause"});
		})

		jQuery(".cinema_host_replay").click(function() {
			self.post(self, "set", {status: "replay"});
		})

		jQuery(".cinema_host_load").click(function() {

			var id = jQuery("input[name=cinema_host_vid]").val();

			if (id) {
				self.id = id;
			}

// 329757457
			self.post(self, "set", {id: self.id, status: "pause"});

			jQuery(".cinema_player_play").show();
			jQuery(".cinema_player_pause").hide();

			jQuery("input[name=cinema_host_vid").hide();
		})

		jQuery(".cinema_host_stop").click(function() {

			self.id = false;

			self.post(self, "stop", "");

			// hide local play control
			jQuery(".cinema_player_play").hide();
			jQuery(".cinema_player_pause").hide();

			// show vid input field
			jQuery("input[name=cinema_host_vid").show();
		})


		// start loop
		setInterval(this.status_get.bind(this), 1000);
 	}


	// ==========================================
	// poll status
	status_get() {
		this.post(this, "status", "");
	}


	// ==========================================
	// send post request
 	post(self, action, data) {

	 	var url = "?cinema_action=" + action + "&name=" + self.name + "&user=" + self.user;

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
				if (result.status != "") {
					self.update(result.status);
				}
			}
		});
 	}


	// ==========================================
	// update screen
 	update(data) {

		jQuery(".cinema_host_status").html(data.status);
		jQuery(".cinema_host_vid").html(data.id);

		jQuery(".cinema_host_clients").html(data.clients);

		switch (data.status) {

			case "replay":
			case "play":
				this.set_play();
				break;

			case "pause":
				this.set_pause();
				break;

			case "stop":
				this.set_stop();
				break;
		}
 	}


	// ==========================================
	// set unloaded
	set_stop() {

		jQuery(".cinema_host_load").show();
		jQuery(".cinema_host_vid").hide();
		jQuery(".cinema_host_input").show();

		// hide host play control
		jQuery(".cinema_host_stop").hide();
		jQuery(".cinema_host_play").hide();
		jQuery(".cinema_host_pause").hide();
		jQuery(".cinema_host_replay").hide();

		jQuery(".cinema_player_status").hide();
	}


	set_pause() {

		jQuery(".cinema_host_load").hide();
		jQuery(".cinema_host_vid").show();
		jQuery(".cinema_host_input").hide();

		jQuery(".cinema_host_stop").show();
		jQuery(".cinema_host_play").show();
		jQuery(".cinema_host_pause").hide();
		jQuery(".cinema_host_replay").show();

		jQuery(".cinema_player_status").show();
	}


	set_play() {

		jQuery(".cinema_host_load").hide();
		jQuery(".cinema_host_vid").show();
		jQuery(".cinema_host_input").hide();

		jQuery(".cinema_host_stop").show();
		jQuery(".cinema_host_play").hide();
		jQuery(".cinema_host_pause").show();
		jQuery(".cinema_host_replay").show();

		jQuery(".cinema_player_status").show();
	}
}