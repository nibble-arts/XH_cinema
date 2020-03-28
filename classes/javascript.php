<?php

namespace cinema;

class JavaScript {

	public static function create($source) {

		// is local source
		// if (strpos($source, "http") === false) {
		// 	$source = Path::create(["", CMSIMPLE_ROOT, $source]);
		// }

		return '<script type="text/javascript" src="' . $source . '"></script>';
	}
}

?>