export var borksyInfo = {
	templateVersion: '3.2',
	lastUpdated: "August 14, 2018"
};

export var hacks = {
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
		python: 'yellow',
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
		python: 'yellow',
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
		python: 'red',
		github: false,
		forceLocal: false
	},

	"directional-avatar": {
		readme: true,
		type: "options",
		requires: "edit-image-at-runtime",
		hidden: false,
		order: 10,
		conflicts: false,
		python: 'green',
		github: 'directional%20avatar.js',
		forceLocal: false
	},

	"dynamic-background": {
		readme: false,
		type: "simple",
		requires: false,
		hidden: false,
		order: 10,
		conflicts: false,
		python: 'green',
		github: 'dynamic%20background.js',
		forceLocal: false
	},

	"exit-from-dialog": {
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'red',
		github: 'exit-from-dialog.js',
		forceLocal: false
	},

	"end-from-dialog": {
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'red',
		github: 'end-from-dialog.js',
		forceLocal: false
	},

	"javascript-dialog": {
		readme: true,
		type: "simple",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 2,
		conflicts: false,
		python: 'red',
		github: 'javascript%20dialog.js',
		forceLocal: false
	},

	"transparent-sprites": {
		readme: false,
		type: "options",
		requires: false,
		hidden: false,
		order: 10,
		conflicts: false,
		python: 'green',
		github: 'transparent%20sprites.js',
		forceLocal: false
	},

	"logic-operators-extended": {
		readme: true,
		type: "simple",
		requires: 'kitsy-script-toolkit',
		hidden: false,
		order: 2,
		conflicts: false,
		python: 'red',
		github: 'logic-operators-extended.js',
		forceLocal: false
	},

	"permanent-items": {
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 4,
		conflicts: false,
		python: 'red',
		github: 'permanent%20items.js',
		forceLocal: false
	},

	"solid-items": {
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'red',
		github: 'solid%20items.js',
		forceLocal: false
	},

	"unique-items": {
		readme: true,
		type: "options",
		requires: false,
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'red',
		github: 'unique%20items.js',
		forceLocal: false
	},

	"bitsymuse": {
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'yellow',
		github: 'bitsymuse.js',
		forceLocal: false
	},

	"multi-sprite-avatar": {
		readme: true,
		type: "options",
		requires: "kitsy-script-toolkit",
		hidden: false,
		order: 5,
		conflicts: false,
		python: 'red',
		github: 'multi-sprite%20avatar.js',
		forceLocal: false
	}
};
