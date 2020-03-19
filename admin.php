<?php

/**
 * Cinema plugin
 *
 * @category  CMSimple_XH
 * @package   Cinema
 * @author    Thomas Winkler <thomas.winkler@iggmp.net>
 * @copyright 2020 nibble-arts <http://www.nibble-arts.org>
 * @license   http://www.gnu.org/licenses/gpl-3.0.en.html GNU GPLv3
 * @link      http://cmsimple-xh.org/
 */

/*
 * Prevent direct access.
 */
if (!defined('CMSIMPLE_XH_VERSION')) {
    header('HTTP/1.0 403 Forbidden');
    exit;
}


/*
 * Register the plugin menu items.
 */
if (function_exists('XH_registerStandardPluginMenuItems')) {
    XH_registerStandardPluginMenuItems(true);
}

if (function_exists('cinema') 
    && XH_wantsPluginAdministration('cinema') 
    || isset($cinema) && $cinema == 'true')
{


    $o .= print_plugin_admin('on');

    switch ($admin) {

	    case '':
	        $o .= '<h1>Cinema</h1>';
    		$o .= '<p>Version 0.9</p>';
            $o .= '<p>Copyright 2020</p>';
    		$o .= '<p><a href="http://www.nibble-arts.org" target="_blank">Thomas Winkler</a></p>';
            $o .= '<p>Mit dem Plugin lassen sich Filmprogramme mit Beiträgen aus Vimeo zusammenstellen. Die Programme werden von einem Moderator geleitet und synchron auf allen Clientrechnern gestartet. Jeder Film kann von bestimmten Personen (Juroren) oder allen Zusehern bewertet werden. Die Bewertungen werden gespeichert und können vom Moderator ausgewertet werden.</p>';

	        break;

        case 'plugin_main':
            // include_once(DATABASE_BASE."settings.php");

            // database_settings($action, $admin, $plugin);
            break;

	    default:
	        $o .= plugin_admin_common($action, $admin, $plugin);
            break;
    }

}
?>
