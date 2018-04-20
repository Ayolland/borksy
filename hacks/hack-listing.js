hacks = {

	"kitsy": {
		title: "🛠 Kitsy",
		description: "Utilities needed for many hacks",
		author: "@mildmojo",
		readme: false,
		type: "simple",
		requires: false,
		hidden: true,
		order: 1
	},

	"dynamic-background": {
		title: "🖼 Dynamic Background Color",
		description: "Changes the color of the BODY tag to the background color of the current room.",
		author: "Sean S LeBlanc",
		readme: false,
		type: "simple",
		requires: false,
		hidden: false,
		order: 10
	},

	"exit-from-dialog": {
		title: "🚪 Exit From Dialog",
		description: "Adds (Exit) and (ExitNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: "kitsy",
		hidden: false,
		order: 5
	},

	"end-from-dialog": {
		title: "🔚 End From Dialog",
		description: "Adds (End) and (EndNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: "kitsy",
		hidden: false,
		order: 5
	},

	"javascript-dialog": {
		title: "☕ Javascript Dialog",
		description: "Lets you execute arbitrary JavaScript from dialog (including inside conditionals).",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: "kitsy",
		hidden: false,
		order: 2
	},

	"transparent-sprites": {
		title: "🏁 Transparent Sprites",
		description: "Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",
		author: "Sean S. LeBlanc",
		readme: false,
		type: "simple",
		requires: false,
		hidden: false,
		order: 10
	},

	"logic-operators-extended": {
		title: "🔀 Extended Logic Operators",
		description: "Adds conditional logic operators.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requires: 'kitsy',
		hidden: false,
		order: 2
	},

	"permanent-items": {
		title: "⏳ Permanent Items",
		description: "Prevents certain items from being picked up, but allows them to be walked over and triggers their dialog.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: false,
		hidden: false,
		order: 5
	},

	"solid-items": {
		title: "🛑 Solid Items",
		description: "Prevents certain items from being picked up or walked over, but still triggers their dialog.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: false,
		hidden: false,
		order: 5
	},

	"unique-items": {
		title: "❄ Unique Items",
		description: "Adds support for items which, when picked up, remove all other instances of that item from the game.",
		author: "Sean S. LeBlanc",
		readme: true,
		type: "simple",
		requires: false,
		hidden: false,
		order: 5
	}

};