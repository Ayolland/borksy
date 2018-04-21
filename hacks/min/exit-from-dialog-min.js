// exit-from-dialog

var queuedDialogExit = null;

// Hook into game load and rewrite custom functions in game data to Bitsy format.
before('load_game', function (game_data, startWithTitle) {
	// Rewrite custom functions' parentheses to curly braces for Bitsy's
	// interpreter. Unescape escaped parentheticals, too.
	var fixedGameData = game_data
	.replace(/(^|[^\\])\((exit(Now)? ".+?")\)/g, "$1{$2}") // Rewrite (exit...) to {exit...}
	.replace(/\\\((exit(Now)? ".+")\\?\)/g, "($1)"); // Rewrite \(exit...\) to (exit...)
	return [fixedGameData, startWithTitle];
});

// Hook into the game reset and make sure exit data gets cleared.
after('clearGameData', function () {
	queuedDialogExit = null;
});

// Hook into the dialog finish event; if there was an {exit}, travel there now.
after('onExitDialog', function () {
	if (queuedDialogExit) {
		doPlayerExit(queuedDialogExit);
		queuedDialogExit = null;
	}
});

// Implement the {exit} dialog function. It saves the room name and
// destination X/Y coordinates so we can travel there after the dialog is over.
bitsy.exitFunc = function (environment, parameters, onReturn) {
	queuedDialogExit = _getExitParams('exit', parameters);

	onReturn(null);
}

// Implement the {exitNow} dialog function. It exits to the destination room
// and X/Y coordinates right damn now.
bitsy.exitNowFunc = function (environment, parameters, onReturn) {
	var exitParams = _getExitParams('exitNow', parameters);
	if (!exitParams) {
		return;
	}

	doPlayerExit(exitParams);
	onReturn(null);
}

// Rewrite the Bitsy script tag, making these new functions callable from dialog.
inject(
	'var functionMap = new Map();',
	'functionMap.set("exit", exitFunc);',
	'functionMap.set("exitNow", exitNowFunc);'
);

function _getExitParams(exitFuncName, parameters) {
	var params = parameters[0].split(',');
	var roomName = params[0];
	var x = params[1];
	var y = params[2];
	var coordsType = (params[3] || 'exit').toLowerCase();
	var useSpriteCoords = coordsType === 'sprite';
	var roomId = bitsy.names.room.get(roomName);

	if (!roomName || x === undefined || y === undefined) {
		console.warn('{' + exitFuncName + '} was missing parameters! Usage: {' +
			exitFuncName + ' "roomname,x,y"}');
		return null;
	}

	if (roomId === undefined) {
		console.warn("Bad {" + exitFuncName + "} parameter: Room '" + roomName + "' not found!");
		return null;
	}

	return {
		room: roomId,
		x: Number(x),
		y: useSpriteCoords ? 15 - Number(y) : Number(y)
	};
}

// dest === {room: Room, x: Int, y: Int}
function doPlayerExit(dest) {
	bitsy.player().room = dest.room;
	bitsy.player().x = dest.x;
	bitsy.player().y = dest.y;
	bitsy.curRoom = dest.room;
}
// End of (exit) dialog function mod

