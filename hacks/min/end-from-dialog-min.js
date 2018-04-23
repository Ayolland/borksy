// end-from-dialog

var queuedEndingNarration = null;

// Hook into game load and rewrite custom functions in game data to Bitsy format.
before('load_game', function (game_data, startWithTitle) {
	// Rewrite custom functions' parentheses to curly braces for Bitsy's
	// interpreter. Unescape escaped parentheticals, too.
	var fixedGameData = game_data
	.replace(/(^|[^\\])\(((end|endNow)( ".+?")?)\)/g, "$1{$2}") // Rewrite (end...) to {end...}
	.replace(/(^|\\)\(((end|endNow)( ".+?")?)\\?\)/g, "($2)"); // Rewrite \(end...\) to (end...)
	return [fixedGameData, startWithTitle];
});

// Hook into the game reset and make sure queued ending data gets cleared.
after('clearGameData', function () {
	queuedEndingNarration = null;
});

// Hook into the dialog finish event; if there was an {end}, start the ending.
after('onExitDialog', function () {
	if (!bitsy.isEnding && queuedEndingNarration) {
		bitsy.startNarrating(queuedEndingNarration === true ? null : queuedEndingNarration, true);
	}
});

// Implement the {end} dialog function. It stores the ending narration, if any,
// and schedules the game to end after the current dialog finishes.
bitsy.endFunc = function (environment, parameters, onReturn) {
	queuedEndingNarration = parameters || true;

	onReturn(null);
}

// Implement the {endNow} dialog function. It starts ending narration, if any,
// and restarts the game right damn now.
bitsy.endNowFunc = function (environment, parameters, onReturn) {
	bitsy.endFunc.call(this, environment, parameters, function () {});
	bitsy.dialogBuffer.EndDialog();
	bitsy.onExitDialog();
}

// Rewrite the Bitsy script tag, making these new functions callable from dialog.
utilsInject(
	'var functionMap = new Map();',
	'functionMap.set("end", endFunc);',
	'functionMap.set("endNow", endNowFunc);'
);

