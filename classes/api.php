<?php

namespace cinema;

class Api {

	public static function fetch() {

		if (Session::param("cinema_action") && ($name = Session::param("name"))) {

			// init register
			Register::init($name);
			Chat::init($name);




			$program = new Program(Session::param("name"));

			switch (Session::param("cinema_action")) {
				
				case "set":
					if ($program)

					Session::remove_param("cinema_action");

					// set parameters in program status
					foreach (Session::get_param_keys() as $key) {
						$program->set($key, Session::param($key));
					}
					break;

				case "stop":
					$program->reset();
					break;

				case "chat":

					// new text > save
					if (Session::param("text") != "") {
						Chat::send(Session::param("text"), Session::param("user"));
					}

					// return chat list
					echo json_encode(Chat::get());
					die();

			}

			// reset when no id
			if (!$program->get("id")) {
				$program->reset();
			}

			// register uuid
			if (Session::param("uuid")) {
				Register::update(Session::get("uuid"));
			}

			$program->set("clients", Register::registered());

			// send json code
			echo json_encode($program->status());

			// stop execution
			die();
		}
	}
}

?>