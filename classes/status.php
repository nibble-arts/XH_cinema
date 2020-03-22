<?php

namespace cinema;

class Status {

	private static $name;
	private static $path = false;
	private static $status;


	// create the status object
	// set the basic content path
	// create path if not exists
	public static function init($name) {

		// self::reset();
		self::$name = $name;
		self::$path = Config::path_program();

		// check for directory
		// create if it don't exists
		if (!file_exists(self::$path)) {

			if (!mkdir(self::$path, 0666, true)) {

				self::$path = false;
				Message::failure("failure_mk_program_dir");
			}
		}
		
		// load status
		else {
			self::$status = parse_ini_file(Path::create([self::$path, self::$name . ".status.ini"]), true);
		}
	}


	public static function reset() {

		self::$status["id"] = "";
		self::$status["status"] = "stop";
		self::$status["duration"] = "";
		
		/*self::$status = [
			"id" => "",
			"status" => "stop",
			"name" => "",
			"user" => "",
			"duration" => "",
			"timestamp" => "",
			"clients" => ""
		];*/

	}


	// set a new status property
	public static function set($key, $value) {
		self::$status[$key] = $value;
	}


	// remove a key
	public static function clear($key) {

		if (isset(self::$status[$key])) {
			unset(self::$status[$key]);
		}

	}


	// return a status property by key
	public static function get($key) {

		if (isset(self::$status[$key])) {
			return self::$status[$key];
		}

		return false;
	} 


	// write status file
	public static function write() {

		// update timestamp
		self::$status["timestamp"] = time();

		file_put_contents(Path::create([self::$path, self::$name . ".status.ini"]), Array2Ini::serialize(self::$status));
	}


	// return the status of a program
	public static function status() {
		return ["status" => self::$status];
	}


}