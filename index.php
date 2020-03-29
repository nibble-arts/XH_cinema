<?php

/* CMSimple_XH plugin
 * memberaccess
 * (c) 2018 Thomas Winkler
 *
 * Manages member logins and hides pages by group
 */


// init class autoloader
spl_autoload_register(function ($path) {

	if ($path && strpos($path, "cinema\\") !== false) {
		$path = "classes/" . str_replace("cinema\\", "", strtolower($path)) . ".php";
		include_once $path; 
	}
});


// plugin base path
define('CINEMA_PLUGIN_BASE', $pth['folder']['plugin']);

// init access class
// init pages class
cinema\Main::init($plugin_cf, $plugin_tx);

// execute api access
cinema\Api::fetch();


// ================================
// main plugin function call
function cinema($name = false, $options = []) {

	global $onload;

	$o = "";
	$user = "";
	$host = false;
	$platform = false;


	// ==============================================
	// select platform by option
	if (isset($options["platform"])) {

		switch($options["platform"]) {

			case "twitch":
				$platform = "twitch";

			    // Load the Twitch embed script
			    $o .= cinema\JavaScript::create("https://embed.twitch.tv/embed/v1.js");

				break;

			case "youtube":

				break;
		}

	    $o .= cinema\JavaScript::create(CINEMA_PLUGIN_BASE . 'script/' . $options["platform"] . '.js');

		// ==============================================
		// name and valid platform
		if ($name) {



			if (class_exists("ma\Access") && ma\Access::user()) {
				$user = ma\Access::user("username");
			}

			// Include scripts for chat and player
		    $o .= cinema\JavaScript::create(CINEMA_PLUGIN_BASE . 'script/cinema.js');
		    $o .= cinema\JavaScript::create(CINEMA_PLUGIN_BASE . 'script/player.js');
		    $o .= cinema\JavaScript::create(CINEMA_PLUGIN_BASE . 'script/chat.js');


			// get js text
			$text = cinema\Text::array();
			$js_text = [];


			// view option
			if (!isset($options["view"])) {
				$options["view"] = "player";
			}

			// chat option
			if (isset($options["chat"])) {
				$chat = $options["chat"];
			}
			else {
				$chat = "";
			}


			// collect messages and remove prefix
			foreach ($text as $key => $line) {

				if (strpos($key, "js_") !== false) {
					$js_text[substr($key, 3)] = $line;
				}

			}


			// add page title
			if (isset($options["title"])) {
				$title = $options["title"];
			}
			else {
				$title = cinema\Text::default_title();
			}


			// ==============================================
			// options for script start
			$js_options = json_encode(
				[
					"text" => $js_text,
					"name" => $name,
					"user" => $user,
					"chat" => $chat,
					"uuid" => uniqid()
				]
			);


			// add to onload
			$onload .= str_replace("\"", "'", 'cinema_init(' . $js_options . ');');


			// ==============================================
			// render output by function
			switch ($options["view"]) {
				
				// show host view
				case "host":

					$o .= cinema\View::host($name, $title);
					break;

				// show viewer view
				default:

					$o .= cinema\View::twitch($name, $title);
					break;
					
			}
		}

		else {
			cinema\Message::failure("failure_no_program");
		}
	}

	else {
		$o .= cinema\Message::failure("failure_no_platform");
	}


	// ==============================================
	// render messages	
	$o = cinema\Message::render() . $o;

	return $o;
}

?>