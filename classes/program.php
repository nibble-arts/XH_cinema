<?php

namespace cinema;

class Program {

	private $name;
	private $path = false;
	private $program = [];


	// create the cinema object
	// set the basic content path
	// create path if not exists
	public function __construct($name) {

		$this->name = $name;
		$this->reset();
		$this->path = Config::path_program();

		// check for directory
		// create if it don't exists
		if (!file_exists($this->path)) {

			if (!mkdir($this->path, 0666, true)) {

				$this->path = false;
				Message::failure("failure_mk_program_dir");
			}
		}
		
		// load program
		$this->load();
	}


	public function reset() {
	}


	// load a program
	private function load() {

		$path = Path::create([$this->path, $this->name . ".ini"]);

		if ($this->path) {

			if (file_exists($path)) {
				$this->program = parse_ini_file($path, true);
			}

			else {
				Message::failure("failure_program_not_found");
			}
		} 
	}


	// add a new program entry
	public function add($value) {
		
		$this->program[] = $value;
		$this->write();
	}


	// remove a entry by key
	public function remove($key) {

		if (isset($this->program[$key])) {
			unset($this->program[$key]);
		}

	}


// remove a entry by value
	public function remove($value) {

		if (($pos = array_search($value, $this->program) !== false) {
			unset($this->program[$pos]);
		}

	}

	// return a program by key
	public function get($key) {

		if (isset($this->program[$key])) {
			return $this->program[$key];
		}

		return false;
	} 


	// write program file
	public function write() {

		// update timestamp
		$this->status["timestamp"] = time();

		file_put_contents(Path::create([$this->path, $this->name . ".ini"]), Array2Ini::serialize($this->program));
		chmod(Path::create([$this->path, $this->name . ".ini"]), 0664);
	}


	// return the program as array
	public function program() {

		return ["program" => $this->program];
	}


}