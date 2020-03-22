<?php

namespace cinema;

class Register {

	private static $path;
	private static $name;
	private static $registered = false;


	// load registered
	public static function init($name) {

		self::$name = $name;
		self::$path = Path::create([Config::path_program(), $name . ".register.ini"]);

		self::load();

		// clean registry
		self::clean();
	}


	// update uuid
	public static function update($uuid) {

		self::load();

		if (is_array(self::$registered)) {
			self::$registered[$uuid] = time();
		}

		self::clean();
		self::write();
	}


	// clean old entries
	public static function clean() {

		foreach (self::$registered as $uuid => $time) {

			// timeout -> clear entry
			if ($time < time() - intval(Config::register_timeout())) {
				unset(self::$registered[$uuid]);
			}
		}
	}


	// get number of registered
	public static function registered() {
		return count (self::$registered);
	}


	// load register
	private static function load() {
		self::$registered = parse_ini_file(self::$path);
	}


	// write registered to file
	private static function write() {

		// write to ini file
		if (self::$registered) {
			file_put_contents(self::$path, Array2ini::serialize(self::$registered), true);
		}
	}
}