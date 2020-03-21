<?php

namespace cinema;

class Api {

	public static function fetch() {

		$result = false;


		if (Session::param("cinema_action") && ($name = Session::param("name"))) {

			// init register
			Register::init($name);
			Chat::init($name);

			// register uuid
			if (Session::param("uuid")) {
				Register::update(Session::get("uuid"));
			}


			// load program and add count of registered
			$program = new Program(Session::param("name"));
			$program->set("clients", Register::registered());


			// select action
			switch (Session::param("cinema_action")) {

				// send status
				case "status":

					$result = $program->status();
					break;

				// set value
				case "set":
					if ($program) {
						
						Session::remove_param("cinema_action");

						// set parameters in program status
						foreach (Session::get_param_keys() as $key) {
							$program->set($key, Session::param($key));
						}

						$program->write();
					}

					$result = $program->status();
					break;

				// stop
				case "stop":
					$program->reset();
					$program->write();
					break;

				// chat
				case "chat":

					// new text > save
					if (Session::param("text") != "") {
						Chat::send(Session::param("text"), Session::param("user"));
					}

					$result = Chat::get();

					echo json_encode($result);
					die();
			}

			// reset when no id
			if (!$program->get("id")) {

				$program->reset();
				$result = $program->status();
			}



			// send json code
			echo json_encode($result);

			// stop execution
			die();
		}
	}
}

?>