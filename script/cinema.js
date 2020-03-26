/* CMSimple_XH plugin
 * cinema
 * start twitch embed and chat
 * (c) 2018 Thomas Winkler
 *
 */

function cinema_init(options) {

	new Chat(options);
	new Player(options);

}

function create_player(options) {

	new Twitch.Embed("twitch-embed", {
		width: 854,
		height: 480,
		channel: options.name,
		layout: "video"
	});
}