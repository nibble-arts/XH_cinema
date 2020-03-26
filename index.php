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
function cinema($name = false, $function = false, $options = []) {

	global $onload;

	$o = "";
	$user = "";
	$host = false;

	if ($name) {

		// memberaccess integration
		// host group found
		// if (class_exists("ma\Access") && ma\Access::user() && ma\Groups::user_is_in_group(ma\Access::user()->username(), cinema\Config::config("host_group"))) {

		if (class_exists("ma\Access") && ma\Access::user()) {
			$user = ma\Access::user("username");
		}


	    // Load the Twitch embed script
	    $o .= '<script src="https://embed.twitch.tv/embed/v1.js"></script>';

		// Include Chat script
		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/chat.js"></script>';

		// Include Chat script
		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/player.js"></script>';

		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/cinema.js"></script>';


		// get js text
		$text = cinema\Text::array();
		$js_text = [];

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


		// options for script start
		$options = json_encode(
			[
				"text" => $js_text,
				"name" => $name,
				"user" => $user,
				"uuid" => uniqid()
			]
		);


		// add to onload
		$onload .= str_replace("\"", "'", 'cinema_init(' . $options . ');');

		// switch function
		switch ($function) {
			
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
	
	$o = cinema\Message::render() . $o;

	return $o;
}

?>