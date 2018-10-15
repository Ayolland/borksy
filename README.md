Borksy is a tool made to assist in hacking and extending games built with Bitsy Game Maker.

[**View the Demo**](http://ayolland.github.io/borksy/)

Borksy uses jQuery (don't even start) to assemble and compile text files and user input into a final HTML file that runs the Bitsy game.

**NOTE:** Font data and customizer is now deprecated as of Bitsy 5.1. Use Bitsy's font tools.

Current features:
* Fixed Mobile touch controls for Itch.io embeds
* Hacks are loaded from Github using AJAX
* Preloaded Hacks Menu
* Editable Hack Options
* HotKeys for Save/Restore Defaults
* Editable Page Title / Filename
* Customize HTML/CSS
* Font Importer and Presets *(deprecated*
* Enables extended ASCII characters
* Field for extra JS / Hacks
* Bitsy variables are exposed in JS as global variable *bitsyVariableMap*
* Uses a version of the default Bitsy font with more consistent unicode support.
* Saves work to LocalStorage for persistence
* Party Mode

Planned features:
* HTML/CSS Theme Presets
* More Hacks

Borksy relies heavily on [the work done here by Sean](https://github.com/seleb/bitsy-hacks) creating and collecting hacks for Bitsy. 