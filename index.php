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

		// $o .= '<script src="https://player.vimeo.com/api/player.js"></script>';

		// $o .= '<script src="' . CINEMA_PLUGIN_BASE . 'script/vimeo/player.js"></script>';

		// include javascript
		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/cinema.js"></script>';

		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/chat.js"></script>';

		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/host.js"></script>';

		$o .= '<script type="text/javascript" src="' . CINEMA_PLUGIN_BASE . 'script/player.js"></script>';

		// switch function
		switch ($function) {
			
			// show host view
			case "host":

				// add to onload
				$onload .= "cinema_init({
					'name':'" . $name . "',
					'uuid':'',
					'width':'" . 400 . "',
					'height':'" . 300 . "',
					'user':'" . $user . "'
				});";

				$o .= cinema\View::host($name);
				break;

			// show program window
			default:

				// add to onload
				$onload .= "cinema_init({
					'name':'" . $name . "',
					'uuid':'" . uniqid() . "',
					'width':'" . 1600 . "',
					'height':'" . 900 . "',
					'user':'" . $user . "'
				});";

				$o .= cinema\View::cinema($name, $user);

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