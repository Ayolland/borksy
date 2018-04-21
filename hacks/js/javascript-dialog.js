//javascript dialog

// Hook into game load and rewrite custom functions in game data to Bitsy format.
before("load_game", function (game_data, startWithTitle) {
	// Rewrite custom functions' parentheses to curly braces for Bitsy's
	// interpreter. Unescape escaped parentheticals, too.
	var fixedGameData = game_data
	.replace(/(^|[^\\])\((.*? ".+?")\)/g, "$1{$2}") // Rewrite (...) to {...}
	.replace(/\\\((.*? ".+")\\?\)/g, "($1)"); // Rewrite \(...\) to (...)
	return [fixedGameData, startWithTitle];
});

// Rewrite the Bitsy script tag, making these new functions callable from dialog.
inject(
	"var functionMap = new Map();",
	"functionMap.set('js', " + function (environment, parameters, onReturn) {
		eval(parameters[0]);
		onReturn(null);
	}.toString() + ");"
);