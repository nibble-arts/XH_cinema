<?php

namespace cinema;

class Api {

	public static function fetch() {

		$result = [];

		if (Session::param("cinema_action") && ($name = Session::param("name"))) {

			// init classes
			Register::init($name);
			Chat::init($name);
			Status::init($name);

			// register uuid
			if (Session::param("uuid")) {
				Register::update(Session::get("uuid"));
			}


			// add count of registered to status
			Status::set("clients", Register::registered());


			// select action
			switch (Session::param("cinema_action")) {

				// send status
				case "status":

					$result = Status::status();
					break;

				// set value
				case "set":
						
					Session::remove_param("cinema_action");

					// set parameters in status
					foreach (Session::get_param_keys() as $key) {
						Status::set($key, Session::param($key));
					}

					// write new status
					Status::write();

					$result = Status::status();
					break;

				// stop
				case "stop":
					Status::reset();
					Status::write();
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
			if (!Status::get("id")) {

				Status::reset();
				Status::write();
				$result = Status::status();
			}



			// send json code
			echo json_encode($result);

			// stop execution
			die();
		}
	}
}

?>