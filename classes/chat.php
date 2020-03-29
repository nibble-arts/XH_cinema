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

		if (!$chat = parse_ini_file(self::$path, true)) {
			$chat = [];
		}

		$chat[count($chat) + 1] = [
			"text" => $text,
			"user" => $user,
			"timestamp" => intval(microtime(true) * 1000)
		];

		// restrict to maximal messages from config
		// if (count($chat) >Condig::chat_max_messages()) {
		// 	array_shift($chat);
		// }


		// write message to file
		file_put_contents(self::$path, Array2ini::serialize($chat));
		chmod(self::$path, 0664);
	}


	// get messages as array
	// newest message first
	public static function get() {

		// sort by timestamp desc
		if (!$chat = parse_ini_file(self::$path, true)) {
			$chat = [];
		}

		// sort descending
		krsort($chat);

		return ["chat" => $chat];
	}
}