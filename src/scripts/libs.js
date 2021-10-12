window.loadedFiles ={};

window.borksyInfo = {
	lastUpdated: "September 16, 2021",
	templates: [
		{filename:"Bitsy.5.5", description: "Bitsy 5.5 (modified for Borksy)", isDefault: false},
		{filename:"BitsyHD.5.1", description: "Bitsy HD + Borksy (modified from Bitsy 5.1)", isDefault: false},
		{filename:"Bitsy.6.0", description: "Bitsy 6.0 (modified for Borksy)", isDefault: false},
		{filename:"Bitsy.6.3", description: "Bitsy 6.3 (modified for Borksy)", isDefault: false},
		{filename:"Bitsy.6.4", description: "Bitsy 6.4 (modified for Borksy)", isDefault: false},
		{filename:"Bitsy.6.5", description: "Bitsy 6.5", isDefault: false},
		{filename:"Bitsy.7.0", description: "Bitsy 7.0", isDefault: false},
		{filename:"Bitsy.7.2", description: "Bitsy 7.2", isDefault: false},
		{filename:"Bitsy.7.8", description: "Bitsy 7.8", isDefault: false},
		{filename:"Bitsy.7.10", description: "Bitsy 7.10", isDefault: true},
	]
};

window.hacks = {

	// "kitsy-script-toolkit": {
	// 	title: "🛠 Kitsy",
	// 	description: "Utilities needed for many hacks",
	// 	author: "@mildmojo",
	// 	readme: false,
	// 	type: "simple",
	// 	requires: "utils",
	// 	hidden: true,
	// 	order: 2,
	// 	conflicts: false,
	// 	github: false,
	// 	forceLocal: false
	// },

	// "utils": {
	// 	title: "🛠 Utils",
	// 	description: "Utilities needed for many hacks",
	// 	author: "Sean S LeBlanc",
	// 	readme: false,
	// 	type: "simple",
	// 	requires: false,
	// 	hidden: true,
	// 	order: 1,
	// 	conflicts: false,
	// 	github: false,
	// 	forceLocal: false
	// },

	// "edit-image-at-runtime": {
	// 	title: "🛠 Edit Image At Runtime",
	// 	description: "Utilities for changing drawings in-game",
	// 	author: "Sean S LeBlanc",
	// 	readme: false,
	// 	type: "simple",
	// 	requires: "utils",
	// 	hidden: true,
	// 	order: 2,
	// 	conflicts: false,
	// 	github: false,
	// 	forceLocal: false
	// },

	// "logic-operators-extended": {
	// 	title: "🔀 Extended Logic Operators",
	// 	description: "Adds conditional logic operators.",
	// 	author: "@mildmojo",
	// 	readme: true,
	// 	type: "simple",
	// 	requires: 'kitsy-script-toolkit',
	// 	hidden: true,
	// 	order: 2,
	// 	conflicts: false,
	// 	github: 'logic-operators-extended.js',
	// 	forceLocal: false
	// },

	// "paragraph-break": {
	// 	title: "📃 Paragraph Break",
	// 	description: "Adds paragraph breaks to the dialogue parser.",
	// 	author: "Sean S. LeBlanc and David Mowatt",
	// 	readme: true,
	// 	type: "simple",
	// 	requires: "",
	// 	hidden: true,
	// 	order: 2,
	// 	conflicts: false,
	// 	github: 'paragraph-break.js',
	// 	forceLocal: false
	// },

	// "3d": {
	// 	title: "📦 3d",
	// 	description: "bitsy in three dee",
	// 	author: "Sean S. LeBlanc & Elkie Nova",
	// 	readme: true,
	// 	type: "options",
	// 	requires: "",
	// 	hidden: true,
	// 	order: 3,
	// 	conflicts: false,
	// 	github: '3d.js',
	// 	forceLocal: false
	// },

	// "character-portraits-animated": {
	// 	title: "🙀 Character Portraits Animated",
	// 	description: "high quality anime gifs",
	// 	author: "Sean S. LeBlanc",
	// 	readme: true,
	// 	type: "options",
	// 	requires: "",
	// 	hidden: true,
	// 	order: 5,
	// 	conflicts: false,
	// 	github: 'character-portraits-animated.js',
	// 	forceLocal: false
	// },

	"avatar-by-room": {
		title: "👥 Avatar By Room",
		description: "Allows changing the avatar in certain rooms.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'avatar-by-room.js',
		forceLocal: false
	},

	"backdrops": {
		title: "🖼 Backdrops",
		description: "Gives the game a backdrop",
		author: "Cephalopodunk",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'backdrops.js',
		forceLocal: false
	},

	"bitsymuse": {
		title: "😌 Bitsymuse",
		description: "A hack that a variety of audio controls, including music that changes as you move between rooms.",
		author: "David Mowatt",
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'bitsymuse.js',
		forceLocal: false
	},

	"character-portraits": {
		title: "😽 Character Portraits",
		description: "High Quality Anime Jpegs (or pngs i guess)",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'character-portraits.js',
		forceLocal: false
	},

	"dialog-choices": {
		title: "🔀 Dialog Choices",
		description: "Allows binary(?) dialog choices.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'dialog-choices.js',
		forceLocal: false
	},

	"dialog-jump": {
		title: "🚀 Dialog Jump",
		description: "Allows jumping from one dialog entry to another.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'dialog-jump.js',
		forceLocal: false
	},

	"dialog-pause": {
		title: "💬 Dialog Pause",
		description: "Allows adding pauses in between printing text.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'dialog-pause.js',
		forceLocal: false
	},

	"direction-in-dialog": {
		title: "🔝 Direction in Dialog",
		description: "Provides a variable with player direction.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'direction-in-dialog.js',
		forceLocal: false
	},

	"directional-avatar": {
		title: "↔ Directional Avatar",
		description: "Flips the player's sprite based on directional movement",
		author: "Sean S LeBlanc",
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 10,
		conflicts: false,
		github: 'directional-avatar.js',
		forceLocal: false
	},

	"dynamic-background": {
		title: "🖼 Dynamic Background Color",
		description: "Changes the color of the BODY tag to the background color of the current room.",
		author: "Sean S LeBlanc",
		readme: false,
		type: "simple",
		requires: false,
		hidden: false,
		order: 10,
		conflicts: false,
		github: 'dynamic-background.js',
		forceLocal: false
	},

	"edit-image-from-dialog": {
		title: "🖌 Edit Image from Dialog",
		description: "Allows editing of sprites, items, and tiles from dialog.",
		author: "Sean S LeBlanc",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'edit-image-from-dialog.js',
		forceLocal: false
	},

	"edit-room-from-dialog": {
		title: "🏠 Edit Room from Dialog",
		description: "Allows editing the content of a room from dialog.",
		author: "Dana Holdampf",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'edit-room-from-dialog.js',
		forceLocal: false
	},

	"end-from-dialog": {
		title: "🔚 End From Dialog",
		description: "Adds (End) and (EndNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'end-from-dialog.js',
		forceLocal: false
	},

	"exit-from-dialog": {
		title: "🚪 Exit From Dialog",
		description: "Adds (Exit) and (ExitNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'exit-from-dialog.js',
		forceLocal: false
	},

	"gamepad-input": {
		title: "🎮 Gamepad Input",
		description: "Adds HTML5 gamepad support.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 3,
		conflicts: false,
		github: 'gamepad-input.js',
		forceLocal: false
	},

	"gravity": {
		title: "🍂 Gravity",
		description: "Adds pseudo-platforming/gravity/physics.",
		author: "Cole Sea",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 10,
		conflicts: false,
		github: 'gravity.js',
		forceLocal: false
	},

	"javascript-dialog": {
		title: "☕ Javascript Dialog",
		description: "Lets you execute arbitrary JavaScript from dialog (including inside conditionals).",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'javascript-dialog.js',
		forceLocal: false
	},

	"long-dialog": {
		title: "📜 Long Dialog",
		description: "put more words onscreen",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 3,
		conflicts: false,
		github: 'long-dialog.js',
		forceLocal: false
	},

	"multi-sprite-avatar": {
		title: "👨‍👨‍👧‍👧 Multi-Sprite Avatar",
		description: "Allows multiple sprites to be moved together along with the player to create the illusion of a larger avatar.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'multi-sprite-avatar.js',
		forceLocal: false
	},

	"opaque-tiles": {
		title: "⬛ Opaque Tiles",
		description: "Adds tiles which hide the player.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'opaque-tiles.js',
		forceLocal: false
	},

	"permanent-items": {
		title: "⏳ Permanent Items",
		description: "Prevents certain items from being picked up, but allows them to be walked over and triggers their dialog.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 4,
		conflicts: false,
		github: 'permanent-items.js',
		forceLocal: false
	},

	"replace-drawing": {
		title: "🎭 Replace Drawing",
		description: "Add name-tags to replace drawings when the game is loading",
		author: "Elkie Nova",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 3,
		conflicts: false,
		github: 'replace-drawing.js',
		forceLocal: false
	},

	"save": {
		title: "💾 Save",
		description: "Save/Load Your Game",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'save.js',
		forceLocal: false
	},

	"solid-items": {
		title: "🛑 Solid Items",
		description: "Prevents certain items from being picked up or walked over, but still triggers their dialog.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'solid-items.js',
		forceLocal: false
	},

	"stopwatch": {
		title: "⏱️ Stopwatch",
		description: "Allows timing player actions.",
		author: "Lenny Magner",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'stopwatch.js',
		forceLocal: false
	},

	"text-to-speech": {
		title: "🗣 Text to Speech",
		description: " Provides text-to-speech for bitsy dialog.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'text-to-speech.js',
		forceLocal: false
	},

	"textbox-styler": {
		title: "📐 Textbox Styler",
		description: " Customize the style and properties of the textbox.",
		author: "Dana Holdampf & Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'textbox-styler.js',
		forceLocal: false
	},

	"tracery-processing": {
		title: "🏰 Tracery Processing",
		description: "process all dialog text with a tracery grammar",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: "",
		hidden: false,
		order: 3,
		conflicts: false,
		github: 'tracery-processing.js',
		forceLocal: false
	},

	"transparent-dialog": {
		title: "👁️‍🗨️ Transparent Dialog",
		description: "Makes the dialog box have a transparent background.",
		author: "Sean S. LeBlanc",
		readme: false,
		type: "simple",
		requires: "",
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'transparent-dialog.js',
		forceLocal: false
	},

	"transparent-sprites": {
		title: "🏁 Transparent Sprites",
		description: "Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 30,
		conflicts: false,
		github: 'transparent-sprites.js',
		forceLocal: false
	},

	"unique-items": {
		title: "❄ Unique Items",
		description: "Adds support for items which, when picked up, remove all other instances of that item from the game.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 5,
		conflicts: false,
		github: 'unique-items.js',
		forceLocal: false
	},

};
