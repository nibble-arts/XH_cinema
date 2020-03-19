<?php

namespace cinema;

class Chat {

	private static $name;
	private static $path;


	// init chat class
	public static function init($name) {

		self::$name = $name;
		self::$path = Path::create([Config::path_program(), $name . ".chat.ini"]);

	}


	// send message
	public static function send($text, $user = false) {

		date_default_timezone_set("UTC");
		
		$data = [
			time() => [
				"text" => $text,
				"user" => $user,
			]
		];

		// write message to file
		file_put_contents(self::$path, Array2ini::serialize($data), FILE_APPEND);
	}


	// get messages as array
	// newest message first
	public static function get() {
		return array_reverse(parse_ini_file(self::$path, true), true);
	}
}