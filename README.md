# CMSimple Cinema Plugin

The aim of the plugin is to offer a hosted cinema like experience, where multiple users can view films at the same time. The content is streamed from VIMEO and controlled by the API of the plugin.

# API
A cinema program is used defining a name. With the name the necessary data is stored in the content directory. Three files are created:

* {name}.status.ini
* {name}.register.ini
* {name}.chat.ini

The status file holds the host commands that control all connected players. If an VIMEO-ID is present, the corresponding video is embedded in all player pages. A status property defines the player status:

* stop: The players are destroyed
* pause: The players are in pause mode
* play: The players start playback
* replay: The players play in loop

The status file only can be changed by the host.

The register file holds the UUIDs of the connected clients. Each client sends an update message every second. If the message stays away for a time, set in the plugin configuration, the entry is removed.

The chat file holds the chat messages of the program. The host can save or clear the chat.

# Plugin Use
The plugin as player is called by {name} is the program name:

    {{{cinema("{name}")}}}

For the host, the plugin call is:

    {{{cinema("{name}","host")}}}

As third parameter, a options array can be given along. This is only possible for players, not the host:

    [
        "title" => "Title string, when no video is loaded",
        "controls" => true/false,
    ]

    {{{cinema("{name","['title' => '','controls' => ''")}}}

If the controls option is true, the VIMEO control pannel is shown and the remote control from the host is ignored.

If the option is false, the VIMEO player is controled by the host through the api.

# Program (in developement)
A host can set up a program, which is a playlist of videos that can simply be selected and started.