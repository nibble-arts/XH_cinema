<?php

/*
 * create a path from an array
 */

namespace cinema;

class Path {

	public static function create($path) {

		// combine path
		if (is_array($path)) {

			array_walk($path, function (&$part, $idx) {

				// handle leading ./
				if (strpos($part, "./") === 0) {
					$part = substr($part, 2);
				}

				$part = trim($part, " \t\n\r\0\x0B/");

			});

			$path = implode("/", $path);
		}

		return $path;
	}
}

?>