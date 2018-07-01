// multi-sprite-avatar

var multiSpriteAvatarHackOptions = {
	BORKSY-OPTIONS
};

if (multiSpriteAvatarHackOptions.enabledOnStart) {
	after("onready", enableBig);
}

var enabled = false;
var pieces = [];

function syncPieces() {
	var p = bitsy.player();
	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		var spr = bitsy.sprite[piece.spr];

		spr.room = p.room;
		spr.x = p.x + piece.x;
		spr.y = p.y + piece.y;
	}
}

function enableBig(newPieces) {
	disableBig();
	pieces = newPieces || multiSpriteAvatarHackOptions.pieces;
	enabled = true;
	syncPieces();
}

function disableBig() {
	enabled = false;
	for (var i = 0; i < pieces.length; ++i) {
		bitsy.sprite[pieces[i].spr].room = null;
	}
}

// handle item/ending/exit collision
var multiSpriteAvatarGetItemIndex = bitsy.getItemIndex;
var multiSpriteAvatarGetEnding = bitsy.getEnding;
var multiSpriteAvatarGetExit = bitsy.getExit;
var getItemIndexOverride = function (roomId, x, y) {
	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		var idx = multiSpriteAvatarGetItemIndex(roomId, x + piece.x, y + piece.y);
		if (idx !== -1) {
			return idx;
		}
	}
	return -1;
};
var getEndingOverride = function (roomId, x, y) {
	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		var e = multiSpriteAvatarGetEnding(roomId, x + piece.x, y + piece.y);
		if (e) {
			return e;
		}
	}
}
var getExitOverride = function (roomId, x, y) {
	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		var e = multiSpriteAvatarGetExit(roomId, x + piece.x, y + piece.y);
		if (e) {
			return e;
		}
	}
}
before("movePlayer", function () {
	if (enabled) {
		bitsy.getItemIndex = getItemIndexOverride;
		bitsy.getEnding = getEndingOverride;
		bitsy.getExit = getExitOverride;
	}
});
after("movePlayer", function () {
	bitsy.getItemIndex = multiSpriteAvatarGetItemIndex;
	bitsy.getEnding = multiSpriteAvatarGetEnding;
	bitsy.getExit = multiSpriteAvatarGetExit;
	if (enabled) {
		syncPieces();
	}
});


// handle wall/sprite collision
function repeat(fn) {
	var p = bitsy.player();
	var x = p.x;
	var y = p.y;
	var r;
	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		p.x = x + piece.x;
		p.y = y + piece.y;
		r = r || fn();
	}
	p.x = x;
	p.y = y;
	return r;
}
var repeats = [
	'getSpriteLeft',
	'getSpriteRight',
	'getSpriteUp',
	'getSpriteDown',
	'isWallLeft',
	'isWallRight',
	'isWallUp',
	'isWallDown'
];
for (var i = 0; i < repeats.length; ++i) {
	var r = repeats[i];
	var _fn = bitsy[r];
	bitsy[r] = function (fn) {
		return enabled ? repeat(fn) : fn();
	}.bind(undefined, _fn);
}

// prevent player from colliding with their own pieces
function filterPieces(id) {
	for (var i = 0; i < pieces.length; ++i) {
		if (id === pieces[i].spr) {
			return null;
		}
	}
	return id;
}
var multiSpriteAvatarGetSpriteAt = bitsy.getSpriteAt;
bitsy.getSpriteAt = function () {
	return filterPieces(multiSpriteAvatarGetSpriteAt.apply(this, arguments));
}