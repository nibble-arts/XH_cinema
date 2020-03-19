<?php

namespace cinema;

class Main {


	// ================================================
	// initialise main class
	public static function init ($config, $text) {

		Session::load();
		Config::init($config);
		Text::init($text);

	}

}