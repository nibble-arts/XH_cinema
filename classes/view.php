<?php

namespace cinema;

class View {

	public static function twitch($name) {

		$o = "";

		$o .= '<div id="cinema_player_wrapper">';

			$o .= '<div class="cinema_player_wrapper">';
				$o = '<div id="twitch-embed"></div>';
			$o .= '</div>';

		$o .= '</div>';

		// CHAT section
		$o .= '<div id="cinema_chat" class="cinema_chat"></div>';

	    return $o;
	}


	public static function cinema($name) {

		$o = "";


		$o .= '<div id="cinema_player_wrapper">';

			$o .= '<div class="cinema_player_title">' . Text::title() . '</div>';
	
			$o .= '<div id="cinema_fullscreen_button" class="cinema_fullscreen_grow"></div>';


			// CREATE PLAYER
			$o .= '<div class="cinema_player_wrapper">';
				$o .= '<div id="cinema_player" class="cinema_player_player"></div>';
			$o .= '</div>';

			$o .= '<script src="https://player.vimeo.com/api/player.js"></script>';

			// local control
			// $o .= '<div><span class="cinema_start">START</span> <span class="cinema_stop">STOP</span></div>';

			$o .= '<div class="cinema_player_status">Player-Status</div>';

			$o .= '<div style="clear:both;"></div>';

			// CHAT section
			$o .= '<div id="cinema_chat" class="cinema_chat">';

				$o .= '<div id="cinema_chat_hide" class="cinema_chat_button"></div>';

				$o .= '<div class="cinema_chat_text">Nachricht <input type="text" class="cinema_chat_input"></div>';

				$o .= '<div class="cinema_chat_list">';

				$o .= '</div>';
			$o .= '</div>';
		$o .= '</div>';

		return $o;
	}


	public static function host($name) {

		// TITLE
		$o = '<div class="cinema_host_title">Cinema Host</div>';

		$o .= '<div>';
			$o .= '<span class="cinema_host_clients"></span>';
		$o .= ' verbundene Zuseher</div>';

		// CREATE PLAYER
		$o .= '<div class="cinema_host_player">';
			$o .= '<div id="cinema_player"></div>';

			$o .= '<div class="cinema_player_play cinema_button">Vorschau</div>';
			$o .= '<div class="cinema_player_pause cinema_button">Pause</div>';
		$o .= '</div>';

		$o .= '<script src="https://player.vimeo.com/api/player.js"></script>';

		// LOAD FILM
		$o .= '<div class="cinema_host_vid">Video ID</div>';
		$o .= '<input type="text" name="cinema_host_vid" class="cinema_host_input">';
		$o .= '<div class="cinema_host_load cinema_button">Film laden</div>';

		// UNLOAD FILM
		$o .= '<div class="cinema_host_stop cinema_button cinema_stop">Beenden</div>';
		$o .= '<div style="clear:left;"></div>';

		// PLAY
		$o .= '<div class="cinema_host_play cinema_button cinema_play" vid="329757457">START</div>';
		// PAUSE
		$o .= '<div class="cinema_host_pause cinema_button cinema_pause">PAUSE</div>';
		$o .= '<div class="cinema_host_replay cinema_button cinema_play" vid="329757457">REPLAY</div>';
		$o .= '<div style="clear:left;"></div>';

		// STATI
		$o .= '<div class="cinema_player_status">Player-Status</div>';
		$o .= '<div style="clear:left;"></div>';
		// $o .= '<div class="cinema_host_status">Host-Status</div>';
		// $o .= '<div style="clear:both;"></div>';

		// CHAT section
		$o .= '<div class="cinema_chat">';
			$o .= '<div class="cinema_chat_text">Nachricht <input type="text" class="cinema_chat_input"></div>';

			$o .= '<div class="cinema_chat_list">';

			$o .= '</div>';
		$o .= '</div>';
		return $o;
	}

}