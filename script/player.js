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
		this.options = options;

		// fullscreen toggle
		jQuery("#cinema_fullscreen_button").click(function() {

			// switch to fullscreen
			if (jQuery(this).hasClass("cinema_fullscreen_grow")) {
				self.fullscreen(self);
			}

			else {
				self.shrink(self);
			}
		});


		// create player
		create_player(options);

		// start loop
		// setInterval(this.status_get.bind(this), 1000);
	}


	// ==========================================
	// toggle fullscreen
	fullscreen(self) {

		// set player class to fullscreen
		jQuery('.cinema_player_wrapper').addClass('cinema_player_wrapper_fullscreen');

		// create fullscreen div
		jQuery('<div id="cinema_fullscreen"></div>').appendTo("body");

		// create placeholdeer
		jQuery('<div id="cinema_fullscreen_placeholder"></div>').insertBefore("#cinema_player_wrapper");

		jQuery('#cinema_player_wrapper').detach().appendTo('#cinema_fullscreen');

		jQuery('#cinema_fullscreen_button')
			.removeClass("cinema_fullscreen_grow")
			.addClass("cinema_fullscreen_shrink");

		// hide scrollbar and title
		jQuery('body').attr("style", "overflow: hidden;");
		jQuery('.cinema_title').hide();

		// recreate player
		create_player(self.options);
	}


	// fullscreen off
	shrink(self) {

		// set player class to normal
		jQuery('.cinema_player_wrapper_fullscreen').removeClass('cinema_player_wrapper_fullscreen');

		// link back to placeholder
		jQuery('#cinema_player_wrapper').detach().insertAfter('#cinema_fullscreen_placeholder');

		// remove placeholder and fullscreen
		jQuery('#cinema_fullscreen').remove();
		// jQuery('#cinema_fullscreen_placeholder').remove();

		jQuery('#cinema_fullscreen_button')
			.removeClass("cinema_fullscreen_shrink")
			.addClass("cinema_fullscreen_grow");

		// show scrollbar and title
		jQuery('body').removeAttr("style", "overflow: hidden;");
		jQuery('.cinema_title').show();

		// recreate player
		create_player(self.options);
	}

}