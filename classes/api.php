<?php

namespace cinema;

class Api {

	public static function fetch() {

		$result = [];

		if (Session::param("cinema_action") && ($name = Session::param("name"))) {

			// init classes
			Register::init($name);
			Chat::init($name);

			// register uuid
			if (Session::param("uuid")) {
				Register::update(Session::get("uuid"));
			}


			// select action
			switch (Session::param("cinema_action")) {

				// chat
				case "chat":

					// new text > save
					if (Session::param("text") != "") {
						Chat::send(Session::param("text"), Session::param("user"));
					}

					$result = Chat::get();

					$result["status"] = Register::registered();
debug($result);

					echo json_encode($result);
					die();
			}


			// stop execution
			die();
		}
	}
}

?>