var loadedFiles ={};

var borksyInfo = {
	templateVersion: '3.6',
	lastUpdated: "March 9, 2019"
};

var hacks = {

	"kitsy-script-toolkit": {
		title: "🛠 Kitsy",
		description: "Utilities needed for many hacks",
		author: "@mildmojo",
		readme: false,
		type: "simple",
		requires: "utils",
		hidden: true,
		order: 2,
		conflicts: false,
		github: false,
		forceLocal: false
	},

	"utils": {
		title: "🛠 Utils",
		description: "Utilities needed for many hacks",
		author: "Sean S LeBlanc",
		readme: false,
		type: "simple",
		requires: false,
		hidden: true,
		order: 1,
		conflicts: false,
		github: false,
		forceLocal: false
	},

	"edit-image-at-runtime": {
		title: "🛠 Edit Image At Runtime",
		description: "Utilities for changing drawings in-game",
		author: "Sean S LeBlanc",
		readme: false,
		type: "simple",
		requires: "utils",
		hidden: true,
		order: 2,
		conflicts: false,
		github: false,
		forceLocal: false
	},

	"directional-avatar": {
		title: "↔ Directional Avatar",
		description: "Flips the player's sprite based on directional movement",
		author: "Sean S LeBlanc",
		readme: true,
		type: "options",
		requires: "edit-image-at-runtime",
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

	"transparent-sprites": {
		title: "🏁 Transparent Sprites",
		description: "Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",
		author: "Sean S. LeBlanc",
		readme: false,
		type: "options",
		requires: false,
		hidden: false,
		order: 10,
		conflicts: false,
		github: 'transparent-sprites.js',
		forceLocal: false
	},

	"logic-operators-extended": {
		title: "🔀 Extended Logic Operators",
		description: "Adds conditional logic operators.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: 'kitsy-script-toolkit',
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'logic-operators-extended.js',
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

	"avatar-by-room": {
		title: "👥 Avatar By Room",
		description: "Allows changing the avatar in certain rooms",
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

	"transparent-dialog": {
		title: "👁️‍🗨️ Transparent Dialog",
		description: "Makes the Dialog Box have a Transparent Background",
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

	"stopwatch": {
		title: "⏱️ Stopwatch",
		description: "Allows Timing Player Actions",
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

	"paragraph-break": {
		title: "📃 Paragraph Break",
		description: "Adds paragraph breaks to the dialogue parser",
		author: "Sean S. LeBlanc and David Mowatt",
		readme: true,
		type: "simple",
		requires: "",
		hidden: false,
		order: 2,
		conflicts: false,
		github: 'paragraph-break.js',
		forceLocal: false
	}

};
