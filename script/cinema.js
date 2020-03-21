// ==========================================================================
// init cinema plugin scripts

function cinema_init(options) {

	// if logged, add chat and host capabilities
	chat = new Chat(options);
	host = new Host(options);

	player = new Player(options);

}