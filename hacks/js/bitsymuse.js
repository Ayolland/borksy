//bitsymuse

var bitsymuseHackOptions = {
	BORKSY-OPTIONS
};

var currentMusic;
var roomMusicFlag = null;

// expand the map to include ids of rooms listed by name
after('load_game', function () {
	var room;
	for (var i in bitsymuseHackOptions.musicByRoom) {
		if (bitsymuseHackOptions.musicByRoom.hasOwnProperty(i)) {
			room = getRoom(i);
			if (room) {
				bitsymuseHackOptions.musicByRoom[room.id] = bitsymuseHackOptions.musicByRoom[i];
			}
		}
	}
});

var audioCache = {};

function getAudio(id) {
	var el = audioCache[id] || (audioCache[id] = document.getElementById(id));
	if (!el) {
		throw new Error("bitsymuse tried to use audio with id '" + id + "' but couldn't find one on the page!");
	}
	return el;
}

function playSound(soundParam) {
	if (!soundParam) {
		return;
	}
	getAudio(soundParam).play();
}

function changeMusic(newMusic) {
	var audio;
	// if we didn't get new music,
	// or the music didn't change,
	// there's no work to be done
	if (!newMusic || newMusic === currentMusic) {
		return;
	}

	// stop old music
	if (currentMusic && currentMusic !== bitsymuseHackOptions.silenceId) {
		audio = getAudio(currentMusic);
		audio.pause();
		if (!bitsymuseHackOptions.resume) {
			audio.currentTime = 0.0;
		}
	}

	// start new music
	currentMusic = newMusic;
	// special case: don't start anything new
	if (newMusic === bitsymuseHackOptions.silenceId) {
		return;
	}
	getAudio(newMusic).play();
}

after('drawRoom', function () {
	if (roomMusicFlag !== bitsy.curRoom) {
		changeMusic(bitsymuseHackOptions.musicByRoom[bitsy.curRoom]);
		roomMusicFlag = bitsy.curRoom;
	}
});

// Implement the {music} dialog function.
// It changes the music track as soon as it is called.
addDialogTag('music', function (environment, parameters, onReturn) {
	if (!parameters[0]) {
		throw new Error('{music} was missing parameters! Usage: {music "track name"}');
	}
	changeMusic(parameters[0]);
	onReturn(null);
});

// Implement the {musicEnd} dialog function.
// It changes the music track once the dialog closes.
addDeferredDialogTag('musicEnd', function (environment, parameters) {
	if (!parameters[0]) {
		throw new Error('{musicEnd} was missing parameters! Usage: {musicEnd "track name"}');
	}
	changeMusic(parameters[0]);
});

addDialogTag('soundeffect', function (environment, parameters, onReturn) {
	if (!parameters[0]) {
		throw new Error('{soundeffect} was missing parameters! Usage: {soundeffect "track name"}');
	}
	playSound(parameters[0]);
	onReturn(null);
});
// End of (music) dialog function mod