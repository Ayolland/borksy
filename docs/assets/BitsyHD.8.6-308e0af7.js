const t=`<!DOCTYPE HTML>
<html>

<!-- HEADER -->

<!-- Borksy {{BORKSY-VERSION}} -->
<!-- bitsy-hacks {{HACKS-VERSION}} -->
<!-- Bitsy HD ~> Bitsy 8.6 -->
<head>

<meta charset="UTF-8">

<title>{{TITLE}}</title>

<script type="text/bitsyGameData" id="exportedGameData">
{{{GAMEDATA}}}
<\/script>

<style>
{{{CSS}}}
</style>

<!-- SCRIPTS -->
<script>
function startExportedGame() {
	var gameCanvas = document.getElementById("game");
	var gameData = document.getElementById("exportedGameData").text.slice(1);
	var defaultFontData = document.getElementById(defaultFontName).text.slice(1);
	loadGame(gameCanvas, gameData, defaultFontData);
	initSystem();
}
<\/script>

<!-- system -->
<script>
function InputSystem() {
	var self = this;

	this.Key = {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SPACE: 32,
		ENTER: 13,
		W: 87,
		A: 65,
		S: 83,
		D: 68,
		R: 82,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		CMD: 224
	};

	var pressed;
	var ignored;
	var touchState;

	var isRestartComboPressed = false;

	var SwipeDir = {
		None : -1,
		Up : 0,
		Down : 1,
		Left : 2,
		Right : 3,
	};

	function resetAll() {
		isRestartComboPressed = false;

		pressed = {};
		ignored = {};

		touchState = {
			isDown : false,
			startX : 0,
			startY : 0,
			curX : 0,
			curY : 0,
			swipeDistance : 30,
			swipeDirection : SwipeDir.None,
			tapReleased : false
		};
	}

	resetAll();

	function stopWindowScrolling(e) {
		if (e.keyCode == self.Key.LEFT || e.keyCode == self.Key.RIGHT || e.keyCode == self.Key.UP || e.keyCode == self.Key.DOWN || !isPlayerEmbeddedInEditor) {
			e.preventDefault();
		}
	}

	function isRestartCombo(e) {
		return (e.keyCode === self.Key.R && (e.getModifierState("Control")|| e.getModifierState("Meta")));
	}

	function eventIsModifier(event) {
		return (event.keyCode == self.Key.SHIFT || event.keyCode == self.Key.CTRL || event.keyCode == self.Key.ALT || event.keyCode == self.Key.CMD);
	}

	function isModifierKeyDown() {
		return (self.isKeyDown(self.Key.SHIFT) || self.isKeyDown(self.Key.CTRL) || self.isKeyDown(self.Key.ALT) || self.isKeyDown(self.Key.CMD));
	}

	this.ignoreHeldKeys = function() {
		for (var key in pressed) {
			if (pressed[key]) { // only ignore keys that are actually held
				ignored[key] = true;
				// bitsyLog("IGNORE -- " + key, "system");
			}
		}
	}

	this.onkeydown = function(event) {
		enableGlobalAudioContext();
		// bitsyLog("KEYDOWN -- " + event.keyCode, "system");

		stopWindowScrolling(event);

		isRestartComboPressed = isRestartCombo(event);

		// Special keys being held down can interfere with keyup events and lock movement
		// so just don't collect input when they're held
		{
			if (isModifierKeyDown()) {
				return;
			}

			if (eventIsModifier(event)) {
				resetAll();
			}
		}

		if (ignored[event.keyCode]) {
			return;
		}

		pressed[event.keyCode] = true;
		ignored[event.keyCode] = false;
	}

	this.onkeyup = function(event) {
		// bitsyLog("KEYUP -- " + event.keyCode, "system");
		pressed[event.keyCode] = false;
		ignored[event.keyCode] = false;
	}

	this.ontouchstart = function(event) {
		enableGlobalAudioContext();

		event.preventDefault();

		if( event.changedTouches.length > 0 ) {
			touchState.isDown = true;

			touchState.startX = touchState.curX = event.changedTouches[0].clientX;
			touchState.startY = touchState.curY = event.changedTouches[0].clientY;

			touchState.swipeDirection = SwipeDir.None;
		}
	}

	this.ontouchmove = function(event) {
		event.preventDefault();

		if( touchState.isDown && event.changedTouches.length > 0 ) {
			touchState.curX = event.changedTouches[0].clientX;
			touchState.curY = event.changedTouches[0].clientY;

			var prevDirection = touchState.swipeDirection;

			if( touchState.curX - touchState.startX <= -touchState.swipeDistance ) {
				touchState.swipeDirection = SwipeDir.Left;
			}
			else if( touchState.curX - touchState.startX >= touchState.swipeDistance ) {
				touchState.swipeDirection = SwipeDir.Right;
			}
			else if( touchState.curY - touchState.startY <= -touchState.swipeDistance ) {
				touchState.swipeDirection = SwipeDir.Up;
			}
			else if( touchState.curY - touchState.startY >= touchState.swipeDistance ) {
				touchState.swipeDirection = SwipeDir.Down;
			}

			if( touchState.swipeDirection != prevDirection ) {
				// reset center so changing directions is easier
				touchState.startX = touchState.curX;
				touchState.startY = touchState.curY;
			}
		}
	}

	this.ontouchend = function(event) {
		event.preventDefault();

		touchState.isDown = false;

		if( touchState.swipeDirection == SwipeDir.None ) {
			// tap!
			touchState.tapReleased = true;
		}

		touchState.swipeDirection = SwipeDir.None;
	}

	this.isKeyDown = function(keyCode) {
		return pressed[keyCode] != null && pressed[keyCode] == true && (ignored[keyCode] == null || ignored[keyCode] == false);
	}

	this.anyKeyDown = function() {
		var anyKey = false;

		for (var key in pressed) {
			if (pressed[key] && (ignored[key] == null || ignored[key] == false) &&
				!(key === self.Key.UP || key === self.Key.DOWN || key === self.Key.LEFT || key === self.Key.RIGHT) &&
				!(key === self.Key.W || key === self.Key.S || key === self.Key.A || key === self.Key.D)) {
				// detected that a key other than the d-pad keys are down!
				anyKey = true;
			}
		}

		return anyKey;
	}

	this.isRestartComboPressed = function() {
		return isRestartComboPressed;
	}

	this.swipeLeft = function() {
		return touchState.swipeDirection == SwipeDir.Left;
	}

	this.swipeRight = function() {
		return touchState.swipeDirection == SwipeDir.Right;
	}

	this.swipeUp = function() {
		return touchState.swipeDirection == SwipeDir.Up;
	}

	this.swipeDown = function() {
		return touchState.swipeDirection == SwipeDir.Down;
	}

	this.isTapReleased = function() {
		return touchState.tapReleased;
	}

	this.resetTapReleased = function() {
		touchState.tapReleased = false;
	}

	this.onblur = function() {
		// bitsyLog("~~~ BLUR ~~", "system");
		resetAll();
	}

	this.resetAll = resetAll;

	this.listen = function(canvas) {
		document.addEventListener('keydown', self.onkeydown);
		document.addEventListener('keyup', self.onkeyup);

		if (isPlayerEmbeddedInEditor) {
			canvas.addEventListener('touchstart', self.ontouchstart, {passive:false});
			canvas.addEventListener('touchmove', self.ontouchmove, {passive:false});
			canvas.addEventListener('touchend', self.ontouchend, {passive:false});
		}
		else {
			// creates a 'touchTrigger' element that covers the entire screen and can universally have touch event listeners added w/o issue.

			// we're checking for existing touchTriggers both at game start and end, so it's slightly redundant.
			var existingTouchTrigger = document.querySelector('#touchTrigger');

			if (existingTouchTrigger === null) {
				var touchTrigger = document.createElement("div");
				touchTrigger.setAttribute("id","touchTrigger");

				// afaik css in js is necessary here to force a fullscreen element
				touchTrigger.setAttribute(
					"style","position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden;"
				);

				document.body.appendChild(touchTrigger);

				touchTrigger.addEventListener('touchstart', self.ontouchstart);
				touchTrigger.addEventListener('touchmove', self.ontouchmove);
				touchTrigger.addEventListener('touchend', self.ontouchend);
			}
		}

		window.onblur = self.onblur;
	}

	this.unlisten = function(canvas) {
		document.removeEventListener('keydown', self.onkeydown);
		document.removeEventListener('keyup', self.onkeyup);

		if (isPlayerEmbeddedInEditor) {
			canvas.removeEventListener('touchstart', self.ontouchstart);
			canvas.removeEventListener('touchmove', self.ontouchmove);
			canvas.removeEventListener('touchend', self.ontouchend);
		}
		else {
			//check for touchTrigger and removes it

			var existingTouchTrigger = document.querySelector('#touchTrigger');

			if (existingTouchTrigger !== null) {
				existingTouchTrigger.removeEventListener('touchstart', self.ontouchstart);
				existingTouchTrigger.removeEventListener('touchmove', self.ontouchmove);
				existingTouchTrigger.removeEventListener('touchend', self.ontouchend);

				existingTouchTrigger.parentElement.removeChild(existingTouchTrigger);
			}
		}

		window.onblur = null;
	}
}
<\/script>

<script>
// init global audio context
var audioContext = new AudioContext();

function enableGlobalAudioContext() {
	audioContext.resume();
}

function SoundSystem() {
	var self = this;

	// volume
	var maxGain = 0.15;

	// curves for different pulse wave duties (ratios between on and off)
	var dutyCycle_1_8 = new Float32Array(256);
	for (var i = 0; i < 256; i++) {
		dutyCycle_1_8[i] = ((i / 256) * 2) - 1.75;
	}

	var dutyCycle_1_4 = new Float32Array(256);
	for (var i = 0; i < 256; i++) {
		dutyCycle_1_4[i] = ((i / 256) * 2) - 1.5;
	}

	var dutyCycle_1_2 = new Float32Array(256);
	for (var i = 0; i < 256; i++) {
		dutyCycle_1_2[i] = ((i / 256) * 2) - 1.0;
	}

	var dutyCycles = [
		dutyCycle_1_8,
		dutyCycle_1_4,
		dutyCycle_1_2 // square wave
	];

	function createPulseWidthModulator() {
		// the base oscillator: start with a sawtooth wave that we'll shape into a pulse wave
		var oscillator = audioContext.createOscillator();
		oscillator.type = "sawtooth";

		// create a gain node to control the volume of the sound
		var volumeControl = audioContext.createGain();
		volumeControl.gain.value = 0;

		// create a wave shaper that turns the sawtooth wave into a pulse
		// by mapping any negative value to -1 and any positive value to 1
		var pulseCurve = new Float32Array(256);
		for (var i = 0; i < 128; i++) {
			pulseCurve[i] = -1;
		}
		for (var i = 128; i < 256; i++) {
			pulseCurve[i] = 1;
		}

		var pulseShaper = audioContext.createWaveShaper();
		pulseShaper.curve = pulseCurve;

		var dutyShaper = audioContext.createWaveShaper();
		dutyShaper.curve = dutyCycle_1_2;

		oscillator.connect(dutyShaper);
		dutyShaper.connect(pulseShaper);
		pulseShaper.connect(volumeControl);
		volumeControl.connect(audioContext.destination);
		oscillator.start();

		return {
			oscillator: oscillator,
			volumeControl: volumeControl,
			dutyShaper: dutyShaper
		};
	}

	var pulseChannels = [createPulseWidthModulator(), createPulseWidthModulator()];

	this.setPulse = function(channel, pulse) {
		var pulseChannel = pulseChannels[channel];
		pulseChannel.dutyShaper.curve = dutyCycles[pulse];
	}

	this.setFrequency = function(channel, frequencyHz) {
		var pulseChannel = pulseChannels[channel];
		// set frequency in hertz
		pulseChannel.oscillator.frequency.setValueAtTime(frequencyHz, audioContext.currentTime);
	}

	this.setVolume = function(channel, volumeNorm) {
		var pulseChannel = pulseChannels[channel];
		pulseChannel.volumeControl.gain.value = volumeNorm * maxGain;
	}

	this.mute = function() {
		for (var i = 0; i < pulseChannels.length; i++) {
			pulseChannels[i].volumeControl.gain.value = 0;
		}
	}
}

var sound = new SoundSystem();
<\/script>

<script>
function GraphicsSystem() {
	var self = this;

	var canvas;
	var ctx;

	var scale;
	var textScale;
	var palette = [];
	var images = [];
	var imageFillColors = [];

	function makeFillStyle(color, isTransparent) {
		var i = color * 3;
		if (isTransparent) {
			return "rgba(" + palette[i + 0] + "," + palette[i + 1] + "," + palette[i + 2] + ", 0)";
		}
		else {
			return "rgb(" + palette[i + 0] + "," + palette[i + 1] + "," + palette[i + 2] + ")";
		}
	}

	this._images = images;
	this._getPalette = function() {
		return palette;
	};

	// todo : do I really need to pass in size here?
	this.attachCanvas = function(c, size) {
		canvas = c;
		canvas.width = size * scale;
		canvas.height = size * scale;
		ctx = canvas.getContext("2d");
	};

	this.getCanvas = function() {
		return canvas;
	};

	this.getContext = function() {
		return ctx;
	};

	this.setScale = function(s) {
		scale = s;
	};

	this.setTextScale = function(s) {
		textScale = s;
	};

	this.getTextScale = function() {
		return textScale;
	};

	this.setPalette = function(p) {
		palette = p;
	};

	// todo : rename this since it doesn't always create a totally new canvas?
	this.createImage = function(id, width, height, pixels, useTextScale) {
		var imageScale = useTextScale === true ? textScale : scale;
		var widthScaled = width * imageScale;
		var heightScaled = height * imageScale;

		// try to use an existing image canvas if it is the right size,
		// instead of expensively creating a new one
		var imageCanvas = images[id];
		if (imageCanvas === undefined || imageCanvas.width != widthScaled || imageCanvas.height != heightScaled) {
			imageCanvas = document.createElement("canvas");
			imageCanvas.width = widthScaled;
			imageCanvas.height = heightScaled;
		}

		var imageCtx = imageCanvas.getContext("2d");

		// if we know the fill color for this image, we can speed things up
		// by filling the whole image with that color
		var fillColor;
		if (imageFillColors[id] != undefined) {
			fillColor = imageFillColors[id];
			var isTransparent = (fillColor === 0);
			if (isTransparent) {
				imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
			}
			else {
				imageCtx.fillStyle = makeFillStyle(fillColor, isTransparent);
				imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
			}
		}

		for (var i = 0; i < pixels.length; i++) {
			var x = i % width;
			var y = Math.floor(i / width);
			var color = pixels[i];
			if (color != fillColor) {
				var isTransparent = (color === 0);
				imageCtx.fillStyle = makeFillStyle(color, isTransparent);
				imageCtx.fillRect(x * imageScale, y * imageScale, imageScale, imageScale);
			}
		}

		images[id] = imageCanvas;
	};

	this.setImageFill = function(id, color) {
		imageFillColors[id] = color;
	};

	this.drawImage = function(id, x, y, destId) {
		if (!images[id]) {
			bitsyLog("image doesn't exist: " + id, "graphics");
			return;
		}

		var destCtx = ctx;
		if (destId != undefined) {
			// if there's a destination ID, that means we're drawing this image *onto* another image canvas
			var destCanvas = images[destId];
			destCtx = destCanvas.getContext("2d");
		}

		destCtx.drawImage(images[id], x * scale, y * scale, images[id].width, images[id].height);
	};

	this.hasImage = function(id) {
		return images[id] != undefined;
	};

	this.getImage = function(id) {
		return images[id];
	};

	this.deleteImage = function(id) {
		delete images[id];
		delete imageFillColors[id];
	};

	this.getCanvas = function() {
		return canvas;
	};

	this.clearCanvas = function(color) {
		bitsyLog("pal? " + palette.length + " / " + color, "graphics");
		ctx.fillStyle = makeFillStyle(color);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};
}
<\/script>

<script>
/* LOGGING */
var DebugLogCategory = {
	// system
	input: false,
	sound: false,
	graphics: false,
	system: false,

	// engine
	bitsy: false,

	// editor
	editor: false,

	// tools
	room: false,
	tune: false,
	blip: false,
};

var isLoggingVerbose = false;

function bitsyLog(message, category) {
	if (!category) {
		category = "bitsy";
	}

	var summary = category + "::" + message;

	if (DebugLogCategory[category] === true) {
		if (isLoggingVerbose) {
			console.group(summary);

			console.dir(message);

			console.group("stack")
			console.trace();
			console.groupEnd();

			console.groupEnd();
		}
		else {
			console.log(summary);
		}
	}
}

/* GLOBALS */
var tilesize = 16;
var mapsize = 16;
var width = mapsize * tilesize;
var height = mapsize * tilesize;
var scale = 2;
var textScale = 2;

/* SYSTEM */
var updateInterval = null;
var prevTime = 0;
var deltaTime = 0;

function initSystem() {
	prevTime = Date.now();
	updateInterval = setInterval(updateSystem, 16);
}

function updateSystem() {
	var curTime = Date.now();
	deltaTime = curTime - prevTime;

	// update all active processes
	for (var i = 0; i < processes.length; i++) {
		bitsy = processes[i].system;
		if (bitsy._active) {
			bitsyLog(bitsy._name + " img count: " + bitsy._graphics._images.length, "system");
			var shouldContinue = bitsy._update(deltaTime);
			if (!shouldContinue) {
				// todo : do I really care about this _exit thing?
				if (bitsy._name != "bitsy") {
					bitsy._exit();
				}
			}
		}
	}

	bitsy = mainProcess.system;
	prevTime = curTime;
}

function loadGame(canvas, gameData, defaultFontData) {
	bitsyLog("load!", "system");
	// initialize bitsy system
	bitsy._attachCanvas(canvas);
	bitsy._write(bitsy._gameDataBlock, gameData);
	bitsy._write(bitsy._fontDataBlock, defaultFontData);
	bitsy._start();
}

function quitGame() {
	// hack to press the menu button to force game over state
	bitsy._injectPreLoop = function() { bitsy._poke(bitsy._buttonBlock, bitsy.BTN_MENU, 1); };

	// one last update to clean up (a little hacky to do this here?)
	bitsy._update(0);
	bitsy._exit();

	// clean up this gross hack
	bitsy._injectPreLoop = null;
}

/* GRAPHICS */
var canvas; // can I get rid of these?
var ctx;

function attachCanvas(c) {
	// hack : tes tnew system
	bitsy._attachCanvas(c);
	// extra hacky
	canvas = bitsy._getCanvas();
	ctx = bitsy._getContext();
}

/* PROCESSES */
var processes = [];

function addProcess(name) {
	var proc = {};
	proc.system = new BitsySystem(name);

	processes.push(proc);

	return proc;
}

/* == SYSTEM v0.2 === */
function BitsySystem(name) {
	var self = this;

	if (!name) {
		name = "bitsy";
	}

	// memory
	var memory = {
		blocks: [],
		changed: []
	};

	// input
	var input = new InputSystem();

	// sound
	var sound = new SoundSystem();
	var soundDurationIndex = 0;
	var soundFrequencyIndex = 1;
	var soundVolumeIndex = 2;
	var soundPulseIndex = 3;
	var maxVolume = 15;

	// graphics
	var graphics = new GraphicsSystem();
	graphics.setScale(scale);
	graphics.setTextScale(textScale);
	var initialPaletteSize = 64;
	var tilePoolStart = null;
	var tilePoolSize = 512;
	// hack!!! (access for debugging)
	this._graphics = graphics;

	function updateTextScale() {
		// make sure the text scale matches the text mode
		var textMode = self._peek(modeBlock, 1);
		var textModeScale = (textMode === self.TXT_LOREZ) ? scale : textScale;
		if (graphics.getTextScale() != textModeScale) {
			graphics.setTextScale(textModeScale);
			memory.changed[self.TEXTBOX] = true;
		}
	}

	function updateInput() {
		// update input flags
		self._poke(self._buttonBlock, self.BTN_UP,
			(input.isKeyDown(input.Key.UP) || input.isKeyDown(input.Key.W) || input.swipeUp()) ? 1 : 0);

		self._poke(self._buttonBlock, self.BTN_DOWN,
			(input.isKeyDown(input.Key.DOWN) || input.isKeyDown(input.Key.S) || input.swipeDown()) ? 1 : 0);

		self._poke(self._buttonBlock, self.BTN_LEFT,
			(input.isKeyDown(input.Key.LEFT) || input.isKeyDown(input.Key.A) || input.swipeLeft()) ? 1 : 0);

		self._poke(self._buttonBlock, self.BTN_RIGHT,
			(input.isKeyDown(input.Key.RIGHT) || input.isKeyDown(input.Key.D) || input.swipeRight()) ? 1 : 0);

		self._poke(self._buttonBlock, self.BTN_OK,
			(input.anyKeyDown() || input.isTapReleased()) ? 1 : 0);

		self._poke(self._buttonBlock, self.BTN_MENU,
			(input.isRestartComboPressed()) ? 1 : 0);

		input.resetTapReleased();
	}

	function updateSound(dt) {
		var changed0 = memory.changed[self.SOUND1];
		var changed1 = memory.changed[self.SOUND2];

		// update sound channel timers
		var timer0 = self._peek(self.SOUND1, soundDurationIndex);
		timer0 -= dt;
		if (timer0 <= 0) {
			timer0 = 0;
			if (self._peek(self.SOUND1, soundVolumeIndex) > 0) {
				self._poke(self.SOUND1, soundVolumeIndex, 0);
				changed0 = true;
			}
		}
		self._poke(self.SOUND1, soundDurationIndex, timer0);

		var timer1 = self._peek(self.SOUND2, soundDurationIndex);
		timer1 -= dt;
		if (timer1 <= 0) {
			timer1 = 0;
			if (self._peek(self.SOUND2, soundVolumeIndex) > 0) {
				self._poke(self.SOUND2, soundVolumeIndex, 0);
				changed1 = true;
			}
		}
		self._poke(self.SOUND2, soundDurationIndex, timer1);

		// send updated channel attributes to the sound system
		if (changed0) {
			sound.setPulse(0, self._peek(self.SOUND1, soundPulseIndex));

			var freq = self._peek(self.SOUND1, soundFrequencyIndex);
			var freqHz = freq / 100;
			sound.setFrequency(0, freqHz);

			var volume = self._peek(self.SOUND1, soundVolumeIndex);
			volume = Math.max(0, Math.min(volume, maxVolume));
			volumeNorm = (volume / maxVolume);
			sound.setVolume(0, volumeNorm);
		}

		if (changed1) {
			sound.setPulse(1, self._peek(self.SOUND2, soundPulseIndex));

			var freq = self._peek(self.SOUND2, soundFrequencyIndex);
			var freqHz = freq / 100;
			sound.setFrequency(1, freqHz);

			var volume = self._peek(self.SOUND2, soundVolumeIndex);
			volume = Math.max(0, Math.min(volume, maxVolume));
			volumeNorm = (volume / maxVolume);
			sound.setVolume(1, volumeNorm);
		}
	}

	function updateGraphics() {
		if (self._enableGraphics === false) {
			return;
		}

		bitsyLog("update graphics", "system");

		if (memory.changed[paletteBlock]) {
			graphics.setPalette(self._dump()[paletteBlock]);
		}

		if (tilePoolStart != null) {
			for (var i = 0; i < tilePoolSize; i++) {
				var tile = tilePoolStart + i;
				if (memory.blocks[tile] != undefined && memory.changed[tile]) {
					bitsyLog("tile changed? " + tile, "system");
					// update tile image
					graphics.createImage(tile, self.TILE_SIZE, self.TILE_SIZE, self._dump()[tile]);
				}
			}
		}

		var textboxChanged = memory.changed[self.TEXTBOX] || memory.changed[textboxAttributeBlock];
		if (textboxChanged) {
			// todo : should this be optimized in some way?
			// update textbox image
			var w = self._peek(textboxAttributeBlock, 3); // todo : need a variable to store this index?
			var h = self._peek(textboxAttributeBlock, 4);
			if (w > 0 && h > 0) {
				bitsyLog("textbox changed! " + memory.changed[self.TEXTBOX] + " " + memory.changed[textboxAttributeBlock] + " " + w + " " + h, "system");
				var useTextBoxScale = true; // todo : check mode here?
				graphics.createImage(self.TEXTBOX, w, h, self._dump()[self.TEXTBOX], useTextBoxScale);
			}
		}

		var mode = self._peek(modeBlock, 0);
		if (mode === self.GFX_VIDEO) {
			if (memory.changed[self.VIDEO]) {
				graphics.clearCanvas(0);
				// update screen image
				graphics.createImage(self.VIDEO, self.VIDEO_SIZE, self.VIDEO_SIZE, self._dump()[self.VIDEO]);
				// render screen onto canvas
				graphics.drawImage(self.VIDEO, 0, 0);
			}
		}
		else if (mode === self.GFX_MAP) {
			// redraw any changed layers
			var layers = self._getTileMapLayers();
			var anyMapLayerChanged = false;
			for (var i = 0; i < layers.length; i++) {
				var layerId = layers[i];
				if (memory.changed[layerId]) {
					// need to redraw this map layer
					anyMapLayerChanged = true;
					// clear layer canvas
					graphics.setImageFill(layerId, 0); // fill transparent
					graphics.createImage(layerId, self.VIDEO_SIZE, self.VIDEO_SIZE, []);
					// render tiles onto layer canvas
					var layerData = self._dump()[layerId];
					for (var ty = 0; ty < self.MAP_SIZE; ty++) {
						for (var tx = 0; tx < self.MAP_SIZE; tx++) {
							var tileIndex = (ty * self.MAP_SIZE) + tx;
							var tile = layerData[tileIndex];
							if (tile > 0) {
								graphics.drawImage(tile, tx * self.TILE_SIZE, ty * self.TILE_SIZE, layerId);
							}
						}
					}
				}
			}

			// redraw the main canvas
			if (textboxChanged || anyMapLayerChanged) {
				bitsyLog("map changed? " + memory.changed[self.MAP1] + " " + memory.changed[self.MAP2], "system");
				graphics.clearCanvas(0);

				for (var i = 0; i < layers.length; i++) {
					var layerId = layers[i];
					// draw the layer's image canvas onto the main canvas
					graphics.drawImage(layerId, 0, 0);
				}

				// draw textbox onto canvas
				var visible = self._peek(textboxAttributeBlock, 0)
				var x = self._peek(textboxAttributeBlock, 1);
				var y = self._peek(textboxAttributeBlock, 2);
				var w = self._peek(textboxAttributeBlock, 3);
				var h = self._peek(textboxAttributeBlock, 4);
				if (visible > 0 && w > 0 && h > 0) {
					graphics.drawImage(self.TEXTBOX, x, y);
				}
			}
		}
	}

	/* == PRIVATE / DEBUG == */
	this._name = name;

	this._active = false;

	this._attachCanvas = function(c) {
		graphics.attachCanvas(c, self.VIDEO_SIZE);
	};

	this._getCanvas = graphics.getCanvas;
	this._getContext = graphics.getContext;

	this._start = function() {
		input.listen(graphics.getCanvas());
		updateTextScale();
		self._active = true;
	};

	// hacky...
	this._startNoInput = function() {
		updateTextScale();
		self._active = true;
	};

	this._exit = function() {
		input.unlisten(graphics.getCanvas());
		sound.mute();
		self._active = false;
	};

	// hacky....
	this._injectPreLoop = null;
	this._injectPostDraw = null;

	this._update = function(dt) {
		var shouldContinue = false;

		updateInput();

		// too hacky???
		if (self._injectPreLoop) {
			self._injectPreLoop();
		}

		// run main loop
		if (onLoopFunction) {
			shouldContinue = onLoopFunction(dt);
		}

		if (memory.changed[modeBlock]) {
			updateTextScale();
		}

		// update output systems
		updateSound(dt);
		updateGraphics();

		if (self._injectPostDraw) {
			self._injectPostDraw();
		}

		// reset memory block changed flags
		for (var i = 0; i < memory.changed.length; i++) {
			memory.changed[i] = false;
		}

		// todo : should the _exit() call go in here?

		return shouldContinue;
	};

	this._updateGraphics = updateGraphics;

	this._allocate = function(args) {
		// find next available block in range
		var next = (args && args.start) ? args.start : 0;
		var count = (args && args.max) ? args.max : -1;
		while (memory.blocks[next] != undefined && count != 0) {
			next++;
			count--;
		}

		if (memory.blocks[next] != undefined) {
			// couldn't find any available block
			return null;
		}

		if (args && args.str) {
			memory.blocks[next] = args.str;
		}
		else {
			var size = args && args.size ? args.size : 0;
			memory.blocks[next] = [];
			for (var i = 0; i < size; i++) {
				memory.blocks[next].push(0);
			}
		}

		memory.changed[next] = false;

		return next;
	};

	this._free = function(block) {
		delete memory.blocks[block];
		delete memory.changed[block];
	};

	this._peek = function(block, index) {
		var memoryBlock = memory.blocks[block];
		if (typeof(memoryBlock) === "string") {
			return memoryBlock.charCodeAt(index);
		}
		else {
			return memoryBlock[index];
		}
	};

	this._poke = function(block, index, value) {
		var memoryBlock = memory.blocks[block];
		if (typeof(memoryBlock) === "string") {
			memory.blocks[block] = memoryBlock.substring(0, index) + String.fromCharCode(value) + memoryBlock.substring(index + 1);
		}
		else {
			var value = parseInt(value);
			if (!isNaN(value)) {
				memoryBlock[index] = value;
			}
		}
		memory.changed[block] = true;
	};

	this._read = function(block) {
		var memoryBlock = memory.blocks[block];
		if (typeof(memoryBlock) === "string") {
			return memoryBlock;
		}
		else {
			var str = "";
			for (var i = 0; i < memoryBlock.length; i++) {
				str += String.fromCharCode(memoryBlock[i]);
			}
			return str;
		}
	};

	this._write = function(block, str) {
		var memoryBlock = memory.blocks[block];
		if (typeof(memoryBlock) === "string") {
			memory.blocks[block] = str;
		}
		else {
			memory.blocks[block] = [];
			for (var i = 0; i < str.length; i++) {
				memory.blocks[block][i] = str.charCodeAt(i);
			}
		}
		memory.changed[block] = true;
	};

	this._dump = function() {
		return memory.blocks;
	};

	// convenience methods for hacking around with map layers
	var tileMapLayers = [];
	this._getTileMapLayers = function() {
		return tileMapLayers;
	};
	this._addTileMapLayer = function() {
		var layer = self._allocate({
			start: (tilePoolStart + tilePoolSize),
			size: (self.MAP_SIZE * self.MAP_SIZE)
		});

		tileMapLayers.push(layer);

		return layer;
	};

	/* == CONSTANTS == */
	// memory blocks (these will be initialized below)
	this.VIDEO;
	this.TEXTBOX;
	this.MAP1;
	this.MAP2;
	this.SOUND1;
	this.SOUND2;

	// graphics modes
	this.GFX_VIDEO = 0;
	this.GFX_MAP = 1;

	// text modes
	this.TXT_HIREZ = 0; // 2x resolution
	this.TXT_LOREZ = 1; // 1x resolution

	// size
	this.TILE_SIZE = tilesize;
	this.MAP_SIZE = mapsize;
	this.VIDEO_SIZE = width;
	// todo : should text scale have a constant?

	// button codes
	this.BTN_UP = 0;
	this.BTN_DOWN = 1;
	this.BTN_LEFT = 2;
	this.BTN_RIGHT = 3;
	this.BTN_OK = 4;
	this.BTN_MENU = 5;

	// pulse waves
	this.PULSE_1_8 = 0;
	this.PULSE_1_4 = 1;
	this.PULSE_1_2 = 2;

	/* == IO == */
	this.log = function(message) {
		bitsyLog(message, name);
	};

	this.button = function(code) {
		return self._peek(buttonBlock, code) > 0;
	};

	this.getGameData = function() {
		return self._read(gameDataBlock);
	};

	this.getFontData = function() {
		return self._read(fontDataBlock);
	};

	/* == GRAPHICS == */
	this.graphicsMode = function(mode) {
		// todo : store the mode flag indices somewhere?
		if (mode != undefined) {
			self._poke(modeBlock, 0, mode);
		}

		return self._peek(modeBlock, 0);
	};

	this.textMode = function(mode) {
		// todo : test whether the requested mode is supported!
		if (mode != undefined) {
			self._poke(modeBlock, 1, mode);
		}

		return self._peek(modeBlock, 1);
	};

	this.color = function(color, r, g, b) {
		self._poke(paletteBlock, (color * 3) + 0, r);
		self._poke(paletteBlock, (color * 3) + 1, g);
		self._poke(paletteBlock, (color * 3) + 2, b);

		// mark all graphics as changed
		memory.changed[self.VIDEO] = true;
		memory.changed[self.TEXTBOX] = true;
		memory.changed[self.MAP1] = true;
		memory.changed[self.MAP2] = true;

		if (tilePoolStart != null) {
			for (var i = 0; i < tilePoolSize; i++) {
				if (memory.blocks[tilePoolStart + i] != undefined) {
					memory.changed[tilePoolStart + i] = true;
				}
			}
		}
	};

	this.tile = function() {
		return self._allocate({
			start: tilePoolStart,
			max: tilePoolSize,
			size: (self.TILE_SIZE * self.TILE_SIZE)
		});
	};

	this.delete = function(tile) {
		if (graphics.hasImage(tile)) {
			graphics.deleteImage(tile);
		}

		self._free(tile);
	};

	this.fill = function(block, value) {
		var len = memory.blocks[block].length;
		for (var i = 0; i < len; i++) {
			self._poke(block, i, value);
		}

		var isImage = (block === self.VIDEO) ||
			(block === self.TEXTBOX) ||
			(block >= tilePoolStart && block < (tilePoolStart + tilePoolSize));

		// optimize rendering by notifying the graphics system what the fill color is for this image
		if (isImage) {
			graphics.setImageFill(block, value);
		}
	};

	this.set = function(block, index, value) {
		self._poke(block, index, value);
	};

	this.textbox = function(visible, x, y, w, h) {
		if (visible != undefined) {
			self._poke(textboxAttributeBlock, 0, (visible === true) ? 1 : 0);
		}
		
		if (x != undefined) {
			self._poke(textboxAttributeBlock, 1, x);
		}
		
		if (y != undefined) {
			self._poke(textboxAttributeBlock, 2, y);
		}

		var prevWidth = self._peek(textboxAttributeBlock, 3);
		var prevHeight = self._peek(textboxAttributeBlock, 4);

		if (w != undefined) {
			self._poke(textboxAttributeBlock, 3, w);
		}
		
		if (h != undefined) {
			self._poke(textboxAttributeBlock, 4, h);
		}

		if (w != undefined && h != undefined && (prevWidth != w || prevHeight != h)) {
			// re-allocate the textbox block (should I have a helper function for this?)
			memory.blocks[self.TEXTBOX] = [];
			for (var i = 0; i < (w * h); i++) {
				memory.blocks[self.TEXTBOX].push(0);
			}
			memory.changed[self.TEXTBOX] = true;
		}
	};

	/* == SOUND == */
	// duration is in milliseconds (ms)
	this.sound = function(channel, duration, frequency, volume, pulse) {
		self._poke(channel, soundDurationIndex, duration);
		self._poke(channel, soundFrequencyIndex, frequency);
		self._poke(channel, soundVolumeIndex, volume);
		self._poke(channel, soundPulseIndex, pulse);
	};

	// frequency is in decihertz (dHz)
	this.frequency = function(channel, frequency) {
		self._poke(channel, soundFrequencyIndex, frequency);
	};

	// volume: min = 0, max = 15
	this.volume = function(channel, volume) {
		self._poke(channel, soundVolumeIndex, volume);
	};

	/* == EVENTS == */
	this.loop = function(fn) {
		onLoopFunction = fn;
	};

	/* == INTERNAL == */
	// initialize memory blocks
	var gameDataBlock = this._allocate({ str: "" });
	var fontDataBlock = this._allocate({ str: "" });
	this.VIDEO = this._allocate({ size: self.VIDEO_SIZE * self.VIDEO_SIZE });
	this.TEXTBOX = this._allocate();
	this.MAP1 = this._allocate({ size: self.MAP_SIZE * self.MAP_SIZE });
	tileMapLayers.push(this.MAP1);
	this.MAP2 = this._allocate({ size: self.MAP_SIZE * self.MAP_SIZE });
	tileMapLayers.push(this.MAP2);
	var paletteBlock = this._allocate({ size: initialPaletteSize * 3 });
	var buttonBlock = this._allocate({ size: 8 });
	this.SOUND1 = this._allocate({ size: 4 });
	this.SOUND2 = this._allocate({ size: 4 });
	var modeBlock = this._allocate({ size: 8 });
	var textboxAttributeBlock = this._allocate({ size: 8 });

	tilePoolStart = (textboxAttributeBlock + 1);

	// access for debugging
	this._gameDataBlock = gameDataBlock;
	this._fontDataBlock = fontDataBlock;
	this._buttonBlock = buttonBlock;

	// events
	var onLoopFunction = null;
}

var mainProcess = addProcess();
var bitsy = mainProcess.system;
<\/script>

<!-- engine -->
<script>
/* BITSY VERSION */
// is this the right place for this to live?
var version = {
	major: 8, // major changes
	minor: 6, // smaller changes
	devBuildPhase: "RELEASE",
};
function getEngineVersion() {
	return version.major + "." + version.minor;
}

/* TEXT CONSTANTS */
var titleDialogId = "title";

// todo : where should this be stored?
var tileColorStartIndex = 16;

var TextDirection = {
	LeftToRight : "LTR",
	RightToLeft : "RTL"
};

var defaultFontName = "ascii_small";

/* TUNE CONSTANTS */
var barLength = 16; // sixteenth notes
var minTuneLength = 1;
var maxTuneLength = 16;

// chromatic notes
var Note = {
	NONE 		: -1,
	C 			: 0,	// C
	C_SHARP 	: 1,	// C sharp / D flat
	D 			: 2,	// D
	D_SHARP 	: 3,	// D sharp / E flat
	E 			: 4,	// E
	F 			: 5,	// F
	F_SHARP 	: 6,	// F sharp / G flat
	G 			: 7,	// G
	G_SHARP 	: 8,	// G sharp / A flat
	A 			: 9,	// A
	A_SHARP 	: 10,	// A sharp / B flat
	B 			: 11,	// B
	COUNT 		: 12
};

// solfa notes
var Solfa = {
	NONE 	: -1,
	D 		: 0,	// Do
	R 		: 1,	// Re
	M 		: 2,	// Mi
	F 		: 3,	// Fa
	S 		: 4,	// Sol
	L 		: 5,	// La
	T 		: 6,	// Ti
	COUNT 	: 7
};

var Octave = {
	NONE: -1,
	2: 0,
	3: 1,
	4: 2, // octave 4: middle C octave
	5: 3,
	COUNT: 4
};

var Tempo = {
	SLW: 0, // slow
	MED: 1, // medium
	FST: 2, // fast
	XFST: 3 // extra fast (aka turbo)
};

var SquareWave = {
	P8: 0, // pulse 1 / 8
	P4: 1, // pulse 1 / 4
	P2: 2, // pulse 1 / 2
	COUNT: 3
};

var ArpeggioPattern = {
	OFF: 0,
	UP: 1, // ascending triad chord
	DWN: 2, // descending triad chord
	INT5: 3, // 5 step interval
	INT8: 4 // 8 setp interval
};

function createWorldData() {
	return {
		room : {},
		tile : {},
		sprite : {},
		item : {},
		dialog : {},
		end : {}, // pre-7.0 ending data for backwards compatibility
		palette : { // start off with a default palette
			"default" : {
				name : "default",
				colors : [[0,0,0],[255,255,255],[255,255,255]]
			}
		},
		variable : {},
		tune : {},
		blip : {},
		versionNumberFromComment : -1, // -1 indicates no version information found
		fontName : defaultFontName,
		textDirection : TextDirection.LeftToRight,
		flags : createDefaultFlags(),
		names : {},
		// source data for all drawings (todo: better name?)
		drawings : {},
	};
}

// creates a drawing data structure with default property values for the type
function createDrawingData(type, id) {
	// the avatar's drawing id still uses the sprite prefix (for back compat)
	var drwId = (type === "AVA" ? "SPR" : type) + "_" + id;

	var drawingData = {
		type : type,
		id : id,
		name : null,
		drw : drwId,
		col : (type === "TIL") ? 1 : 2, // foreground color
		bgc : 0, // background color
		animation : {
			isAnimated : false,
			frameIndex : 0,
			frameCount : 1,
		},
	};

	// add type specific properties
	if (type === "TIL") {
		// default null value indicates it can vary from room to room (original version)
		drawingData.isWall = null;
	}

	if (type === "AVA" || type === "SPR") {
		// default sprite location is "offstage"
		drawingData.room = null;
		drawingData.x = -1;
		drawingData.y = -1;
		drawingData.inventory = {};
	}

	if (type === "AVA" || type === "SPR" || type === "ITM") {
		drawingData.dlg = null;
		drawingData.blip = null;
	}

	return drawingData;
}

function createTuneData(id) {
	var tuneData = {
		id : id,
		name : null,
		melody : [],
		harmony : [],
		key: null, // a null key indicates a chromatic scale (all notes enabled)
		tempo: Tempo.MED,
		instrumentA : SquareWave.P2,
		instrumentB : SquareWave.P2,
		arpeggioPattern : ArpeggioPattern.OFF,
	};
	return tuneData;
}

function createTuneBarData() {
	var bar = [];
	for (var i = 0; i < barLength; i++) {
		bar.push({ beats: 0, note: Note.C, octave: Octave[4] });
	}
	return bar;
}

function createTuneKeyData() {
	var key = {
		notes: [], // mapping of the solfa scale degrees to chromatic notes
		scale: []  // list of solfa notes that are enabled for this key
	};

	// initialize notes
	for (var i = 0; i < Solfa.COUNT; i++) {
		key.notes.push(Note.NONE);
	}

	return key;
}

function createBlipData(id) {
	var blipData = {
		id: id,
		name: null,
		pitchA: { beats: 0, note: Note.C, octave: Octave[4] },
		pitchB: { beats: 0, note: Note.C, octave: Octave[4] },
		pitchC: { beats: 0, note: Note.C, octave: Octave[4] },
		envelope: {
			attack: 0, // attack time in ms
			decay: 0, // decay time in ms
			sustain: 0, // sustain volume
			length: 0, // sustain time in ms
			release: 0 // release time in ms
		},
		beat : {
			time: 0, // time in ms between pitch changes
			delay: 0 // time in ms *before* first pitch change
		},
		instrument: SquareWave.P2,
		doRepeat: false
		// TODO : consider for future update
		// doSlide: false,
	};

	return blipData;
}

function createDefaultFlags() {
	return {
		// version
		VER_MAJ: -1, // major version number (-1 = no version information found)
		VER_MIN: -1, // minor version number (-1 = no version information found)
		// compatibility
		ROOM_FORMAT: 0, // 0 = non-comma separated (original), 1 = comma separated (default)
		DLG_COMPAT: 0, // 0 = default dialog behavior, 1 = pre-7.0 dialog behavior
		// config
		TXT_MODE: 0 // 0 = HIREZ (2x - default), 1 = LOREZ (1x)
	};
}

function createDialogData(id) {
	return {
		src : "",
		name : null,
		id : id,
	};
}

function parseWorld(file) {
	bitsy.log("create world data");

	var world = createWorldData();

	bitsy.log("init parse state");

	var parseState = {
		lines : file.split("\\n"),
		index : 0,
		spriteStartLocations : {}
	};

	bitsy.log("start reading lines");

	while (parseState.index < parseState.lines.length) {
		var i = parseState.index;
		var lines = parseState.lines;
		var curLine = lines[i];

		// bitsy.log("LN " + i + " xx " + curLine);

		if (i == 0) {
			i = parseTitle(parseState, world);
		}
		else if (curLine.length <= 0 || curLine.charAt(0) === "#") {
			// collect version number from a comment (hacky but required for pre-8.0 compatibility)
			if (curLine.indexOf("# BITSY VERSION ") != -1) {
				world.versionNumberFromComment = parseFloat(curLine.replace("# BITSY VERSION ", ""));
			}

			//skip blank lines & comments
			i++;
		}
		else if (getType(curLine) === "PAL") {
			i = parsePalette(parseState, world);
		}
		else if (getType(curLine) === "ROOM" || getType(curLine) === "SET") { // SET for back compat
			i = parseRoom(parseState, world);
		}
		else if (getType(curLine) === "TIL") {
			i = parseTile(parseState, world);
		}
		else if (getType(curLine) === "SPR") {
			i = parseSprite(parseState, world);
		}
		else if (getType(curLine) === "ITM") {
			i = parseItem(parseState, world);
		}
		else if (getType(curLine) === "DLG") {
			i = parseDialog(parseState, world);
		}
		else if (getType(curLine) === "END") {
			// parse endings for back compat
			i = parseEnding(parseState, world);
		}
		else if (getType(curLine) === "VAR") {
			i = parseVariable(parseState, world);
		}
		else if (getType(curLine) === "DEFAULT_FONT") {
			i = parseFontName(parseState, world);
		}
		else if (getType(curLine) === "TEXT_DIRECTION") {
			i = parseTextDirection(parseState, world);
		}
		else if (getType(curLine) === "FONT") {
			i = parseFontData(parseState, world);
		}
		else if (getType(curLine) === "TUNE") {
			i = parseTune(parseState, world);
		}
		else if (getType(curLine) === "BLIP") {
			i = parseBlip(parseState, world);
		}
		else if (getType(curLine) === "!") {
			i = parseFlag(parseState, world);
		}
		else {
			i++;
		}

		parseState.index = i;
	}

	world.names = createNameMapsForWorld(world);

	placeSprites(parseState, world);

	if ((world.flags.VER_MAJ <= -1 || world.flags.VER_MIN <= -1) && world.versionNumberFromComment > -1) {
		var versionNumberStr = "" + world.versionNumberFromComment;
		versionNumberStr = versionNumberStr.split(".");
		world.flags.VER_MAJ = parseFloat(versionNumberStr[0]);
		world.flags.VER_MIN = parseFloat(versionNumberStr[1]);
	}

	// starting in version v7.0, there were two major changes to dialog behavior:
	// 1) sprite dialog was no longer implicitly linked by the sprite and dialog IDs matching
	//    (see this commit: 5e1adb29faad4e50603c689d2dac143074117b4e)
	// 2) ending dialogs no longer had their own world data type ("END")
	// for the v7.x versions I tried to automatically convert old dialog to the new format,
	// however, that process can be unreliable and lead to weird bugs.
	// with v8.0 and above I will no longer attempt to convert old files, and instead will use
	// a flag to indicate files that need to use the backwards compatible behavior -
	// this is more reliable & configurable (at the cost of making pre-7.0 games a bit harder to edit)
	if (world.flags.VER_MAJ < 7) {
		world.flags.DLG_COMPAT = 1;
	}

	return world;
}

function parseTitle(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var results;
	if (scriptUtils) {
		results = scriptUtils.ReadDialogScript(lines,i);
	}
	else {
		results = { script: lines[i], index: (i + 1) };
	}

	world.dialog[titleDialogId] = createDialogData(titleDialogId);
	world.dialog[titleDialogId].src = results.script;

	i = results.index;
	i++;

	return i;
}

function parsePalette(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	i++;
	var colors = [];
	var name = null;
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		var args = lines[i].split(" ");
		if (args[0] === "NAME") {
			name = lines[i].split(/\\s(.+)/)[1];
		}
		else {
			var col = [];
			lines[i].split(",").forEach(function(i) {
				col.push(parseInt(i));
			});
			colors.push(col);
		}
		i++;
	}
	world.palette[id] = {
		id : id,
		name : name,
		colors : colors
	};
	return i;
}

function createRoomData(id) {
	return {
		id: id,
		name: null,
		tilemap: [],
		walls: [],
		exits: [],
		endings: [],
		items: [],
		pal: null,
		ava: null,
		tune: "0"
	};
}

function createExitData(x, y, destRoom, destX, destY, transition, dlg) {
	return {
		x: x,
		y: x,
		dest: {
			room: destRoom,
			x: destX,
			y: destY
		},
		transition_effect: transition,
		dlg: dlg,
	};
}

function createEndingData(id, x, y) {
	return {
		id: id,
		x: x,
		y: y
	};
}

function parseRoom(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;
	var id = getId(lines[i]);

	var roomData = createRoomData(id);

	i++;

	// create tile map
	if (world.flags.ROOM_FORMAT === 0) {
		// old way: no commas, single char tile ids
		var end = i + bitsy.MAP_SIZE;
		var y = 0;
		for (; i < end; i++) {
			roomData.tilemap.push([]);
			for (x = 0; x < bitsy.MAP_SIZE; x++) {
				roomData.tilemap[y].push(lines[i].charAt(x));
			}
			y++;
		}
	}
	else if (world.flags.ROOM_FORMAT === 1) {
		// new way: comma separated, multiple char tile ids
		var end = i + bitsy.MAP_SIZE;
		var y = 0;
		for (; i < end; i++) {
			roomData.tilemap.push([]);
			var lineSep = lines[i].split(",");
			for (x = 0; x < bitsy.MAP_SIZE; x++) {
				roomData.tilemap[y].push(lineSep[x]);
			}
			y++;
		}
	}

	while (i < lines.length && lines[i].length > 0) { //look for empty line
		// bitsy.log(getType(lines[i]));
		if (getType(lines[i]) === "SPR") {
			/* NOTE SPRITE START LOCATIONS */
			var sprId = getId(lines[i]);
			if (sprId.indexOf(",") == -1 && lines[i].split(" ").length >= 3) { //second conditional checks for coords
				/* PLACE A SINGLE SPRITE */
				var sprCoord = lines[i].split(" ")[2].split(",");
				parseState.spriteStartLocations[sprId] = {
					room : id,
					x : parseInt(sprCoord[0]),
					y : parseInt(sprCoord[1])
				};
			}
			else if ( world.flags.ROOM_FORMAT == 0 ) { // TODO: right now this shortcut only works w/ the old comma separate format
				/* PLACE MULTIPLE SPRITES*/ 
				//Does find and replace in the tilemap (may be hacky, but its convenient)
				var sprList = sprId.split(",");
				for (row in roomData.tilemap) {
					for (s in sprList) {
						var col = roomData.tilemap[row].indexOf( sprList[s] );
						//if the sprite is in this row, replace it with the "null tile" and set its starting position
						if (col != -1) {
							roomData.tilemap[row][col] = "0";
							parseState.spriteStartLocations[ sprList[s] ] = {
								room : id,
								x : parseInt(col),
								y : parseInt(row)
							};
						}
					}
				}
			}
		}
		else if (getType(lines[i]) === "ITM") {
			var itmId = getId(lines[i]);
			var itmCoord = lines[i].split(" ")[2].split(",");
			var itm = {
				id: itmId,
				x : parseInt(itmCoord[0]),
				y : parseInt(itmCoord[1])
			};
			roomData.items.push( itm );
		}
		else if (getType(lines[i]) === "WAL") {
			/* DEFINE COLLISIONS (WALLS) */
			roomData.walls = getId(lines[i]).split(",");
		}
		else if (getType(lines[i]) === "EXT") {
			/* ADD EXIT */
			var exitArgs = lines[i].split(" ");
			//arg format: EXT 10,5 M 3,2 [AVA:7 LCK:a,9] [AVA 7 LCK a 9]
			var exitCoords = exitArgs[1].split(",");
			var destName = exitArgs[2];
			var destCoords = exitArgs[3].split(",");
			var ext = createExitData(
				/* x 			*/ parseInt(exitCoords[0]),
				/* y 			*/ parseInt(exitCoords[1]),
				/* destRoom 	*/ destName,
				/* destX 		*/ parseInt(destCoords[0]),
				/* destY 		*/ parseInt(destCoords[1]),
				/* transition 	*/ null,
				/* dlg 			*/ null);

			// optional arguments
			var exitArgIndex = 4;
			while (exitArgIndex < exitArgs.length) {
				if (exitArgs[exitArgIndex] == "FX") {
					ext.transition_effect = exitArgs[exitArgIndex+1];
					exitArgIndex += 2;
				}
				else if (exitArgs[exitArgIndex] == "DLG") {
					ext.dlg = exitArgs[exitArgIndex+1];
					exitArgIndex += 2;
				}
				else {
					exitArgIndex += 1;
				}
			}

			roomData.exits.push(ext);
		}
		else if (getType(lines[i]) === "END") {
			/* ADD ENDING */
			var endId = getId(lines[i]);

			var endCoords = getCoord(lines[i], 2);
			var end = createEndingData(
				/* id */ endId,
				/* x */ parseInt(endCoords[0]),
				/* y */ parseInt(endCoords[1]));

			roomData.endings.push(end);
		}
		else if (getType(lines[i]) === "PAL") {
			/* CHOOSE PALETTE (that's not default) */
			roomData.pal = getId(lines[i]);
		}
		else if (getType(lines[i]) === "AVA") {
			// change avatar appearance per room
			roomData.ava = getId(lines[i]);
		}
		else if (getType(lines[i]) === "TUNE") {
			roomData.tune = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			roomData.name = getNameArg(lines[i]);
		}

		i++;
	}

	world.room[id] = roomData;

	return i;
}

function parseTile(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	var tileData = createDrawingData("TIL", id);

	i++;

	// read & store tile image source
	i = parseDrawingCore(lines, i, tileData.drw, world);

	// update animation info
	tileData.animation.frameCount = getDrawingFrameCount(world, tileData.drw);
	tileData.animation.isAnimated = tileData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			tileData.col = parseInt(getId(lines[i]));
		}
		else if (getType(lines[i]) === "BGC") {
			var bgcId = getId(lines[i]);
			if (bgcId === "*") {
				// transparent background
				tileData.bgc = (-1 * tileColorStartIndex);
			}
			else {
				tileData.bgc = parseInt(bgcId);
			}
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			tileData.name = getNameArg(lines[i]);
		}
		else if (getType(lines[i]) === "WAL") {
			var wallArg = getArg(lines[i], 1);
			if (wallArg === "true") {
				tileData.isWall = true;
			}
			else if (wallArg === "false") {
				tileData.isWall = false;
			}
		}

		i++;
	}

	// store tile data
	world.tile[id] = tileData;

	return i;
}

function parseSprite(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	var type = (id === "A") ? "AVA" : "SPR";
	var spriteData = createDrawingData(type, id);

	// bitsy.log(spriteData);

	i++;

	// read & store sprite image source
	i = parseDrawingCore(lines, i, spriteData.drw, world);

	// update animation info
	spriteData.animation.frameCount = getDrawingFrameCount(world, spriteData.drw);
	spriteData.animation.isAnimated = spriteData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			spriteData.col = parseInt(getId(lines[i]));
		}
		else if (getType(lines[i]) === "BGC") {
			/* BACKGROUND COLOR */
			var bgcId = getId(lines[i]);
			if (bgcId === "*") {
				// transparent background
				spriteData.bgc = (-1 * tileColorStartIndex);
			}
			else {
				spriteData.bgc = parseInt(bgcId);
			}
		}
		else if (getType(lines[i]) === "POS") {
			/* STARTING POSITION */
			var posArgs = lines[i].split(" ");
			var roomId = posArgs[1];
			var coordArgs = posArgs[2].split(",");
			parseState.spriteStartLocations[id] = {
				room : roomId,
				x : parseInt(coordArgs[0]),
				y : parseInt(coordArgs[1])
			};
		}
		else if(getType(lines[i]) === "DLG") {
			spriteData.dlg = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			spriteData.name = getNameArg(lines[i]);
		}
		else if (getType(lines[i]) === "ITM") {
			/* ITEM STARTING INVENTORY */
			var itemId = getId(lines[i]);
			var itemCount = parseFloat(getArg(lines[i], 2));
			spriteData.inventory[itemId] = itemCount;
		}
		else if (getType(lines[i]) == "BLIP") {
			var blipId = getId(lines[i]);
			spriteData.blip = blipId;
		}

		i++;
	}

	// store sprite data
	world.sprite[id] = spriteData;

	return i;
}

function parseItem(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	var itemData = createDrawingData("ITM", id);

	i++;

	// read & store item image source
	i = parseDrawingCore(lines, i, itemData.drw, world);

	// update animation info
	itemData.animation.frameCount = getDrawingFrameCount(world, itemData.drw);
	itemData.animation.isAnimated = itemData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			itemData.col = parseInt(getArg(lines[i], 1));
		}
		else if (getType(lines[i]) === "BGC") {
			/* BACKGROUND COLOR */
			var bgcId = getId(lines[i]);
			if (bgcId === "*") {
				// transparent background
				itemData.bgc = (-1 * tileColorStartIndex);
			}
			else {
				itemData.bgc = parseInt(bgcId);
			}
		}
		else if (getType(lines[i]) === "DLG") {
			itemData.dlg = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			itemData.name = getNameArg(lines[i]);
		}
		else if (getType(lines[i]) == "BLIP") {
			var blipId = getId(lines[i]);
			itemData.blip = blipId;
		}

		i++;
	}

	// store item data
	world.item[id] = itemData;

	return i;
}

function parseDrawingCore(lines, i, drwId, world) {
	var frameList = []; //init list of frames
	frameList.push( [] ); //init first frame
	var frameIndex = 0;
	var y = 0;
	while (y < bitsy.TILE_SIZE) {
		var line = lines[i + y];
		var row = [];

		for (x = 0; x < bitsy.TILE_SIZE; x++) {
			row.push(parseInt(line.charAt(x)));
		}

		frameList[frameIndex].push(row);
		y++;

		if (y === bitsy.TILE_SIZE) {
			i = i + y;
			if (lines[i] != undefined && lines[i].charAt(0) === ">") {
				// start next frame!
				frameList.push([]);
				frameIndex++;

				//start the count over again for the next frame
				i++;
				y = 0;
			}
		}
	}

	storeDrawingData(world, drwId, frameList);

	return i;
}

function parseDialog(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	// hacky but I need to store this so I can set the name below
	var id = getId(lines[i]);

	i = parseScript(lines, i, world.dialog);

	if (i < lines.length && lines[i].length > 0 && getType(lines[i]) === "NAME") {
		world.dialog[id].name = getNameArg(lines[i]);
		i++;
	}

	return i;
}

// keeping this around to parse old files where endings were separate from dialogs
function parseEnding(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	return parseScript(lines, i, world.end);
}

function parseScript(lines, i, data) {
	var id = getId(lines[i]);
	i++;

	var results;
	if (scriptUtils) {
		results = scriptUtils.ReadDialogScript(lines,i);
	}
	else {
		results = { script: lines[i], index: (i + 1)};
	}

	data[id] = createDialogData(id);
	data[id].src = results.script;

	i = results.index;

	return i;
}

function parseVariable(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;
	var id = getId(lines[i]);
	i++;
	var value = lines[i];
	i++;
	world.variable[id] = value;
	return i;
}

function parseFontName(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;
	world.fontName = getArg(lines[i], 1);
	i++;
	return i;
}

function parseTextDirection(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;
	world.textDirection = getArg(lines[i], 1);
	i++;
	return i;
}

function parseFontData(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	// NOTE : we're not doing the actual parsing here --
	// just grabbing the block of text that represents the font
	// and giving it to the font manager to use later

	var localFontName = getId(lines[i]);
	var localFontData = lines[i];
	i++;

	while (i < lines.length && lines[i] != "") {
		localFontData += "\\n" + lines[i];
		i++;
	}

	var localFontFilename = localFontName + fontManager.GetExtension();
	fontManager.AddResource( localFontFilename, localFontData );

	return i;
}

function parseTune(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	i++;

	var tuneData = createTuneData(id);

	var barIndex = 0;
	while (barIndex < maxTuneLength) {
		// MELODY
		var melodyBar = createTuneBarData();
		var melodyNotes = lines[i].split(",");
		for (var j = 0; j < barLength; j++) {
			// default to a rest
			var pitch = { beats: 0, note: Note.C, octave: Octave[4], };

			if (j < melodyNotes.length) {
				var pitchSplit = melodyNotes[j].split("~");
				var pitchStr = pitchSplit[0];
				pitch = parsePitch(melodyNotes[j]);

				// look for effect added to the note
				if (pitchSplit.length > 1) {
					var blipId = pitchSplit[1];
					pitch.blip = blipId;
				}
			}

			melodyBar[j] = pitch;
		}
		tuneData.melody.push(melodyBar);
		i++;

		// HARMONY
		var harmonyBar = createTuneBarData();
		var harmonyNotes = lines[i].split(",");
		for (var j = 0; j < barLength; j++) {
			// default to a rest
			var pitch = { beats: 0, note: Note.C, octave: Octave[4], };

			if (j < harmonyNotes.length) {
				var pitchSplit = harmonyNotes[j].split("~");
				var pitchStr = pitchSplit[0];
				pitch = parsePitch(harmonyNotes[j]);

				// look for effect added to the note
				if (pitchSplit.length > 1) {
					var blipId = pitchSplit[1];
					pitch.blip = blipId;
				}
			}

			harmonyBar[j] = pitch;
		}
		tuneData.harmony.push(harmonyBar);
		i++;

		// check if there's another bar after this one
		if (lines[i] === ">") {
			// there is! increment the index
			barIndex++;
			i++;
		}
		else {
			// we've reached the end of the tune!
			barIndex = maxTuneLength;
		}
	}

	// parse other tune properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "KEY") {
			tuneData.key = createTuneKeyData();

			var keyNotes = getArg(lines[i], 1);
			if (keyNotes) {
				keyNotes = keyNotes.split(",");
				for (var j = 0; j < keyNotes.length && j < tuneData.key.notes.length; j++) {
					var pitch = parsePitch(keyNotes[j]);
					tuneData.key.notes[j] = pitch.note;
				}
			}

			var keyScale = getArg(lines[i], 2);
			if (keyScale) {
				keyScale = keyScale.split(",");
				for (var j = 0; j < keyScale.length; j++) {
					var pitch = parsePitch(keyScale[j]);
					if (pitch.note > Solfa.NONE && pitch.note < Solfa.COUNT) {
						tuneData.key.scale.push(pitch.note);
					}
				}
			}
		}
		else if (getType(lines[i]) === "TMP") {
			var tempoId = getId(lines[i]);
			if (Tempo[tempoId] != undefined) {
				tuneData.tempo = Tempo[tempoId];
			}
		}
		else if (getType(lines[i]) === "SQR") {
			// square wave instrument settings
			var squareWaveIdA = getArg(lines[i], 1);
			if (SquareWave[squareWaveIdA] != undefined) {
				tuneData.instrumentA = SquareWave[squareWaveIdA];
			}

			var squareWaveIdB = getArg(lines[i], 2);
			if (SquareWave[squareWaveIdB] != undefined) {
				tuneData.instrumentB = SquareWave[squareWaveIdB];
			}
		}
		else if (getType(lines[i]) === "ARP") {
			var arp = getId(lines[i]);
			if (ArpeggioPattern[arp] != undefined) {
				tuneData.arpeggioPattern = ArpeggioPattern[arp];
			}
		}
		else if (getType(lines[i]) === "NAME") {
			var name = lines[i].split(/\\s(.+)/)[1];
			tuneData.name = name;
			// todo : add to map?
		}

		i++;
	}

	world.tune[id] = tuneData;

	return i;
}

function parseBlip(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;

	var id = getId(lines[i]);
	i++;

	var blipData = createBlipData(id);

	// blip pitches
	var notes = lines[i].split(",");
	if (notes.length >= 1) {
		blipData.pitchA = parsePitch(notes[0]);
	}
	if (notes.length >= 2) {
		blipData.pitchB = parsePitch(notes[1]);
	}
	if (notes.length >= 3) {
		blipData.pitchC = parsePitch(notes[2]);
	}
	i++;

	// blip parameters
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "ENV") {
			// envelope
			blipData.envelope.attack = parseInt(getArg(lines[i], 1));
			blipData.envelope.decay = parseInt(getArg(lines[i], 2));
			blipData.envelope.sustain = parseInt(getArg(lines[i], 3));
			blipData.envelope.length = parseInt(getArg(lines[i], 4));
			blipData.envelope.release = parseInt(getArg(lines[i], 5));
		}
		else if (getType(lines[i]) === "BEAT") {
			// pitch beat length
			blipData.beat.time = parseInt(getArg(lines[i], 1));
			blipData.beat.delay = parseInt(getArg(lines[i], 2));
		}
		else if (getType(lines[i]) === "SQR") {
			// square wave
			var squareWaveId = getArg(lines[i], 1);
			if (SquareWave[squareWaveId] != undefined) {
				blipData.instrument = SquareWave[squareWaveId];
			}
		}
		// TODO : consider for future update
		// else if (getType(lines[i]) === "SLD") {
		// 	// slide mode
		// 	if (parseInt(getArg(lines[i], 1)) === 1) {
		// 		blipData.doSlide = true;
		// 	}
		// }
		else if (getType(lines[i]) === "RPT") {
			// repeat mode
			if (parseInt(getArg(lines[i], 1)) === 1) {
				blipData.doRepeat = true;
			}
		}
		else if (getType(lines[i]) === "NAME") {
			var name = lines[i].split(/\\s(.+)/)[1];
			blipData.name = name;
		}

		i++;
	}

	world.blip[id] = blipData;

	return i;
}

function parsePitch(pitchStr) {
	var pitch = { beats: 1, note: Note.C, octave: Octave[4], };
	var i;

	// beats
	var beatsToken = "";
	for (i = 0; i < pitchStr.length && ("0123456789".indexOf(pitchStr[i]) != -1); i++) {
		beatsToken += pitchStr[i];
	}
	if (beatsToken.length > 0) {
		pitch.beats = parseInt(beatsToken);
	}

	// note
	var noteType;
	var noteName = "";
	if (i < pitchStr.length) {
		if (pitchStr[i] === pitchStr[i].toUpperCase()) {
			// uppercase letters represent chromatic notes
			noteType = Note;
			noteName += pitchStr[i];
			i++;

			// check for sharp
			if (i < pitchStr.length && pitchStr[i] === "#") {
				noteName += "_SHARP";
				i++;
			}
		}
		else {
			// lowercase letters represent solfa notes
			noteType = Solfa;
			noteName += pitchStr[i].toUpperCase();
			i++;
		}
	}

	if (noteType != undefined && noteType[noteName] != undefined) {
		pitch.note = noteType[noteName];
	}

	// octave
	var octaveToken = "";
	if (i < pitchStr.length) {
		octaveToken += pitchStr[i];
	}

	if (Octave[octaveToken] != undefined) {
		pitch.octave = Octave[octaveToken];
	}

	return pitch;
}

function parseFlag(parseState, world) {
	var i = parseState.index;
	var lines = parseState.lines;
	var id = getId(lines[i]);
	var valStr = lines[i].split(" ")[2];
	world.flags[id] = parseInt( valStr );
	i++;
	return i;
}

function getDrawingFrameCount(world, drwId) {
	return world.drawings[drwId].length;
}

function storeDrawingData(world, drwId, drawingData) {
	world.drawings[drwId] = drawingData;
}

function placeSprites(parseState, world) {
	for (id in parseState.spriteStartLocations) {
		world.sprite[id].room = parseState.spriteStartLocations[id].room;
		world.sprite[id].x = parseState.spriteStartLocations[id].x;
		world.sprite[id].y = parseState.spriteStartLocations[id].y;
	}
}

function createNameMapsForWorld(world) {
	var nameMaps = {};

	function createNameMap(objectStore) {
		var map = {};

		for (id in objectStore) {
			if (objectStore[id].name != undefined && objectStore[id].name != null) {
				map[objectStore[id].name] = id;
			}
		}

		return map;
	}

	nameMaps.room = createNameMap(world.room);
	nameMaps.tile = createNameMap(world.tile);
	nameMaps.sprite = createNameMap(world.sprite);
	nameMaps.item = createNameMap(world.item);
	nameMaps.dialog = createNameMap(world.dialog);
	nameMaps.palette = createNameMap(world.palette);
	nameMaps.tune = createNameMap(world.tune);
	nameMaps.blip = createNameMap(world.blip);

	return nameMaps;
}

function getType(line) {
	return getArg(line,0);
}

function getId(line) {
	return getArg(line,1);
}

function getCoord(line,arg) {
	return getArg(line,arg).split(",");
}

function getArg(line,arg) {
	return line.split(" ")[arg];
}

function getNameArg(line) {
	var name = line.split(/\\s(.+)/)[1];
	return name;
}
<\/script>

<script>
/* PITCH HELPER FUNCTIONS */
function pitchToSteps(pitch) {
	return (pitch.octave * Note.COUNT) + pitch.note;
}

function stepsToPitch(steps) {
	var pitch = { beats: 1, note: Note.C, octave: Octave[2], };

	while (steps >= Note.COUNT) {
		pitch.octave = (pitch.octave + 1) % Octave.COUNT;
		steps -= Note.COUNT;
	}

	pitch.note += steps;

	// make sure pitch isn't outside a valid range
	if (pitch.note <= Note.NONE) {
		pitch.note = Note.C;
	}
	else if (pitch.note >= Note.COUNT) {
		pitch.note = Note.B;
	}

	if (pitch.octave <= Octave.NONE) {
		pitch.octave = Octave[2];
	}
	else if (pitch.octave >= Octave.COUNT) {
		pitch.octave = Octave[5];
	}

	return pitch;
}

function adjustPitch(pitch, stepDelta) {
	return stepsToPitch(pitchToSteps(pitch) + stepDelta);
}

function pitchDistance(pitchA, pitchB) {
	return pitchToSteps(pitchB) - pitchToSteps(pitchA);
}

function isMinPitch(pitch) {
	return pitchToSteps(pitch) <= pitchToSteps({ note: Note.C, octave: Octave[2] });
}

function isMaxPitch(pitch) {
	return pitchToSteps(pitch) >= pitchToSteps({ note: Note.B, octave: Octave[5] });
}

function SoundPlayer() {
	// frequencies (in hertz) for octave 0 (or is it octave 4?)
	var frequencies = [
		261.7, // middle C
		277.2,
		293.7,
		311.2,
		329.7,
		349.3,
		370.0,
		392.0,
		415.3,
		440.0,
		466.2,
		493.9,
	];

	// tempos are calculated as the duration of a 16th note, rounded to the nearest millisecond
	var tempos = {};
	tempos[Tempo.SLW] = 250; // 60bpm (adagio)
	tempos[Tempo.MED] = 188; // ~80bpm (andante) [exact would be 187.5 ms]
	tempos[Tempo.FST] = 125; // 120bpm (moderato)
	tempos[Tempo.XFST] = 94; // ~160bpm (allegro) [exact would be 93.75 ms]

	// arpeggio patterns expressed in scale degrees
	var arpeggioPattern = {};
	arpeggioPattern[ArpeggioPattern.UP] = [0, 2, 4, 7];
	arpeggioPattern[ArpeggioPattern.DWN] = [7, 4, 2, 0];
	arpeggioPattern[ArpeggioPattern.INT5] = [0, 4];
	arpeggioPattern[ArpeggioPattern.INT8] = [0, 7];

	this.getArpeggioSteps = function(tune) { return arpeggioPattern[tune.arpeggioPattern]; };

	function isPitchPlayable(pitch, key) {
		if (pitch.beats <= 0) {
			return false;
		}

		if (key === undefined || key === null) {
			return true;
		}

		// test if note is in the scale
		return (key.scale.indexOf(pitch.note) > -1)
			&& (key.notes[pitch.note] > Note.NONE)
			&& (key.notes[pitch.note] < Note.COUNT);
	}

	function pitchToChromatic(pitch, key) {
		if (pitch === undefined || pitch === null) {
			return null;
		}

		if (key === undefined || key === null) {
			return pitch;
		}

		// convert from solfa
		var octaveOffset = (pitch.note >= Solfa.COUNT) ? 1 : 0;

		return {
			beats: pitch.beats,
			octave: pitch.octave + octaveOffset,
			// todo : what about the scale limits?
			note: key.notes[(pitch.note % Solfa.COUNT)],
			blip: pitch.blip
		};
	}

	function makePitchFrequency(pitch) {
		// todo : this clamp shouldn't be required.. there's a bug in the pitch shifting somewhere
		var note = Math.max(0, pitch.note);
		var octave = (pitch.octave != undefined ? pitch.octave : Octave[4]);

		var octaveMin = Octave[2];
		var octaveMax = Octave[5];

		// make sure octave is in valid range
		octave = Math.max(octaveMin, Math.min(octave, octaveMax));
		var distFromMiddleC = octave - 2;

		var freq = frequencies[note] * Math.pow(2, distFromMiddleC);

		if (isNaN(freq)) {
			bitsy.log("invalid frequency " + pitch, "sound");
		}

		return freq;
	}

	var maxVolume = 15; // todo : should this be a system constant?
	var noteVolume = 5;

	var curTune = null;
	var isTunePaused = false;
	var barIndex = -1;
	var curArpeggio = [];

	var beat16 = 0;
	var beat16Timer = 0;
	var beat16Index = 0;

	// special settings
	var isLooping = false;
	var isMelodyMuted = false;
	var maxBeatCount = null;
	var muteTimer = 0; // allow temporary muting of all notes

	function arpeggiateBar(bar, key, pattern) {
		var arpeggio = [];

		if (key != undefined && key != null && isPitchPlayable(bar[0], key)) {
			for (var i = 0; i < arpeggioPattern[pattern].length; i++) {
				var pitch = { beats: 1, note: bar[0].note + arpeggioPattern[pattern][i], octave: bar[0].octave };
				arpeggio.push(pitchToChromatic(pitch, key));
			}
		}

		for (var i = 0; i < arpeggio.length; i++) {
			bitsy.log(i + ": " + serializeNote(arpeggio[i].note));
		}

		return arpeggio;
	};

	function playNote(pitch, instrument, options) {
		if (pitch.beats <= 0) {
			return;
		}

		var channel = bitsy.SOUND1;
		if (options != undefined && options.channel != undefined) {
			channel = options.channel;
		}

		var key = null;
		if (options != undefined && options.key != undefined) {
			key = options.key;
		}

		var beatLen = beat16;
		if (options != undefined && options.beatLen != undefined) {
			beatLen = options.beatLen;
		}

		if (isPitchPlayable(pitch, key)) {
			var freq = makePitchFrequency(pitchToChromatic(pitch, key));
			bitsy.sound(channel, (pitch.beats * beatLen), freq * 100, noteVolume, instrument);
		}
	}

	function sfxFrequencyAtTime(sfx, time) {
		var beatDelay = sfx.blip.beat.delay;
		var beatTime = sfx.blip.beat.time;
		var delta = Math.max(0, time - beatDelay) / beatTime;

		var pitchDelta = sfx.blip.doRepeat
			? (delta % sfx.frequencies.length)
			: Math.min(delta, sfx.frequencies.length - 1);

		sfx.pitchIndex = Math.floor(pitchDelta);
		var curFreq = sfx.frequencies[sfx.pitchIndex];

		// TODO : consider for future update
		// if (sfx.blip.doSlide) {
		// 	var nextPitchIndex = (sfx.pitchIndex + 1) % sfx.frequencies.length;
		// 	var nextFreq = sfx.frequencies[nextPitchIndex];
		// 	var d = pitchDelta - sfx.pitchIndex;
		// 	curFreq = curFreq + ((nextFreq - curFreq) * d);
		// }

		return curFreq;
	}

	function sfxVolumeAtTime(sfx, time) {
		var volume = 0;

		// use envelope settings to calculate volume
		var attack = sfx.blip.envelope.attack;
		var decay = sfx.blip.envelope.decay;
		var length = sfx.blip.envelope.length;
		var release = sfx.blip.envelope.release;
		if (time < attack) {
			// attack
			var t = time / attack;
			volume = Math.floor(sfxPeakVolume * t);
		}
		else if (time < attack + decay) {
			// decay
			var t = (time - attack) / decay;
			var d = sfx.blip.envelope.sustain - sfxPeakVolume;
			volume = Math.floor(sfxPeakVolume + (d * t));
		}
		else if (time < attack + decay + length) {
			// sustain
			volume = sfx.blip.envelope.sustain;
		}
		else if (time < attack + decay + length + release) {
			// release
			var t = (time - (attack + decay + length)) / release;
			volume = Math.floor(sfx.blip.envelope.sustain * (1 - t));
		}
		else {
			volume = 0;
		}

		return volume;
	}

	function updateSfx(dt) {
		// try limiting the max change per frame
		dt = Math.min(dt, 32);
		var isAnyBlipPlaying = false;

		if (activeSfx != null) {
			isAnyBlipPlaying = true;
			var sfx = activeSfx;

			sfx.timer += dt;
			if (sfx.timer >= sfx.duration) {
				sfx.timer = sfx.duration;
			}

			if (sfx.frequencies.length > 0) {
				// update pitch
				var prevPitchIndex = sfx.pitchIndex;
				var freq = sfxFrequencyAtTime(sfx, sfx.timer);
				if (prevPitchIndex != sfx.pitchIndex) {
					// pitch changed!
					bitsy.frequency(bitsy.SOUND1, freq * 100);
				}

				// update volume envelope
				bitsy.volume(bitsy.SOUND1, sfxVolumeAtTime(sfx, sfx.timer));
			}

			if (sfx.timer >= sfx.duration) {
				// turn off sound
				bitsy.volume(bitsy.SOUND1, 0);
				activeSfx = null;
			}
		}

		if (isMusicPausedForBlip && !isAnyBlipPlaying) {
			isMusicPausedForBlip = false;
		}
	}

	function updateTune(dt) {
		if (curTune === undefined || curTune === null) {
			return;
		}

		beat16Timer += dt;

		if (muteTimer > 0) {
			muteTimer -= dt;
		}

		if (beat16Timer >= beat16) {
			beat16Timer = 0;
			beat16Index++;

			if (beat16Index >= 16) {
				beat16Index = 0;

				if (!isLooping) {
					barIndex = (barIndex + 1) % curTune.melody.length;

					if (curTune.arpeggioPattern != ArpeggioPattern.OFF && curTune.key != null) {
						curArpeggio = arpeggiateBar(curTune.harmony[barIndex], curTune.key, curTune.arpeggioPattern);
					}
				}
			}

			if (muteTimer <= 0) {
				if (!isMelodyMuted) {
					// melody note
					var pitchA = curTune.melody[barIndex][beat16Index];
					if (pitchA.beats > 0) {
						// since they're played on the same channel, any melody note will cancel a blip
						activeSfx = null;
					}

					if (pitchA.blip != undefined && pitchA.beats > 0) {
						playBlip(blip[pitchA.blip], { interruptMusic: false, pitch: pitchA, key: curTune.key });
					}
					else {
						playNote(pitchA, curTune.instrumentA, { channel: bitsy.SOUND1, key: curTune.key });
					}
				}

				if (curTune.arpeggioPattern === ArpeggioPattern.OFF) {
					// harmony note
					var pitchB = curTune.harmony[barIndex][beat16Index];
					if (pitchB.blip != undefined && pitchB.beats > 0) {
						playBlip(blip[pitchB.blip], { interruptMusic: false, pitch: pitchB, key: curTune.key });
					}
					else {
						playNote(pitchB, curTune.instrumentB, { channel: bitsy.SOUND2, key: curTune.key });
					}
				}
				else {
					var arpPitch = curArpeggio[beat16Index % curArpeggio.length];
					if (arpPitch != undefined && arpPitch.beats > 0) {
						playNote(arpPitch, curTune.instrumentB, { channel: bitsy.SOUND2, beatLen: beat16 });
					}
				}
			}

			if (maxBeatCount != null && beat16Index >= (maxBeatCount - 1)) {
				// stop playback early
				curTune = null;
			}
		}
	}

	this.update = function(dt) {
		updateSfx(dt);
		if (!isTunePaused && !isMusicPausedForBlip) {
			updateTune(dt);
		}
	};

	this.playTune = function(tune, options) {
		curTune = tune;
		beat16Timer = 0;
		beat16Index = -1;
		barIndex = 0;

		isLooping = false;
		isMelodyMuted = false;
		maxBeatCount = null;

		// special options for the editor
		if (options != undefined) {
			if (options.barIndex != undefined) {
				barIndex = options.barIndex;
			}

			if (options.loop != undefined) {
				isLooping = options.loop;
			}

			if (options.melody != undefined) {
				isMelodyMuted = !options.melody;
			}

			if (options.beatCount != undefined) {
				maxBeatCount = options.beatCount;
			}
		}

		// update tempo
		beat16 = tempos[curTune.tempo];

		if (curTune.arpeggioPattern != ArpeggioPattern.OFF && curTune.key != null) {
			curArpeggio = arpeggiateBar(curTune.harmony[barIndex], curTune.key, curTune.arpeggioPattern);
		}
	};

	this.isTunePlaying = function() {
		return curTune != null;
	};

	this.getCurTuneId = function() {
		if (curTune) {
			return curTune.id;
		}

		return null;
	};

	this.stopTune = function() {
		curTune = null;
	};

	this.pauseTune = function() {
		isTunePaused = true;
	};

	this.resumeTune = function() {
		isTunePaused = false;
	};

	this.getBeat = function() {
		if (curTune == null) {
			return null;
		}

		return {
			bar : barIndex,
			beat : beat16Index,
		};
	};

	this.getBlipState = function() {
		return activeSfx;
	};

	this.playNote = function(pitch, instrument, channel, key) {
		beat16 = tempos[Tempo.SLW];
		muteTimer = beat16;
		playNote(pitch, instrument, { channel: channel, key: key });
	};

	this.setTempo = function(tempo) {
		beat16 = tempos[tempo];
	};

	this.setLooping = function(looping) {
		isLooping = looping;
	};

	/* SOUND EFFECTS */
	var sfxPeakVolume = 10; // todo : is this a good value?
	var activeSfx = null;
	var isMusicPausedForBlip = false;

	function createSfxState(blip, pitch, isPitchRandomized) {
		// bitsy.log("init sfx blip: " + blip.id);

		var sfxState = {
			blip : blip,
			pitchIndex : -1,
			frequencies : [],
			timer : 0,
			duration : 0,
		};

		// is it weird to track this both in the system *AND* the engine?
		sfxState.duration = (blip.envelope.attack + blip.envelope.decay + blip.envelope.length + blip.envelope.release);

		// adjust starting pitch
		var step = 0;
		if (pitch != null) {
			step = pitchDistance(blip.pitchA, pitch);
		}
		else if (isPitchRandomized > 0) {
			step = Math.floor(Math.random() * 6);
		}

		if (blip.pitchA.beats > 0) {
			sfxState.frequencies.push(makePitchFrequency(adjustPitch(blip.pitchA, step)));
		}
		if (blip.pitchB.beats > 0) {
			sfxState.frequencies.push(makePitchFrequency(adjustPitch(blip.pitchB, step)));
		}
		if (blip.pitchC.beats > 0) {
			sfxState.frequencies.push(makePitchFrequency(adjustPitch(blip.pitchC, step)));
		}

		return sfxState;
	}

	function playBlip(blip, options) {
		// default to pausing music while the blip plays (except when playing a blip as *part* of music)
		isMusicPausedForBlip = (options === undefined || options.interruptMusic === undefined) ? true : options.interruptMusic;

		// always play blips on channel 1
		var channel = bitsy.SOUND1;

		// other options
		var pitch = (options === undefined || options.pitch === undefined) ? null : options.pitch;
		var isPitchRandomized = (options === undefined || options.isPitchRandomized === undefined) ? false : options.isPitchRandomized;
		var key = (options != undefined && options.key != undefined) ? options.key : null;

		activeSfx = createSfxState(blip, pitchToChromatic(pitch, key), isPitchRandomized);
		bitsy.log("play blip: " + activeSfx.frequencies);

		bitsy.sound(
			channel,
			activeSfx.duration * 10, // HACK : mult by 10 is to avoid accidentally turning off early
			activeSfx.frequencies.length > 0 ? (activeSfx.frequencies[0] * 100) : 0,
			0, // volume
			activeSfx.blip.instrument);
	};

	this.playBlip = playBlip;

	this.isBlipPlaying = function() {
		return isMusicPausedForBlip; // todo : rename this variable?
	};

	// todo : should any of this stuff be moved into the tool code?
	this.sampleBlip = function(blip, sampleCount) {
		var sfx = createSfxState(blip, null, false);

		var minFreq = makePitchFrequency({ note: Note.C, octave: Octave[2] });
		var maxFreq = makePitchFrequency({ note: Note.B, octave: Octave[5] });

		// sample the frequency of the sound
		var frequencySamples = [];
		for (var i = 0; i < sampleCount; i++) {
			if (sfx.frequencies.length > 0) {
				var t = Math.floor((i / sampleCount) * sfx.duration);
				// get frequency at time
				var freq = sfxFrequencyAtTime(sfx, t);
				// normalize the sample
				freq = freq / (maxFreq - minFreq);

				frequencySamples.push(freq);
			}
			else {
				frequencySamples.push(0);
			}
		}

		// sample the volume envelope
		var amplitudeSamples = [];
		for (var i = 0; i < sampleCount; i++) {
			var t = Math.floor((i / sampleCount) * sfx.duration);
			amplitudeSamples.push(sfxVolumeAtTime(sfx, t) / maxVolume);
		}

		return {
			frequencies: frequencySamples,
			amplitudes: amplitudeSamples
		};
	};
}
<\/script>

<script>
/*
TODO:
- can I simplify this more now that I've removed the external resources stuff?
*/

function FontManager(packagedFontNames) {

var self = this;

var fontExtension = ".bitsyfont";
this.GetExtension = function() {
	return fontExtension;
}

// place to store font data
var fontResources = {};

// load fonts from the editor
if (packagedFontNames != undefined && packagedFontNames != null && packagedFontNames.length > 0
		&& Resources != undefined && Resources != null) {

	for (var i = 0; i < packagedFontNames.length; i++) {
		var filename = packagedFontNames[i];
		fontResources[filename] = Resources[filename];
	}
}

// manually add resource
this.AddResource = function(filename, fontdata) {
	fontResources[filename] = fontdata;
}

this.ContainsResource = function(filename) {
	return fontResources[filename] != null;
}

function GetData(fontName) {
	return fontResources[fontName + fontExtension];
}
this.GetData = GetData;

function Create(fontData) {
	return new Font(fontData);
}
this.Create = Create;

this.Get = function(fontName) {
	var fontData = self.GetData(fontName);
	return self.Create(fontData);
}

function Font(fontData) {
	bitsy.log("create font");

	var name = "unknown";
	var width = 6; // default size so if you have NO font or an invalid font it displays boxes
	var height = 8;
	var chardata = {};

	// create invalid char data at default size in case the font is missing
	var invalidCharData = {};
	updateInvalidCharData();

	this.getName = function() {
		return name;
	}

	this.getData = function() {
		return chardata;
	}

	this.getWidth = function() {
		return width;
	}

	this.getHeight = function() {
		return height;
	}

	this.hasChar = function(char) {
		var codepoint = char.charCodeAt(0);
		return chardata[codepoint] != null;
	}

	this.getChar = function(char) {

		var codepoint = char.charCodeAt(0);

		if (chardata[codepoint] != null) {
			return chardata[codepoint];
		}
		else {
			return invalidCharData;
		}
	}

	this.allCharCodes = function() {
		var codeList = [];
		for (var code in chardata) {
			codeList.push(code);
		}
		return codeList;
	}

	function createCharData() {
		return { 
			width: width,
			height: height,
			offset: {
				x: 0,
				y: 0
			},
			spacing: width,
			data: [],
		};
	}

	function updateInvalidCharData() {
		invalidCharData = createCharData();
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				if (x < width-1 && y < height-1) {
					invalidCharData.data.push(1);
				}
				else {
					invalidCharData.data.push(0);
				}
			}
		}
	}

	function parseFont(fontData) {
		if (fontData == null) {
			return;
		}

		bitsy.log("split font lines");
		// NOTE: this is where we run out of memory - split creates a lot of memory issues
		// var lines = fontData.split("\\n");
		bitsy.log("after split lines");

		var isReadingChar = false;
		var isReadingCharProperties = false;
		var curCharLineCount = 0;
		var curCharCode = 0;

		var lineStart = 0;
		var lineEnd = fontData.indexOf("\\n", lineStart) != -1
			? fontData.indexOf("\\n", lineStart)
			: fontData.length;

		// for (var i = 0; i < lines.length; i++) {
		// 	var line = lines[i];
		while (lineStart < fontData.length) {
			var line = fontData.substring(lineStart, lineEnd);
			// bitsy.log("parse font xx " + line);

			if (line[0] === "#") {
				// skip comment lines
			}
			else if (!isReadingChar) {
				// READING NON CHARACTER DATA LINE
				var args = line.split(" ");
				if (args[0] == "FONT") {
					name = args[1];
				}
				else if (args[0] == "SIZE") {
					width = parseInt(args[1]);
					height = parseInt(args[2]);
				}
				else if (args[0] == "CHAR") {
					isReadingChar = true;
					isReadingCharProperties = true;

					curCharLineCount = 0;
					curCharCode = parseInt(args[1]);
					chardata[curCharCode] = createCharData();
				}
			}
			else {
				// CHAR PROPERTIES
				if (isReadingCharProperties) {
					var args = line.split(" ");
					if (args[0].indexOf("CHAR_") == 0) { // Sub-properties start with "CHAR_"
						if (args[0] == "CHAR_SIZE") {
							// Custom character size - overrides the default character size for the font
							chardata[curCharCode].width = parseInt(args[1]);
							chardata[curCharCode].height = parseInt(args[2]);
							chardata[curCharCode].spacing = parseInt(args[1]); // HACK : assumes CHAR_SIZE is always declared first
						}
						else if (args[0] == "CHAR_OFFSET") {
							// Character offset - shift the origin of the character on the X or Y axis
							chardata[curCharCode].offset.x = parseInt(args[1]);
							chardata[curCharCode].offset.y = parseInt(args[2]);
						}
						else if (args[0] == "CHAR_SPACING") {
							// Character spacing:
							// specify total horizontal space taken up by the character
							// lets chars take up more or less space on a line than its bitmap does
							chardata[curCharCode].spacing = parseInt(args[1]);
						}
					}
					else {
						isReadingCharProperties = false;
					}
				}

				// CHAR DATA
				if (!isReadingCharProperties) {
					// READING CHARACTER DATA LINE
					for (var j = 0; j < chardata[curCharCode].width; j++)
					{
						chardata[curCharCode].data.push( parseInt(line[j]) );
					}

					curCharLineCount++;
					if (curCharLineCount >= chardata[curCharCode].height) {
						isReadingChar = false;
					}
				}
			}

			lineStart = lineEnd + 1;
			lineEnd = fontData.indexOf("\\n", lineStart) != -1
				? fontData.indexOf("\\n", lineStart)
				: fontData.length;
		}

		// re-init invalid character box at the actual font size once it's loaded
		updateInvalidCharData();
	}

	bitsy.log("parse font");
	parseFont(fontData);

	bitsy.log("create font");
}

} // FontManager

<\/script>

<script>
var TransitionManager = function() {
	var transitionStart = null;
	var transitionEnd = null;

	var isTransitioning = false;
	var transitionTime = 0; // milliseconds
	var minStepTime = 125; // cap the frame rate
	var curStep = 0;

	this.BeginTransition = function(startRoom, startX, startY, endRoom, endX, endY, effectName) {
		bitsy.log("--- START ROOM TRANSITION ---");

		curEffect = effectName;

		var tmpRoom = player().room;
		var tmpX = player().x;
		var tmpY = player().y;

		if (transitionEffects[curEffect].showPlayerStart) {
			player().room = startRoom;
			player().x = startX;
			player().y = startY;
		}
		else {
			player().room = "_transition_none"; // kind of hacky!!
		}

		var startRoomPixels = createRoomPixelBuffer(room[startRoom]);
		var startPalette = getPal(room[startRoom].pal);
		var startImage = new PostProcessImage(startRoomPixels);
		transitionStart = new TransitionInfo(startImage, startPalette, startX, startY);

		if (transitionEffects[curEffect].showPlayerEnd) {
			player().room = endRoom;
			player().x = endX;
			player().y = endY;
		}
		else {
			player().room = "_transition_none";
		}

		var endRoomPixels = createRoomPixelBuffer(room[endRoom]);
		var endPalette = getPal(room[endRoom].pal);
		var endImage = new PostProcessImage(endRoomPixels);
		transitionEnd = new TransitionInfo(endImage, endPalette, endX, endY);

		isTransitioning = true;
		transitionTime = 0;
		curStep = 0;

		player().room = endRoom;
		player().x = endX;
		player().y = endY;

		bitsy.graphicsMode(bitsy.GFX_VIDEO);
	}

	this.UpdateTransition = function(dt) {
		if (!isTransitioning) {
			return;
		}

		transitionTime += dt;

		var maxStep = transitionEffects[curEffect].stepCount;

		if (transitionTime >= minStepTime) {
			curStep++;

			var step = curStep;
			bitsy.log("transition step " + step);

			if (transitionEffects[curEffect].paletteEffectFunc) {
				var colors = transitionEffects[curEffect].paletteEffectFunc(transitionStart, transitionEnd, (step / maxStep));
				updatePaletteWithTileColors(colors);
			}

			bitsy.fill(bitsy.VIDEO, tileColorStartIndex);

			for (var y = 0; y < bitsy.VIDEO_SIZE; y++) {
				for (var x = 0; x < bitsy.VIDEO_SIZE; x++) {
					var color = transitionEffects[curEffect].pixelEffectFunc(transitionStart, transitionEnd, x, y, (step / maxStep));
					bitsy.set(bitsy.VIDEO, (y * bitsy.VIDEO_SIZE) + x, color);
				}
			}

			transitionTime = 0;
		}

		if (curStep >= (maxStep - 1)) {
			isTransitioning = false;
			transitionTime = 0;
			transitionStart = null;
			transitionEnd = null;
			curStep = 0;

			if (transitionCompleteCallback != null) {
				transitionCompleteCallback();
			}
			transitionCompleteCallback = null;

			bitsy.graphicsMode(bitsy.GFX_MAP);
		}
	}

	this.IsTransitionActive = function() {
		return isTransitioning;
	}

	// todo : should this be part of the constructor?
	var transitionCompleteCallback = null;
	this.OnTransitionComplete = function(callback) {
		if (isTransitioning) { // TODO : safety check necessary?
			transitionCompleteCallback = callback;
		}
	}

	var transitionEffects = {};
	var curEffect = "none";
	this.RegisterTransitionEffect = function(name, effect) {
		transitionEffects[name] = effect;
	}

	this.RegisterTransitionEffect("none", {
		showPlayerStart : false,
		showPlayerEnd : false,
		paletteEffectFunc : function() {},
		pixelEffectFunc : function() {},
	});

	this.RegisterTransitionEffect("fade_w", { // TODO : have it linger on full white briefly?
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 6,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			return delta < 0.5 ? start.Image.GetPixel(pixelX, pixelY) : end.Image.GetPixel(pixelX, pixelY);
		},
		paletteEffectFunc : function(start, end, delta) {
			var colors = [];

			if (delta < 0.5) {
				delta = delta / 0.5;

				for (var i = 0; i < start.Palette.length; i++) {
					colors.push(lerpColor(start.Palette[i], [255, 255, 255], delta));
				}
			}
			else {
				delta = ((delta - 0.5) / 0.5);

				for (var i = 0; i < end.Palette.length; i++) {
					colors.push(lerpColor([255, 255, 255], end.Palette[i], delta));
				}
			}

			return colors;
		},
	});

	this.RegisterTransitionEffect("fade_b", {
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 6,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			return delta < 0.5 ? start.Image.GetPixel(pixelX, pixelY) : end.Image.GetPixel(pixelX, pixelY);
		},
		paletteEffectFunc : function(start, end, delta) {
			var colors = [];

			if (delta < 0.5) {
				delta = delta / 0.5;

				for (var i = 0; i < start.Palette.length; i++) {
					colors.push(lerpColor(start.Palette[i], [0, 0, 0], delta));
				}
			}
			else {
				delta = ((delta - 0.5) / 0.5);

				for (var i = 0; i < end.Palette.length; i++) {
					colors.push(lerpColor([0, 0, 0], end.Palette[i], delta));
				}
			}

			return colors;
		},
	});

	this.RegisterTransitionEffect("wave", {
		showPlayerStart : true,
		showPlayerEnd : true,
		stepCount : 12,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			var waveDelta = delta < 0.5 ? delta / 0.5 : 1 - ((delta - 0.5) / 0.5);

			var offset = (pixelY + (waveDelta * waveDelta * 0.2 * start.Image.Height));
			var freq = 4;
			var size = 2 + (14 * waveDelta);
			pixelX += Math.floor(Math.sin(offset / freq) * size);

			if (pixelX < 0) {
				pixelX += start.Image.Width;
			}
			else if (pixelX >= start.Image.Width) {
				pixelX -= start.Image.Width;
			}

			var curImage = delta < 0.5 ? start.Image : end.Image;
			return curImage.GetPixel(pixelX, pixelY);
		},
		paletteEffectFunc : function(start, end, delta) {
			return delta < 0.5 ? start.Palette : end.Palette;
		},
	});

	this.RegisterTransitionEffect("tunnel", {
		showPlayerStart : true,
		showPlayerEnd : true,
		stepCount : 12,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			if (delta <= 0.4) {
				var tunnelDelta = 1 - (delta / 0.4);

				var xDist = start.PlayerCenter.x - pixelX;
				var yDist = start.PlayerCenter.y - pixelY;
				var dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

				if (dist > start.Image.Width * tunnelDelta) {
					return 0;
				}
				else {
					return start.Image.GetPixel(pixelX, pixelY);
				}
			}
			else if (delta <= 0.6) {
				return 0;
			}
			else {
				var tunnelDelta = (delta - 0.6) / 0.4;

				var xDist = end.PlayerCenter.x - pixelX;
				var yDist = end.PlayerCenter.y - pixelY;
				var dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

				if (dist > end.Image.Width * tunnelDelta) {
					return 0;
				}
				else {
					return end.Image.GetPixel(pixelX, pixelY);
				}
			}
		},
		paletteEffectFunc : function(start, end, delta) {
			return delta < 0.5 ? start.Palette : end.Palette;
		},
	});

	function lerpPalettes(start, end, delta) {
		var colors = [];

		var maxLength = (start.Palette.length > end.Palette.length) ?
			start.Palette.length : end.Palette.length;

		for (var i = 0; i < maxLength; i++) {
			if (i < start.Palette.length && i < end.Palette.length) {
				colors.push(lerpColor(start.Palette[i], end.Palette[i], delta));
			}
			else if (i < start.Palette.length) {
				colors.push(lerpColor(
					start.Palette[i],
					end.Palette[end.Palette.length - 1],
					delta));
			}
			else if (i < end.Palette.length) {
				colors.push(lerpColor(
					start.Palette[start.Palette.length - 1],
					end.Palette[i],
					delta));
			}
		}

		return colors;
	}

	this.RegisterTransitionEffect("slide_u", {
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 8,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			var pixelOffset = -1 * Math.floor(start.Image.Height * delta);
			var slidePixelY = pixelY + pixelOffset;

			if (slidePixelY >= 0) {
				return start.Image.GetPixel(pixelX, slidePixelY);
			}
			else {
				slidePixelY += start.Image.Height;
				return end.Image.GetPixel(pixelX, slidePixelY);
			}
		},
		paletteEffectFunc : lerpPalettes,
	});

	this.RegisterTransitionEffect("slide_d", {
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 8,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			var pixelOffset = Math.floor(start.Image.Height * delta);
			var slidePixelY = pixelY + pixelOffset;

			if (slidePixelY < start.Image.Height) {
				return start.Image.GetPixel(pixelX, slidePixelY);
			}
			else {
				slidePixelY -= start.Image.Height;
				return end.Image.GetPixel(pixelX, slidePixelY);
			}
		},
		paletteEffectFunc : lerpPalettes,
	});

	this.RegisterTransitionEffect("slide_l", {
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 8,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			var pixelOffset = -1 * Math.floor(start.Image.Width * delta);
			var slidePixelX = pixelX + pixelOffset;

			if (slidePixelX >= 0) {
				return start.Image.GetPixel(slidePixelX, pixelY);
			}
			else {
				slidePixelX += start.Image.Width;
				return end.Image.GetPixel(slidePixelX, pixelY);
			}
		},
		paletteEffectFunc : lerpPalettes,
	});

	this.RegisterTransitionEffect("slide_r", {
		showPlayerStart : false,
		showPlayerEnd : true,
		stepCount : 8,
		pixelEffectFunc : function(start, end, pixelX, pixelY, delta) {
			var pixelOffset = Math.floor(start.Image.Width * delta);
			var slidePixelX = pixelX + pixelOffset;

			if (slidePixelX < start.Image.Width) {
				return start.Image.GetPixel(slidePixelX, pixelY);
			}
			else {
				slidePixelX -= start.Image.Width;
				return end.Image.GetPixel(slidePixelX, pixelY);
			}
		},
		paletteEffectFunc : lerpPalettes,
	});

	// todo : move to Renderer()?
	function createRoomPixelBuffer(room) {
		var pixelBuffer = [];

		for (var i = 0; i < bitsy.VIDEO_SIZE * bitsy.VIDEO_SIZE; i++) {
			pixelBuffer.push(tileColorStartIndex);
		}

		var drawTileInPixelBuffer = function(sourceData, frameIndex, colorIndex, tx, ty, pixelBuffer) {
			var frameData = sourceData[frameIndex];

			for (var y = 0; y < bitsy.TILE_SIZE; y++) {
				for (var x = 0; x < bitsy.TILE_SIZE; x++) {
					var color = tileColorStartIndex + (frameData[y][x] === 1 ? colorIndex : 0);
					pixelBuffer[(((ty * bitsy.TILE_SIZE) + y) * bitsy.VIDEO_SIZE) + ((tx * bitsy.TILE_SIZE) + x)] = color;
				}
			}
		}

		//draw tiles
		for (i in room.tilemap) {
			for (j in room.tilemap[i]) {
				var id = room.tilemap[i][j];
				var x = parseInt(j);
				var y = parseInt(i);

				if (id != "0" && tile[id] != null) {
					drawTileInPixelBuffer(
						renderer.GetDrawingSource(tile[id].drw),
						tile[id].animation.frameIndex,
						tile[id].col,
						x,
						y,
						pixelBuffer);
				}
			}
		}

		//draw items
		for (var i = 0; i < room.items.length; i++) {
			var itm = room.items[i];
			drawTileInPixelBuffer(
				renderer.GetDrawingSource(item[itm.id].drw),
				item[itm.id].animation.frameIndex,
				item[itm.id].col,
				itm.x,
				itm.y,
				pixelBuffer);
		}

		//draw sprites
		for (id in sprite) {
			var spr = sprite[id];
			if (spr.room === room.id) {
				drawTileInPixelBuffer(
					renderer.GetDrawingSource(spr.drw),
					spr.animation.frameIndex,
					spr.col,
					spr.x,
					spr.y,
					pixelBuffer);
			}
		}

		return pixelBuffer;
	}

	function lerpColor(colorA, colorB, t) {
		return [
			colorA[0] + ((colorB[0] - colorA[0]) * t),
			colorA[1] + ((colorB[1] - colorA[1]) * t),
			colorA[2] + ((colorB[2] - colorA[2]) * t),
		];
	};
}; // TransitionManager()

// todo : is this wrapper still useful?
var PostProcessImage = function(imageData) {
	this.Width = bitsy.VIDEO_SIZE;
	this.Height = bitsy.VIDEO_SIZE;

	this.GetPixel = function(x, y) {
		return imageData[(y * bitsy.VIDEO_SIZE) + x];
	};

	this.GetData = function() {
		return imageData;
	};
};

var TransitionInfo = function(image, palette, playerX, playerY) {
	this.Image = image;

	this.Palette = palette;

	this.PlayerTilePos = {
		x: playerX,
		y: playerY
	};

	this.PlayerCenter = {
		x: Math.floor((playerX * bitsy.TILE_SIZE) + (bitsy.TILE_SIZE / 2)),
		y: Math.floor((playerY * bitsy.TILE_SIZE) + (bitsy.TILE_SIZE / 2))
	};
};
<\/script>

<script>
function Script() {

this.CreateInterpreter = function() {
	return new Interpreter();
};

this.CreateUtils = function() {
	return new Utils();
};

var Interpreter = function() {
	var env = new Environment();
	var parser = new Parser( env );

	this.SetDialogBuffer = function(buffer) { env.SetDialogBuffer( buffer ); };

	// TODO -- maybe this should return a string instead othe actual script??
	this.Compile = function(scriptName, scriptStr) {
		var script = parser.Parse(scriptStr, scriptName);
		env.SetScript(scriptName, script);
	}
	this.Run = function(scriptName, exitHandler, objectContext) { // Runs pre-compiled script
		var localEnv = new LocalEnvironment(env);

		if (objectContext) {
			localEnv.SetObject(objectContext); // PROTO : should this be folded into the constructor?
		}

		var script = env.GetScript(scriptName);

		script.Eval( localEnv, function(result) { OnScriptReturn(localEnv, exitHandler); } );
	}
	this.Interpret = function(scriptStr, exitHandler, objectContext) { // Compiles and runs code immediately
		// bitsy.log("INTERPRET");
		var localEnv = new LocalEnvironment(env);

		if (objectContext) {
			localEnv.SetObject(objectContext); // PROTO : should this be folded into the constructor?
		}

		var script = parser.Parse(scriptStr, "anonymous");
		script.Eval( localEnv, function(result) { OnScriptReturn(localEnv, exitHandler); } );
	}
	this.HasScript = function(name) { return env.HasScript(name); };

	this.ResetEnvironment = function() {
		env = new Environment();
		parser = new Parser( env );
	}

	this.Parse = function(scriptStr, rootId) { // parses a script but doesn't save it
		return parser.Parse(scriptStr, rootId);
	}

	this.Eval = function(scriptTree, exitHandler) { // runs a script stored externally
		var localEnv = new LocalEnvironment(env); // TODO : does this need an object context?
		scriptTree.Eval(
			localEnv,
			function(result) {
				OnScriptReturn(result, exitHandler);
			});
	}

	function OnScriptReturn(result, exitHandler) {
		if (exitHandler != null) {
			exitHandler(result);
		}
	}

	this.CreateExpression = function(expStr) {
		return parser.CreateExpression(expStr);
	}

	this.SetVariable = function(name,value,useHandler) {
		env.SetVariable(name,value,useHandler);
	}

	this.DeleteVariable = function(name,useHandler) {
		env.DeleteVariable(name,useHandler);
	}
	this.HasVariable = function(name) {
		return env.HasVariable(name);
	}

	this.SetOnVariableChangeHandler = function(onVariableChange) {
		env.SetOnVariableChangeHandler(onVariableChange);
	}
	this.GetVariableNames = function() {
		return env.GetVariableNames();
	}
	this.GetVariable = function(name) {
		return env.GetVariable(name);
	}

	function DebugVisualizeScriptTree(scriptTree) {
		var printVisitor = {
			Visit : function(node,depth) {
				bitsy.log("-".repeat(depth) + "- " + node.ToString());
			},
		};

		scriptTree.VisitAll( printVisitor );
	}

	this.DebugVisualizeScriptTree = DebugVisualizeScriptTree;

	this.DebugVisualizeScript = function(scriptName) {
		DebugVisualizeScriptTree(env.GetScript(scriptName));
	}
}


var Utils = function() {
	// for editor ui
	this.CreateDialogBlock = function(children,doIndentFirstLine) {
		if (doIndentFirstLine === undefined) {
			doIndentFirstLine = true;
		}

		var block = new DialogBlockNode(doIndentFirstLine);

		for (var i = 0; i < children.length; i++) {
			block.AddChild(children[i]);
		}
		return block;
	}

	this.CreateOptionBlock = function() {
		var block = new DialogBlockNode(false);
		block.AddChild(new FuncNode("say", [new LiteralNode(" ")]));
		return block;
	}

	this.CreateItemConditionPair = function() {
		var itemFunc = this.CreateFunctionBlock("item", ["0"]);
		var condition = new ExpNode("==", itemFunc, new LiteralNode(1));
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("say", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateVariableConditionPair = function() {
		var varNode = this.CreateVariableNode("a");
		var condition = new ExpNode("==", varNode, new LiteralNode(1));
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("say", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateDefaultConditionPair = function() {
		var condition = this.CreateElseNode();
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("say", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateEmptySayFunc = function() {
		return new FuncNode("say", [new LiteralNode("...")]);
	}

	this.CreateFunctionBlock = function(name, initParamValues) {
		var parameters = [];
		for (var i = 0; i < initParamValues.length; i++) {
			parameters.push(new LiteralNode(initParamValues[i]));
		}

		var node = new FuncNode(name, parameters);
		var block = new CodeBlockNode();
		block.AddChild(node);
		return block;
	}

	// TODO : rename ParseStringToLiteralNode?
	this.CreateLiteralNode = function(str) {
		if (str === "true") {
			return new LiteralNode(true);
		}
		else if (str === "false") {
			return new LiteralNode(false);
		}
		else if (!isNaN(parseFloat(str))) {
			return new LiteralNode(parseFloat(str));
		}
		else {
			return new LiteralNode(str);
		}
	}

	this.CreateVariableNode = function(variableName) {
		return new VarNode(variableName);
	}

	this.CreatePropertyNode = function(propertyName, literalValue) {
		var varNode = new VarNode(propertyName);
		var valNode = new LiteralNode(literalValue);
		var node = new FuncNode("property", [varNode, valNode]);
		var block = new CodeBlockNode();
		block.AddChild(node);
		return block;
	}

	this.CreateElseNode = function() {
		return new ElseNode();
	}

	this.CreateStringLiteralNode = function(str) {
		return new LiteralNode(str);
	}

	// TODO : need to split up code & dialog blocks :|
	this.CreateCodeBlock = function() {
		return new CodeBlockNode();
	}

	this.ChangeSequenceType = function(oldSequence, type) {
		if(type === "sequence") {
			return new SequenceNode(oldSequence.children);
		}
		else if(type === "cycle") {
			return new CycleNode(oldSequence.children);
		}
		else if(type === "shuffle") {
			return new ShuffleNode(oldSequence.children);
		}
		return oldSequence;
	}

	this.CreateSequenceBlock = function() {
		var option1 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option1.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var sequence = new SequenceNode( [ option1, option2 ] );
		var block = new CodeBlockNode();
		block.AddChild( sequence );
		return block;
	}

	this.CreateCycleBlock = function() {
		var option1 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option1.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var sequence = new CycleNode( [ option1, option2 ] );
		var block = new CodeBlockNode();
		block.AddChild( sequence );
		return block;
	}

	this.CreateShuffleBlock = function() {
		var option1 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option1.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var sequence = new ShuffleNode( [ option1, option2 ] );
		var block = new CodeBlockNode();
		block.AddChild( sequence );
		return block;
	}

	this.CreateIfBlock = function() {
		var leftNode = new CodeBlockNode();
		leftNode.AddChild( new FuncNode("item", [new LiteralNode("0")] ) );
		var rightNode = new LiteralNode( 1 );
		var condition1 = new ExpNode("==", leftNode, rightNode );

		var condition2 = new ElseNode();

		var result1 = new DialogBlockNode();
		result1.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var result2 = new DialogBlockNode();
		result2.AddChild(new FuncNode("say", [new LiteralNode("...")]));

		var ifNode = new IfNode( [ condition1, condition2 ], [ result1, result2 ] );
		var block = new CodeBlockNode();
		block.AddChild( ifNode );
		return block;
	}

	this.ReadDialogScript = function(lines, i) {
		var scriptStr = "";
		if (lines[i] === Sym.DialogOpen) {
			scriptStr += lines[i] + "\\n";
			i++;
			while(lines[i] != Sym.DialogClose) {
				scriptStr += lines[i] + "\\n";
				i++;
			}
			scriptStr += lines[i];
			i++;
		}
		else {
			scriptStr += lines[i];
			i++;
		}
		return { script:scriptStr, index:i };
	}

	// TODO this.ReadCodeScript (reads through code open and close symbols), and this.ReadScript

	this.EnsureDialogBlockFormat = function(dialogStr) {
		// TODO -- what if it's already enclosed in dialog symbols??
		if(dialogStr.indexOf('\\n') > -1) {
			dialogStr = Sym.DialogOpen + "\\n" + dialogStr + "\\n" + Sym.DialogClose;
		}
		return dialogStr;
	}

	this.RemoveDialogBlockFormat = function(source) {
		var sourceLines = source.split("\\n");
		var dialogStr = "";
		if(sourceLines[0] === Sym.DialogOpen) {
			// multi line
			var i = 1;
			while (i < sourceLines.length && sourceLines[i] != Sym.DialogClose) {
				dialogStr += sourceLines[i] + (sourceLines[i+1] != Sym.DialogClose ? '\\n' : '');
				i++;
			}
		}
		else {
			// single line
			dialogStr = source;
		}
		return dialogStr;
	}

	this.SerializeDialogNodeList = function(nodeList) {
		var tempBlock = new DialogBlockNode(false);
		 // set children directly to avoid breaking the parenting chain for this temp operation
		tempBlock.children = nodeList;
		return tempBlock.Serialize();
	}

	this.GetOperatorList = function() {
		return [Sym.Set].concat(Sym.Operators);
	}

	this.IsInlineCode = function(node) {
		return isInlineCode(node);
	}
}


/* BUILT-IN FUNCTIONS */ // TODO: better way to encapsulate these?
function deprecatedFunc(environment,parameters,onReturn) {
	bitsy.log("BITSY SCRIPT WARNING: Tried to use deprecated function");
	onReturn(null);
}

function sayFunc(environment, parameters, onReturn) {
	if (parameters[0] != undefined && parameters[0] != null) {
		var textStr = "" + parameters[0];
		environment.GetDialogBuffer().AddText(textStr);
		environment.GetDialogBuffer().AddScriptReturn(function() { onReturn(null); });
	}
	else {
		onReturn(null);
	}
}

function linebreakFunc(environment, parameters, onReturn) {
	// bitsy.log("LINEBREAK FUNC");
	environment.GetDialogBuffer().AddLinebreak();
	environment.GetDialogBuffer().AddScriptReturn(function() { onReturn(null); });
}

function pagebreakFunc(environment, parameters, onReturn) {
	environment.GetDialogBuffer().AddPagebreak(function() { onReturn(null); });
}

function drawFunc(environment, parameters, onReturn) {
	var drawingId = parameters[0];
	environment.GetDialogBuffer().AddDrawing(drawingId);
	environment.GetDialogBuffer().AddScriptReturn(function() { onReturn(null); });
}

function drawSpriteFunc(environment, parameters, onReturn) {
	var spriteId = parameters[0];

	// check if id parameter is actually a name
	if (names.sprite[spriteId] != undefined) {
		spriteId = names.sprite[spriteId];
	}

	var drawingId = sprite[spriteId].drw;
	drawFunc(environment, [drawingId], onReturn);
}

function drawTileFunc(environment, parameters, onReturn) {
	var tileId = parameters[0];

	// check if id parameter is actually a name
	if (names.tile[tileId] != undefined) {
		tileId = names.tile[tileId];
	}

	var drawingId = tile[tileId].drw;
	drawFunc(environment, [drawingId], onReturn);
}

function drawItemFunc(environment, parameters, onReturn) {
	var itemId = parameters[0];

	// check if id parameter is actually a name
	if (names.item[itemId] != undefined) {
		itemId = names.item[itemId];
	}

	var drawingId = item[itemId].drw;
	drawFunc(environment, [drawingId], onReturn);
}

function printFontFunc(environment, parameters, onReturn) {
	var allCharacters = "";
	var font = fontManager.Get(fontName);
	var codeList = font.allCharCodes();
	for (var i = 0; i < codeList.length; i++) {
		allCharacters += String.fromCharCode(codeList[i]) + " ";
	}
	sayFunc(environment, [allCharacters], onReturn);
}

function itemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];

	if (names.item[itemId] != undefined) {
		// id is actually a name
		itemId = names.item[itemId];
	}

	var curItemCount = player().inventory[itemId] ? player().inventory[itemId] : 0;

	if (parameters.length > 1) {
		// TODO : is it a good idea to force inventory to be >= 0?
		player().inventory[itemId] = Math.max(0, parseInt(parameters[1]));
		curItemCount = player().inventory[itemId];

		if (onInventoryChanged != null) {
			onInventoryChanged(itemId);
		}
	}

	onReturn(curItemCount);
}

function toggleTextEffect(environment, name) {
	if (environment.GetDialogBuffer().hasTextEffect(name)) {
		environment.GetDialogBuffer().popTextEffect(name);
	}
	else {
		environment.GetDialogBuffer().pushTextEffect(name, []);
	}
}

function color1Func(environment, parameters, onReturn) {
	toggleTextEffect(environment, "clr1");
	onReturn(null);
}

function color2Func(environment, parameters, onReturn) {
	toggleTextEffect(environment, "clr2");
	onReturn(null);
}

function color3Func(environment, parameters, onReturn) {
	toggleTextEffect(environment, "clr3");
	onReturn(null);
}

function colorFunc(environment, parameters, onReturn) {
	environment.GetDialogBuffer().pushTextEffect("clr", parameters);
	onReturn(null);
}

function colorPopFunc(environment, parameters, onReturn) {
	if (environment.GetDialogBuffer().hasTextEffect("clr")) {
		environment.GetDialogBuffer().popTextEffect("clr");
	}
	onReturn(null);
}

function rainbowFunc(environment, parameters, onReturn) {
	toggleTextEffect(environment, "rbw");
	onReturn(null);
}

function rainbowPopFunc(environment, parameters, onReturn) {
	if (environment.GetDialogBuffer().hasTextEffect("rbw")) {
		environment.GetDialogBuffer().popTextEffect("rbw");
	}
	onReturn(null);
}

function wavyFunc(environment, parameters, onReturn) {
	toggleTextEffect(environment, "wvy");
	onReturn(null);
}

function wavyPopFunc(environment, parameters, onReturn) {
	if (environment.GetDialogBuffer().hasTextEffect("wvy")) {
		environment.GetDialogBuffer().popTextEffect("wvy");
	}
	onReturn(null);
}

function shakyFunc(environment, parameters, onReturn) {
	toggleTextEffect(environment, "shk");
	onReturn(null);
}

function shakyPopFunc(environment, parameters, onReturn) {
	if (environment.GetDialogBuffer().hasTextEffect("shk")) {
		environment.GetDialogBuffer().popTextEffect("shk");
	}
	onReturn(null);
}

function propertyFunc(environment, parameters, onReturn) {
	var outValue = null;

	if (parameters.length > 0 && parameters[0]) {
		var propertyName = parameters[0];

		if (environment.HasProperty(propertyName)) {
			// TODO : in a future update I can handle the case of initializing a new property
			// after which we can move this block outside the HasProperty check
			if (parameters.length > 1) {
				var inValue = parameters[1];
				environment.SetProperty(propertyName, inValue);
			}

			outValue = environment.GetProperty(propertyName);
		}
	}

	bitsy.log("PROPERTY! " + propertyName + " " + outValue);

	onReturn(outValue);
}

function endFunc(environment,parameters,onReturn) {
	isEnding = true;
	isNarrating = true;
	dialogRenderer.SetCentered(true);
	dialogRenderer.DrawTextbox();
	onReturn(null);
}

function exitFunc(environment, parameters, onReturn) {
	var destRoom;
	var destX;
	var destY;

	if (parameters.length >= 1) {
		destRoom = parameters[0];

		// is it a name?
		if (names.room[destRoom] != undefined) {
			destRoom = names.room[destRoom];
		}
	}

	if (parameters.length >= 3) {
		destX = parseInt(parameters[1]);
		destY = parseInt(parameters[2]);
	}

	if (parameters.length >= 4) {
		var transitionEffect = parameters[3];

		transition.BeginTransition(
			player().room,
			player().x,
			player().y,
			destRoom,
			destX,
			destY,
			transitionEffect);
		transition.UpdateTransition(0);
	}

	var movePlayerAndResumeScript = function() {
		if (destRoom != undefined && destX != undefined && destY != undefined) {
			// update world state
			player().room = destRoom;
			player().x = destX;
			player().y = destY;
			state.room = destRoom;

			// update game state
			initRoom(state.room);
		}

		if (dialogRenderer) {
			dialogRenderer.updateTextboxPosition();
		}

		// resume dialog script
		onReturn(state.room);
	};

	// TODO : this doesn't play nice with pagebreak because it thinks the dialog is finished!
	if (transition.IsTransitionActive()) {
		transition.OnTransitionComplete(movePlayerAndResumeScript);
	}
	else {
		movePlayerAndResumeScript();
	}
}

function tuneFunc(environment, parameters, onReturn) {
	if (parameters.length > 0) {
		var tuneId = parameters[0];

		// check if id parameter is actually a name
		if (names.tune[tuneId] != undefined) {
			tuneId = names.tune[tuneId];
		}

		if (soundPlayer) {
			if (tuneId === "0") {
				soundPlayer.stopTune();
			}
			else if (state.tune != tuneId) {
				soundPlayer.playTune(tune[tuneId]);
			}
		}

		state.tune = tuneId;
	}

	onReturn(state.tune);
}

function blipFunc(environment, parameters, onReturn) {
	if (parameters.length > 0) {
		var blipId = parameters[0];

		// check if id parameter is actually a name
		if (names.blip[blipId] != undefined) {
			blipId = names.blip[blipId];
		}

		soundPlayer.playBlip(blip[blipId]);
	}

	// if a dialog skip is happening, stop it and force a redraw of the textbox
	if (dialogBuffer) {
		if (dialogBuffer.tryInterruptSkip()) {
			dialogRenderer.Draw(dialogBuffer, 0, true /* disableOnPrint */);
		}
	}

	onReturn(null);
}

/*
// TODO : use later?
function yakFunc(environment, parameters, onReturn) {
	if (parameters.length > 0) {
		var blipId = parameters[0];

		// check if id parameter is actually a name
		if (names.blip[blipId] != undefined) {
			blipId = names.blip[blipId];
		}

		environment.GetDialogBuffer().pushTextEffect("yak", [blipId]);
	}

	onReturn(null);
}

function yakPopFunc(environment, parameters, onReturn) {
	if (environment.GetDialogBuffer().hasTextEffect("yak")) {
		environment.GetDialogBuffer().popTextEffect("yak");
	}

	onReturn(null);
}
*/

function paletteFunc(environment, parameters, onReturn) {
	if (parameters.length > 0) {
		var palId = parameters[0];

		// check if id parameter is actually a name
		if (names.palette[palId] != undefined) {
			palId = names.palette[palId];
		}

		updatePalette(palId);
	}

	onReturn(state.pal);
}

function avatarFunc(environment, parameters, onReturn) {
	if (parameters.length > 0) {
		var sprId = parameters[0];

		// check if id parameter is actually a name
		if (names.sprite[sprId] != undefined) {
			sprId = names.sprite[sprId];
		}

		// override the avatar's current appearance
		state.ava = sprId;

		// redraw the avatar with its new appearance
		drawRoom(room[state.room], { redrawAvatar: true });
	}

	onReturn(state.ava);
}

/* BUILT-IN OPERATORS */
function setExp(environment,left,right,onReturn) {
	// bitsy.log("SET " + left.name);

	if(left.type != "variable") {
		// not a variable! return null and hope for the best D:
		onReturn( null );
		return;
	}

	right.Eval(environment,function(rVal) {
		environment.SetVariable( left.name, rVal );
		// bitsy.log("VAL " + environment.GetVariable( left.name ) );
		left.Eval(environment,function(lVal) {
			onReturn( lVal );
		});
	});
}
function equalExp(environment,left,right,onReturn) {
	// bitsy.log("EVAL EQUAL");
	// bitsy.log(left);
	// bitsy.log(right);
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal === rVal );
		});
	});
}
function greaterExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal > rVal );
		});
	});
}
function lessExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal < rVal );
		});
	});
}
function greaterEqExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal >= rVal );
		});
	});
}
function lessEqExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal <= rVal );
		});
	});
}
function multExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal * rVal );
		});
	});
}
function divExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal / rVal );
		});
	});
}
function addExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal + rVal );
		});
	});
}
function subExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal - rVal );
		});
	});
}

/* ENVIRONMENT */
var Environment = function() {
	var dialogBuffer = null;
	this.SetDialogBuffer = function(buffer) { dialogBuffer = buffer; };
	this.GetDialogBuffer = function() { return dialogBuffer; };

	var functionMap = {};

	// dialog
	functionMap["say"] = sayFunc;
	functionMap["br"] = linebreakFunc;
	functionMap["pg"] = pagebreakFunc;

	// text effects
	functionMap["wvy"] = wavyFunc;
	functionMap["/wvy"] = wavyPopFunc;
	functionMap["shk"] = shakyFunc;
	functionMap["/shk"] = shakyPopFunc;
	functionMap["rbw"] = rainbowFunc;
	functionMap["/rbw"] = rainbowPopFunc;
	functionMap["clr"] = colorFunc;
	functionMap["/clr"] = colorPopFunc;
	// drawing text effects
	functionMap["drwt"] = drawTileFunc;
	functionMap["drws"] = drawSpriteFunc;
	functionMap["drwi"] = drawItemFunc;

	// room
	functionMap["end"] = endFunc;
	functionMap["exit"] = exitFunc;
	functionMap["pal"] = paletteFunc;
	functionMap["ava"] = avatarFunc;

	// inventory & variables
	functionMap["item"] = itemFunc;
	functionMap["property"] = propertyFunc;

	// sound
	functionMap["tune"] = tuneFunc;
	functionMap["blip"] = blipFunc;

	// legacy
	functionMap["clr1"] = color1Func;
	functionMap["clr2"] = color2Func;
	functionMap["clr3"] = color3Func;
	functionMap["print"] = sayFunc;
	functionMap["printTile"] = drawTileFunc;
	functionMap["printSprite"] = drawSpriteFunc;
	functionMap["printItem"] = drawItemFunc;

	// DEBUG
	functionMap["_debugOnlyPrintFont"] = printFontFunc;

	// EXPERIMENTAL
	// functionMap["yak"] = yakFunc;
	// functionMap["/yak"] = yakPopFunc;

	this.HasFunction = function(name) { return functionMap[name] != undefined; };
	this.EvalFunction = function(name,parameters,onReturn,env) {
		if (env == undefined || env == null) {
			env = this;
		}

		functionMap[name](env, parameters, onReturn);
	}

	var variableMap = {};

	this.HasVariable = function(name) { return variableMap[name] != undefined; };
	this.GetVariable = function(name) { return variableMap[name]; };
	this.SetVariable = function(name,value,useHandler) {
		// bitsy.log("SET VARIABLE " + name + " = " + value);
		if(useHandler === undefined) useHandler = true;
		variableMap[name] = value;
		if(onVariableChangeHandler != null && useHandler){
			onVariableChangeHandler(name);
		}
	};
	this.DeleteVariable = function(name,useHandler) {
		if(useHandler === undefined) useHandler = true;
		if(variableMap[name] != undefined) {
			variableMap.delete(name);
			if(onVariableChangeHandler != null && useHandler) {
				onVariableChangeHandler(name);
			}
		}
	};

	var operatorMap = {};
	operatorMap["="] = setExp;
	operatorMap["=="] = equalExp;
	operatorMap[">"] = greaterExp;
	operatorMap["<"] = lessExp;
	operatorMap[">="] = greaterEqExp;
	operatorMap["<="] = lessEqExp;
	operatorMap["*"] = multExp;
	operatorMap["/"] = divExp;
	operatorMap["+"] = addExp;
	operatorMap["-"] = subExp;

	this.HasOperator = function(sym) { return operatorMap[sym] != undefined; };
	this.EvalOperator = function(sym,left,right,onReturn) {
		operatorMap[ sym ]( this, left, right, onReturn );
	}

	var scriptMap = {};
	this.HasScript = function(name) { return scriptMap[name] != undefined; };
	this.GetScript = function(name) { return scriptMap[name]; };
	this.SetScript = function(name,script) { scriptMap[name] = script; };

	var onVariableChangeHandler = null;
	this.SetOnVariableChangeHandler = function(onVariableChange) {
		onVariableChangeHandler = onVariableChange;
	}
	this.GetVariableNames = function() {
		var variableNames = [];

		for (var key in variableMap) {
			variableNames.push(key);
		}

		return variableNames;
	}
}

// Local environment for a single run of a script: knows local context
var LocalEnvironment = function(parentEnvironment) {
	// this.SetDialogBuffer // not allowed in local environment?
	this.GetDialogBuffer = function() { return parentEnvironment.GetDialogBuffer(); };

	this.HasFunction = function(name) { return parentEnvironment.HasFunction(name); };
	this.EvalFunction = function(name,parameters,onReturn,env) {
		if (env == undefined || env == null) {
			env = this;
		}

		parentEnvironment.EvalFunction(name,parameters,onReturn,env);
	}

	this.HasVariable = function(name) { return parentEnvironment.HasVariable(name); };
	this.GetVariable = function(name) { return parentEnvironment.GetVariable(name); };
	this.SetVariable = function(name,value,useHandler) { parentEnvironment.SetVariable(name,value,useHandler); };
	// this.DeleteVariable // not needed in local environment?

	this.HasOperator = function(sym) { return parentEnvironment.HasOperator(sym); };
	this.EvalOperator = function(sym,left,right,onReturn,env) {
		if (env == undefined || env == null) {
			env = this;
		}

		parentEnvironment.EvalOperator(sym,left,right,onReturn,env);
	};

	// TODO : I don't *think* any of this is required by the local environment
	// this.HasScript
	// this.GetScript
	// this.SetScript

	// TODO : pretty sure these debug methods aren't required by the local environment either
	// this.SetOnVariableChangeHandler
	// this.GetVariableNames

	/* Here's where specific local context data goes:
	 * this includes access to the object running the script
	 * and any properties it may have (so far only "locked")
	 */

	// The local environment knows what object called it -- currently only used to access properties
	var curObject = null;
	this.HasObject = function() { return curObject != undefined && curObject != null; }
	this.SetObject = function(object) { curObject = object; }
	this.GetObject = function() { return curObject; }

	// accessors for properties of the object that's running the script
	this.HasProperty = function(name) {
		if (curObject && curObject.property && curObject.property.hasOwnProperty(name)) {
			return true;
		}
		else {
			return false;
		}
	};
	this.GetProperty = function(name) {
		if (curObject && curObject.property && curObject.property.hasOwnProperty(name)) {
			return curObject.property[name]; // TODO : should these be getters and setters instead?
		}
		else {
			return null;
		}
	};
	this.SetProperty = function(name, value) {
		// NOTE : for now, we need to gaurd against creating new properties
		if (curObject && curObject.property && curObject.property.hasOwnProperty(name)) {
			curObject.property[name] = value;
		}
	};
}

function leadingWhitespace(depth) {
	var str = "";
	for(var i = 0; i < depth; i++) {
		str += "  "; // two spaces per indent
	}
	// bitsy.log("WHITESPACE " + depth + " ::" + str + "::");
	return str;
}

/* NODES */
var TreeRelationship = function() {
	this.parent = null;
	this.children = [];

	this.AddChild = function(node) {
		this.children.push(node);
		node.parent = this;
	};

	this.AddChildren = function(nodeList) {
		for (var i = 0; i < nodeList.length; i++) {
			this.AddChild(nodeList[i]);
		}
	};

	this.SetChildren = function(nodeList) {
		this.children = [];
		this.AddChildren(nodeList);
	};

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit(this, depth);
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].VisitAll( visitor, depth + 1 );
		}
	};

	this.rootId = null; // for debugging
	this.GetId = function() {
		// bitsy.log(this);
		if (this.rootId != null) {
			return this.rootId;
		}
		else if (this.parent != null) {
			var parentId = this.parent.GetId();
			if (parentId != null) {
				return parentId + "_" + this.parent.children.indexOf(this);
			}
		}
		else {
			return null;
		}
	}
}

function DialogBlockNode(doIndentFirstLine) {
	TreeRelationship.call(this);

	this.type = "dialog_block";

	this.Eval = function(environment, onReturn) {
		// bitsy.log("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// bitsy.log(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// bitsy.log("<< CHILD " + i);
					lastVal = val;
					i++;
					evalChildren(children,done);
				});
			}
			else {
				done();
			}
		};

		var self = this;
		evalChildren(this.children, function() {
			if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
				events.Raise("script_node_exit", { id: self.GetId() });
			}

			onReturn(lastVal);
		});
	}

	if (doIndentFirstLine === undefined) {
		doIndentFirstLine = true; // This is just for serialization
	}

	this.Serialize = function(depth) {
		if (depth === undefined) {
			depth = 0;
		}

		var str = "";
		var lastNode = null;

		for (var i = 0; i < this.children.length; i++) {

			var curNode = this.children[i];

			var shouldIndentFirstLine = (i == 0 && doIndentFirstLine);
			var shouldIndentAfterLinebreak = (lastNode && lastNode.type === "function" && lastNode.name === "br");

			if (shouldIndentFirstLine || shouldIndentAfterLinebreak) {
				str += leadingWhitespace(depth);
			}

			str += curNode.Serialize(depth);

			lastNode = curNode;
		}

		return str;
	}

	this.ToString = function() {
		return this.type + " " + this.GetId();
	};
}

function CodeBlockNode() {
	TreeRelationship.call(this);

	this.type = "code_block";

	this.Eval = function(environment, onReturn) {
		// bitsy.log("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// bitsy.log(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// bitsy.log("<< CHILD " + i);
					lastVal = val;
					i++;
					evalChildren(children,done);
				});
			}
			else {
				done();
			}
		};

		var self = this;
		evalChildren(this.children, function() {
			if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
				events.Raise("script_node_exit", { id: self.GetId() });
			}

			onReturn(lastVal);
		});
	}

	this.Serialize = function(depth) {
		if(depth === undefined) {
			depth = 0;
		}

		// bitsy.log("SERIALIZE BLOCK!!!");
		// bitsy.log(depth);
		// bitsy.log(doIndentFirstLine);

		var str = "{"; // todo: increase scope of Sym?

		// TODO : do code blocks ever have more than one child anymore????
		for (var i = 0; i < this.children.length; i++) {
			var curNode = this.children[i];
			str += curNode.Serialize(depth);
		}

		str += "}";

		return str;
	}

	this.ToString = function() {
		return this.type + " " + this.GetId();
	};
}

function isInlineCode(node) {
	return isTextEffectBlock(node) || isUndefinedBlock(node) || isMultilineListBlock(node);
}

function isUndefinedBlock(node) {
	return node.type === "code_block" && node.children.length > 0 && node.children[0].type === "undefined";
}

var textEffectBlockNames = ["clr1", "clr2", "clr3", "wvy", "shk", "rbw", "printSprite", "printItem", "printTile", "print", "say", "br"];
function isTextEffectBlock(node) {
	if (node.type === "code_block") {
		if (node.children.length > 0 && node.children[0].type === "function") {
			var func = node.children[0];
			return textEffectBlockNames.indexOf(func.name) != -1;
		}
	}
	return false;
}

var listBlockTypes = ["sequence", "cycle", "shuffle", "if"];
function isMultilineListBlock(node) {
	if (node.type === "code_block") {
		if (node.children.length > 0) {
			var child = node.children[0];
			return listBlockTypes.indexOf(child.type) != -1;
		}
	}
	return false;
}

// for round-tripping undefined code through the parser (useful for hacks!)
function UndefinedNode(sourceStr) {
	TreeRelationship.call(this);

	this.type = "undefined";
	this.source = sourceStr;

	this.Eval = function(environment,onReturn) {
		toggleTextEffect(environment, "_debug_highlight");
		sayFunc(environment, ["{" + sourceStr + "}"], function() {
			onReturn(null);
		});
		toggleTextEffect(environment, "_debug_highlight");
	}

	this.Serialize = function(depth) {
		return this.source;
	}

	this.ToString = function() {
		return "undefined" + " " + this.GetId();
	}
}

function FuncNode(name, args) {
	TreeRelationship.call(this);

	this.type = "function";
	this.name = name;
	this.args = args;

	this.Eval = function(environment,onReturn) {
		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var self = this; // hack to deal with scope (TODO : move up higher?)

		var argumentValues = [];
		var i = 0;

		function evalArgs(args, done) {
			// TODO : really hacky way to make we get the first
			// symbol's NAME instead of its variable value
			// if we are trying to do something with a property
			if (self.name === "property" && i === 0 && i < args.length) {
				if (args[i].type === "variable") {
					argumentValues.push(args[i].name);
					i++;
				}
				else {
					// first argument for a property MUST be a variable symbol
					// -- so skip everything if it's not!
					i = args.length;
				}
			}

			if (i < args.length) {
				// Evaluate each argument
				args[i].Eval(
					environment,
					function(val) {
						argumentValues.push(val);
						i++;
						evalArgs(args, done);
					});
			}
			else {
				done();
			}
		};

		evalArgs(
			this.args,
			function() {
				if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
					events.Raise("script_node_exit", { id: self.GetId() });
				}

				environment.EvalFunction(self.name, argumentValues, onReturn);
			});
	}

	this.Serialize = function(depth) {
		var isDialogBlock = this.parent.type === "dialog_block";
		if (isDialogBlock && this.name === "say") {
			// TODO this could cause problems with "real" print functions
			return this.args[0].value; // first argument should be the text of the {print} func
		}
		else if (isDialogBlock && this.name === "br") {
			return "\\n";
		}
		else {
			var str = "";
			str += this.name;
			for(var i = 0; i < this.args.length; i++) {
				str += " ";
				str += this.args[i].Serialize(depth);
			}
			return str;
		}
	}

	this.ToString = function() {
		return this.type + " " + this.name + " " + this.GetId();
	};
}

function LiteralNode(value) {
	TreeRelationship.call(this);

	this.type = "literal";
	this.value = value;

	this.Eval = function(environment,onReturn) {
		onReturn(this.value);
	};

	this.Serialize = function(depth) {
		var str = "";

		if (this.value === null) {
			return str;
		}

		if (typeof this.value === "string") {
			str += '"';
		}

		str += this.value;

		if (typeof this.value === "string") {
			str += '"';
		}

		return str;
	};

	this.ToString = function() {
		return this.type + " " + this.value + " " + this.GetId();
	};
}

function VarNode(name) {
	TreeRelationship.call(this);

	this.type = "variable";
	this.name = name;

	this.Eval = function(environment,onReturn) {
		// bitsy.log("EVAL " + this.name + " " + environment.HasVariable(this.name) + " " + environment.GetVariable(this.name));
		if( environment.HasVariable(this.name) )
			onReturn( environment.GetVariable( this.name ) );
		else
			onReturn(null); // not a valid variable -- return null and hope that's ok
	} // TODO: might want to store nodes in the variableMap instead of values???

	this.Serialize = function(depth) {
		var str = "" + this.name;
		return str;
	}

	this.ToString = function() {
		return this.type + " " + this.name + " " + this.GetId();
	};
}

function ExpNode(operator, left, right) {
	TreeRelationship.call(this);

	this.type = "operator";
	this.operator = operator;
	this.left = left;
	this.right = right;

	this.Eval = function(environment,onReturn) {
		// bitsy.log("EVAL " + this.operator);
		var self = this; // hack to deal with scope
		environment.EvalOperator( this.operator, this.left, this.right, 
			function(val){
				// bitsy.log("EVAL EXP " + self.operator + " " + val);
				onReturn(val);
			} );
		// NOTE : sadly this pushes a lot of complexity down onto the actual operator methods
	};

	this.Serialize = function(depth) {
		var isNegativeNumber = this.operator === "-" && this.left.type === "literal" && this.left.value === null;

		if (!isNegativeNumber) {
			var str = "";

			if (this.left != undefined && this.left != null) {
				str += this.left.Serialize(depth) + " ";
			}

			str += this.operator;

			if (this.right != undefined && this.right != null) {
				str += " " + this.right.Serialize(depth);
			}

			return str;
		}
		else {
			return this.operator + this.right.Serialize(depth); // hacky but seems to work
		}
	};

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit( this, depth );
		if(this.left != null)
			this.left.VisitAll( visitor, depth + 1 );
		if(this.right != null)
			this.right.VisitAll( visitor, depth + 1 );
	};

	this.ToString = function() {
		return this.type + " " + this.operator + " " + this.GetId();
	};
}

function SequenceBase() {
	TreeRelationship.call(this);

	this.Serialize = function(depth) {
		var str = "";
		str += this.type + "\\n";
		for (var i = 0; i < this.children.length; i++) {
			str += leadingWhitespace(depth + 1) + Sym.List + " ";
			str += this.children[i].Serialize(depth + 2);
			str += "\\n";
		}
		str += leadingWhitespace(depth);
		return str;
	};

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit(this, depth);
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].VisitAll( visitor, depth + 1 );
		}
	};

	this.ToString = function() {
		return this.type + " " + this.GetId();
	};
}

function SequenceNode(options) {
	SequenceBase.call(this);

	this.type = "sequence";
	this.AddChildren(options);

	var index = 0;
	this.Eval = function(environment, onReturn) {
		// bitsy.log("SEQUENCE " + index);
		this.children[index].Eval(environment, onReturn);

		var next = index + 1;
		if (next < this.children.length) {
			index = next;
		}
	}
}

function CycleNode(options) {
	SequenceBase.call(this);

	this.type = "cycle";
	this.AddChildren(options);

	var index = 0;
	this.Eval = function(environment, onReturn) {
		// bitsy.log("CYCLE " + index);
		this.children[index].Eval(environment, onReturn);

		var next = index + 1;
		if (next < this.children.length) {
			index = next;
		}
		else {
			index = 0;
		}
	}
}

function ShuffleNode(options) {
	SequenceBase.call(this);

	this.type = "shuffle";
	this.AddChildren(options);

	var optionsShuffled = [];
	function shuffle(options) {
		optionsShuffled = [];
		var optionsUnshuffled = options.slice();
		while (optionsUnshuffled.length > 0) {
			var i = Math.floor(Math.random() * optionsUnshuffled.length);
			optionsShuffled.push(optionsUnshuffled.splice(i,1)[0]);
		}
	}
	shuffle(this.children);

	var index = 0;
	this.Eval = function(environment, onReturn) {
		optionsShuffled[index].Eval(environment, onReturn);
		
		index++;
		if (index >= this.children.length) {
			shuffle(this.children);
			index = 0;
		}
	}
}

// TODO : rename? ConditionalNode?
function IfNode(conditions, results, isSingleLine) {
	TreeRelationship.call(this);

	this.type = "if";

	for (var i = 0; i < conditions.length; i++) {
		this.AddChild(new ConditionPairNode(conditions[i], results[i]));
	}

	var self = this;
	this.Eval = function(environment, onReturn) {
		// bitsy.log("EVAL IF");
		var i = 0;
		function TestCondition() {
			self.children[i].Eval(environment, function(result) {
				if (result.conditionValue == true) {
					onReturn(result.resultValue);
				}
				else if (i+1 < self.children.length) {
					i++;
					TestCondition();
				}
				else {
					onReturn(null);
				}
			});
		};
		TestCondition();
	};

	if (isSingleLine === undefined) {
		isSingleLine = false; // This is just for serialization
	}

	this.Serialize = function(depth) {
		var str = "";
		if(isSingleLine) {
			// HACKY - should I even keep this mode???
			str += this.children[0].children[0].Serialize() + " ? " + this.children[0].children[1].Serialize();
			if (this.children.length > 1 && this.children[1].children[0].type === Sym.Else) {
				str += " " + Sym.ElseExp + " " + this.children[1].children[1].Serialize();
			}
		}
		else {
			str += "\\n";
			for (var i = 0; i < this.children.length; i++) {
				str += this.children[i].Serialize(depth);
			}
			str += leadingWhitespace(depth);
		}
		return str;
	};

	this.IsSingleLine = function() {
		return isSingleLine;
	};

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit(this, depth);

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].VisitAll(visitor, depth + 1);
		}
	};

	this.ToString = function() {
		return this.type + " " + this.mode + " " + this.GetId();
	};
}

function ConditionPairNode(condition, result) {
	TreeRelationship.call(this);

	this.type = "condition_pair";

	this.AddChild(condition);
	this.AddChild(result);

	var self = this;

	this.Eval = function(environment, onReturn) {
		self.children[0].Eval(environment, function(conditionSuccess) {
			if (conditionSuccess) {
				self.children[1].Eval(environment, function(resultValue) {
					onReturn({ conditionValue:true, resultValue:resultValue });
				});
			}
			else {
				onReturn({ conditionValue:false });
			}
		});
	};

	this.Serialize = function(depth) {
		var str = "";
		str += leadingWhitespace(depth + 1);
		str += Sym.List + " " + this.children[0].Serialize(depth) + " " + Sym.ConditionEnd + Sym.Linebreak;
		str += this.children[1].Serialize(depth + 2) + Sym.Linebreak;
		return str;
	};

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit(this, depth);

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].VisitAll(visitor, depth + 1);
		}
	};

	this.ToString = function() {
		return this.type + " " + this.GetId();
	};
}

function ElseNode() {
	TreeRelationship.call(this);

	this.type = Sym.Else;

	this.Eval = function(environment, onReturn) {
		onReturn(true);
	};

	this.Serialize = function() {
		return Sym.Else;
	};

	this.ToString = function() {
		return this.type + " " + this.mode + " " + this.GetId();
	};
}

var Sym = {
	DialogOpen : '"""',
	DialogClose : '"""',
	CodeOpen : "{",
	CodeClose : "}",
	Linebreak : "\\n", // just call it "break" ?
	Separator : ":",
	List : "-",
	String : '"',
	ConditionEnd : "?",
	Else : "else",
	ElseExp : ":", // special shorthand for expressions (deprecate?)
	Set : "=",
	Operators : ["==", ">=", "<=", ">", "<", "-", "+", "/", "*"], // operators need to be in reverse order of precedence
};

var Parser = function(env) {
	var environment = env;

	this.Parse = function(scriptStr, rootId) {
		var rootNode = new DialogBlockNode();
		rootNode.rootId = rootId;
		var state = new ParserState(rootNode, scriptStr);

		if (state.MatchAhead(Sym.DialogOpen)) {
			// multi-line dialog block
			var dialogStr = state.ConsumeBlock(Sym.DialogOpen + Sym.Linebreak, Sym.Linebreak + Sym.DialogClose);
			rootNode = new DialogBlockNode();
			rootNode.rootId = rootId; // hacky!!
			state = new ParserState(rootNode, dialogStr);
			state = ParseDialog(state);
		}
		else {
			// single-line dialog block
			state = ParseDialog(state);
		}

		return state.rootNode;
	};

	var ParserState = function( rootNode, str ) {
		this.rootNode = rootNode;
		this.curNode = this.rootNode;

		var sourceStr = str;
		var i = 0;
		this.Index = function() { return i; };
		this.Count = function() { return sourceStr.length; };
		this.Done = function() { return i >= sourceStr.length; };
		this.Char = function() { return sourceStr[i]; };
		this.Step = function(n) { if(n===undefined) n=1; i += n; };
		this.MatchAhead = function(str) {
			// bitsy.log(str);
			str = "" + str; // hack to turn single chars into strings
			// bitsy.log(str);
			// bitsy.log(str.length);
			for (var j = 0; j < str.length; j++) {
				if (i + j >= sourceStr.length) {
					return false;
				}
				else if (str[j] != sourceStr[i+j]) {
					return false;
				}
			}
			return true;
		}
		this.Peak = function(end) {
			var str = "";
			var j = i;
			// bitsy.log(j);
			while (j < sourceStr.length && end.indexOf(sourceStr[j]) == -1) {
				str += sourceStr[j];
				j++;
			}
			// bitsy.log("PEAK ::" + str + "::");
			return str;
		}
		this.ConsumeBlock = function(open, close, includeSymbols) {
			if (includeSymbols === undefined || includeSymbols === null) {
				includeSymbols = false;
			}

			var startIndex = i;

			var matchCount = 0;
			if (this.MatchAhead(open)) {
				matchCount++;
				this.Step(open.length);
			}

			while (matchCount > 0 && !this.Done()) {
				if (this.MatchAhead(close)) {
					matchCount--;
					this.Step( close.length );
				}
				else if (this.MatchAhead(open)) {
					matchCount++;
					this.Step(open.length);
				}
				else {
					this.Step();
				}
			}

			if (includeSymbols) {
				return sourceStr.slice(startIndex, i);
			}
			else {
				return sourceStr.slice(startIndex + open.length, i - close.length);
			}
		}

		this.Print = function() { bitsy.log(sourceStr); };
		this.Source = function() { return sourceStr; };
	};

	/*
		ParseDialog():
		This function adds {print} nodes and linebreak {br} nodes to display text,
		interleaved with bracketed code nodes for functions and flow control,
		such as text effects {shk} {wvy} or sequences like {cycle} and {shuffle}.
		The parsing of those code blocks is handled by ParseCode.

		Note on parsing newline characters:
		- there should be an implicit linebreak {br} after each dialog line
		- a "dialog line" is defined as any line that either:
			- 1) contains dialog text (any text outside of a code block)
			- 2) is entirely empty (no text, no code)
			- *or* 3) contains a list block (sequence, cycle, shuffle, or conditional)
		- lines *only* containing {code} blocks are not dialog lines

		NOTE TO SELF: all the state I'm storing in here feels like
		evidence that the parsing system kind of broke down at this point :(
		Maybe it would feel better if I move into the "state" object
	*/
	function ParseDialog(state) {
		var curLineNodeList = [];
		var curText = "";
		var curLineIsEmpty = true;
		var curLineContainsDialogText = false;
		var prevLineIsDialogLine = false;

		var curLineIsDialogLine = function() {
			return curLineContainsDialogText || curLineIsEmpty;
		}

		var resetLineStateForNewLine = function() {
			prevLineIsDialogLine = curLineIsDialogLine();
			curLineContainsDialogText = false;
			curLineIsEmpty = true;
			curText = "";
			curLineNodeList = [];
		}

		var tryAddTextNodeToList = function() {
			if (curText.length > 0) {
				var sayNode = new FuncNode("say", [new LiteralNode(curText)]);
				curLineNodeList.push(sayNode);

				curText = "";
				curLineIsEmpty = false;
				curLineContainsDialogText = true;
			}
		}

		var addCodeNodeToList = function() {
			var codeSource = state.ConsumeBlock(Sym.CodeOpen, Sym.CodeClose);
			var codeState = new ParserState(new CodeBlockNode(), codeSource);
			codeState = ParseCode(codeState);
			var codeBlockNode = codeState.rootNode;
			curLineNodeList.push(codeBlockNode);

			curLineIsEmpty = false;

			// lists count as dialog text, because they can contain it
			if (isMultilineListBlock(codeBlockNode)) {
				curLineContainsDialogText = true;
			}
		}

		var tryAddLinebreakNodeToList = function() {
			if (prevLineIsDialogLine) {
				var linebreakNode = new FuncNode("br", []);
				curLineNodeList.unshift(linebreakNode);
			}
		}

		var addLineNodesToParent = function() {
			for (var i = 0; i < curLineNodeList.length; i++) {
				state.curNode.AddChild(curLineNodeList[i]);
			}
		}

		while (!state.Done()) {
			if (state.MatchAhead(Sym.CodeOpen)) { // process code block
				// add any buffered text to a print node, and parse the code
				tryAddTextNodeToList();
				addCodeNodeToList();
			}
			else if (state.MatchAhead(Sym.Linebreak)) { // process new line
				// add any buffered text to a print node, 
				// and add a linebreak if we are between two dialog lines
				tryAddTextNodeToList();
				tryAddLinebreakNodeToList();

				// since we've reached the end of a line
				// add stored nodes for this line to the parent node we are building,
				// and reset state for the next line
				addLineNodesToParent();
				resetLineStateForNewLine();

				state.Step();
			}
			else {
				// continue adding text to the current text buffer
				curText += state.Char();
				state.Step();
			}
		}

		// to make sure we don't leave anything behind:
		// add buffered text to a print node and add all nodes
		// to the current parent node
		tryAddTextNodeToList();
		tryAddLinebreakNodeToList();
		addLineNodesToParent();

		return state;
	}

	function ParseDialogBlock(state) {
		var dialogStr = state.ConsumeBlock( Sym.DialogOpen, Sym.DialogClose );

		var dialogState = new ParserState(new DialogBlockNode(), dialogStr);
		dialogState = ParseDialog( dialogState );

		state.curNode.AddChild( dialogState.rootNode );

		return state;
	}

	/*
		ParseConditional():
		A conditional contains a list of conditions that can be
		evaluated to true or false, followed by more dialog
		that will be evaluated if the condition is true. The first
		true condition is the one that gets evaluated.
	*/
	function ParseConditional(state) {
		var conditionStrings = [];
		var resultStrings = [];
		var curIndex = -1;
		var requiredLeadingWhitespace = -1;

		// TODO : very similar to sequence parsing - can we share anything?
		function parseConditionalItemLine(state) {
			var lineText = "";
			var whitespaceCount = 0;
			var isNewCondition = false;
			var encounteredNonWhitespace = false;
			var encounteredConditionEnd = false;

			while (!state.Done() && !(state.Char() === Sym.Linebreak)) {
				// count whitespace until we hit the first non-whitespace character
				if (!encounteredNonWhitespace) {
					if (state.Char() === " " || state.Char() === "\\t") {
						whitespaceCount++;
					}
					else {
						encounteredNonWhitespace = true;

						if (state.Char() === Sym.List) {
							isNewCondition = true;
							whitespaceCount += 2; // count the list seperator AND the following extra space
						}
					}
				}

				// if this is the condition, we need to track whether we've
				// reached the end of the condition
				if (isNewCondition && !encounteredConditionEnd) {
					if (state.Char() === Sym.ConditionEnd) {
						encounteredConditionEnd = true;
					}
				}

				// add characters one at a time, unless it's a code block
				// since code blocks can contain additional sequences inside
				// them that will mess up our list item detection
				if (state.Char() === Sym.CodeOpen) {
					lineText += state.ConsumeBlock(Sym.CodeOpen, Sym.CodeClose, true /*includeSymbols*/);
				}
				else {
					if (!encounteredConditionEnd) { // skip all characters including & after the condition end
						lineText += state.Char();
					}
					state.Step();
				}
			}

			if (state.Char() === Sym.Linebreak) {
				state.Step();
			}

			return { text:lineText, whitespace:whitespaceCount, isNewCondition:isNewCondition };
		}

		// TODO : this is copied from sequence parsing; share?
		function trimLeadingWhitespace(text, trimLength) {
			var textSplit = text.split(Sym.linebreak);
			textSplit = textSplit.map(function(line) { return line.slice(trimLength) });
			return textSplit.join(Sym.linebreak);
		}

		while (!state.Done()) {
			var lineResults = parseConditionalItemLine(state);

			if (lineResults.isNewCondition) {
				requiredLeadingWhitespace = lineResults.whitespace;
				curIndex++;
				conditionStrings[curIndex] = "";
				resultStrings[curIndex] = "";
			}

			// to avoid extra newlines in nested conditionals, only count lines
			// that at least match the whitespace count of the initial line
			// NOTE: see the comment in sequence parsing for more details
			if (lineResults.whitespace >= requiredLeadingWhitespace) {
				var trimmedText = trimLeadingWhitespace(lineResults.text, requiredLeadingWhitespace);

				if (lineResults.isNewCondition) {
					conditionStrings[curIndex] += trimmedText;
				}
				else {
					resultStrings[curIndex] += trimmedText + Sym.Linebreak;
				}
			}
		}

		// hack: cut off the trailing newlines from all the result strings
		resultStrings = resultStrings.map(function(result) { return result.slice(0,-1); });

		var conditions = [];
		for (var i = 0; i < conditionStrings.length; i++) {
			var str = conditionStrings[i].trim();
			if (str === Sym.Else) {
				conditions.push(new ElseNode());
			}
			else {
				var exp = CreateExpression(str);
				conditions.push(exp);
			}
		}

		var results = [];
		for (var i = 0; i < resultStrings.length; i++) {
			var str = resultStrings[i];
			var dialogBlockState = new ParserState(new DialogBlockNode(), str);
			dialogBlockState = ParseDialog(dialogBlockState);
			var dialogBlock = dialogBlockState.rootNode;
			results.push(dialogBlock);
		}

		state.curNode.AddChild(new IfNode(conditions, results));

		return state;
	}

	function IsSequence(str) {
		// bitsy.log("IsSequence? " + str);
		return str === "sequence" || str === "cycle" || str === "shuffle";
	}

	/*
		ParseSequence():
		Sequence nodes contain a list of dialog block nodes. The order those
		nodes are evaluated is determined by the type of sequence:
		- sequence: each child node evaluated once in order
		- cycle: repeats from the beginning after all nodes evaluate
		- shuffle: evaluate in a random order

		Each item in a sequence is sepearated by a "-" character.
		The seperator must come at the beginning of the line,
		but may be preceded by whitespace (in any amount).

		About whitespace: Whitespace at the start of a line
		is ignored if it less than or equal to the count of
		whitespace that preceded the list separator ("-") at
		the start of that item. (The count also includes the
		seperator and the extra space after the seperator.)
	 */
	function ParseSequence(state, sequenceType) {
		var itemStrings = [];
		var curItemIndex = -1; // -1 indicates not reading an item yet
		var requiredLeadingWhitespace = -1;

		function parseSequenceItemLine(state) {
			var lineText = "";
			var whitespaceCount = 0;
			var isNewListItem = false;
			var encounteredNonWhitespace = false;

			while (!state.Done() && !(state.Char() === Sym.Linebreak)) {
				// count whitespace until we hit the first non-whitespace character
				if (!encounteredNonWhitespace) {
					if (state.Char() === " " || state.Char() === "\\t") {
						whitespaceCount++;
					}
					else {
						encounteredNonWhitespace = true;

						if (state.Char() === Sym.List) {
							isNewListItem = true;
							whitespaceCount += 2; // count the list seperator AND the following extra space
						}
					}
				}

				// add characters one at a time, unless it's a code block
				// since code blocks can contain additional sequences inside
				// them that will mess up our list item detection
				if (state.Char() === Sym.CodeOpen) {
					lineText += state.ConsumeBlock(Sym.CodeOpen, Sym.CodeClose, true /*includeSymbols*/);
				}
				else {
					lineText += state.Char();
					state.Step();
				}
			}

			if (state.Char() === Sym.Linebreak) {
				state.Step();
			}

			return { text:lineText, whitespace:whitespaceCount, isNewListItem:isNewListItem };
		}

		function trimLeadingWhitespace(text, trimLength) {
			// the split and join is necessary because a single "line"
			// can contain sequences that may contain newlines of their own
			// (we treat them all as one "line" for sequence parsing purposes)
			var textSplit = text.split(Sym.linebreak);
			textSplit = textSplit.map(function(line) { return line.slice(trimLength) });
			return textSplit.join(Sym.linebreak);
		}

		while (!state.Done()) {
			var lineResults = parseSequenceItemLine(state);

			if (lineResults.isNewListItem) {
				requiredLeadingWhitespace = lineResults.whitespace;
				curItemIndex++;
				itemStrings[curItemIndex] = "";
			}

			// to avoid double counting closing lines (empty ones ending in a curly brace)
			// we only allow lines that have at least as much whitespace as the start of the list item
			// TODO : I think right now this leads to a bug if the list item's indentation is less than
			// its parent code block... hopefully that won't be a big deal for now
			// (NOTE: I think the bug could be fixed by only applying this to the FINAL line of an item, but
			// that would require more consideration and testing)
			if (lineResults.whitespace >= requiredLeadingWhitespace) {
				var trimmedText = trimLeadingWhitespace(lineResults.text, requiredLeadingWhitespace);
				itemStrings[curItemIndex] += trimmedText + Sym.Linebreak;
			}
		}

		// a bit hacky: cut off the trailing newlines from all the items
		itemStrings = itemStrings.map(function(item) { return item.slice(0,-1); });

		var options = [];
		for (var i = 0; i < itemStrings.length; i++) {
			var str = itemStrings[i];
			var dialogBlockState = new ParserState(new DialogBlockNode(false /* doIndentFirstLine */), str);
			dialogBlockState = ParseDialog(dialogBlockState);
			var dialogBlock = dialogBlockState.rootNode;
			options.push(dialogBlock);
		}

		if (sequenceType === "sequence") {
			state.curNode.AddChild(new SequenceNode(options));
		}
		else if (sequenceType === "cycle") {
			state.curNode.AddChild(new CycleNode(options));
		}
		else if (sequenceType === "shuffle") {
			state.curNode.AddChild(new ShuffleNode(options));
		}

		return state;
	}

	function ParseFunction(state, funcName) {
		bitsy.log("~~~ PARSE FUNCTION " + funcName);

		var args = [];

		var curSymbol = "";
		function OnSymbolEnd() {
			curSymbol = curSymbol.trim();
			// bitsy.log("PARAMTER " + curSymbol);
			args.push( StringToValue(curSymbol) );
			// bitsy.log(args);
			curSymbol = "";
		}

		while( !( state.Char() === "\\n" || state.Done() ) ) {
			if( state.MatchAhead(Sym.CodeOpen) ) {
				var codeBlockState = new ParserState(new CodeBlockNode(), state.ConsumeBlock(Sym.CodeOpen, Sym.CodeClose));
				codeBlockState = ParseCode( codeBlockState );
				var codeBlock = codeBlockState.rootNode;
				args.push( codeBlock );
				curSymbol = "";
			}
			else if( state.MatchAhead(Sym.String) ) {
				/* STRING LITERAL */
				var str = state.ConsumeBlock(Sym.String, Sym.String);
				// bitsy.log("STRING " + str);
				args.push( new LiteralNode(str) );
				curSymbol = "";
			}
			else if(state.Char() === " " && curSymbol.length > 0) {
				OnSymbolEnd();
			}
			else {
				curSymbol += state.Char();
			}
			state.Step();
		}

		if(curSymbol.length > 0) {
			OnSymbolEnd();
		}

		state.curNode.AddChild( new FuncNode( funcName, args ) );

		return state;
	}

	function IsValidVariableName(str) {
		var reg = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
		var isValid = reg.test(str);
		// bitsy.log("VALID variable??? " + isValid);
		return isValid;
	}

	function StringToValue(valStr) {
		if(valStr[0] === Sym.CodeOpen) {
			// CODE BLOCK!!!
			var codeStr = (new ParserState( null, valStr )).ConsumeBlock(Sym.CodeOpen, Sym.CodeClose); //hacky
			var codeBlockState = new ParserState(new CodeBlockNode(), codeStr);
			codeBlockState = ParseCode( codeBlockState );
			return codeBlockState.rootNode;
		}
		else if(valStr[0] === Sym.String) {
			// STRING!!
			// bitsy.log("STRING");
			var str = "";
			var i = 1;
			while (i < valStr.length && valStr[i] != Sym.String) {
				str += valStr[i];
				i++;
			}
			// bitsy.log(str);
			return new LiteralNode( str );
		}
		else if(valStr === "true") {
			// BOOL
			return new LiteralNode( true );
		}
		else if(valStr === "false") {
			// BOOL
			return new LiteralNode( false );
		}
		else if( !isNaN(parseFloat(valStr)) ) {
			// NUMBER!!
			// bitsy.log("NUMBER!!! " + valStr);
			return new LiteralNode( parseFloat(valStr) );
		}
		else if(IsValidVariableName(valStr)) {
			// VARIABLE!!
			// bitsy.log("VARIABLE");
			return new VarNode(valStr); // TODO : check for valid potential variables
		}
		else {
			// uh oh
			return new LiteralNode(null);
		}
	}

	function CreateExpression(expStr) {
		expStr = expStr.trim();

		function IsInsideString(index) {
			var inString = false;
			for(var i = 0; i < expStr.length; i++) {
				if(expStr[i] === Sym.String)
					inString = !inString;

				if(index === i)
					return inString;
			}
			return false;
		}

		function IsInsideCode(index) {
			var count = 0;
			for(var i = 0; i < expStr.length; i++) {
				if(expStr[i] === Sym.CodeOpen)
					count++;
				else if(expStr[i] === Sym.CodeClose)
					count--;

				if(index === i)
					return count > 0;
			}
			return false;
		}

		var operator = null;

		// set is special because other operator can look like it, and it has to go first in the order of operations
		var setIndex = expStr.indexOf(Sym.Set);
		if( setIndex > -1 && !IsInsideString(setIndex) && !IsInsideCode(setIndex) ) { // it might be a set operator
			if( expStr[setIndex+1] != "=" && expStr[setIndex-1] != ">" && expStr[setIndex-1] != "<" ) {
				// ok it actually IS a set operator and not ==, >=, or <=
				operator = Sym.Set;
				var variableName = expStr.substring(0,setIndex).trim(); // TODO : valid variable name testing
				var left = IsValidVariableName(variableName) ? new VarNode( variableName ) : new LiteralNode(null);
				var right = CreateExpression( expStr.substring(setIndex+Sym.Set.length) );
				var exp = new ExpNode( operator, left, right );
				return exp;
			}
		}

		// special if "expression" for single-line if statements
		var ifIndex = expStr.indexOf(Sym.ConditionEnd);
		if( ifIndex > -1 && !IsInsideString(ifIndex) && !IsInsideCode(ifIndex) ) {
			operator = Sym.ConditionEnd;
			var conditionStr = expStr.substring(0,ifIndex).trim();
			var conditions = [ CreateExpression(conditionStr) ];

			var resultStr = expStr.substring(ifIndex+Sym.ConditionEnd.length);
			var results = [];
			function AddResult(str) {
				var dialogBlockState = new ParserState(new DialogBlockNode(), str);
				dialogBlockState = ParseDialog( dialogBlockState );
				var dialogBlock = dialogBlockState.rootNode;
				results.push( dialogBlock );
			}

			var elseIndex = resultStr.indexOf(Sym.ElseExp); // does this need to test for strings?
			if(elseIndex > -1) {
				conditions.push( new ElseNode() );

				var elseStr = resultStr.substring(elseIndex+Sym.ElseExp.length);
				var resultStr = resultStr.substring(0,elseIndex);

				AddResult( resultStr.trim() );
				AddResult( elseStr.trim() );
			}
			else {
				AddResult( resultStr.trim() );
			}

			return new IfNode( conditions, results, true /*isSingleLine*/ );
		}

		for( var i = 0; (operator == null) && (i < Sym.Operators.length); i++ ) {
			var opSym = Sym.Operators[i];
			var opIndex = expStr.indexOf( opSym );
			if( opIndex > -1 && !IsInsideString(opIndex) && !IsInsideCode(opIndex) ) {
				operator = opSym;
				var left = CreateExpression( expStr.substring(0,opIndex) );
				var right = CreateExpression( expStr.substring(opIndex+opSym.length) );
				var exp = new ExpNode( operator, left, right );
				return exp;
			}
		}

		if( operator == null ) {
			return StringToValue(expStr);
		}
	}
	this.CreateExpression = CreateExpression;

	function IsWhitespace(str) {
		return ( str === " " || str === "\\t" || str === "\\n" );
	}

	function IsExpression(str) {
		var tempState = new ParserState(null, str); // hacky
		var textOutsideCodeBlocks = "";

		while (!tempState.Done()) {
			if (tempState.MatchAhead(Sym.CodeOpen)) {
				tempState.ConsumeBlock(Sym.CodeOpen, Sym.CodeClose);
			}
			else {
				textOutsideCodeBlocks += tempState.Char();
				tempState.Step();
			}
		}

		var containsAnyExpressionOperators = (textOutsideCodeBlocks.indexOf(Sym.ConditionEnd) != -1) ||
				(textOutsideCodeBlocks.indexOf(Sym.Set) != -1) ||
				(Sym.Operators.some(function(opSym) { return textOutsideCodeBlocks.indexOf(opSym) != -1; }));

		return containsAnyExpressionOperators;
	}

	function IsLiteral(str) {
		var isBool = str === "true" || str === "false";
		var isNum = !isNaN(parseFloat(str));
		var isStr = str[0] === '"' && str[str.length-1] === '"';
		var isVar = IsValidVariableName(str);
		var isEmpty = str.length === 0;
		return isBool || isNum || isStr || isVar || isEmpty;
	}

	function ParseExpression(state) {
		var line = state.Source(); // state.Peak( [Sym.Linebreak] ); // TODO : remove the linebreak thing
		// bitsy.log("EXPRESSION " + line);
		var exp = CreateExpression(line);
		// bitsy.log(exp);
		state.curNode.AddChild(exp);
		state.Step(line.length);
		return state;
	}

	function IsConditionalBlock(state) {
		var peakToFirstListSymbol = state.Peak([Sym.List]);

		var foundListSymbol = peakToFirstListSymbol < state.Source().length;

		var areAllCharsBeforeListWhitespace = true;
		for (var i = 0; i < peakToFirstListSymbol.length; i++) {
			if (!IsWhitespace(peakToFirstListSymbol[i])) {
				areAllCharsBeforeListWhitespace = false;
			}
		}

		var peakToFirstConditionSymbol = state.Peak([Sym.ConditionEnd]);
		peakToFirstConditionSymbol = peakToFirstConditionSymbol.slice(peakToFirstListSymbol.length);
		var hasNoLinebreakBetweenListAndConditionEnd = peakToFirstConditionSymbol.indexOf(Sym.Linebreak) == -1;

		return foundListSymbol && 
			areAllCharsBeforeListWhitespace && 
			hasNoLinebreakBetweenListAndConditionEnd;
	}

	function ParseCode(state) {
		if (IsConditionalBlock(state)) {
			state = ParseConditional(state);
		}
		else if (environment.HasFunction(state.Peak([" "]))) { // TODO --- what about newlines???
			var funcName = state.Peak([" "]);
			state.Step(funcName.length);
			state = ParseFunction(state, funcName);
		}
		else if (IsSequence(state.Peak([" ", Sym.Linebreak]))) {
			var sequenceType = state.Peak([" ", Sym.Linebreak]);
			state.Step(sequenceType.length);
			state = ParseSequence(state, sequenceType);
		}
		else if (IsLiteral(state.Source()) || IsExpression(state.Source())) {
			state = ParseExpression(state);
		}
		else {
			var undefinedSrc = state.Peak([]);
			var undefinedNode = new UndefinedNode(undefinedSrc);
			state.curNode.AddChild(undefinedNode);
		}

		// just go to the end now
		while (!state.Done()) {
			state.Step();
		}

		return state;
	}

	function ParseCodeBlock(state) {
		var codeStr = state.ConsumeBlock( Sym.CodeOpen, Sym.CodeClose );
		var codeState = new ParserState(new CodeBlockNode(), codeStr);
		codeState = ParseCode( codeState );
		state.curNode.AddChild( codeState.rootNode );
		return state;
	}

}

} // Script()
<\/script>

<script>
function Dialog() {

this.CreateRenderer = function() {
	return new DialogRenderer();
};

this.CreateBuffer = function() {
	return new DialogBuffer();
};

var DialogRenderer = function() {
	// TODO : refactor this eventually? remove everything from struct.. avoid the defaults?
	var textboxInfo = {
		width : 104,
		height : 8+4+2+5, //8 for text, 4 for top-bottom padding, 2 for line padding, 5 for arrow
		top : 12*2,
		left : 12*2,
		bottom : 12*2, //for drawing it from the bottom
		padding_vert : 2,
		padding_horz : 4,
		arrow_height : 5,
	};

	var font = null;
	this.SetFont = function(f) {
		font = f;
		textboxInfo.height = (textboxInfo.padding_vert * 3) + (relativeFontHeight() * 2) + textboxInfo.arrow_height;

		// todo : clean up all the scale stuff
		var textboxScaleW = textboxInfo.width * getTextScale();
		var textboxScaleH = textboxInfo.height * getTextScale();
		bitsy.textbox(false, 0, 0, textboxScaleW, textboxScaleH);
	}

	this.GetPixelsPerRow = function() {
		return (textboxInfo.width - (textboxInfo.padding_horz * 2)) * getTextScale();
	}

	// todo : cache this value? it shouldn't really change in the middle of a game
	function getTextScale() {
		return bitsy.textMode() === bitsy.TXT_LOREZ ? 1 : 2;
	}

	function relativeFontWidth() {
		return Math.ceil(font.getWidth() / getTextScale());
	}

	function relativeFontHeight() {
		return Math.ceil(font.getHeight() / getTextScale());
	}

	this.ClearTextbox = function() {
		bitsy.fill(bitsy.TEXTBOX, textBackgroundIndex);
	};

	var isCentered = false;
	this.SetCentered = function(centered) {
		isCentered = centered;
	};

	// todo : I can stop doing this every frame right?
	this.DrawTextbox = function() {
		if (isCentered) {
			// todo : will the height calculations always work?
			bitsy.textbox(true, textboxInfo.left, ((bitsy.VIDEO_SIZE / 2) - (textboxInfo.height / 2)));
		}
		else if (player().y < (bitsy.MAP_SIZE / 2)) {
			// bottom
			bitsy.textbox(true, textboxInfo.left, (bitsy.VIDEO_SIZE - textboxInfo.bottom - textboxInfo.height));
		}
		else {
			// top
			bitsy.textbox(true, textboxInfo.left, textboxInfo.top);
		}
	};

	var arrowdata = [
		1,1,1,1,1,
		0,1,1,1,0,
		0,0,1,0,0
	];

	this.DrawNextArrow = function() {
		// bitsy.log("draw arrow!");
		var text_scale = getTextScale();
		var textboxScaleW = textboxInfo.width * text_scale;
		var textboxScaleH = textboxInfo.height * text_scale;

		var top = (textboxInfo.height - 5) * text_scale;
		var left = (textboxInfo.width - (5 + 4)) * text_scale;
		if (textDirection === TextDirection.RightToLeft) { // RTL hack
			left = 4 * text_scale;
		}

		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 5; x++) {
				var i = (y * 5) + x;
				if (arrowdata[i] == 1) {
					//scaling nonsense
					for (var sy = 0; sy < text_scale; sy++) {
						for (var sx = 0; sx < text_scale; sx++) {
							var px = left + (x * text_scale) + sx;
							var py = top + (y * text_scale) + sy;
							bitsy.set(bitsy.TEXTBOX, (py * textboxScaleW) + px, textArrowIndex);
						}
					}
				}
			}
		}
	};

	function drawCharData(charData, textScale, top, left, width, height, color) {
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var i = (y * width) + x;
				if (charData[i] == 1) {
					bitsy.set(bitsy.TEXTBOX, ((top + y) * (textboxInfo.width * textScale)) + (left + x), color);
				}
			}
		}
	}

	this.DrawChar = function(char, row, col, leftPos) {
		// characters with effects need to be redrawn every frame
		if (char.effectList.length > 0) {
			char.redraw = true;
		}

		// skip characters that are already drawn and don't need to be updated
		if (!char.redraw) {
			return;
		}
		char.redraw = false;

		var text_scale = getTextScale();
		var charData = char.bitmap;
		var top;
		var left;

		if (char.effectList.length > 0) {
			// clear the pixels from the previous frame
			top = (4 * text_scale) + (row * 2 * text_scale) + (row * font.getHeight()) + Math.floor(char.offset.y);
			left = (4 * text_scale) + leftPos + Math.floor(char.offset.x);
			drawCharData(charData, text_scale, top, left, char.width, char.height, textBackgroundIndex);
		}

		// compute render offset *every* frame
		char.offset = {
			x: char.base_offset.x,
			y: char.base_offset.y
		};
		char.SetPosition(row, col);
		char.ApplyEffects(effectTime);

		top = (4 * text_scale) + (row * 2 * text_scale) + (row * font.getHeight()) + Math.floor(char.offset.y);
		left = (4 * text_scale) + leftPos + Math.floor(char.offset.x);

		drawCharData(charData, text_scale, top, left, char.width, char.height, char.color);

		// TODO : consider for a future update?
		/*
		if (soundPlayer && char.blip && char.hasPlayedBlip != true) {
			soundPlayer.playBlip(blip[char.blip], { isPitchRandomized: true });
			char.hasPlayedBlip = true;
		}
		*/

		// call printHandler for character
		if (!disableOnPrintHandlers) {
			char.OnPrint();
		}
	};

	var effectTime = 0; // TODO this variable should live somewhere better

	var shouldUpdateTextboxSettings = true;
	var shouldClearTextbox = true;
	var shouldDrawArrow = true;

	var disableOnPrintHandlers = false;

	this.Draw = function(buffer, dt, disableOnPrint) {
		disableOnPrintHandlers = (disableOnPrint === true);

		// bitsy.log("draw dialog");
		if (buffer.DidFlipPageThisFrame()) {
			shouldClearTextbox = true;
			shouldDrawArrow = true;
		}

		effectTime += dt;

		if (shouldUpdateTextboxSettings) {
			bitsy.log("draw textbox");
			this.DrawTextbox(); // todo : rename to something more accurate
			shouldUpdateTextboxSettings = false;
		}

		if (shouldClearTextbox) {
			// bitsy.log("clear textbox");
			this.ClearTextbox();
			shouldClearTextbox = false;
		}

		// bitsy.log("draw chars");
		buffer.ForEachActiveChar(this.DrawChar);

		if (buffer.CanContinue() && shouldDrawArrow) {
			// bitsy.log("draw next arrow");
			this.DrawNextArrow();
			shouldDrawArrow = false;
		}

		if (buffer.DidPageFinishThisFrame() && onPageFinish != null) {
			bitsy.log("page finished");
			onPageFinish();
		}

		// bitsy.log("draw dialog end");
	};

	/* this is a hook for GIF rendering */
	var onPageFinish = null;
	this.SetPageFinishHandler = function(handler) {
		onPageFinish = handler;
	};

	this.Reset = function() {
		effectTime = 0;
		// TODO - anything else?

		shouldUpdateTextboxSettings = true;
		shouldClearTextbox = true;
		shouldDrawArrow = true;
	}

	this.updateTextboxPosition = function() {
		shouldUpdateTextboxSettings = true;
	};

	// this.CharsPerRow = function() {
	// 	return textboxInfo.charsPerRow;
	// }
}

var DialogBuffer = function() {
	var buffer = [[[]]]; // holds dialog in an array buffer
	var pageIndex = 0;
	var rowIndex = 0;
	var charIndex = 0;
	var nextCharTimer = 0;
	var nextCharMaxTime = 50; // in milliseconds
	var isDialogReadyToContinue = false;
	var activeTextEffects = [];
	var activeTextEffectParameters = [];
	var font = null;
	var arabicHandler = new ArabicHandler();
	var onDialogEndCallbacks = [];

	this.SetFont = function(f) {
		font = f;
	};

	this.SetPixelsPerRow = function(n) {
		pixelsPerRow = n;
	};

	this.CurPage = function() { return buffer[ pageIndex ]; };
	this.CurRow = function() { return this.CurPage()[ rowIndex ]; };
	this.CurChar = function() { return this.CurRow()[ charIndex ]; };
	this.CurPageCount = function() { return buffer.length; };
	this.CurRowCount = function() { return this.CurPage().length; };
	this.CurCharCount = function() { return this.CurRow().length; };

	this.ForEachActiveChar = function(handler) { // Iterates over visible characters on the active page
		var rowCount = rowIndex + 1;
		for (var i = 0; i < rowCount; i++) {
			var row = this.CurPage()[i];
			var charCount = (i == rowIndex) ? charIndex+1 : row.length;
			// bitsy.log(charCount);

			var leftPos = 0;
			if (textDirection === TextDirection.RightToLeft) {
				leftPos = 24 * 8; // hack -- I think this is correct?
			}

			for(var j = 0; j < charCount; j++) {
				var char = row[j];
				if(char) {
					if (textDirection === TextDirection.RightToLeft) {
						leftPos -= char.spacing;
					}
					// bitsy.log(j + " " + leftPos);

					// handler( char, i /*rowIndex*/, j /*colIndex*/ );
					handler(char, i /*rowIndex*/, j /*colIndex*/, leftPos)

					if (textDirection === TextDirection.LeftToRight) {
						leftPos += char.spacing;
					}
				}
			}
		}
	}

	this.Reset = function() {
		buffer = [[[]]];
		pageIndex = 0;
		rowIndex = 0;
		charIndex = 0;
		isDialogReadyToContinue = false;

		afterManualPagebreak = false;

		activeTextEffects = [];

		onDialogEndCallbacks = [];

		isActive = false;
	};

	this.DoNextChar = function() {
		nextCharTimer = 0; //reset timer

		//time to update characters
		if (charIndex + 1 < this.CurCharCount()) {
			//add char to current row
			charIndex++;
		}
		else if (rowIndex + 1 < this.CurRowCount()) {
			//start next row
			rowIndex++;
			charIndex = 0;
		}
		else {
			//the page is full!
			isDialogReadyToContinue = true;
			didPageFinishThisFrame = true;
		}

		if (this.CurChar() != null) {
			if (this.CurChar().isPageBreak) {
				// special case for page break marker character!
				isDialogReadyToContinue = true;
				didPageFinishThisFrame = true;
			}
			
			this.CurChar().OnPrint(); // make sure we hit the callback before we run out of text
		}
	};

	this.Update = function(dt) {
		didPageFinishThisFrame = false;
		didFlipPageThisFrame = false;
		// this.Draw(dt); // TODO move into a renderer object
		if (isDialogReadyToContinue) {
			return; //waiting for dialog to be advanced by player
		}

		nextCharTimer += dt; //tick timer

		if (nextCharTimer > nextCharMaxTime) {
			this.DoNextChar();
		}
	};

	var isSkipping = false;

	this.Skip = function() {
		bitsy.log("SKIPPP");
		isSkipping = true;

		didPageFinishThisFrame = false;
		didFlipPageThisFrame = false;

		// add new characters until you get to the end of the current line of dialog
		while (rowIndex < this.CurRowCount() && isSkipping) {
			this.DoNextChar();

			if (isDialogReadyToContinue) {
				//make sure to push the rowIndex past the end to break out of the loop
				rowIndex++;
				charIndex = 0;
			}
		}

		if (isSkipping) {
			rowIndex = this.CurRowCount() - 1;
			charIndex = this.CurCharCount() - 1;
		}

		isSkipping = false;
	};

	this.tryInterruptSkip = function() {
		if (isSkipping) {
			isSkipping = false;
			return true;
		}

		return false;
	};

	this.FlipPage = function() {
		didFlipPageThisFrame = true;
		isDialogReadyToContinue = false;
		pageIndex++;
		rowIndex = 0;
		charIndex = 0;
	}

	this.EndDialog = function() {
		isActive = false; // no more text to show... this should be a sign to stop rendering dialog

		for (var i = 0; i < onDialogEndCallbacks.length; i++) {
			onDialogEndCallbacks[i]();
		}
	}

	var afterManualPagebreak = false; // is it bad to track this state like this?

	this.Continue = function() {
		bitsy.log("CONTINUE");

		// if we used a page break character to continue we need
		// to run whatever is in the script afterwards! // TODO : make this comment better
		if (this.CurChar().isPageBreak) {
			// hacky: always treat a page break as the end of dialog
			// if there's more dialog later we re-activate the dialog buffer
			this.EndDialog();
			afterManualPagebreak = true;
			this.CurChar().OnContinue();
			return false;
		}
		if (pageIndex + 1 < this.CurPageCount()) {
			bitsy.log("FLIP PAGE!");
			//start next page
			this.FlipPage();
			return true; /* hasMoreDialog */
		}
		else {
			bitsy.log("END DIALOG!");
			bitsy.textbox(false);
			//end dialog mode
			this.EndDialog();
			return false; /* hasMoreDialog */
		}
	};

	var isActive = false;
	this.IsActive = function() { return isActive; };

	this.OnDialogEnd = function(callback) {
		if (!isActive) {
			callback();
		}
		else {
			onDialogEndCallbacks.push(callback);
		}
	}

	this.CanContinue = function() { return isDialogReadyToContinue; };

	function DialogChar() {
		this.redraw = true;

		this.effectList = [];
		this.effectParameterList = [];

		this.color = textColorIndex; // white
		this.offset = { x:0, y:0 }; // in pixels (screen pixels?)

		this.col = 0;
		this.row = 0;

		this.SetPosition = function(row,col) {
			// bitsy.log("SET POS");
			// bitsy.log(this);
			this.row = row;
			this.col = col;
		};

		this.ApplyEffects = function(time) {
			// bitsy.log("APPLY EFFECTS! " + time);
			for (var i = 0; i < this.effectList.length; i++) {
				var effectName = this.effectList[i];
				// bitsy.log("FX " + effectName);
				TextEffects[effectName].doEffect(this, time, this.effectParameterList[i]);
			}
		};

		var printHandler = null; // optional function to be called once on printing character
		this.SetPrintHandler = function(handler) {
			printHandler = handler;
		};
		this.OnPrint = function() {
			if (printHandler != null) {
				// bitsy.log("PRINT HANDLER ---- DIALOG BUFFER");
				printHandler();
				printHandler = null; // only call handler once (hacky)
			}
		};

		this.bitmap = [];
		this.width = 0;
		this.height = 0;
		this.base_offset = { // hacky name
 			x: 0,
			y: 0
		};
		this.spacing = 0;
	}

	function DialogFontChar(font, char, effectList, effectParameterList) {
		DialogChar.call(this);

		this.effectList = effectList.slice(); // clone effect list (since it can change between chars)
		this.effectParameterList = effectParameterList.slice();

		var charData = font.getChar(char);
		this.char = char;
		this.bitmap = charData.data;
		this.width = charData.width;
		this.height = charData.height;
		this.base_offset.x = charData.offset.x;
		this.base_offset.y = charData.offset.y;
		this.spacing = charData.spacing;
		this.blip = null;
		this.hasPlayedBlip = false;
	}

	function DialogDrawingChar(drawingId, effectList, effectParameterList) {
		DialogChar.call(this);

		this.effectList = effectList.slice(); // clone effect list (since it can change between chars)
		this.effectParameterList = effectParameterList.slice();

		// get the first frame of the drawing and flatten it
		var drawingData = renderer.GetDrawingSource(drawingId)[0];
		var drawingDataFlat = [];
		for (var i = 0; i < drawingData.length; i++) {
			drawingDataFlat = drawingDataFlat.concat(drawingData[i]);
		}

		this.bitmap = drawingDataFlat;
		this.width = 8;
		this.height = 8;
		this.spacing = 8;
	}

	function DialogScriptControlChar() {
		DialogChar.call(this);

		this.width = 0;
		this.height = 0;
		this.spacing = 0;
	}

	// is a control character really the best way to handle page breaks?
	function DialogPageBreakChar() {
		DialogChar.call(this);

		this.width = 0;
		this.height = 0;
		this.spacing = 0;

		this.isPageBreak = true;

		var continueHandler = null;

		this.SetContinueHandler = function(handler) {
			continueHandler = handler;
		};

		this.OnContinue = function() {
			if (continueHandler) {
				continueHandler();
			}
		};
	}

	function AddWordToCharArray(charArray, word, effectList, effectParameterList) {
		// bitsy.log("add char array");
		for (var i = 0; i < word.length; i++) {
			charArray.push(new DialogFontChar(font, word[i], effectList, effectParameterList));
		}
		// bitsy.log("add char array end");
		return charArray;
	}

	function GetCharArrayWidth(charArray) {
		var width = 0;
		for(var i = 0; i < charArray.length; i++) {
			width += charArray[i].spacing;
		}
		return width;
	}

	function GetStringWidth(str) {
		var width = 0;
		for (var i = 0; i < str.length; i++) {
			var charData = font.getChar(str[i]);
			width += charData.spacing;
		}
		return width;
	}

	var pixelsPerRow = 192; // hard-coded fun times!!!

	this.AddScriptReturn = function(onReturnHandler) {
		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		var controlChar = new DialogScriptControlChar();
		controlChar.SetPrintHandler(onReturnHandler);

		curRowArr.push(controlChar);

		isActive = true;
	}

	this.AddDrawing = function(drawingId) {
		// bitsy.log("DRAWING ID " + drawingId);

		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		var drawingChar = new DialogDrawingChar(drawingId, activeTextEffects, activeTextEffectParameters);

		var rowLength = GetCharArrayWidth(curRowArr);

		// TODO : clean up copy-pasted code here :/
		if (afterManualPagebreak) {
			this.FlipPage(); // hacky

			buffer[curPageIndex][curRowIndex] = curRowArr;
			buffer.push([]);
			curPageIndex++;
			buffer[curPageIndex].push([]);
			curRowIndex = 0;
			curRowArr = buffer[curPageIndex][curRowIndex];
			curRowArr.push(drawingChar);

			afterManualPagebreak = false;
		}
		else if (rowLength + drawingChar.spacing  <= pixelsPerRow || rowLength <= 0) {
			//stay on same row
			curRowArr.push(drawingChar);
		}
		else if (curRowIndex == 0) {
			//start next row
			buffer[curPageIndex][curRowIndex] = curRowArr;
			buffer[curPageIndex].push([]);
			curRowIndex++;
			curRowArr = buffer[curPageIndex][curRowIndex];
			curRowArr.push(drawingChar);
		}
		else {
			//start next page
			buffer[curPageIndex][curRowIndex] = curRowArr;
			buffer.push([]);
			curPageIndex++;
			buffer[curPageIndex].push([]);
			curRowIndex = 0;
			curRowArr = buffer[curPageIndex][curRowIndex];
			curRowArr.push(drawingChar);
		}

		isActive = true; // this feels like a bad way to do this???
	}

	// TODO : convert this into something that takes DialogChar arrays
	this.AddText = function(textStr) {
		bitsy.log("ADD TEXT >>" + textStr + "<<");

		//process dialog so it's easier to display
		var words = textStr.split(" ");

		// var curPageIndex = this.CurPageCount() - 1;
		// var curRowIndex = this.CurRowCount() - 1;
		// var curRowArr = this.CurRow();

		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			if (arabicHandler.ContainsArabicCharacters(word)) {
				word = arabicHandler.ShapeArabicCharacters(word);
			}

			var wordWithPrecedingSpace = ((i == 0) ? "" : " ") + word;
			var wordLength = GetStringWidth(wordWithPrecedingSpace);

			var rowLength = GetCharArrayWidth(curRowArr);

			if (afterManualPagebreak) {
				this.FlipPage();

				// hacky copied bit for page breaks
				buffer[curPageIndex][curRowIndex] = curRowArr;
				buffer.push([]);
				curPageIndex++;
				buffer[curPageIndex].push([]);
				curRowIndex = 0;
				curRowArr = buffer[curPageIndex][curRowIndex];
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects, activeTextEffectParameters);

				afterManualPagebreak = false;
			}
			else if (rowLength + wordLength <= pixelsPerRow || rowLength <= 0) {
				//stay on same row
				curRowArr = AddWordToCharArray(curRowArr, wordWithPrecedingSpace, activeTextEffects, activeTextEffectParameters);
			}
			else if (curRowIndex == 0) {
				//start next row
				buffer[curPageIndex][curRowIndex] = curRowArr;
				buffer[curPageIndex].push([]);
				curRowIndex++;
				curRowArr = buffer[curPageIndex][curRowIndex];
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects, activeTextEffectParameters);
			}
			else {
				//start next page
				buffer[curPageIndex][curRowIndex] = curRowArr;
				buffer.push([]);
				curPageIndex++;
				buffer[curPageIndex].push([]);
				curRowIndex = 0;
				curRowArr = buffer[curPageIndex][curRowIndex];
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects, activeTextEffectParameters);
			}
		}

		//destroy any empty stuff
		var lastPage = buffer[buffer.length-1];
		var lastRow = lastPage[lastPage.length-1];
		if (lastRow.length == 0) {
			lastPage.splice(lastPage.length-1, 1);
		}
		if (lastPage.length == 0) {
			buffer.splice(buffer.length-1, 1);
		}

		//finish up 
		lastPage = buffer[buffer.length-1];
		lastRow = lastPage[lastPage.length-1];
		if (lastRow.length > 0) {
			var lastChar = lastRow[lastRow.length-1];
		}

		// bitsy.log(buffer);

		bitsy.log("add text finished");

		isActive = true;
	};

	this.AddLinebreak = function() {
		var lastPage = buffer[buffer.length-1];
		if (lastPage.length <= 1) {
			// bitsy.log("LINEBREAK - NEW ROW ");
			// add new row
			lastPage.push([]);
		}
		else {
			// add new page
			buffer.push([[]]);
		}
		// bitsy.log(buffer);

		isActive = true;
	}

	this.AddPagebreak = function(onReturnHandler) {
		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		// need to actually create a whole new page if following another pagebreak character
		if (afterManualPagebreak) {
			this.FlipPage(); // hacky

			buffer[curPageIndex][curRowIndex] = curRowArr;
			buffer.push([]);
			curPageIndex++;
			buffer[curPageIndex].push([]);
			curRowIndex = 0;
			curRowArr = buffer[curPageIndex][curRowIndex];

			afterManualPagebreak = false;
		}

		var pagebreakChar = new DialogPageBreakChar();
		pagebreakChar.SetContinueHandler(onReturnHandler);

		curRowArr.push(pagebreakChar);

		isActive = true;
	}

	this.hasTextEffect = function(name) {
		return activeTextEffects.indexOf(name) != -1;
	};

	this.pushTextEffect = function(name, parameters) {
		activeTextEffects.push(name);
		activeTextEffectParameters.push(parameters);
	};

	this.popTextEffect = function(name) {
		var i = activeTextEffects.lastIndexOf(name);
		activeTextEffects.splice(i, 1);
		activeTextEffectParameters.splice(i, 1);
	};

	/* this is a hook for GIF rendering */
	var didPageFinishThisFrame = false;
	this.DidPageFinishThisFrame = function(){ return didPageFinishThisFrame; };

	var didFlipPageThisFrame = false;
	this.DidFlipPageThisFrame = function(){ return didFlipPageThisFrame; };

	// this.SetCharsPerRow = function(num){ charsPerRow = num; }; // hacky
};

/* ARABIC */
var ArabicHandler = function() {

	var arabicCharStart = 0x0621;
	var arabicCharEnd = 0x064E;

	var CharacterForm = {
		Isolated : 0,
		Final : 1,
		Initial : 2,
		Middle : 3
	};

	// map glyphs to their character forms
	var glyphForms = {
		/*		 Isolated, Final, Initial, Middle Forms	*/
		0x0621: [0xFE80,0xFE80,0xFE80,0xFE80], /*  HAMZA  */ 
		0x0622: [0xFE81,0xFE82,0xFE81,0xFE82], /*  ALEF WITH MADDA ABOVE  */ 
		0x0623: [0xFE83,0xFE84,0xFE83,0xFE84], /*  ALEF WITH HAMZA ABOVE  */ 
		0x0624: [0xFE85,0xFE86,0xFE85,0xFE86], /*  WAW WITH HAMZA ABOVE  */ 
		0x0625: [0xFE87,0xFE88,0xFE87,0xFE88], /*  ALEF WITH HAMZA BELOW  */ 
		0x0626: [0xFE89,0xFE8A,0xFE8B,0xFE8C], /*  YEH WITH HAMZA ABOVE  */ 
		0x0627: [0xFE8D,0xFE8E,0xFE8D,0xFE8E], /*  ALEF  */ 
		0x0628: [0xFE8F,0xFE90,0xFE91,0xFE92], /*  BEH  */ 
		0x0629: [0xFE93,0xFE94,0xFE93,0xFE94], /*  TEH MARBUTA  */ 
		0x062A: [0xFE95,0xFE96,0xFE97,0xFE98], /*  TEH  */ 
		0x062B: [0xFE99,0xFE9A,0xFE9B,0xFE9C], /*  THEH  */ 
		0x062C: [0xFE9D,0xFE9E,0xFE9F,0xFEA0], /*  JEEM  */ 
		0x062D: [0xFEA1,0xFEA2,0xFEA3,0xFEA4], /*  HAH  */ 
		0x062E: [0xFEA5,0xFEA6,0xFEA7,0xFEA8], /*  KHAH  */ 
		0x062F: [0xFEA9,0xFEAA,0xFEA9,0xFEAA], /*  DAL  */ 
		0x0630: [0xFEAB,0xFEAC,0xFEAB,0xFEAC], /*  THAL */ 
		0x0631: [0xFEAD,0xFEAE,0xFEAD,0xFEAE], /*  RAA  */ 
		0x0632: [0xFEAF,0xFEB0,0xFEAF,0xFEB0], /*  ZAIN  */ 
		0x0633: [0xFEB1,0xFEB2,0xFEB3,0xFEB4], /*  SEEN  */ 
		0x0634: [0xFEB5,0xFEB6,0xFEB7,0xFEB8], /*  SHEEN  */ 
		0x0635: [0xFEB9,0xFEBA,0xFEBB,0xFEBC], /*  SAD  */ 
		0x0636: [0xFEBD,0xFEBE,0xFEBF,0xFEC0], /*  DAD  */ 
		0x0637: [0xFEC1,0xFEC2,0xFEC3,0xFEC4], /*  TAH  */ 
		0x0638: [0xFEC5,0xFEC6,0xFEC7,0xFEC8], /*  ZAH  */ 
		0x0639: [0xFEC9,0xFECA,0xFECB,0xFECC], /*  AIN  */ 
		0x063A: [0xFECD,0xFECE,0xFECF,0xFED0], /*  GHAIN  */ 
		0x063B: [0x0000,0x0000,0x0000,0x0000], /*  space */
		0x063C: [0x0000,0x0000,0x0000,0x0000], /*  space */
		0x063D: [0x0000,0x0000,0x0000,0x0000], /*  space */
		0x063E: [0x0000,0x0000,0x0000,0x0000], /*  space */
		0x063F: [0x0000,0x0000,0x0000,0x0000], /*  space */
		0x0640: [0x0640,0x0640,0x0640,0x0640], /*  TATWEEL  */ 
		0x0641: [0xFED1,0xFED2,0xFED3,0xFED4], /*  FAA  */ 
		0x0642: [0xFED5,0xFED6,0xFED7,0xFED8], /*  QAF  */ 
		0x0643: [0xFED9,0xFEDA,0xFEDB,0xFEDC], /*  KAF  */ 
		0x0644: [0xFEDD,0xFEDE,0xFEDF,0xFEE0], /*  LAM  */ 
		0x0645: [0xFEE1,0xFEE2,0xFEE3,0xFEE4], /*  MEEM  */ 
		0x0646: [0xFEE5,0xFEE6,0xFEE7,0xFEE8], /*  NOON  */ 
		0x0647: [0xFEE9,0xFEEA,0xFEEB,0xFEEC], /*  HEH  */ 
		0x0648: [0xFEED,0xFEEE,0xFEED,0xFEEE], /*  WAW  */ 
		0x0649: [0xFEEF,0xFEF0,0xFBE8,0xFBE9], /*  ALEF MAKSURA  */ 
		0x064A: [0xFEF1,0xFEF2,0xFEF3,0xFEF4], /*  YEH  */ 
		0x064B: [0xFEF5,0xFEF6,0xFEF5,0xFEF6], /*  LAM ALEF MADD*/
		0x064C: [0xFEF7,0xFEF8,0xFEF7,0xFEF8], /*  LAM ALEF HAMZA ABOVE*/
		0x064D: [0xFEF9,0xFEFa,0xFEF9,0xFEFa], /*  LAM ALEF HAMZA BELOW*/
		0x064E: [0xFEFb,0xFEFc,0xFEFb,0xFEFc], /*  LAM ALEF */
	};

	var disconnectedCharacters = [0x0621,0x0622,0x0623,0x0624,0x0625,0x0627,0x062f,0x0630,0x0631,0x0632,0x0648,0x0649,0x064b,0x064c,0x064d,0x064e];

	function IsArabicCharacter(char) {
		var code = char.charCodeAt(0);
		return (code >= arabicCharStart && code <= arabicCharEnd);
	}

	function ContainsArabicCharacters(word) {
		for (var i = 0; i < word.length; i++) {
			if (IsArabicCharacter(word[i])) {
				return true;
			}
		}
		return false;
	}

	function IsDisconnectedCharacter(char) {
		var code = char.charCodeAt(0);
		return disconnectedCharacters.indexOf(code) != -1;
	}

	function ShapeArabicCharacters(word) {
		var shapedWord = "";

		for (var i = 0; i < word.length; i++) {
			if (!IsArabicCharacter(word[i])) {
				shapedWord += word[i];
				continue;
			}

			var connectedToPreviousChar = i-1 >= 0 && IsArabicCharacter(word[i-1]) && !IsDisconnectedCharacter(word[i-1]);

			var connectedToNextChar = i+1 < word.length && IsArabicCharacter(word[i+1]) && !IsDisconnectedCharacter(word[i]);

			var form;
			if (!connectedToPreviousChar && !connectedToNextChar) {
				form = CharacterForm.Isolated;
			}
			else if (connectedToPreviousChar && !connectedToNextChar) {
				form = CharacterForm.Final;
			}
			else if (!connectedToPreviousChar && connectedToNextChar) {
				form = CharacterForm.Initial;
			}
			else if (connectedToPreviousChar && connectedToNextChar) {
				form = CharacterForm.Middle;
			}

			var code = word[i].charCodeAt(0);

			// handle lam alef special case
			if (code == 0x0644 && connectedToNextChar) {
				var nextCode = word[i+1].charCodeAt(0);
				var specialCode = null;
				if (nextCode == 0x0622) {
					// alef madd
					specialCode = glyphForms[0x064b][form];
				}
				else if (nextCode == 0x0623) {
					// hamza above
					specialCode = glyphForms[0x064c][form];
				}
				else if (nextCode == 0x0625) {
					// hamza below
					specialCode = glyphForms[0x064d][form];
				}
				else if (nextCode == 0x0627) {
					// alef
					specialCode = glyphForms[0x064e][form];
				}

				if (specialCode != null) {
					shapedWord += String.fromCharCode(specialCode);
					i++; // skip a step
					continue;
				}
			}

			// hacky?
			if (form === CharacterForm.Isolated) {
				shapedWord += word[i];
				continue;
			}

			var shapedCode = glyphForms[code][form];
			shapedWord += String.fromCharCode(shapedCode);
		}

		return shapedWord;
	}

	this.ContainsArabicCharacters = ContainsArabicCharacters;
	this.ShapeArabicCharacters = ShapeArabicCharacters;
}

/* TEXT EFFECTS */
var TextEffects = {};

function RainbowEffect() {
	function positiveModulo(number, divisor) {
		return ((number % divisor) + divisor) % divisor;
	}

	this.doEffect = function(char, time, parameters) {
		char.color = rainbowColorStartIndex + Math.floor(positiveModulo((time / 100) - char.col * 0.5, rainbowColorCount));
	};
}

TextEffects["rbw"] = new RainbowEffect();

function ColorEffect(index) {
	this.doEffect = function(char, time, parameters) {
		if (parameters && parameters.length > 0) {
			char.color = tileColorStartIndex + parameters[0];
		}
		else {
			char.color = tileColorStartIndex + index;
		}
	};
}

TextEffects["clr"] = new ColorEffect();
TextEffects["clr1"] = new ColorEffect(0);
TextEffects["clr2"] = new ColorEffect(1);
TextEffects["clr3"] = new ColorEffect(2);

function WavyEffect() {
	this.doEffect = function(char, time, parameters) {
		char.offset.y += Math.sin((time / 250) - (char.col / 2)) * 2;
	};
}

TextEffects["wvy"] = new WavyEffect();

function ShakyEffect() {
	function disturb(func, time, offset, mult1, mult2) {
		return func((time * mult1) - (offset * mult2));
	}

	this.doEffect = function(char, time, parameters) {
		char.offset.y += 1.5
						* disturb(Math.sin, time, char.col, 0.1, 0.5)
						* disturb(Math.cos, time, char.col, 0.3, 0.2)
						* disturb(Math.sin, time, char.row, 2.0, 1.0);
		char.offset.x += 1.5
						* disturb(Math.cos, time, char.row, 0.1, 1.0)
						* disturb(Math.sin, time, char.col, 3.0, 0.7)
						* disturb(Math.cos, time, char.col, 0.2, 0.3);
	};
}

TextEffects["shk"] = new ShakyEffect();

/*
// TODO : maybe use this in a future update?
function YakEffect() {
	this.doEffect = function(char, time, parameters) {
		if (char.char != " ") {
			char.blip = parameters[0];
		}
	};
}

TextEffects["yak"] = new YakEffect();
*/

var DebugHighlightEffect = function() {
	this.doEffect = function(char, time, parameters) {
		char.color = tileColorStartIndex;
	};
}

TextEffects["_debug_highlight"] = new DebugHighlightEffect();

} // Dialog()
<\/script>

<script>
function TileRenderer() {
bitsy.log("!!!!! NEW TILE RENDERER");

var drawingCache = {
	source: {},
	render: {},
};

// var debugRenderCount = 0;

function createRenderCacheId(drawingId, colorIndex) {
	return drawingId + "_" + colorIndex;
}

function renderDrawing(drawing) {
	// debugRenderCount++;
	// bitsy.log("RENDER COUNT " + debugRenderCount);

	var col = drawing.col;
	var bgc = drawing.bgc;
	var drwId = drawing.drw;
	var drawingFrames = drawingCache.source[drwId];

	// initialize render cache entry
	var cacheId = createRenderCacheId(drwId, col);
	if (drawingCache.render[cacheId] === undefined) {
		// initialize array of frames for drawing
		drawingCache.render[cacheId] = [];
	}

	for (var i = 0; i < drawingFrames.length; i++) {
		var frameData = drawingFrames[i];
		var frameTileId = renderTileFromDrawingData(frameData, col, bgc);
		drawingCache.render[cacheId].push(frameTileId);
	}
}

function renderTileFromDrawingData(drawingData, col, bgc) {
	var tileId = bitsy.tile();

	var backgroundColor = tileColorStartIndex + bgc;
	var foregroundColor = tileColorStartIndex + col;

	bitsy.fill(tileId, backgroundColor);

	for (var y = 0; y < bitsy.TILE_SIZE; y++) {
		for (var x = 0; x < bitsy.TILE_SIZE; x++) {
			var px = drawingData[y][x];
			if (px === 1) {
				bitsy.set(tileId, (y * bitsy.TILE_SIZE) + x, foregroundColor);
			}
		}
	}

	return tileId;
}

// TODO : move into core
function undefinedOrNull(x) {
	return x === undefined || x === null;
}

function isDrawingRendered(drawing) {
	var cacheId = createRenderCacheId(drawing.drw, drawing.col);
	return drawingCache.render[cacheId] != undefined;
}

function getRenderedDrawingFrames(drawing) {
	var cacheId = createRenderCacheId(drawing.drw, drawing.col);
	return drawingCache.render[cacheId];
}

function getDrawingFrameTileId(drawing, frameOverride) {
	var frameIndex = 0;

	if (drawing != null && drawing.animation.isAnimated) {
		if (frameOverride != undefined && frameOverride != null) {
			frameIndex = frameOverride;
		}
		else {
			frameIndex = drawing.animation.frameIndex;
		}
	}

	return getRenderedDrawingFrames(drawing)[frameIndex];
}

function getOrRenderDrawingFrame(drawing, frameOverride) {
	// bitsy.log("frame render: " + drawing.type + " " + drawing.id + " f:" + frameOverride);

	if (!isDrawingRendered(drawing)) {
		bitsy.log("frame render: doesn't exist " + drawing.id);
		renderDrawing(drawing);
	}

	return getDrawingFrameTileId(drawing, frameOverride);
}

function deleteRenders(drawingId) {
	for (var cacheId in drawingCache.render) {
		if (cacheId.indexOf(drawingId) === 0) {
			var tiles = drawingCache.render[cacheId];
			for (var i = 0; i < tiles.length; i++) {
				bitsy.delete(tiles[i]);
			}
			delete drawingCache.render[cacheId];
		}
	}
}

/* PUBLIC INTERFACE */
this.GetDrawingFrame = getOrRenderDrawingFrame;

// todo : leave individual get and set stuff for now - should I remove later?
// todo : better name for function?
this.SetDrawings = function(drawingSource) {
	drawingCache.source = drawingSource;
	// need to reset entire render cache when all the drawings are changed
	drawingCache.render = {};
};

this.SetDrawingSource = function(drawingId, drawingData) {
	deleteRenders(drawingId);
	drawingCache.source[drawingId] = drawingData;
};

this.GetDrawingSource = function(drawingId) {
	return drawingCache.source[drawingId];
};

this.GetFrameCount = function(drawingId) {
	return drawingCache.source[drawingId].length;
};

// todo : forceReset option is hacky?
this.ClearCache = function(forceReset) {
	if (forceReset === undefined || forceReset === true) {
		for (var cacheId in drawingCache.render) {
			var tiles = drawingCache.render[cacheId];
			for (var i = 0; i < tiles.length; i++) {
				bitsy.delete(tiles[i]);
			}
		}
	}

	drawingCache.render = {};
};

this.deleteDrawing = deleteRenders;

} // Renderer()
<\/script>

<script>
/* WORLD DATA */
var room = {};
var tile = {};
var sprite = {};
var item = {};
var dialog = {};
var end = {}; // for backwards compatibility
var palette = { // start off with a default palette
		"default" : {
			name : "default",
			colors : [[0,0,0],[255,255,255],[255,255,255]]
		}
	};
var variable = {}; // these are starting variable values -- they don't update (or I don't think they will)
var tune = {};
var blip = {};
var playerId = "A";
var fontName = defaultFontName;
var textDirection = TextDirection.LeftToRight;

/* NAME-TO-ID MAPS */
var names = {
	room : {},
	tile : {},
	sprite : {},
	item : {},
	dialog : {},
	palette : {},
	tune : {},
	blip : {},
};

// todo : this is basically a copy of the one in world.js - can I remove it?
function updateNamesFromCurData() {

	function createNameMap(objectStore) {
		var map = {};

		for (id in objectStore) {
			if (objectStore[id].name != undefined && objectStore[id].name != null) {
				map[objectStore[id].name] = id;
			}
		}

		return map;
	}

	names.room = createNameMap(room);
	names.tile = createNameMap(tile);
	names.sprite = createNameMap(sprite);
	names.item = createNameMap(item);
	names.dialog = createNameMap(dialog);
	names.palette = createNameMap(palette);
	names.tune = createNameMap(tune);
	names.blip = createNameMap(blip);
}

/* GAME STATE */
var state = {}
function resetGameState() {
	state.room = "0";
	state.ava = playerId; // avatar appearance override
	state.pal = "0"; // current palette id
	state.tune = "0"; // current tune id ("0" === off)
	state.exits = []; // exits in current room
	state.endings = []; // endings in current room
}

// title helper functions
function getTitle() {
	return dialog[titleDialogId].src;
}
function setTitle(titleSrc) {
	dialog[titleDialogId] = { src:titleSrc, name:null };
}

/* FLAGS */
var flags = createDefaultFlags();

// feature flags for testing purposes
var engineFeatureFlags = {
	isSoundEnabled : true,
	isFontEnabled : true,
	isTransitionEnabled : true,
	isScriptEnabled : true,
	isDialogEnabled : true,
	isRendererEnabled : true,
};

function clearGameData() {
	room = {};
	tile = {};
	sprite = {};
	item = {};
	dialog = {};
	palette = { //start off with a default palette
		"default" : {
			name : "default",
			colors : [[0,0,0],[255,255,255],[255,255,255]]
		}
	};
	isEnding = false; //todo - correct place for this?
	variable = {};

	updateNamesFromCurData();

	fontName = defaultFontName; // TODO : reset font manager too?
	textDirection = TextDirection.LeftToRight;

	resetGameState();

	isGameLoaded = false;
	isGameOver = false;
}

// engine event hooks for the editor
var onInventoryChanged = null;
var onVariableChanged = null;
var onGameReset = null;
var onInitRoom = null;

var isPlayerEmbeddedInEditor = false;

var renderer;
if (engineFeatureFlags.isRendererEnabled) {
	renderer = new TileRenderer();
}

var curGameData = null;
var curDefaultFontData = null;

var isGameLoaded = false;
var isGameOver = false;

function load_game(gameData, defaultFontData, startWithTitle) {
	// bitsy.log("game data in: \\n" + gameData);

	curGameData = gameData; //remember the current game (used to reset the game)

	if (dialogBuffer) {
		dialogBuffer.Reset();
	}

	if (scriptInterpreter) {
		scriptInterpreter.ResetEnvironment(); // ensures variables are reset -- is this the best way?
	}

	loadWorldFromGameData(gameData);

	bitsy.log("world loaded");

	if (fontManager && !isPlayerEmbeddedInEditor && defaultFontData) {
		bitsy.log("load font");

		curDefaultFontData = defaultFontData; // store for resetting game

		// todo : consider replacing this with a more general system for requesting resources from the system?
		// hack to ensure default font is available
		fontManager.AddResource(defaultFontName + fontManager.GetExtension(), defaultFontData);

		bitsy.log("load font end");
	}

	// request text mode
	if (flags.TXT_MODE === 1) {
		bitsy.textMode(bitsy.TXT_LOREZ);
	}
	else {
		// default to 2x scale for text rendering
		bitsy.textMode(bitsy.TXT_HIREZ);
	}

	if (fontManager && dialogBuffer) {
		bitsy.log("get font");

		var font = fontManager.Get( fontName );
		dialogBuffer.SetFont(font);
		dialogRenderer.SetFont(font);

		bitsy.log("get font end");
	}

	if (dialogBuffer) {
		// this feels a little silly to me - oh well??
		dialogBuffer.SetPixelsPerRow(dialogRenderer.GetPixelsPerRow());
	}

	setInitialVariables();

	bitsy.log("ready");

	onready(startWithTitle);

	isGameLoaded = true;
}

function loadWorldFromGameData(gameData) {
	bitsy.log("load world from game data");

	var world = parseWorld(gameData);

	bitsy.log("parse world done");

	// move world data into global scope
	palette = world.palette;
	room = world.room;
	tile = world.tile;
	sprite = world.sprite;
	item = world.item;
	dialog = world.dialog;
	end = world.end; // back compat endings
	variable = world.variable;
	fontName = world.fontName;
	textDirection = world.textDirection;
	tune = world.tune;
	blip = world.blip;
	flags = world.flags;
	names = world.names;

	if (renderer) {
		renderer.SetDrawings(world.drawings);
	}

	// find starting room and initialize it
	var roomIds = Object.keys(room);

	if (player() != undefined && player().room != null && roomIds.indexOf(player().room) != -1) {
		// player has valid room
		state.room = player().room;
	}
	else if (roomIds.length > 0) {
		// player not in any room! what the heck
		state.room = roomIds[0];
	}
	else {
		// uh oh there are no rooms I guess???
		state.room = null;
	}

	if (state.room != null) {
		bitsy.log("INIT ROOM " + state.room);
		initRoom(state.room);
	}
}

function reset_cur_game() {
	if (curGameData == null) {
		return; //can't reset if we don't have the game data
	}

	stopGame();
	clearGameData();

	if (isPlayerEmbeddedInEditor && onGameReset != null) {
		onGameReset();
	}
}

function onready(startWithTitle) {
	bitsy.log("game ready!");

	if (startWithTitle === undefined || startWithTitle === null) {
		startWithTitle = true;
	}

	if (startWithTitle) { // used by editor 
		startNarrating(getTitle());
	}
}

function setInitialVariables() {
	if (!scriptInterpreter) {
		return;
	}

	for(id in variable) {
		var value = variable[id]; // default to string
		if(value === "true") {
			value = true;
		}
		else if(value === "false") {
			value = false;
		}
		else if(!isNaN(parseFloat(value))) {
			value = parseFloat(value);
		}
		scriptInterpreter.SetVariable(id,value);
	}
	scriptInterpreter.SetOnVariableChangeHandler( onVariableChanged );
}

function getOffset(evt) {
	var offset = { x:0, y:0 };

	var el = evt.target;
	var rect = el.getBoundingClientRect();

	offset.x += rect.left + el.scrollLeft;
	offset.y += rect.top + el.scrollTop;

	offset.x = evt.clientX - offset.x;
	offset.y = evt.clientY - offset.y;

	return offset;
}

function stopGame() {
	if (soundPlayer) {
		soundPlayer.stopTune();
	}
	bitsy.log("stop GAME!");
}

function update(dt) {
	if (!isGameLoaded) {
		load_game(bitsy.getGameData(), bitsy.getFontData());
	}

	if (state.room == null) {
		// in the special case where there is no valid room, end the game
		startNarrating( "", true /*isEnding*/ );
	}

	if (!transition || !transition.IsTransitionActive()) {
		updateInput();
	}

	if (transition && transition.IsTransitionActive()) {
		// transition animation takes over everything!
		transition.UpdateTransition(dt);
	}
	else {
		if (bitsy.graphicsMode() != bitsy.GFX_MAP) {
			bitsy.graphicsMode(bitsy.GFX_MAP);
		}

		if (soundPlayer) {
			soundPlayer.update(dt);
		}

		if (!isNarrating && !isEnding) {
			// draw world if game has begun
			var didAnimate = updateAnimation(dt);

			// test whether player moved so we can redraw just the avatar
			playerCurX = player().x;
			playerCurY = player().y;
			var didPlayerMove = (playerPrevX != playerCurX) || (playerPrevY != playerCurY);

			drawRoom(room[state.room], { redrawAnimated: didAnimate, redrawAvatar: didPlayerMove });

			// store player's position for next frame
			playerPrevX = playerCurX;
			playerPrevY = playerCurY;
		}
		else {
			clearRoom();
		}

		if (dialogBuffer && dialogBuffer.IsActive() && !(soundPlayer && soundPlayer.isBlipPlaying())) {
			// bitsy.log("update dialog");
			// bitsy.log("renderer");
			dialogRenderer.Draw(dialogBuffer, dt);
			// bitsy.log("buffer");
			dialogBuffer.Update(dt);
			// bitsy.log("update dialog end");
		}

		// keep moving avatar if player holds down button
		if ((!dialogBuffer || !dialogBuffer.IsActive()) && !isEnding) {
			if (curPlayerDirection != Direction.None) {
				playerHoldToMoveTimer -= dt;

				if (playerHoldToMoveTimer <= 0) {
					movePlayer(curPlayerDirection, false /* isFirstMove */);
					playerHoldToMoveTimer = 150;
					// playerHoldToMoveTimer = 16; // PERF TEST
				}
			}
		}
	}

	// clean up state if the game is ending
	if (isGameOver) {
		bitsy.log("game over");
		reset_cur_game();
	}

	return true;
}

var isAnyButtonHeld = false;
var isIgnoringInput = false;

function isAnyButtonDown() {
	return bitsy.button(bitsy.BTN_UP) ||
		bitsy.button(bitsy.BTN_DOWN) ||
		bitsy.button(bitsy.BTN_LEFT) ||
		bitsy.button(bitsy.BTN_RIGHT) ||
		bitsy.button(bitsy.BTN_OK);
}

function updateInput() {
	if (dialogBuffer && dialogBuffer.IsActive()) {
		if (!(soundPlayer && soundPlayer.isBlipPlaying())) {
			if (!isAnyButtonHeld && isAnyButtonDown()) {
				/* CONTINUE DIALOG */
				if (dialogBuffer.CanContinue()) {
					var hasMoreDialog = dialogBuffer.Continue();
					if (!hasMoreDialog) {
						// ignore currently held keys UNTIL they are released (stops player from insta-moving)
						isIgnoringInput = true;
						curPlayerDirection = Direction.None;
					}
				}
				else {
					dialogBuffer.Skip();
				}
			}
		}
	}
	else if (isEnding) {
		if (!isAnyButtonHeld && isAnyButtonDown()) {
			// tell game to restart
			isGameOver = true;
		}
	}
	else if (!isIgnoringInput) {
		/* WALK */
		var prevPlayerDirection = curPlayerDirection;

		if (bitsy.button(bitsy.BTN_UP)) {
			curPlayerDirection = Direction.Up;
		}
		else if (bitsy.button(bitsy.BTN_DOWN)) {
			curPlayerDirection = Direction.Down;
		}
		else if (bitsy.button(bitsy.BTN_LEFT)) {
			curPlayerDirection = Direction.Left;
		}
		else if (bitsy.button(bitsy.BTN_RIGHT)) {
			curPlayerDirection = Direction.Right;
		}
		else {
			curPlayerDirection = Direction.None;
		}

		if (curPlayerDirection != Direction.None && curPlayerDirection != prevPlayerDirection) {
			movePlayer(curPlayerDirection, true /* isFirstMove */);
			playerHoldToMoveTimer = 500;
			// playerHoldToMoveTimer = 32; // PERF TEST
		}
	}

	if (!isAnyButtonDown()) {
		isIgnoringInput = false;
	}

	// quit if the user ever presses the restart button
	// todo : should I rename it bitsy.BTN_RESTART or bitsy.BTN_QUIT or bitsy.BTN_OFF?
	if (bitsy.button(bitsy.BTN_MENU)) {
		isGameOver = true;
	}

	isAnyButtonHeld = isAnyButtonDown();
}

var animationCounter = 0;
var animationTime = 400;
function updateAnimation(dt) {
	animationCounter += dt;
	// bitsy.log("anim " + animationCounter);
	if (animationCounter >= animationTime) {
		// animate sprites
		for (id in sprite) {
			var spr = sprite[id];
			if (spr.animation.isAnimated) {
				spr.animation.frameIndex = (spr.animation.frameIndex + 1) % spr.animation.frameCount;
			}
		}

		// animate tiles
		for (id in tile) {
			var til = tile[id];
			if (til.animation.isAnimated) {
				til.animation.frameIndex = (til.animation.frameIndex + 1) % til.animation.frameCount;
			}
		}

		// animate items
		for (id in item) {
			var itm = item[id];
			if (itm.animation.isAnimated) {
				itm.animation.frameIndex = (itm.animation.frameIndex + 1) % itm.animation.frameCount;
			}
		}

		// reset counter
		animationCounter = 0;

		// updated animations this frame
		return true;
	}

	// did *not* update animations this frame
	return false;
}

function resetAllAnimations() {
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.animation.isAnimated) {
			spr.animation.frameIndex = 0;
		}
	}

	for (id in tile) {
		var til = tile[id];
		if (til.animation.isAnimated) {
			til.animation.frameIndex = 0;
		}
	}

	for (id in item) {
		var itm = item[id];
		if (itm.animation.isAnimated) {
			itm.animation.frameIndex = 0;
		}
	}
}

function getSpriteAt(x, y, roomId) {
	if (roomId === undefined) {
		roomId = state.room;
	}

	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === roomId) {
			if (spr.x == x && spr.y == y) {
				return id;
			}
		}
	}

	return null;
}

var Direction = {
	None : -1,
	Up : 0,
	Down : 1,
	Left : 2,
	Right : 3
};

var curPlayerDirection = Direction.None;
var playerHoldToMoveTimer = 0;
var playerPrevX = 0;
var playerPrevY = 0;

function movePlayer(direction, isFirstMove) {
	didPlayerMove = false;
	var roomIds = Object.keys(room);

	if (player().room == null || roomIds.indexOf(player().room) < 0) {
		return; // player room is missing or invalid.. can't move them!
	}

	var spr = null;

	if (direction == Direction.Left && !(spr = getSpriteLeft()) && !isWallLeft()) {
		player().x -= 1;
	}
	else if (direction == Direction.Right && !(spr = getSpriteRight()) && !isWallRight()) {
		player().x += 1;
	}
	else if (direction == Direction.Up && !(spr = getSpriteUp()) && !isWallUp()) {
		player().y -= 1;
	}
	else if (direction == Direction.Down && !(spr = getSpriteDown()) && !isWallDown()) {
		player().y += 1;
	}

	var ext = getExit( player().room, player().x, player().y );
	var end = getEnding( player().room, player().x, player().y );
	var itmIndex = getItemIndex( player().room, player().x, player().y );

	// only play one sound effect per "turn"
	var blipId = null;

	// do items first, because you can pick up an item AND go through a door
	if (itmIndex > -1) {
		var itm = room[player().room].items[itmIndex];
		var itemRoom = player().room;

		// play sound on pitck up item
		if (item[itm.id].blip != null) {
			blipId = item[itm.id].blip;
		}

		startItemDialog(itm.id, function() {
			// remove item from room
			room[itemRoom].items.splice(itmIndex, 1);

			// update player inventory
			if (player().inventory[itm.id]) {
				player().inventory[itm.id] += 1;
			}
			else {
				player().inventory[itm.id] = 1;
			}

			// show inventory change in UI
			if (onInventoryChanged != null) {
				onInventoryChanged(itm.id);
			}
		});
	}

	if (end) {
		startEndingDialog(end);
	}
	else if (ext) {
		movePlayerThroughExit(ext);
	}
	else if (spr) {
		// play sound on greet sprite
		if (sprite[spr].blip != null) {
			blipId = sprite[spr].blip;
		}

		startSpriteDialog(spr /*spriteId*/);
	}

	// TODO : maybe add in a future update?
	/*
	// play sound when player moves (if no other sound selected)
	if (isFirstMove && blipId === null && sprite[state.ava].blip != null) {
		blipId = sprite[state.ava].blip;
		randomizeBlip = true;
		blipChannel = bitsy.SOUND2; // play walking sfx *under* the tune melody
	}
	*/

	if (soundPlayer && blipId != null && blip[blipId]) {
		soundPlayer.playBlip(blip[blipId]);
	}
}

var transition;
if (engineFeatureFlags.isTransitionEnabled) {
	transition = new TransitionManager();
}

function movePlayerThroughExit(ext) {
	var GoToDest = function() {
		if (transition && ext.transition_effect != null) {
			transition.BeginTransition(
				player().room,
				player().x,
				player().y,
				ext.dest.room,
				ext.dest.x,
				ext.dest.y,
				ext.transition_effect);

			transition.UpdateTransition(0);

			transition.OnTransitionComplete(function() {
				player().room = ext.dest.room;
				player().x = ext.dest.x;
				player().y = ext.dest.y;
				state.room = ext.dest.room;
				initRoom(state.room);
			});
		}
		else {
			player().room = ext.dest.room;
			player().x = ext.dest.x;
			player().y = ext.dest.y;
			state.room = ext.dest.room;

			initRoom(state.room);
		}
	};

	if (ext.dlg != undefined && ext.dlg != null) {
		// TODO : I need to simplify dialog code,
		// so I don't have to get the ID and the source str
		// every time!
		startDialog(
			dialog[ext.dlg].src,
			ext.dlg,
			function(result) {
				var isLocked = ext.property && ext.property.locked === true;
				if (!isLocked) {
					GoToDest();
				}
			},
			ext);
	}
	else {
		GoToDest();
	}
}

/* PALETTE INDICES */
var backgroundIndex = 0;
var textBackgroundIndex = 1;
var textArrowIndex = 2;
var textColorIndex = 3;

// precalculated rainbow colors
var rainbowColorStartIndex = 4;
var rainbowColorCount = 10;
var rainbowColors = [
	[255,0,0],
	[255,217,0],
	[78,255,0],
	[0,255,125],
	[0,192,255],
	[0,18,255],
	[136,0,255],
	[255,0,242],
	[255,0,138],
	[255,0,61],
];

function updatePaletteWithTileColors(tileColors) {
	// the screen background color should match the first tile color
	if (tileColors.length > 0) {
		var color = tileColors[0];
		bitsy.color(backgroundIndex, color[0], color[1], color[2]);
	}
	else {
		// as a fallback, use black as the background
		bitsy.log("no tile colors!");
		bitsy.color(backgroundIndex, 0, 0, 0);
	}

	// textbox colors
	bitsy.color(textBackgroundIndex, 0, 0, 0); // black
	bitsy.color(textArrowIndex, 255, 255, 255); // white
	bitsy.color(textColorIndex, 255, 255, 255); // white

	// rainbow colors
	for (var i = 0; i < rainbowColorCount; i++) {
		var color = rainbowColors[i];
		bitsy.color(rainbowColorStartIndex + i, color[0], color[1], color[2]);
	}

	// tile colors
	for (var i = 0; i < tileColors.length; i++) {
		var color = tileColors[i];
		bitsy.color(tileColorStartIndex + i, color[0], color[1], color[2]);
	}
}

function updatePalette(palId) {
	state.pal = palId;
	var pal = palette[state.pal];
	updatePaletteWithTileColors(pal.colors);
}

function initRoom(roomId) {
	bitsy.log("init room " + roomId);

	updatePalette(getRoomPal(roomId));

	// update avatar appearance
	state.ava = (room[roomId].ava != null) ? room[roomId].ava : playerId;

	if (renderer) {
		renderer.ClearCache();
	}

	// init exit properties
	state.exits = [];
	for (var i = 0; i < room[roomId].exits.length; i++) {
		var exit = createExitData(
			/* x 			*/ room[roomId].exits[i].x,
			/* y 			*/ room[roomId].exits[i].y,
			/* destRoom 	*/ room[roomId].exits[i].dest.room,
			/* destX 		*/ room[roomId].exits[i].dest.x,
			/* destY 		*/ room[roomId].exits[i].dest.y,
			/* transition 	*/ room[roomId].exits[i].transition_effect,
			/* dlg 			*/ room[roomId].exits[i].dlg);
		exit.property = { locked: false };

		state.exits.push(exit);
	}

	// init ending properties
	state.endings = [];
	for (var i = 0; i < room[roomId].endings.length; i++) {
		var end = createEndingData(
			/* id */ room[roomId].endings[i].id,
			/* x  */ room[roomId].endings[i].x,
			/* y  */ room[roomId].endings[i].y);
		end.property = { locked: false };

		state.endings.push(end);
	}

	if (soundPlayer) {
		if (!room[roomId].tune || room[roomId].tune === "0" || !tune[room[roomId].tune]) {
			// stop music
			state.tune = "0";
			soundPlayer.stopTune();
		}
		else if (room[roomId].tune != state.tune) {
			// start music
			state.tune = room[roomId].tune;
			soundPlayer.playTune(tune[state.tune]);
		}
	}

	var drawArgs = { redrawAll: true };
	drawRoom(room[roomId], drawArgs);

	if (onInitRoom) {
		onInitRoom(roomId);
	}
}

function getItemIndex( roomId, x, y ) {
	for( var i = 0; i < room[roomId].items.length; i++ ) {
		var itm = room[roomId].items[i];
		if ( itm.x == x && itm.y == y)
			return i;
	}
	return -1;
}

function getSpriteLeft() { //repetitive?
	return getSpriteAt( player().x - 1, player().y );
}

function getSpriteRight() {
	return getSpriteAt( player().x + 1, player().y );
}

function getSpriteUp() {
	return getSpriteAt( player().x, player().y - 1 );
}

function getSpriteDown() {
	return getSpriteAt( player().x, player().y + 1 );
}

function isWallLeft() {
	return (player().x - 1 < 0) || isWall( player().x - 1, player().y );
}

function isWallRight() {
	return (player().x + 1 >= bitsy.MAP_SIZE) || isWall(player().x + 1, player().y);
}

function isWallUp() {
	return (player().y - 1 < 0) || isWall( player().x, player().y - 1 );
}

function isWallDown() {
	return (player().y + 1 >= bitsy.MAP_SIZE) || isWall(player().x, player().y + 1);
}

function isWall(x, y, roomId) {
	if (roomId == undefined || roomId == null) {
		roomId = state.room;
	}

	var tileId = getTile(x, y, roomId);
	if (tileId === '0') {
		return false; // Blank spaces aren't walls, ya doofus
	}

	if (tile[tileId].isWall === undefined || tile[tileId].isWall === null) {
		// No wall-state defined: check room-specific walls
		var i = room[roomId].walls.indexOf(getTile(x, y, roomId));
		return (i > -1);
	}

	// Otherwise, use the tile's own wall-state
	return tile[tileId].isWall;
}

function getItem(roomId,x,y) {
	for (i in room[roomId].items) {
		var item = room[roomId].items[i];
		if (x == item.x && y == item.y) {
			return item;
		}
	}
	return null;
}

// todo : roomId isn't useful in these functions anymore! safe to remove?
function getExit(roomId, x, y) {
	for (i in state.exits) {
		var e = state.exits[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getEnding(roomId, x, y) {
	for (i in state.endings) {
		var e = state.endings[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getTile(x, y, roomId) {
	// bitsy.log(x + " " + y);
	var t = getRoom(roomId).tilemap[y][x];
	return t;
}

function player() {
	return sprite[playerId];
}

// Sort of a hack for legacy palette code (when it was just an array)
function getPal(id) {
	if (palette[id] === undefined) {
		id = "default";
	}

	return palette[ id ].colors;
}

function getRoom(id) {
	return room[id === undefined ? state.room : id];
}

function isSpriteOffstage(id) {
	return sprite[id].room == null;
}

function serializeNote(note, key, useFriendlyName) {
	var isSolfa = (key != undefined && key != null);
	var noteType = (isSolfa === true) ? Solfa : Note;

	if (isSolfa && key.scale.indexOf(note) === -1) {
		// no matching note in key
		return null;
	}

	if (isSolfa && useFriendlyName != true) {
		for (var name in Solfa) {
			if (Solfa[name] === note) {
				return name.toLowerCase();
			}
		}

		// no solfa note found
		return null;
	}

	// for a solfa note's "friendly name" convert to the chromatic equivalent
	if (isSolfa && useFriendlyName === true) {
		note = key.notes[note];
	}

	// from this point on, we know the note we're looking for is chromatic
	for (var name in Note) {
		if (Note[name] === note) {
			name = name.replace("_SHARP", "#");
			if (useFriendlyName === true && name === "H") {
				name = "C";
			}
			return name;
		}
	}

	// no note found
	return symbol;
}

function serializeOctave(octave) {
	for (var symbol in Octave) {
		if (Octave[symbol] === octave) {
			return symbol;
		}
	}

	// default to middle octave
	return "4";
}

//TODO this is in progress and doesn't support all features
function serializeWorld(skipFonts) {
	if (skipFonts === undefined || skipFonts === null) {
		skipFonts = false;
	}

	// update version flags
	flags.VER_MAJ = version.major;
	flags.VER_MIN = version.minor;

	var worldStr = "";
	/* TITLE */
	worldStr += getTitle() + "\\n";
	worldStr += "\\n";
	/* VERSION */
	worldStr += "# BITSY VERSION " + getEngineVersion() + "\\n"; // add version as a comment for debugging purposes
	if (version.devBuildPhase != "RELEASE") {
		worldStr += "# DEVELOPMENT BUILD -- " + version.devBuildPhase;
	}
	worldStr += "\\n";
	/* FLAGS */
	for (f in flags) {
		worldStr += "! " + f + " " + flags[f] + "\\n";
	}
	worldStr += "\\n"
	/* FONT */
	if (fontName != defaultFontName) {
		worldStr += "DEFAULT_FONT " + fontName + "\\n";
		worldStr += "\\n"
	}
	if (textDirection != TextDirection.LeftToRight) {
		worldStr += "TEXT_DIRECTION " + textDirection + "\\n";
		worldStr += "\\n"
	}
	/* PALETTE */
	for (id in palette) {
		if (id != "default") {
			worldStr += "PAL " + id + "\\n";
			for (i in getPal(id)) {
				for (j in getPal(id)[i]) {
					worldStr += getPal(id)[i][j];
					if (j < 2) worldStr += ",";
				}
				worldStr += "\\n";
			}
			if (palette[id].name != null) {
				worldStr += "NAME " + palette[id].name + "\\n";
			}
			worldStr += "\\n";
		}
	}
	/* ROOM */
	for (id in room) {
		worldStr += "ROOM " + id + "\\n";
		if ( flags.ROOM_FORMAT == 0 ) {
			// old non-comma separated format
			for (i in room[id].tilemap) {
				for (j in room[id].tilemap[i]) {
					worldStr += room[id].tilemap[i][j];	
				}
				worldStr += "\\n";
			}
		}
		else if ( flags.ROOM_FORMAT == 1 ) {
			// new comma separated format
			for (i in room[id].tilemap) {
				for (j in room[id].tilemap[i]) {
					worldStr += room[id].tilemap[i][j];
					if (j < room[id].tilemap[i].length-1) worldStr += ","
				}
				worldStr += "\\n";
			}
		}
		if (room[id].name != null) {
			/* NAME */
			worldStr += "NAME " + room[id].name + "\\n";
		}
		if (room[id].walls.length > 0) {
			/* WALLS */
			worldStr += "WAL ";
			for (j in room[id].walls) {
				worldStr += room[id].walls[j];
				if (j < room[id].walls.length-1) {
					worldStr += ",";
				}
			}
			worldStr += "\\n";
		}
		if (room[id].items.length > 0) {
			/* ITEMS */
			for (j in room[id].items) {
				var itm = room[id].items[j];
				worldStr += "ITM " + itm.id + " " + itm.x + "," + itm.y;
				worldStr += "\\n";
			}
		}
		if (room[id].exits.length > 0) {
			/* EXITS */
			for (j in room[id].exits) {
				var e = room[id].exits[j];
				if ( isExitValid(e) ) {
					worldStr += "EXT " + e.x + "," + e.y + " " + e.dest.room + " " + e.dest.x + "," + e.dest.y;
					if (e.transition_effect != undefined && e.transition_effect != null) {
						worldStr += " FX " + e.transition_effect;
					}
					if (e.dlg != undefined && e.dlg != null) {
						worldStr += " DLG " + e.dlg;
					}
					worldStr += "\\n";
				}
			}
		}
		if (room[id].endings.length > 0) {
			/* ENDINGS */
			for (j in room[id].endings) {
				var e = room[id].endings[j];
				// todo isEndingValid
				worldStr += "END " + e.id + " " + e.x + "," + e.y;
				worldStr += "\\n";
			}
		}
		if (room[id].pal != null && room[id].pal != "default") {
			/* PALETTE */
			worldStr += "PAL " + room[id].pal + "\\n";
		}
		if (room[id].ava != null) {
			/* AVATAR SPRITE */
			worldStr += "AVA " + room[id].ava + "\\n";
		}
		if (room[id].tune != null && room[id].tune != "0") {
			/* TUNE */
			worldStr += "TUNE " + room[id].tune + "\\n";
		}
		worldStr += "\\n";
	}
	/* TILES */
	for (id in tile) {
		worldStr += "TIL " + id + "\\n";
		worldStr += serializeDrawing( "TIL_" + id );
		if (tile[id].name != null && tile[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + tile[id].name + "\\n";
		}
		if (tile[id].isWall != null && tile[id].isWall != undefined) {
			/* WALL */
			worldStr += "WAL " + tile[id].isWall + "\\n";
		}
		if (tile[id].col != null && tile[id].col != undefined && tile[id].col != 1) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + tile[id].col + "\\n";
		}
		if (tile[id].bgc != null && tile[id].bgc != undefined && tile[id].bgc != 0) {
			/* BACKGROUND COLOR OVERRIDE */
			if (tile[id].bgc < 0) {
				// transparent background
				worldStr += "BGC *\\n";
			}
			else {
				worldStr += "BGC " + tile[id].bgc + "\\n";
			}
		}
		worldStr += "\\n";
	}
	/* SPRITES */
	for (id in sprite) {
		worldStr += "SPR " + id + "\\n";
		worldStr += serializeDrawing( "SPR_" + id );
		if (sprite[id].name != null && sprite[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + sprite[id].name + "\\n";
		}
		if (sprite[id].dlg != null) {
			worldStr += "DLG " + sprite[id].dlg + "\\n";
		}
		if (sprite[id].room != null) {
			/* SPRITE POSITION */
			worldStr += "POS " + sprite[id].room + " " + sprite[id].x + "," + sprite[id].y + "\\n";
		}
		if (sprite[id].inventory != null) {
			for(itemId in sprite[id].inventory) {
				worldStr += "ITM " + itemId + " " + sprite[id].inventory[itemId] + "\\n";
			}
		}
		if (sprite[id].col != null && sprite[id].col != undefined && sprite[id].col != 2) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + sprite[id].col + "\\n";
		}
		if (sprite[id].bgc != null && sprite[id].bgc != undefined && sprite[id].bgc != 0) {
			/* BACKGROUND COLOR OVERRIDE */
			if (sprite[id].bgc < 0) {
				// transparent background
				worldStr += "BGC *\\n";
			}
			else {
				worldStr += "BGC " + sprite[id].bgc + "\\n";
			}
		}
		if (sprite[id].blip != null && sprite[id].blip != undefined) {
			/* BLIP */
			worldStr += "BLIP " + sprite[id].blip + "\\n";
		}
		worldStr += "\\n";
	}
	/* ITEMS */
	for (id in item) {
		worldStr += "ITM " + id + "\\n";
		worldStr += serializeDrawing( "ITM_" + id );
		if (item[id].name != null && item[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + item[id].name + "\\n";
		}
		if (item[id].dlg != null) {
			worldStr += "DLG " + item[id].dlg + "\\n";
		}
		if (item[id].col != null && item[id].col != undefined && item[id].col != 2) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + item[id].col + "\\n";
		}
		if (item[id].bgc != null && item[id].bgc != undefined && item[id].bgc != 0) {
			/* BACKGROUND COLOR OVERRIDE */
			if (item[id].bgc < 0) {
				// transparent background
				worldStr += "BGC *\\n";
			}
			else {
				worldStr += "BGC " + item[id].bgc + "\\n";
			}
		}
		if (item[id].blip != null && item[id].blip != undefined) {
			/* BLIP */
			worldStr += "BLIP " + item[id].blip + "\\n";
		}
		worldStr += "\\n";
	}
	/* DIALOG */
	for (id in dialog) {
		if (id != titleDialogId) {
			worldStr += "DLG " + id + "\\n";
			worldStr += dialog[id].src + "\\n";
			if (dialog[id].name != null) {
				worldStr += "NAME " + dialog[id].name + "\\n";
			}
			worldStr += "\\n";
		}
	}
	/* ENDINGS (for backwards compability only) */
	for (id in end) {
		worldStr += "END " + id + "\\n";
		worldStr += end[id].src + "\\n";
		worldStr += "\\n";
	}
	/* VARIABLES */
	for (id in variable) {
		worldStr += "VAR " + id + "\\n";
		worldStr += variable[id] + "\\n";
		worldStr += "\\n";
	}
	/* TUNES */
	for (id in tune) {
		if (id === "0") {
			continue;
		}

		worldStr += "TUNE " + id + "\\n";
		for (var i = 0; i < maxTuneLength && i < tune[id].melody.length; i++) {
			// MELODY
			for (var j = 0; j < barLength; j++) {
				var noteStr = serializeNote(tune[id].melody[i][j].note, tune[id].key);
				if (noteStr === null) {
					tune[id].melody[i][j].beats = 0;
				}
				if (tune[id].melody[i][j].beats != 1) {
					worldStr += tune[id].melody[i][j].beats;
				}
				if (tune[id].melody[i][j].beats > 0) {
					worldStr += noteStr;
				}
				if (tune[id].melody[i][j].beats > 0 && tune[id].melody[i][j].octave != Octave[4]) {
					worldStr += serializeOctave(tune[id].melody[i][j].octave);
				}
				if (tune[id].melody[i][j].beats > 0 && tune[id].melody[i][j].blip != undefined) {
					// todo : create constant for the blip separator?
					worldStr += "~" + tune[id].melody[i][j].blip;
				}
				if (j < 15) {
					worldStr += ",";
				}
			}
			worldStr += "\\n";

			// HARMONY
			// todo : lots of copy-pasting - I could probably make some helper functions to simplify this
			for (var j = 0; j < barLength; j++) {
				var noteStr = serializeNote(tune[id].harmony[i][j].note, tune[id].key);
				if (noteStr === null) {
					tune[id].harmony[i][j].beats = 0;
				}
				if (tune[id].harmony[i][j].beats != 1) {
					worldStr += tune[id].harmony[i][j].beats;
				}
				if (tune[id].harmony[i][j].beats > 0) {
					worldStr += noteStr;
				}
				if (tune[id].harmony[i][j].beats > 0 && tune[id].harmony[i][j].octave != Octave[4]) {
					worldStr += serializeOctave(tune[id].harmony[i][j].octave);
				}
				if (tune[id].harmony[i][j].beats > 0 && tune[id].harmony[i][j].blip != undefined) {
					worldStr += "~" + tune[id].harmony[i][j].blip;
				}
				if (j < 15) {
					worldStr += ",";
				}
			}
			worldStr += "\\n";

			if (i < (tune[id].melody.length - 1)) {
				worldStr += ">";
				worldStr += "\\n";
			}
		}
		if (tune[id].name != null) {
			/* NAME */
			worldStr += "NAME " + tune[id].name + "\\n";
		}
		if (tune[id].key != undefined && tune[id].key != null) {
			worldStr += "KEY ";
			for (var i = 0; i < Solfa.COUNT; i++) {
				worldStr += serializeNote(tune[id].key.notes[i]);
				if (i < Solfa.COUNT - 1) {
					worldStr += ",";
				}
			}
			worldStr += " ";
			for (var i = 0; i < tune[id].key.scale.length; i++) {
				worldStr += serializeNote(tune[id].key.scale[i], tune[id].key);
				if (i < tune[id].key.scale.length - 1) {
					worldStr += ",";
				}
			}
			worldStr += "\\n";
		}
		worldStr += "TMP ";
		switch (tune[id].tempo) {
			case Tempo.SLW:
				worldStr += "SLW";
				break;
			case Tempo.MED:
				worldStr += "MED";
				break;
			case Tempo.FST:
				worldStr += "FST";
				break;
			case Tempo.XFST:
				worldStr += "XFST";
				break;
		}
		worldStr += "\\n";
		worldStr += "SQR ";
		switch (tune[id].instrumentA) {
			case SquareWave.P8:
				worldStr += "P8";
				break;
			case SquareWave.P4:
				worldStr += "P4";
				break;
			case SquareWave.P2:
				worldStr += "P2";
				break;
		}
		worldStr += " ";
		switch (tune[id].instrumentB) {
			case SquareWave.P8:
				worldStr += "P8";
				break;
			case SquareWave.P4:
				worldStr += "P4";
				break;
			case SquareWave.P2:
				worldStr += "P2";
				break;
		}
		worldStr += "\\n";
		if (tune[id].key != undefined && tune[id].key != null && tune[id].arpeggioPattern != ArpeggioPattern.OFF) {
			switch (tune[id].arpeggioPattern) {
				case ArpeggioPattern.UP:
					worldStr += "ARP UP\\n";
					break;
				case ArpeggioPattern.DWN:
					worldStr += "ARP DWN\\n";
					break;
				case ArpeggioPattern.INT5:
					worldStr += "ARP INT5\\n";
					break;
				case ArpeggioPattern.INT8:
					worldStr += "ARP INT8\\n";
					break;
			}
		}
		worldStr += "\\n";
	}
	/* BLIP */
	for (id in blip) {
		if (id === "0") {
			continue;
		}

		worldStr += "BLIP " + id + "\\n";
		// pitches
		if (blip[id].pitchA.beats > 0) {
			worldStr += serializeNote(blip[id].pitchA.note);
			if (blip[id].pitchA.octave != Octave[4]) {
				worldStr += serializeOctave(blip[id].pitchA.octave);
			}
		}
		else {
			worldStr += blip[id].pitchA.beats;
		}
		worldStr += ",";
		if (blip[id].pitchB.beats > 0) {
			worldStr += serializeNote(blip[id].pitchB.note);
			if (blip[id].pitchB.octave != Octave[4]) {
				worldStr += serializeOctave(blip[id].pitchB.octave);
			}
		}
		else {
			worldStr += blip[id].pitchB.beats;
		}
		worldStr += ",";
		if (blip[id].pitchC.beats > 0) {
			worldStr += serializeNote(blip[id].pitchC.note);
			if (blip[id].pitchC.octave != Octave[4]) {
				worldStr += serializeOctave(blip[id].pitchC.octave);
			}
		}
		else {
			worldStr += blip[id].pitchC.beats;
		}
		worldStr += "\\n";
		if (blip[id].name != null) {
			/* NAME */
			worldStr += "NAME " + blip[id].name + "\\n";
		}
		// envelope
		worldStr += "ENV " + blip[id].envelope.attack
			+ " " + blip[id].envelope.decay
			+ " " + blip[id].envelope.sustain
			+ " " + blip[id].envelope.length
			+ " " + blip[id].envelope.release + "\\n";
		// beat
		worldStr += "BEAT " + blip[id].beat.time
			+ " " + blip[id].beat.delay + "\\n";
		// instrument (square wave type)
		worldStr += "SQR ";
		switch (blip[id].instrument) {
			case SquareWave.P8:
				worldStr += "P8";
				break;
			case SquareWave.P4:
				worldStr += "P4";
				break;
			case SquareWave.P2:
				worldStr += "P2";
				break;
		}
		worldStr += "\\n";
		// other parameters
		if (blip[id].doRepeat === true) {
			worldStr += "RPT 1\\n";
		}
		// TODO : consider for future update
		// if (blip[id].doSlide === true) {
		// 	worldStr += "SLD 1\\n";
		// }
		worldStr += "\\n";
	}
	/* FONT */
	// TODO : support multiple fonts
	if (fontManager && fontName != defaultFontName && !skipFonts) {
		worldStr += fontManager.GetData(fontName);
	}

	return worldStr;
}

function serializeDrawing(drwId) {
	if (!renderer) {
		return "";
	}

	var drawingData = renderer.GetDrawingSource(drwId);
	var drwStr = "";
	for (f in drawingData) {
		for (y in drawingData[f]) {
			var rowStr = "";
			for (x in drawingData[f][y]) {
				rowStr += drawingData[f][y][x];
			}
			drwStr += rowStr + "\\n";
		}
		if (f < (drawingData.length-1)) drwStr += ">\\n";
	}
	return drwStr;
}

function isExitValid(e) {
	var hasValidStartPos = e.x >= 0 && e.x < bitsy.MAP_SIZE && e.y >= 0 && e.y < bitsy.MAP_SIZE;
	var hasDest = e.dest != null;
	var hasValidRoomDest = (e.dest.room != null && e.dest.x >= 0 && e.dest.x < bitsy.MAP_SIZE && e.dest.y >= 0 && e.dest.y < bitsy.MAP_SIZE);
	return hasValidStartPos && hasDest && hasValidRoomDest;
}

function setTile(mapId, x, y, tileId) {
	bitsy.set(mapId, (y * bitsy.MAP_SIZE) + x, tileId);
}

function drawTile(tileId, x, y) {
	setTile(bitsy.MAP1, x, y, tileId);
}

function drawSprite(tileId, x, y) {
	setTile(bitsy.MAP2, x, y, tileId);
}

function drawItem(tileId, x, y) {
	setTile(bitsy.MAP2, x, y, tileId);
}

// var debugLastRoomDrawn = "0";

function clearRoom() {
	var paletteId = "default";

	if (room === undefined) {
		// protect against invalid rooms
		return;
	}

	if (room.pal != null && palette[paletteId] != undefined) {
		paletteId = room.pal;
	}

	// clear background & foreground
	bitsy.fill(bitsy.MAP1, 0);
	bitsy.fill(bitsy.MAP2, 0);
}

function drawRoomBackground(room, frameIndex, redrawAnimatedOnly) {
	if (!redrawAnimatedOnly) {
		// clear background map
		bitsy.fill(bitsy.MAP1, 0);
	}

	// NOTE: interestingly the slowest part of this is iterating over all the tiles, not actually drawing them
	for (var y = 0; y < bitsy.MAP_SIZE; y++) {
		for (var x = 0; x < bitsy.MAP_SIZE; x++) {
			var id = room.tilemap[y][x];

			if (id != "0" && tile[id] == null) { // hack-around to avoid corrupting files (not a solution though!)
				id = "0";
				room.tilemap[y][x] = id;
			}

			if (id != "0" && (!redrawAnimatedOnly || tile[id].animation.isAnimated)) {
				drawTile(getTileFrame(tile[id], frameIndex), x, y);
			}
		}
	}
}

function drawRoomForeground(room, frameIndex, redrawAnimatedOnly) {
	if (!redrawAnimatedOnly) {
		// clear foreground map
		bitsy.fill(bitsy.MAP2, 0);
	}

	// draw items
	for (var i = 0; i < room.items.length; i++) {
		var itm = room.items[i];
		if (!redrawAnimatedOnly || item[itm.id].animation.isAnimated) {
			drawItem(getItemFrame(item[itm.id], frameIndex), itm.x, itm.y);
		}
	}

	// draw sprites
	for (id in sprite) {
		var spr = sprite[id];
		if (id != playerId && spr.room === room.id && (!redrawAnimatedOnly || spr.animation.isAnimated)) {
			drawSprite(getSpriteFrame(spr, frameIndex), spr.x, spr.y);
		}
	}
}

function drawRoomForegroundTile(room, frameIndex, x, y) {
	// draw items
	for (var i = 0; i < room.items.length; i++) {
		var itm = room.items[i];
		if (itm.x === x && itm.y === y) {
			drawItem(getItemFrame(item[itm.id], frameIndex), itm.x, itm.y);
		}
	}

	// draw sprites
	for (id in sprite) {
		var spr = sprite[id];
		if (id != playerId && spr.room === room.id && spr.x === x && spr.y === y) {
			drawSprite(getSpriteFrame(spr, frameIndex), spr.x, spr.y);
		}
	}
}

function drawRoom(room, args) {
	if (room === undefined || isNarrating) {
		// protect against invalid rooms
		return;
	}

	var redrawAll = args && (args.redrawAll === true);
	var redrawAnimated = args && (args.redrawAnimated === true);
	var redrawAvatar = args && (args.redrawAvatar === true);
	var frameIndex = args ? args.frameIndex : undefined;

	// if *only* redrawing the avatar, first clear its previous position
	if (redrawAvatar) {
		setTile(bitsy.MAP2, playerPrevX, playerPrevY, 0);
		// also redraw any sprite or item that might be "under" the player (todo: possible perf issue?)
		drawRoomForegroundTile(room, frameIndex, playerPrevX, playerPrevY);
	}

	// draw background & foreground tiles
	if (redrawAll || redrawAnimated) {
		// draw tiles
		drawRoomBackground(room, frameIndex, redrawAnimated);
		// draw sprites & items
		drawRoomForeground(room, frameIndex, redrawAnimated);
	}

	// draw the player's avatar at its current position
	if ((redrawAll || redrawAnimated || redrawAvatar) && sprite[playerId] && sprite[playerId].room === room.id) {
		var spr = sprite[playerId];
		var x = spr.x;
		var y = spr.y;

		// get the avatar override sprite (if there is one)
		if (state.ava && state.ava != playerId && sprite[state.ava]) {
			spr = sprite[state.ava];
		}

		drawSprite(getSpriteFrame(spr, frameIndex), x, y);
	}
}

// TODO : remove these get*Image methods
function getTileFrame(t, frameIndex) {
	if (!renderer) {
		return null;
	}
	return renderer.GetDrawingFrame(t, frameIndex);
}

function getSpriteFrame(s, frameIndex) {
	if (!renderer) {
		return null;
	}
	return renderer.GetDrawingFrame(s, frameIndex);
}

function getItemFrame(itm, frameIndex) {
	if (!renderer) {
		return null;
	}
	return renderer.GetDrawingFrame(itm, frameIndex);
}

function curDefaultPal() {
	return getRoomPal(state.room);
}

function getRoomPal(roomId) {
	var defaultId = "default";

	if (roomId == null) {
		return defaultId;
	}
	else if (room[roomId].pal != null) {
		//a specific palette was chosen
		return room[roomId].pal;
	}
	else {
		if (roomId in palette) {
			//there is a palette matching the name of the room
			return roomId;
		}
		else {
			//use the default palette
			return defaultId;
		}
	}
	return defaultId;
}

var isDialogMode = false;
var isNarrating = false;
var isEnding = false;

var dialogModule;
var dialogRenderer;
var dialogBuffer;
if (engineFeatureFlags.isDialogEnabled) {
	dialogModule = new Dialog();
	dialogRenderer = dialogModule.CreateRenderer();
	dialogBuffer = dialogModule.CreateBuffer();
}

var fontManager;
if (engineFeatureFlags.isFontEnabled) {
	fontManager = new FontManager();
}

// TODO : is this scriptResult thing being used anywhere???
function onExitDialog(scriptResult, dialogCallback) {
	isDialogMode = false;
	bitsy.textbox(false);

	if (isNarrating) {
		isNarrating = false;

		// redraw the room
		drawRoom(room[state.room], { redrawAll: true });
	}

	if (isDialogPreview) {
		isDialogPreview = false;

		if (onDialogPreviewEnd != null) {
			onDialogPreviewEnd();
		}
	}

	if (dialogCallback != undefined && dialogCallback != null) {
		dialogCallback(scriptResult);
	}

	if (soundPlayer) {
		soundPlayer.resumeTune();
	}
}

/*
TODO
- titles and endings should also take advantage of the script pre-compilation if possible??
- could there be a namespace collision?
- what about dialog NAMEs vs IDs?
- what about a special script block separate from DLG?
*/
function startNarrating(dialogStr, end) {
	bitsy.log("NARRATE " + dialogStr);

	if(end === undefined) {
		end = false;
	}

	isNarrating = true;
	isEnding = end;

	if (isEnding && soundPlayer) {
		soundPlayer.stopTune();
	}

	// clear the room tiles before narrating
	bitsy.fill(bitsy.MAP1, 0);
	bitsy.fill(bitsy.MAP2, 0);

	startDialog(dialogStr);
}

function startEndingDialog(ending) {
	isNarrating = true;
	isEnding = true;

	var endingScriptId = ending.id;
	var endingDialogStr = dialog[ending.id].src;

	// compatibility with pre-7.0 endings
	if (flags.DLG_COMPAT === 1 && end[ending.id]) {
		endingScriptId = "end_compat_" + ending.id;
		endingDialogStr = end[ending.id].src;
	}

	var tmpTuneId = null;
	if (isEnding && soundPlayer) {
		tmpTuneId = soundPlayer.getCurTuneId();
		soundPlayer.stopTune();
	}

	startDialog(
		endingDialogStr,
		endingScriptId,
		function() {
			var isLocked = ending.property && ending.property.locked === true;
			if (isLocked) {
				isEnding = false;

				// if the ending was cancelled, restart the music
				// todo : should it resume from where it started? (right now it starts over)
				if (tmpTuneId && soundPlayer && !soundPlayer.isTunePlaying()) {
					soundPlayer.playTune(tune[tmpTuneId]);
				}
			}
		},
		ending);
}

function startItemDialog(itemId, dialogCallback) {
	var dialogId = item[itemId].dlg;
	// bitsy.log("START ITEM DIALOG " + dialogId);
	if (dialog[dialogId]) {
		var dialogStr = dialog[dialogId].src;
		startDialog(dialogStr, dialogId, dialogCallback);
	}
	else {
		dialogCallback();
	}
}

function startSpriteDialog(spriteId) {
	var spr = sprite[spriteId];
	var dialogId = spr.dlg;

	// back compat for when dialog IDs were implicitly the same as sprite IDs
	if (flags.DLG_COMPAT === 1 && (dialogId === undefined || dialogId === null)) {
		dialogId = spr.id;
	}

	// bitsy.log("START SPRITE DIALOG " + dialogId);
	if (dialog[dialogId]){
		var dialogStr = dialog[dialogId].src;
		startDialog(dialogStr, dialogId);
	}
}

function startDialog(dialogStr, scriptId, dialogCallback, objectContext) {
	bitsy.log("START DIALOG");

	if (soundPlayer) {
		soundPlayer.pauseTune();
	}

	if (dialogStr.length <= 0) {
		onExitDialog(null, dialogCallback);
		return;
	}

	if (!dialogBuffer) {
		bitsy.log(dialogStr);
		onExitDialog(null, dialogCallback);
		return;
	}

	if (!scriptInterpreter) {
		dialogRenderer.Reset();
		dialogRenderer.SetCentered(isNarrating /*centered*/);
		dialogBuffer.Reset();
		dialogBuffer.AddText(dialogStr);
		dialogBuffer.OnDialogEnd(function() {
			onExitDialog(null, dialogCallback);
		});
		bitsy.log("dialog start end");
		return;
	};

	isDialogMode = true;

	dialogRenderer.Reset();
	dialogRenderer.SetCentered(isNarrating /*centered*/);
	dialogBuffer.Reset();
	scriptInterpreter.SetDialogBuffer(dialogBuffer);

	var onScriptEnd = function(scriptResult) {
		dialogBuffer.OnDialogEnd(function() {
			onExitDialog(scriptResult, dialogCallback);
		});
	};

	if (scriptId === undefined) { // TODO : what's this for again?
		scriptInterpreter.Interpret(dialogStr, onScriptEnd);
	}
	else {
		if (!scriptInterpreter.HasScript(scriptId)) {
			scriptInterpreter.Compile(scriptId, dialogStr);
		}
		// scriptInterpreter.DebugVisualizeScript(scriptId);
		scriptInterpreter.Run(scriptId, onScriptEnd, objectContext);
	}

}

var isDialogPreview = false;
function startPreviewDialog(script, dialogCallback) {
	if (!scriptInterpreter || !dialogBuffer) {
		return;
	}

	isNarrating = true;

	isDialogMode = true;

	isDialogPreview = true;

	dialogRenderer.Reset();
	dialogRenderer.SetCentered(true);
	dialogBuffer.Reset();
	scriptInterpreter.SetDialogBuffer(dialogBuffer);

	// TODO : do I really need a seperate callback for this debug mode??
	onDialogPreviewEnd = dialogCallback;

	var onScriptEndCallback = function(scriptResult) {
		dialogBuffer.OnDialogEnd(function() {
			onExitDialog(scriptResult, null);
		});
	};

	scriptInterpreter.Eval(script, onScriptEndCallback);
}

/* NEW SCRIPT STUFF */
var scriptModule;
var scriptInterpreter;
var scriptUtils;
// scriptInterpreter.SetDialogBuffer( dialogBuffer );
if (engineFeatureFlags.isScriptEnabled) {
	bitsy.log("init script module");
	scriptModule = new Script();
	bitsy.log("init interpreter");
	scriptInterpreter = scriptModule.CreateInterpreter();
	bitsy.log("init utils");
	scriptUtils = scriptModule.CreateUtils(); // TODO: move to editor.js?
	bitsy.log("init script module end");
}

/* SOUND */
var soundPlayer;
if (engineFeatureFlags.isSoundEnabled) {
	soundPlayer = new SoundPlayer();
}

/* EVENTS */
bitsy.loop(update);
<\/script>

<!-- store default font in separate script tag for back compat-->
<script type="text/bitsyFontData" id="ascii_small">
FONT ascii_small
SIZE 6 8
CHAR 0
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 32
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 33
000100
001110
001110
000100
000100
000000
000100
000000
CHAR 34
011011
011011
010010
000000
000000
000000
000000
000000
CHAR 8220
011011
011011
010010
000000
000000
000000
000000
000000
CHAR 8221
011011
011011
010010
000000
000000
000000
000000
000000
CHAR 35
000000
001010
011111
001010
001010
011111
001010
000000
CHAR 36
001000
001110
010000
001100
000010
011100
000100
000000
CHAR 37
011001
011001
000010
000100
001000
010011
010011
000000
CHAR 38
001000
010100
010100
001000
010101
010010
001101
000000
CHAR 39
001100
001100
001000
000000
000000
000000
000000
000000
CHAR 8216
001100
001100
001000
000000
000000
000000
000000
000000
CHAR 8217
001100
001100
001000
000000
000000
000000
000000
000000
CHAR 40
000100
001000
001000
001000
001000
001000
000100
000000
CHAR 41
001000
000100
000100
000100
000100
000100
001000
000000
CHAR 42
000000
001010
001110
011111
001110
001010
000000
000000
CHAR 43
000000
000100
000100
011111
000100
000100
000000
000000
CHAR 44
000000
000000
000000
000000
000000
001100
001100
001000
CHAR 45
000000
000000
000000
011111
000000
000000
000000
000000
CHAR 46
000000
000000
000000
000000
000000
001100
001100
000000
CHAR 47
000000
000001
000010
000100
001000
010000
000000
000000
CHAR 48
001110
010001
010011
010101
011001
010001
001110
000000
CHAR 49
000100
001100
000100
000100
000100
000100
001110
000000
CHAR 50
001110
010001
000001
000110
001000
010000
011111
000000
CHAR 51
001110
010001
000001
001110
000001
010001
001110
000000
CHAR 52
000010
000110
001010
010010
011111
000010
000010
000000
CHAR 53
011111
010000
010000
011110
000001
010001
001110
000000
CHAR 54
000110
001000
010000
011110
010001
010001
001110
000000
CHAR 55
011111
000001
000010
000100
001000
001000
001000
000000
CHAR 56
001110
010001
010001
001110
010001
010001
001110
000000
CHAR 57
001110
010001
010001
001111
000001
000010
001100
000000
CHAR 58
000000
000000
001100
001100
000000
001100
001100
000000
CHAR 59
000000
000000
001100
001100
000000
001100
001100
001000
CHAR 60
000010
000100
001000
010000
001000
000100
000010
000000
CHAR 61
000000
000000
011111
000000
000000
011111
000000
000000
CHAR 62
001000
000100
000010
000001
000010
000100
001000
000000
CHAR 63
001110
010001
000001
000110
000100
000000
000100
000000
CHAR 64
001110
010001
010111
010101
010111
010000
001110
000000
CHAR 65
001110
010001
010001
010001
011111
010001
010001
000000
CHAR 66
011110
010001
010001
011110
010001
010001
011110
000000
CHAR 67
001110
010001
010000
010000
010000
010001
001110
000000
CHAR 68
011110
010001
010001
010001
010001
010001
011110
000000
CHAR 69
011111
010000
010000
011110
010000
010000
011111
000000
CHAR 70
011111
010000
010000
011110
010000
010000
010000
000000
CHAR 71
001110
010001
010000
010111
010001
010001
001111
000000
CHAR 72
010001
010001
010001
011111
010001
010001
010001
000000
CHAR 73
001110
000100
000100
000100
000100
000100
001110
000000
CHAR 74
000001
000001
000001
000001
010001
010001
001110
000000
CHAR 75
010001
010010
010100
011000
010100
010010
010001
000000
CHAR 76
010000
010000
010000
010000
010000
010000
011111
000000
CHAR 77
010001
011011
010101
010001
010001
010001
010001
000000
CHAR 78
010001
011001
010101
010011
010001
010001
010001
000000
CHAR 79
001110
010001
010001
010001
010001
010001
001110
000000
CHAR 80
011110
010001
010001
011110
010000
010000
010000
000000
CHAR 81
001110
010001
010001
010001
010101
010010
001101
000000
CHAR 82
011110
010001
010001
011110
010010
010001
010001
000000
CHAR 83
001110
010001
010000
001110
000001
010001
001110
000000
CHAR 84
011111
000100
000100
000100
000100
000100
000100
000000
CHAR 85
010001
010001
010001
010001
010001
010001
001110
000000
CHAR 86
010001
010001
010001
010001
010001
001010
000100
000000
CHAR 87
010001
010001
010101
010101
010101
010101
001010
000000
CHAR 88
010001
010001
001010
000100
001010
010001
010001
000000
CHAR 89
010001
010001
010001
001010
000100
000100
000100
000000
CHAR 90
011110
000010
000100
001000
010000
010000
011110
000000
CHAR 91
001110
001000
001000
001000
001000
001000
001110
000000
CHAR 92
000000
010000
001000
000100
000010
000001
000000
000000
CHAR 93
001110
000010
000010
000010
000010
000010
001110
000000
CHAR 94
000100
001010
010001
000000
000000
000000
000000
000000
CHAR 95
000000
000000
000000
000000
000000
000000
000000
111111
CHAR 96
001100
001100
000100
000000
000000
000000
000000
000000
CHAR 97
000000
000000
001110
000001
001111
010001
001111
000000
CHAR 98
010000
010000
011110
010001
010001
010001
011110
000000
CHAR 99
000000
000000
001110
010001
010000
010001
001110
000000
CHAR 100
000001
000001
001111
010001
010001
010001
001111
000000
CHAR 101
000000
000000
001110
010001
011110
010000
001110
000000
CHAR 102
000110
001000
001000
011110
001000
001000
001000
000000
CHAR 103
000000
000000
001111
010001
010001
001111
000001
001110
CHAR 104
010000
010000
011100
010010
010010
010010
010010
000000
CHAR 105
000100
000000
000100
000100
000100
000100
000110
000000
CHAR 106
000010
000000
000110
000010
000010
000010
010010
001100
CHAR 107
010000
010000
010010
010100
011000
010100
010010
000000
CHAR 108
000100
000100
000100
000100
000100
000100
000110
000000
CHAR 109
000000
000000
011010
010101
010101
010001
010001
000000
CHAR 110
000000
000000
011100
010010
010010
010010
010010
000000
CHAR 111
000000
000000
001110
010001
010001
010001
001110
000000
CHAR 112
000000
000000
011110
010001
010001
010001
011110
010000
CHAR 113
000000
000000
001111
010001
010001
010001
001111
000001
CHAR 114
000000
000000
010110
001001
001000
001000
011100
000000
CHAR 115
000000
000000
001110
010000
001110
000001
001110
000000
CHAR 116
000000
001000
011110
001000
001000
001010
000100
000000
CHAR 117
000000
000000
010010
010010
010010
010110
001010
000000
CHAR 118
000000
000000
010001
010001
010001
001010
000100
000000
CHAR 119
000000
000000
010001
010001
010101
011111
001010
000000
CHAR 120
000000
000000
010010
010010
001100
010010
010010
000000
CHAR 121
000000
000000
010010
010010
010010
001110
000100
011000
CHAR 122
000000
000000
011110
000010
001100
010000
011110
000000
CHAR 123
000110
001000
001000
011000
001000
001000
000110
000000
CHAR 124
000100
000100
000100
000100
000100
000100
000100
000100
CHAR 125
001100
000010
000010
000011
000010
000010
001100
000000
CHAR 126
000000
000000
000000
001010
010100
000000
000000
000000
CHAR 160
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 161
000100
000000
000100
000100
001110
001110
000100
000000
CHAR 162
000000
000100
001110
010000
010000
001110
000100
000000
CHAR 163
000110
001001
001000
011110
001000
001001
010111
000000
CHAR 165
010001
001010
000100
011111
000100
011111
000100
000000
CHAR 167
001110
010001
001100
001010
000110
010001
001110
000000
CHAR 171
000000
000000
001001
010010
001001
000000
000000
000000
CHAR 172
000000
000000
111111
000001
000001
000000
000000
000000
CHAR 177
000000
000100
001110
000100
000000
001110
000000
000000
CHAR 178
011000
000100
001000
011100
000000
000000
000000
000000
CHAR 181
000000
000000
010010
010010
010010
011100
010000
010000
CHAR 182
001111
010101
010101
001101
000101
000101
000101
000000
CHAR 187
000000
000000
010010
001001
010010
000000
000000
000000
CHAR 188
010000
010010
010100
001011
010101
000111
000001
000000
CHAR 189
010000
010010
010100
001110
010001
000010
000111
000000
CHAR 191
000100
000000
000100
001100
010000
010001
001110
000000
CHAR 196
001010
000000
000100
001010
010001
011111
010001
000000
CHAR 197
001110
001010
001110
011011
010001
011111
010001
000000
CHAR 198
001111
010100
010100
011111
010100
010100
010111
000000
CHAR 199
001110
010001
010000
010000
010001
001110
000100
001100
CHAR 201
000011
000000
011111
010000
011110
010000
011111
000000
CHAR 209
001010
010100
000000
010010
011010
010110
010010
000000
CHAR 214
010010
001100
010010
010010
010010
010010
001100
000000
CHAR 220
001010
000000
010010
010010
010010
010010
001100
000000
CHAR 223
000000
011100
010010
011100
010010
010010
011100
010000
CHAR 224
001100
000000
001110
000001
001111
010001
001111
000000
CHAR 225
000110
000000
001110
000001
001111
010001
001111
000000
CHAR 226
001110
000000
001110
000001
001111
010001
001111
000000
CHAR 228
001010
000000
001110
000001
001111
010001
001111
000000
CHAR 229
001110
001010
001110
000001
001111
010001
001111
000000
CHAR 230
000000
000000
011110
000101
011111
010100
001111
000000
CHAR 231
000000
001110
010001
010000
010001
001110
000100
001100
CHAR 232
001100
000000
001110
010001
011110
010000
001110
000000
CHAR 233
000011
000000
001110
010001
011110
010000
001110
000000
CHAR 234
001110
000000
001110
010001
011110
010000
001110
000000
CHAR 235
001010
000000
001110
010001
011110
010000
001110
000000
CHAR 236
001000
000000
000100
000100
000100
000100
000110
000000
CHAR 237
000110
000000
000100
000100
000100
000100
000110
000000
CHAR 238
000100
001010
000000
000100
000100
000100
000110
000000
CHAR 239
001010
000000
000100
000100
000100
000100
000110
000000
CHAR 241
001010
010100
000000
011100
010010
010010
010010
000000
CHAR 242
011000
000000
001100
010010
010010
010010
001100
000000
CHAR 243
000110
000000
001100
010010
010010
010010
001100
000000
CHAR 244
001110
000000
001100
010010
010010
010010
001100
000000
CHAR 246
001010
000000
001100
010010
010010
010010
001100
000000
CHAR 247
001010
000000
001110
010001
010001
010001
001110
000000
CHAR 249
011000
000000
010010
010010
010010
010110
001010
000000
CHAR 250
000110
000000
010010
010010
010010
010110
001010
000000
CHAR 251
001110
000000
010010
010010
010010
010110
001010
000000
CHAR 252
010010
000000
010010
010010
010010
010110
001010
000000
CHAR 255
001010
000000
010010
010010
010010
001110
000100
011000
CHAR 402
000010
000101
000100
001110
000100
000100
010100
001000
CHAR 915
011110
010010
010000
010000
010000
010000
010000
000000
CHAR 920
001100
010010
010010
011110
010010
010010
001100
000000
CHAR 931
011111
010000
001000
000100
001000
010000
011111
000000
CHAR 934
001110
000100
001110
010001
001110
000100
001110
000000
CHAR 937
000000
001110
010001
010001
001010
001010
011011
000000
CHAR 948
001100
010000
001000
000100
001110
010010
001100
000000
CHAR 949
000000
001110
010000
011110
010000
001110
000000
000000
CHAR 960
000000
011111
001010
001010
001010
001010
001010
000000
CHAR 963
000000
000000
001111
010010
010010
001100
000000
000000
CHAR 964
000000
000000
001010
010100
000100
000100
000100
000000
CHAR 966
000000
000100
001110
010101
010101
001110
000100
000000
CHAR 8226
000000
000000
000000
001100
001100
000000
000000
000000
CHAR 8252
001010
001010
001010
001010
001010
000000
001010
000000
CHAR 8592
000000
000100
001100
011111
001100
000100
000000
000000
CHAR 8593
000100
001110
011111
000100
000100
000100
000100
000000
CHAR 8594
000000
000100
000110
011111
000110
000100
000000
000000
CHAR 8595
000100
000100
000100
000100
011111
001110
000100
000000
CHAR 8734
000000
000000
001010
010101
010101
001010
000000
000000
CHAR 8735
000000
000000
000000
010000
010000
010000
011111
000000
CHAR 8801
000000
011110
000000
011110
000000
011110
000000
000000
CHAR 8804
000010
001100
010000
001100
000010
000000
011110
000000
CHAR 8805
010000
001100
000010
001100
010000
000000
011110
000000
CHAR 8962
000100
001110
011011
010001
010001
011111
000000
000000
CHAR 8976
000000
000000
011111
010000
010000
010000
000000
000000
CHAR 9472
000000
000000
000000
111111
000000
000000
000000
000000
CHAR 9474
000100
000100
000100
000100
000100
000100
000100
000100
CHAR 9488
000000
000000
000000
111100
000100
000100
000100
000100
CHAR 9492
000100
000100
000100
000111
000000
000000
000000
000000
CHAR 9500
000100
000100
000100
000111
000100
000100
000100
000100
CHAR 9508
000100
000100
000100
111100
000100
000100
000100
000100
CHAR 9516
000000
000000
000000
111111
000100
000100
000100
000100
CHAR 9524
000100
000100
000100
111111
000000
000000
000000
000000
CHAR 9532
000100
000100
000100
111111
000100
000100
000100
000100
CHAR 9552
000000
111111
000000
111111
000000
000000
000000
000000
CHAR 9553
010100
010100
010100
010100
010100
010100
010100
010100
CHAR 9556
000000
011111
010000
010111
010100
010100
010100
010100
CHAR 9557
000000
111100
000100
111100
000100
000100
000100
000100
CHAR 9558
000000
000000
000000
111100
010100
010100
010100
010100
CHAR 9559
000000
111100
000100
110100
010100
010100
010100
010100
CHAR 9561
010100
010100
010100
011111
000000
000000
000000
000000
CHAR 9562
010100
010111
010000
011111
000000
000000
000000
000000
CHAR 9563
000100
111100
000100
111100
000000
000000
000000
000000
CHAR 9564
010100
010100
010100
111100
000000
000000
000000
000000
CHAR 9565
010100
110100
000100
111100
000000
000000
000000
000000
CHAR 9566
000100
000111
000100
000111
000100
000100
000100
000100
CHAR 9567
010100
010100
010100
010111
010100
010100
010100
010100
CHAR 9568
010100
010111
010000
010111
010100
010100
010100
010100
CHAR 9569
000000
000000
010010
010010
010010
011100
010000
010000
CHAR 9570
010100
010100
010100
110100
010100
010100
010100
010100
CHAR 9571
010100
110100
000100
110100
010100
010100
010100
010100
CHAR 9572
000000
111111
000000
111111
000100
000100
000100
000100
CHAR 9573
000000
000000
000000
111111
010100
010100
010100
010100
CHAR 9574
000000
111111
000000
110111
010100
010100
010100
010100
CHAR 9575
000100
111111
000000
111111
000000
000000
000000
000000
CHAR 9576
010100
010100
010100
111111
000000
000000
000000
000000
CHAR 9577
010100
110111
000000
111111
000000
000000
000000
000000
CHAR 9580
010100
110111
000000
110111
010100
010100
010100
010100
CHAR 9601
000000
000000
000000
000000
000000
000000
000000
111111
CHAR 9602
000000
000000
000000
000000
000000
000000
111111
111111
CHAR 9603
000000
000000
000000
000000
000000
111111
111111
111111
CHAR 9604
000000
000000
000000
000000
111111
111111
111111
111111
CHAR 9605
000000
000000
000000
111111
111111
111111
111111
111111
CHAR 9606
000000
000000
111111
111111
111111
111111
111111
111111
CHAR 9607
000000
111111
111111
111111
111111
111111
111111
111111
CHAR 9608
111111
111111
111111
111111
111111
111111
111111
111111
CHAR 9609
111100
111100
111100
111100
111100
111100
111100
111100
CHAR 9610
111100
111100
111100
111100
111100
111100
111100
111100
CHAR 9611
111000
111000
111000
111000
111000
111000
111000
111000
CHAR 9613
110000
110000
110000
110000
110000
110000
110000
110000
CHAR 9615
100000
100000
100000
100000
100000
100000
100000
100000
CHAR 9617
010101
000000
101010
000000
010101
000000
101010
000000
CHAR 9618
010101
101010
010101
101010
010101
101010
010101
101010
CHAR 9619
101010
111111
010101
111111
101010
111111
010101
111111
CHAR 9644
000000
000000
000000
000000
000000
011110
011110
000000
CHAR 9650
000100
000100
001110
001110
011111
011111
000000
000000
CHAR 9658
001000
001100
001110
001111
001110
001100
001000
000000
CHAR 9660
011111
011111
001110
001110
000100
000100
000000
000000
CHAR 9668
000010
000110
001110
011110
001110
000110
000010
000000
CHAR 9675
000000
000000
011110
010010
010010
011110
000000
000000
CHAR 9688
111111
111111
111111
110011
110011
111111
111111
111111
CHAR 9689
111111
111111
100001
101101
101101
100001
111111
111111
CHAR 9786
001110
010001
011011
010001
010101
010001
001110
000000
CHAR 9787
001110
011111
010101
011111
010001
011111
001110
000000
CHAR 9788
000000
010101
001110
011011
001110
010101
000000
000000
CHAR 9792
001110
010001
010001
001110
000100
001110
000100
000000
CHAR 9794
000000
000111
000011
001101
010010
010010
001100
000000
CHAR 9824
000000
000100
001110
011111
011111
000100
001110
000000
CHAR 9827
000100
001110
001110
000100
011111
011111
000100
000000
CHAR 9829
000000
001010
011111
011111
011111
001110
000100
000000
CHAR 9830
000000
000100
001110
011111
011111
001110
000100
000000
CHAR 9834
000100
000110
000101
000100
001100
011100
011000
000000
CHAR 9835
000011
001101
001011
001101
001011
011011
011000
000000
<\/script>

<!-- BORKSY HACKS -->
<script type="text/javascript" id="borksyHacks">
{{{HACKS}}}
<\/script>

<script type="text/javascript" id="borksyAdditionalJS">
{{{ADDITIONALJS}}}
<\/script>

</head>


<!-- DOCUMENT BODY -->
<body onload='startExportedGame()'>
{{{MARKUP}}}
</body>


</html>
`;export{t as default};
