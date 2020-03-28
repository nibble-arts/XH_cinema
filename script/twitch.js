/*
 * Twitch embed function
 */

function create_player(options) {

	new Twitch.Embed("twitch-embed", {
		width: 854,
		height: 480,
		channel: options.name,
		layout: "video"
	});
}