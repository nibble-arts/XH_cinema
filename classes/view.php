<?php

namespace cinema;

class View {

	public static function twitch($name) {

		// TITLE
		$o = '<div class="cinema_host_title">';
			$o .= Text::player_title();
		$o .= '</div>';

		// player
		$o .= '<div id="cinema_player_wrapper">';
			$o .= '<div class="cinema_player_wrapper">';
				$o .= '<div id="twitch-embed"></div>';
			$o .= '</div>';
		$o .= '</div>';


		// CHAT section
		$o .= '<div id="cinema_chat"></div>';

	    return $o;
	}


	public static function host($name) {

		$o .= '';

		// TITLE
		// $o .= '<div id="cinema_fullscreen">';

			$o .= '<div class="cinema_host_title">';
				$o .= Text::host_title();
			$o .= '</div>';

			// player
			$o .= '<div id="cinema_host_wrapper">';
				// $o .= '<div class="cinema_host_wrapper">';
					$o .= '<div class="cinema_host_wrapper" id="twitch-embed"></div>';
				// $o .= '</div>';
			$o .= '</div>';

			// $o .= '<div class="cinema_chat_count"></div>';
			$o .= '<div class="cinema_chat_users"></div>';

			// CHAT section
			$o .= '<div id="cinema_chat" type="inline"></div>';

		// $o .= '</div>';

		return $o;
	}

}