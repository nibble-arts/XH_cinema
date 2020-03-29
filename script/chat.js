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
		this.chat = options.chat;
		this.uuid = options.uuid;

		this.lang = options.text;

		this.root = "cinema_chat";

		this.last_read = 0;

		// create chat
		this.create(this.root);

		// show if user
		if (this.user && this.chat) {

			// show chat
			jQuery("." + self.root).show();

			// wait for ENTER
			jQuery("."+self.root+"_input").keypress(function (e) {

				if (e.which == 13) {

					// send message and clear input field
					self.chat_post({"text": jQuery(this).val(), "self": "true"});
					jQuery(this).val("");

				}
			});

			// start chat loop
			setInterval(this.chat_get.bind(this), 1000);


			// add chat button
			jQuery("#"+this.root+"_hide").click(function() {
				self.unfold();
			});
		}
	}


	create(root) {

		var chat = jQuery("#" + root);

		// get display type
		switch (chat.attr("type")) {

			case "inline":
				// add inline class
				chat.addClass("cinema_chat_inline");

				chat.append('<div class="' + root + '_text"><div class="' + root + '_count"></div>' + this.text(this, "message") + ' <input type="text" class="' + root + '_input"></div>');
				chat.append('<div class="' + root + '_list">');
				break;

			// popup for default
			default:
				// add popup class
				chat.addClass("cinema_chat");

				chat.append('<div id="' + root + '_hide" class="' + root + '_button"></div>');
				chat.append('<div class="' + root + '_text"><div class="' + root + '_count"></div>' + this.text(this, "message") + ' <input type="text" class="' + root + '_input"></div>');
				chat.append('<div class="' + root + '_list">');
				break;
		}

	}


	// ==========================================
	// POST AND GET messages
	// get chat from api
	chat_get() {

		var self = this;
		var url = "?cinema_action=chat&chat=" + this.chat + "&uuid=" + this.uuid + "&user=" + this.user;

		// send ajax request
		jQuery.ajax({
			"url": url,
			"dataType": "json",
			"success": function(result) {

				// add options to select
				if (result.chat != "") {
					self.update_list(self, result);
				}
			}
		});

	}


	// send new message to api
	chat_post(data) {

		var url = "?cinema_action=chat&chat=" + this.chat + "&user=" + this.user + "&uuid=" + this.uuid;

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

		// add user count
		var count_string = data.status + " " + self.text(self, "users");
		jQuery("."+self.root+"_count").html(count_string);

		var users = "";
		var title = "";

		// add user list
		jQuery.each(data.users, function (idx, user) {
			title += user + "<br>";
			users += user + "\n";
		});

		// add mouseover for count
		jQuery("."+self.root+"_count").attr("title", users);

		// add list of users
		jQuery("."+self.root+"_users").html(self.text(self, "logged_users") + "<hr>" + title);

		// check for new messages
		jQuery.each(data.chat, function(idx, message) {

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
				jQuery("."+self.root+"_list").prepend(htmlString);

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

		var width = jQuery("#"+this.root).css("width");

		// clear new state
		this.clear_new();

		// show chat
		if (jQuery("#"+this.root).css("right") == "0px") {
			jQuery("#"+this.root).css("right", "-"+width);
		}
		else {
			jQuery("#"+this.root).css("right", 0);
		}
	}


	// ==========================================
	// SET AND CLEAR new state
	set_new() {

		// if folded > show new
		if (jQuery("#"+this.root).css("right") != "0px") {
			jQuery("#"+this.root+"_hide").removeClass(this.root+"_button");
			jQuery("#"+this.root+"_hide").addClass(this.root+"_new");
		}
	}


	clear_new() {
		jQuery("#"+this.root+"_hide").addClass(this.root+"_button");
		jQuery("#"+this.root+"_hide").removeClass(this.root+"_new");
	}


	// get text
	text(self, text_id) {

		if (self.lang != undefined && self.lang[text_id]) {
			return self.lang[text_id];
		}

		else {
			return text_id;
		}
	}
}