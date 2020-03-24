/*
 * Cinema_XH plugin chat class
 *
 * @author: Thomas H Winkler
 * @copyright: 2020
 */



class Chat {


	// ==========================================
	// construct chat class
	constructor(options) {


		var self = this;

		this.user = options.user;
		this.name = options.name;

		this.last_read = 0;

		// create chat
		this.create("cinema_chat");

		// show if user
		if (this.user) {

			// show chat
			jQuery(".cinema_chat").show();

			// wait for ENTER
			jQuery(".cinema_chat_input").keypress(function (e) {

				if (e.which == 13) {

					// send message and clear input field
					self.chat_post({"text": jQuery(this).val(), "self": "true"});
					jQuery(this).val("");

				}
			});

			// start chat loop
			setInterval(this.chat_get.bind(this), 1000);


			// add chat button
			jQuery("#cinema_chat_hide").click(function() {
				self.unfold();
			});
		}
	}


	create(root) {

		var chat = jQuery("#" + root);

		chat.append('<div id="' + root + '_hide" class="' + root + '_button"></div>');
		chat.append('<div class="' + root + '_text">Nachricht <input type="text" class="' + root + '_input"></div>');
		chat.append('<div class="' + root + '_list">');

	}


	// ==========================================
	// POST AND GET messages
	// get chat from api
	chat_get() {

		var self = this;
		var url = "?cinema_action=chat&name=" + this.name;

		// send ajax request
		jQuery.ajax({
			"url": url,
			"dataType": "json",
			"success": function(result) {

				// add options to select
				if (result.chat != "") {
					self.update_list(self, result.chat);
				}
			}
		});

	}


	// send new message to api
	chat_post(data) {

		var url = "?cinema_action=chat&name=" + this.name + "&user=" + this.user;

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


	// ==========================================
	// UPDATE chat
	update_list(self, data) {

		var last;


		// check for new messages
		jQuery.each(data, function(idx, message) {

			// add new messages
			if (parseInt(idx) > parseInt(self.last_read)) {
				var htmlString = "";
				var user = "anonym";
				var hTime = new Date(parseInt(message.timestamp)).toLocaleString();


				// add message to list
				// no user of other user
				if (!message.user || message.user != self.user) {
					htmlString += '<div class="cinema_message">';
				}

				// is own message
				else {
					htmlString += '<div class="cinema_own_message">';
					user = message.user;
				}


				htmlString += '<div class="cinema_message_user">' + user + ' ' + hTime + '</div>';
				htmlString += message.text + '</div>';

				// prepend to list
				jQuery(".cinema_chat_list").prepend(htmlString);

				self.set_new();

				last = parseInt(idx);
			}
		});

		if (last != undefined) {
			self.last_read = parseInt(last);
		}
	}


	// ==========================================
	// HIDE AND SHOW chat
	unfold() {

		var width = jQuery("#cinema_chat").css("width");

		// clear new state
		this.clear_new();

		// show chat
		if (jQuery("#cinema_chat").css("right") == "0px") {
			jQuery("#cinema_chat").css("right", "-"+width);
		}
		else {
			jQuery("#cinema_chat").css("right", 0);
		}
	}


	// ==========================================
	// SET AND CLEAR new state
	set_new() {

		// if folded > show new
		if (jQuery("#cinema_chat").css("right") != "0px") {
			jQuery("#cinema_chat_hide").removeClass("cinema_chat_button");
			jQuery("#cinema_chat_hide").addClass("cinema_chat_new");
		}
	}


	clear_new() {
		jQuery("#cinema_chat_hide").addClass("cinema_chat_button");
		jQuery("#cinema_chat_hide").removeClass("cinema_chat_new");
	}
}