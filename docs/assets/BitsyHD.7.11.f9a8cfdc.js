var t=`<!DOCTYPE HTML>
<html>

<!-- HEADER -->

<!-- Borksy {{BORKSY-VERSION}} -->
<!-- bitsy-hacks {{HACKS-VERSION}} -->
<!-- Bitsy HD ~> Bitsy 7.11 -->
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
	var defaultFontData = document.getElementById(defaultFontName).text.slice(1)
	attachCanvas(gameCanvas);
	loadGame(gameData, defaultFontData);
}
<\/script>

<script>
/* logging */
var DebugLogCategory = {
	system: false,
	bitsy : false,
	editor : false,
};

var isLoggingVerbose = false;

/* input */
var key = {
	left : 37,
	right : 39,
	up : 38,
	down : 40,
	space : 32,
	enter : 13,
	w : 87,
	a : 65,
	s : 83,
	d : 68,
	r : 82,
	shift : 16,
	ctrl : 17,
	alt : 18,
	cmd : 224
};

var InputManager = function() {
	var self = this;

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
		if(e.keyCode == key.left || e.keyCode == key.right || e.keyCode == key.up || e.keyCode == key.down || !isPlayerEmbeddedInEditor)
			e.preventDefault();
	}

	function isRestartCombo(e) {
		return (e.keyCode === key.r && (e.getModifierState("Control")|| e.getModifierState("Meta")));
	}

	function eventIsModifier(event) {
		return (event.keyCode == key.shift || event.keyCode == key.ctrl || event.keyCode == key.alt || event.keyCode == key.cmd);
	}

	function isModifierKeyDown() {
		return ( self.isKeyDown(key.shift) || self.isKeyDown(key.ctrl) || self.isKeyDown(key.alt) || self.isKeyDown(key.cmd) );
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
				!(key === key.up || key === key.down || key === key.left || key === key.right) &&
				!(key === key.w || key === key.s || key === key.a || key === key.d)) {
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
}

var input = new InputManager();

/* events */
var onLoadFunction = null;
var onQuitFunction = null;
var onUpdateFunction = null;
var updateInterval = null;

function initSystem() {
	// temp hack for the editor? unless??
	drawingBuffers[screenBufferId] = createDrawingBuffer(256, 256, scale);
	drawingBuffers[textboxBufferId] = createDrawingBuffer(0, 0, textScale);
}

function loadGame(gameData, defaultFontData) {
	drawingBuffers[screenBufferId] = createDrawingBuffer(256, 256, scale);
	drawingBuffers[textboxBufferId] = createDrawingBuffer(0, 0, textScale);

	document.addEventListener('keydown', input.onkeydown);
	document.addEventListener('keyup', input.onkeyup);

	if (isPlayerEmbeddedInEditor) {
		canvas.addEventListener('touchstart', input.ontouchstart, {passive:false});
		canvas.addEventListener('touchmove', input.ontouchmove, {passive:false});
		canvas.addEventListener('touchend', input.ontouchend, {passive:false});
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

			touchTrigger.addEventListener('touchstart', input.ontouchstart);
			touchTrigger.addEventListener('touchmove', input.ontouchmove);
			touchTrigger.addEventListener('touchend', input.ontouchend);
		}
	}

	window.onblur = input.onblur;

	if (onLoadFunction) {
		// todo : is this the right place to supply default font data?
		onLoadFunction(gameData, defaultFontData);
	}

	updateInterval = setInterval(
		function() {
			if (onUpdateFunction) {
				onUpdateFunction();
			}

			renderGame();

			input.resetTapReleased();

			if (bitsyGetButton(5)) {
				if (confirm("Restart the game?")) {
					input.resetAll();
					reset_cur_game();
				}

				return;
			}
		},
		16);
}

function renderGame() {
	// bitsyLog("render game mode=" + curGraphicsMode, "system");

	bitsyLog(systemPalette.length, "system");

	var startIndex = curGraphicsMode === 0 ? screenBufferId : (drawingBuffers.length - 1);

	for (var i = startIndex; i >= 0; i--) {
		var buffer = drawingBuffers[i];
		if (buffer && buffer.canvas === null) {
			bitsyLog("render buffer " + i, "system");
			renderDrawingBuffer(i, buffer);
		}
	}

	// show screen buffer
	var screenBuffer = drawingBuffers[screenBufferId];
	ctx.drawImage(
		screenBuffer.canvas,
		0,
		0,
		screenBuffer.width * screenBuffer.scale,
		screenBuffer.height * screenBuffer.scale);
}

function quitGame() {
	document.removeEventListener('keydown', input.onkeydown);
	document.removeEventListener('keyup', input.onkeyup);

	if (isPlayerEmbeddedInEditor) {
		canvas.removeEventListener('touchstart', input.ontouchstart);
		canvas.removeEventListener('touchmove', input.ontouchmove);
		canvas.removeEventListener('touchend', input.ontouchend);
	}
	else {
		//check for touchTrigger and removes it

		var existingTouchTrigger = document.querySelector('#touchTrigger');

		if (existingTouchTrigger !== null) {
			existingTouchTrigger.removeEventListener('touchstart', input.ontouchstart);
			existingTouchTrigger.removeEventListener('touchmove', input.ontouchmove);
			existingTouchTrigger.removeEventListener('touchend', input.ontouchend);

			existingTouchTrigger.parentElement.removeChild(existingTouchTrigger);
		}
	}

	window.onblur = null;

	if (onQuitFunction) {
		onQuitFunction();
	}

	clearInterval(updateInterval);
}

/* graphics */
var canvas;
var ctx;

var textScale = 2; // todo : move tile scale into here too?

var curGraphicsMode = 0;
var systemPalette = [[0, 0, 0]];
var curBufferId = -1; // note: -1 is invalid
var drawingBuffers = [];

var screenBufferId = 0;
var textboxBufferId = 1;
var tileStartBufferId = 2;
var nextBufferId = tileStartBufferId;

var DrawingInstruction = {
	Pixel : 0,
	Tile : 1,
	Clear : 2,
	Textbox : 3,
	PixelIndex : 4,
};

function attachCanvas(c) {
	canvas = c;
	canvas.width = width * scale;
	canvas.height = width * scale;
	ctx = canvas.getContext("2d");
}

function createDrawingBuffer(width, height, scale) {
	var buffer = {
		width : width,
		height : height,
		scale : scale, // logical-pixel to display-pixel scale
		instructions : [], // drawing instructions
		canvas : null,
	}

	return buffer;
}

function renderPixelInstruction(bufferId, buffer, paletteIndex, x, y) {
	if (bufferId === screenBufferId && curGraphicsMode != 0) {
		return;
	}

	if (!systemPalette[paletteIndex]) {
		// bitsyLog("invalid index " + paletteIndex + " @ " + x + "," + y, "system");
		return;
	}

	var color = systemPalette[paletteIndex];

	if (buffer.imageData) {
		for (var sy = 0; sy < buffer.scale; sy++) {
			for (var sx = 0; sx < buffer.scale; sx++) {
				var pixelIndex = (((y * buffer.scale) + sy) * buffer.width * buffer.scale * 4) + (((x * buffer.scale) + sx) * 4);

				buffer.imageData.data[pixelIndex + 0] = color[0];
				buffer.imageData.data[pixelIndex + 1] = color[1];
				buffer.imageData.data[pixelIndex + 2] = color[2];
				buffer.imageData.data[pixelIndex + 3] = 255;
			}
		}
	}
	else {
		var bufferContext = buffer.canvas.getContext("2d");
		bufferContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		bufferContext.fillRect(x * buffer.scale, y * buffer.scale, buffer.scale, buffer.scale);
	}
}

function renderPixelAtIndexInstruction(bufferId, buffer, paletteIndex, index) {
	if (bufferId === screenBufferId && curGraphicsMode != 0) {
		return;
	}

	if (!systemPalette[paletteIndex]) {
		// bitsyLog("invalid index " + paletteIndex + " @ " + x + "," + y, "system");
		return;
	}

	var color = systemPalette[paletteIndex];

	if (buffer.imageData) {
		for (var sy = 0; sy < buffer.scale; sy++) {
			for (var sx = 0; sx < buffer.scale; sx++) {
				var pixelIndex = index * 4;

				buffer.imageData.data[pixelIndex + 0] = color[0];
				buffer.imageData.data[pixelIndex + 1] = color[1];
				buffer.imageData.data[pixelIndex + 2] = color[2];
				buffer.imageData.data[pixelIndex + 3] = 255;
			}
		}
	}
	else {
		var y = Math.floor(index / buffer.width);
		var x = index - (y * buffer.width);
		var bufferContext = buffer.canvas.getContext("2d");
		bufferContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		bufferContext.fillRect(x * buffer.scale, y * buffer.scale, buffer.scale, buffer.scale);
	}
}

function renderTileInstruction(bufferId, buffer, tileId, x, y) {
	if (bufferId != screenBufferId || curGraphicsMode != 1) {
		return;
	}

	if (!drawingBuffers[tileId]) {
		return;
	}

	var tileBuffer = drawingBuffers[tileId];

	var bufferContext = buffer.canvas.getContext("2d");
	bufferContext.drawImage(
		tileBuffer.canvas,
		x * tilesize * buffer.scale,
		y * tilesize * buffer.scale,
		tilesize * buffer.scale,
		tilesize * buffer.scale);
}

function renderClearInstruction(bufferId, buffer, paletteIndex) {
	var color = systemPalette[paletteIndex];
	var bufferContext = buffer.canvas.getContext("2d");
	bufferContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
	bufferContext.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
}

function renderTextboxInstruction(bufferId, buffer, x, y) {
	if (bufferId != screenBufferId || curGraphicsMode != 1) {
		return;
	}

	if (!drawingBuffers[textboxBufferId]) {
		return;
	}

	var textboxBuffer = drawingBuffers[textboxBufferId];

	var bufferContext = buffer.canvas.getContext("2d");
	bufferContext.drawImage(
		textboxBuffer.canvas,
		x * buffer.scale,
		y * buffer.scale,
		textboxBuffer.canvas.width,
		textboxBuffer.canvas.height);
}

function renderDrawingBuffer(bufferId, buffer) {
	// bitsyLog("render buffer " + bufferId, "system");

	// if (bufferId === 0) {
	// 	bitsyLog("instructions " + buffer.instructions.length, "system");
	// }

	buffer.canvas = document.createElement("canvas");
	buffer.canvas.width = buffer.width * buffer.scale;
	buffer.canvas.height = buffer.height * buffer.scale;

	for (var i = 0; i < buffer.instructions.length; i++) {
		var instruction = buffer.instructions[i];
		switch (instruction.type) {
			case DrawingInstruction.Pixel:
				renderPixelInstruction(bufferId, buffer, instruction.id, instruction.x, instruction.y);
				break;
			case DrawingInstruction.Tile:
				renderTileInstruction(bufferId, buffer, instruction.id, instruction.x, instruction.y);
				break;
			case DrawingInstruction.Clear:
				renderClearInstruction(bufferId, buffer, instruction.id);
				break;
			case DrawingInstruction.Textbox:
				renderTextboxInstruction(bufferId, buffer, instruction.x, instruction.y);
				break;
			case DrawingInstruction.PixelIndex:
				renderPixelAtIndexInstruction(bufferId, buffer, instruction.id, instruction.index);
		}
	}

	if (buffer.imageData) {
		var bufferContext = buffer.canvas.getContext("2d");
		bufferContext.putImageData(buffer.imageData, 0, 0);
	}
}

function invalidateDrawingBuffer(buffer) {
	buffer.canvas = null;
}

function hackForEditor_GetImageFromTileId(tileId) {
	if (tileId === undefined || !drawingBuffers[tileId]) {
		bitsyLog("editor hack::invalid tile id!", "system");
		return null;
	}

	// force render the buffer if it hasn't been
	if (drawingBuffers[tileId].canvas === null) {
		renderDrawingBuffer(tileId, drawingBuffers[tileId]);
	}

	return drawingBuffers[tileId].canvas;
}

/* ==== */
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

function bitsyGetButton(buttonCode) {
	switch (buttonCode) {
		case 0: // UP
			return (input.isKeyDown(key.up) || input.isKeyDown(key.w) || input.swipeUp());
		case 1: // DOWN
			return (input.isKeyDown(key.down) || input.isKeyDown(key.s) || input.swipeDown());
		case 2: // LEFT
			return (input.isKeyDown(key.left) || input.isKeyDown(key.a) || input.swipeLeft());
		case 3: // RIGHT
			return ((input.isKeyDown(key.right) || input.isKeyDown(key.d) || input.swipeRight()));
		case 4: // OK (equivalent to "any key" on the keyboard or "tap" on touch screen)
			return (input.anyKeyDown() || input.isTapReleased());
		case 5: // MENU / RESTART (restart the game: "ctrl+r" on keyboard, no touch control yet)
			return input.isRestartComboPressed();
	}

	return false;
}

// two modes (0 == pixel mode, 1 == tile mode)
function bitsySetGraphicsMode(mode) {
	curGraphicsMode = mode;

	var screenBuffer = drawingBuffers[screenBufferId];
	if (curGraphicsMode === 0) {
		screenBuffer.imageData = ctx.createImageData(screenBuffer.width * screenBuffer.scale, screenBuffer.height * screenBuffer.scale);
	}
	else {
		screenBuffer.imageData = undefined;
	}
}

function bitsySetColor(paletteIndex, r, g, b) {
	systemPalette[paletteIndex] = [r, g, b];

	// invalidate all drawing buffers
	for (var i = 0; i < drawingBuffers.length; i++) {
		if (drawingBuffers[i]) {
			invalidateDrawingBuffer(drawingBuffers[i]);
		}
	}
}

function bitsyResetColors() {
	systemPalette = [[0, 0, 0]];

	// invalidate all drawing buffers
	for (var i = 0; i < drawingBuffers.length; i++) {
		if (drawingBuffers[i]) {
			invalidateDrawingBuffer(drawingBuffers[i]);
		}
	}
}

function bitsyDrawBegin(bufferId) {
	curBufferId = bufferId;
	var buffer = drawingBuffers[curBufferId];
	invalidateDrawingBuffer(buffer);
}

function bitsyDrawEnd() {
	curBufferId = -1;
}

function bitsyDrawPixel(paletteIndex, x, y) {
	if (curBufferId === screenBufferId && curGraphicsMode != 0) {
		return;
	}

	// avoid trying to render out-of-bounds colors
	if (paletteIndex >= systemPalette.length) {
		bitsyLog("invalid color! " + paletteIndex, "system");
		paletteIndex = systemPalette.length - 1;
	}

	var buffer = drawingBuffers[curBufferId];
	buffer.instructions.push({ type: DrawingInstruction.Pixel, id: paletteIndex, x: x, y: y, });
}

// todo : name is too long :(
// todo : merge with function above?
function bitsySetPixelAtIndex(paletteIndex, pixelIndex) {
	if (curBufferId === screenBufferId && curGraphicsMode != 0) {
		return;
	}

	// avoid trying to render out-of-bounds colors
	if (paletteIndex >= systemPalette.length) {
		bitsyLog("invalid color! " + paletteIndex, "system");
		paletteIndex = systemPalette.length - 1;
	}

	var buffer = drawingBuffers[curBufferId];
	buffer.instructions.push({ type: DrawingInstruction.PixelIndex, id: paletteIndex, index: pixelIndex, });
}

function bitsyDrawTile(tileId, x, y) {
	if (curBufferId != screenBufferId || curGraphicsMode != 1) {
		return;
	}

	var buffer = drawingBuffers[curBufferId];
	buffer.instructions.push({ type: DrawingInstruction.Tile, id: tileId, x: x, y: y, });
}

function bitsyDrawTextbox(x, y) {
	if (curBufferId != screenBufferId || curGraphicsMode != 1) {
		return;
	}

	var buffer = drawingBuffers[curBufferId];
	buffer.instructions.push({ type: DrawingInstruction.Textbox, x: x, y: y, });
}

function bitsyClear(paletteIndex) {
	// avoid trying to render out-of-bounds colors
	if (paletteIndex >= systemPalette.length) {
		paletteIndex = systemPalette.length - 1;
	}

	drawingBuffers[curBufferId].instructions = []; // reset instructions
	drawingBuffers[curBufferId].instructions.push({ type: DrawingInstruction.Clear, id: paletteIndex, });
}

// allocates a tile buffer and returns the ID
function bitsyAddTile() {
	var tileBufferId = nextBufferId;
	nextBufferId++;

	drawingBuffers[tileBufferId] = createDrawingBuffer(tilesize, tilesize, scale);

	return tileBufferId;
}

// clears all tile buffers
function bitsyResetTiles() {
	bitsyLog("RESET TILES", "system");
	// bitsyLog(drawingBuffers, "system");
	// bitsyLog(tileStartBufferId, "system");
	// bitsyLog(drawingBuffers.slice(tileStartBufferId), "system");
	drawingBuffers = drawingBuffers.slice(0, tileStartBufferId);
}

// note: width and height are in text scale pixels
function bitsySetTextboxSize(w, h) {
	drawingBuffers[textboxBufferId] = createDrawingBuffer(w, h, textScale);
}

function bitsyOnLoad(fn) {
	onLoadFunction = fn;
}

function bitsyOnQuit(fn) {
	onQuitFunction = fn;
}

function bitsyOnUpdate(fn) {
	onUpdateFunction = fn;
}
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
		bitsyLog("--- START ROOM TRANSITION ---");

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

		player().room = tmpRoom;
		player().x = tmpX;
		player().y = tmpY;
	}

	this.UpdateTransition = function(dt) {
		if (!isTransitioning) {
			return;
		}

		// todo : shouldn't need to set this every frame!
		bitsySetGraphicsMode(0);

		transitionTime += dt;

		var maxStep = transitionEffects[curEffect].stepCount;

		if (transitionTime >= minStepTime) {
			curStep++;

			var step = curStep;
			bitsyLog("transition step " + step);

			if (transitionEffects[curEffect].paletteEffectFunc) {
				var colors = transitionEffects[curEffect].paletteEffectFunc(transitionStart, transitionEnd, (step / maxStep));
				updatePaletteWithTileColors(colors);
			}

			bitsyDrawBegin(0);
			for (var y = 0; y < 256; y++) {
				for (var x = 0; x < 256; x++) {
					var color = transitionEffects[curEffect].pixelEffectFunc(transitionStart, transitionEnd, x, y, (step / maxStep));
					bitsyDrawPixel(color, x, y);
				}
			}
			bitsyDrawEnd();

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

		for (var i = 0; i < 256 * 256; i++) {
			pixelBuffer.push(tileColorStartIndex);
		}

		var drawTileInPixelBuffer = function(sourceData, frameIndex, colorIndex, tx, ty, pixelBuffer) {
			var frameData = sourceData[frameIndex];

			for (var y = 0; y < tilesize; y++) {
				for (var x = 0; x < tilesize; x++) {
					var color = tileColorStartIndex + (frameData[y][x] === 1 ? colorIndex : 0);
					pixelBuffer[(((ty * tilesize) + y) * 256) + ((tx * tilesize) + x)] = color;
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
	this.Width = 256;
	this.Height = 256;

	this.GetPixel = function(x, y) {
		return imageData[(y * 256) + x];
	};

	this.GetData = function() {
		return imageData;
	};
};

var TransitionInfo = function(image, palette, playerX, playerY) {
	this.Image = image;
	this.Palette = palette;
	this.PlayerTilePos = { x: playerX, y: playerY };
	this.PlayerCenter = { x: Math.floor((playerX * tilesize) + (tilesize / 2)), y: Math.floor((playerY * tilesize) + (tilesize / 2)) };
};
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

		var lines = fontData.split("\\n");

		var isReadingChar = false;
		var isReadingCharProperties = false;
		var curCharLineCount = 0;
		var curCharCode = 0;

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			if (line[0] === "#") {
				continue; // skip comment lines
			}

			if (!isReadingChar) {
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
					if (curCharLineCount >= height) {
						isReadingChar = false;
					}
				}
			}
		}

		// re-init invalid character box at the actual font size once it's loaded
		updateInvalidCharData();
	}

	parseFont(fontData);
}

} // FontManager
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
		// bitsyLog("COMPILE");
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
		// bitsyLog("INTERPRET");
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

	// TODO : add back in if needed later...
	// this.CompatibilityParse = function(scriptStr, compatibilityFlags) {
	// 	env.compatibilityFlags = compatibilityFlags;

	// 	var result = parser.Parse(scriptStr);

	// 	delete env.compatibilityFlags;

	// 	return result;
	// }

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
				bitsyLog("-".repeat(depth) + "- " + node.ToString());
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
		block.AddChild(new FuncNode("print", [new LiteralNode(" ")]));
		return block;
	}

	this.CreateItemConditionPair = function() {
		var itemFunc = this.CreateFunctionBlock("item", ["0"]);
		var condition = new ExpNode("==", itemFunc, new LiteralNode(1));
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("print", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateVariableConditionPair = function() {
		var varNode = this.CreateVariableNode("a");
		var condition = new ExpNode("==", varNode, new LiteralNode(1));
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("print", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateDefaultConditionPair = function() {
		var condition = this.CreateElseNode();
		var result = new DialogBlockNode(true);
		result.AddChild(new FuncNode("print", [new LiteralNode(" ")]));
		var conditionPair = new ConditionPairNode(condition, result);
		return conditionPair;
	}

	this.CreateEmptyPrintFunc = function() {
		return new FuncNode("print", [new LiteralNode("...")]);
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
		option1.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var sequence = new SequenceNode( [ option1, option2 ] );
		var block = new CodeBlockNode();
		block.AddChild( sequence );
		return block;
	}

	this.CreateCycleBlock = function() {
		var option1 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option1.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var sequence = new CycleNode( [ option1, option2 ] );
		var block = new CodeBlockNode();
		block.AddChild( sequence );
		return block;
	}

	this.CreateShuffleBlock = function() {
		var option1 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option1.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var option2 = new DialogBlockNode( false /*doIndentFirstLine*/ );
		option2.AddChild(new FuncNode("print", [new LiteralNode("...")]));

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
		result1.AddChild(new FuncNode("print", [new LiteralNode("...")]));

		var result2 = new DialogBlockNode();
		result2.AddChild(new FuncNode("print", [new LiteralNode("...")]));

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
	bitsyLog("BITSY SCRIPT WARNING: Tried to use deprecated function");
	onReturn(null);
}

function printFunc(environment, parameters, onReturn) {
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
	// bitsyLog("LINEBREAK FUNC");
	environment.GetDialogBuffer().AddLinebreak();
	environment.GetDialogBuffer().AddScriptReturn(function() { onReturn(null); });
}

function pagebreakFunc(environment, parameters, onReturn) {
	environment.GetDialogBuffer().AddPagebreak(function() { onReturn(null); });
}

function printDrawingFunc(environment, parameters, onReturn) {
	var drawingId = parameters[0];
	environment.GetDialogBuffer().AddDrawing(drawingId);
	environment.GetDialogBuffer().AddScriptReturn(function() { onReturn(null); });
}

function printSpriteFunc(environment,parameters,onReturn) {
	var spriteId = parameters[0];
	if(names.sprite[spriteId] != undefined) spriteId = names.sprite[spriteId]; // id is actually a name
	var drawingId = sprite[spriteId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printTileFunc(environment,parameters,onReturn) {
	var tileId = parameters[0];
	if(names.tile[tileId] != undefined) tileId = names.tile[tileId]; // id is actually a name
	var drawingId = tile[tileId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printItemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];
	if(names.item[itemId] != undefined) itemId = names.item[itemId]; // id is actually a name
	var drawingId = item[itemId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printFontFunc(environment, parameters, onReturn) {
	var allCharacters = "";
	var font = fontManager.Get(fontName);
	var codeList = font.allCharCodes();
	for (var i = 0; i < codeList.length; i++) {
		allCharacters += String.fromCharCode(codeList[i]) + " ";
	}
	printFunc(environment, [allCharacters], onReturn);
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

function addOrRemoveTextEffect(environment,name) {
	if( environment.GetDialogBuffer().HasTextEffect(name) )
		environment.GetDialogBuffer().RemoveTextEffect(name);
	else
		environment.GetDialogBuffer().AddTextEffect(name);
}

function rainbowFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"rbw");
	onReturn(null);
}

// TODO : should the colors use a parameter instead of special names?
function color1Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr1");
	onReturn(null);
}

function color2Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr2");
	onReturn(null);
}

function color3Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr3");
	onReturn(null);
}

function wavyFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"wvy");
	onReturn(null);
}

function shakyFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"shk");
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

	bitsyLog("PROPERTY! " + propertyName + " " + outValue);

	onReturn(outValue);
}

function endFunc(environment,parameters,onReturn) {
	isEnding = true;
	isNarrating = true;
	dialogRenderer.SetCentered(true);
	onReturn(null);
}

function exitFunc(environment,parameters,onReturn) {
	var destRoom = parameters[0];

	if (names.room[destRoom] != undefined) {
		// it's a name, not an id! (note: these could cause trouble if people names things weird)
		destRoom = names.room[destRoom];
	}

	var destX = parseInt(parameters[1]);
	var destY = parseInt(parameters[2]);

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
		// update world state
		player().room = destRoom;
		player().x = destX;
		player().y = destY;
		curRoom = destRoom;

		// update game state
		initRoom(curRoom);

		// resume dialog script
		onReturn(null);
	};

	// TODO : this doesn't play nice with pagebreak because it thinks the dialog is finished!
	if (transition.IsTransitionActive()) {
		transition.OnTransitionComplete(movePlayerAndResumeScript);
	}
	else {
		movePlayerAndResumeScript();
	}
}

/* BUILT-IN OPERATORS */
function setExp(environment,left,right,onReturn) {
	// bitsyLog("SET " + left.name);

	if(left.type != "variable") {
		// not a variable! return null and hope for the best D:
		onReturn( null );
		return;
	}

	right.Eval(environment,function(rVal) {
		environment.SetVariable( left.name, rVal );
		// bitsyLog("VAL " + environment.GetVariable( left.name ) );
		left.Eval(environment,function(lVal) {
			onReturn( lVal );
		});
	});
}
function equalExp(environment,left,right,onReturn) {
	// bitsyLog("EVAL EQUAL");
	// bitsyLog(left);
	// bitsyLog(right);
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
	functionMap["print"] = printFunc;
	functionMap["say"] = printFunc;
	functionMap["br"] = linebreakFunc;
	functionMap["item"] = itemFunc;
	functionMap["rbw"] = rainbowFunc;
	functionMap["clr1"] = color1Func;
	functionMap["clr2"] = color2Func;
	functionMap["clr3"] = color3Func;
	functionMap["wvy"] = wavyFunc;
	functionMap["shk"] = shakyFunc;
	functionMap["printSprite"] = printSpriteFunc;
	functionMap["printTile"] = printTileFunc;
	functionMap["printItem"] = printItemFunc;
	functionMap["debugOnlyPrintFont"] = printFontFunc; // DEBUG ONLY
	functionMap["end"] = endFunc;
	functionMap["exit"] = exitFunc;
	functionMap["pg"] = pagebreakFunc;
	functionMap["property"] = propertyFunc;

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
		// bitsyLog("SET VARIABLE " + name + " = " + value);
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
	// bitsyLog("WHITESPACE " + depth + " ::" + str + "::");
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
		// bitsyLog(this);
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

var DialogBlockNode = function(doIndentFirstLine) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "dialog_block";

	this.Eval = function(environment, onReturn) {
		// bitsyLog("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// bitsyLog(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// bitsyLog("<< CHILD " + i);
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

var CodeBlockNode = function() {
	Object.assign( this, new TreeRelationship() );
	this.type = "code_block";

	this.Eval = function(environment, onReturn) {
		// bitsyLog("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// bitsyLog(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// bitsyLog("<< CHILD " + i);
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

		// bitsyLog("SERIALIZE BLOCK!!!");
		// bitsyLog(depth);
		// bitsyLog(doIndentFirstLine);

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
var UndefinedNode = function(sourceStr) {
	Object.assign(this, new TreeRelationship());
	this.type = "undefined";
	this.source = sourceStr;

	this.Eval = function(environment,onReturn) {
		addOrRemoveTextEffect(environment, "_debug_highlight");
		printFunc(environment, ["{" + sourceStr + "}"], function() {
			onReturn(null);
		});
		addOrRemoveTextEffect(environment, "_debug_highlight");
	}

	this.Serialize = function(depth) {
		return this.source;
	}

	this.ToString = function() {
		return "undefined" + " " + this.GetId();
	}
}

var FuncNode = function(name,args) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
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
		if (isDialogBlock && this.name === "print") {
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

var LiteralNode = function(value) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "literal";
	this.value = value;

	this.Eval = function(environment,onReturn) {
		onReturn(this.value);
	}

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
	}

	this.ToString = function() {
		return this.type + " " + this.value + " " + this.GetId();
	};
}

var VarNode = function(name) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "variable";
	this.name = name;

	this.Eval = function(environment,onReturn) {
		// bitsyLog("EVAL " + this.name + " " + environment.HasVariable(this.name) + " " + environment.GetVariable(this.name));
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

var ExpNode = function(operator, left, right) {
	Object.assign( this, new TreeRelationship() );
	this.type = "operator";
	this.operator = operator;
	this.left = left;
	this.right = right;

	this.Eval = function(environment,onReturn) {
		// bitsyLog("EVAL " + this.operator);
		var self = this; // hack to deal with scope
		environment.EvalOperator( this.operator, this.left, this.right, 
			function(val){
				// bitsyLog("EVAL EXP " + self.operator + " " + val);
				onReturn(val);
			} );
		// NOTE : sadly this pushes a lot of complexity down onto the actual operator methods
	}

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
	}

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

var SequenceBase = function() {
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
	}

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

var SequenceNode = function(options) {
	Object.assign(this, new TreeRelationship());
	Object.assign(this, new SequenceBase());
	this.type = "sequence";
	this.AddChildren(options);

	var index = 0;
	this.Eval = function(environment, onReturn) {
		// bitsyLog("SEQUENCE " + index);
		this.children[index].Eval(environment, onReturn);

		var next = index + 1;
		if (next < this.children.length) {
			index = next;
		}
	}
}

var CycleNode = function(options) {
	Object.assign(this, new TreeRelationship());
	Object.assign(this, new SequenceBase());
	this.type = "cycle";
	this.AddChildren(options);

	var index = 0;
	this.Eval = function(environment, onReturn) {
		// bitsyLog("CYCLE " + index);
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

var ShuffleNode = function(options) {
	Object.assign(this, new TreeRelationship());
	Object.assign(this, new SequenceBase());
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
var IfNode = function(conditions, results, isSingleLine) {
	Object.assign(this, new TreeRelationship());
	this.type = "if";

	for (var i = 0; i < conditions.length; i++) {
		this.AddChild(new ConditionPairNode(conditions[i], results[i]));
	}

	var self = this;
	this.Eval = function(environment, onReturn) {
		// bitsyLog("EVAL IF");
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
	}

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
	}

	this.IsSingleLine = function() {
		return isSingleLine;
	}

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

var ConditionPairNode = function(condition, result) {
	Object.assign(this, new TreeRelationship());

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
	}

	this.Serialize = function(depth) {
		var str = "";
		str += leadingWhitespace(depth + 1);
		str += Sym.List + " " + this.children[0].Serialize(depth) + " " + Sym.ConditionEnd + Sym.Linebreak;
		str += this.children[1].Serialize(depth + 2) + Sym.Linebreak;
		return str;
	}

	this.VisitAll = function(visitor, depth) {
		if (depth == undefined || depth == null) {
			depth = 0;
		}

		visitor.Visit(this, depth);

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].VisitAll(visitor, depth + 1);
		}
	}

	this.ToString = function() {
		return this.type + " " + this.GetId();
	}
}

var ElseNode = function() {
	Object.assign( this, new TreeRelationship() );
	this.type = Sym.Else;

	this.Eval = function(environment, onReturn) {
		onReturn(true);
	}

	this.Serialize = function() {
		return Sym.Else;
	}

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

		bitsyLog(scriptStr);
		bitsyLog(state.Source());

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
			// bitsyLog(str);
			str = "" + str; // hack to turn single chars into strings
			// bitsyLog(str);
			// bitsyLog(str.length);
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
			// bitsyLog(j);
			while (j < sourceStr.length && end.indexOf(sourceStr[j]) == -1) {
				str += sourceStr[j];
				j++;
			}
			// bitsyLog("PEAK ::" + str + "::");
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

		this.Print = function() { bitsyLog(sourceStr); };
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
				var printNode = new FuncNode("print", [new LiteralNode(curText)]);
				curLineNodeList.push(printNode);

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
		// bitsyLog("IsSequence? " + str);
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
		bitsyLog("~~~ PARSE FUNCTION " + funcName);

		var args = [];

		var curSymbol = "";
		function OnSymbolEnd() {
			curSymbol = curSymbol.trim();
			// bitsyLog("PARAMTER " + curSymbol);
			args.push( StringToValue(curSymbol) );
			// bitsyLog(args);
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
				// bitsyLog("STRING " + str);
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
		// bitsyLog("VALID variable??? " + isValid);
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
			// bitsyLog("STRING");
			var str = "";
			var i = 1;
			while (i < valStr.length && valStr[i] != Sym.String) {
				str += valStr[i];
				i++;
			}
			// bitsyLog(str);
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
			// bitsyLog("NUMBER!!! " + valStr);
			return new LiteralNode( parseFloat(valStr) );
		}
		else if(IsValidVariableName(valStr)) {
			// VARIABLE!!
			// bitsyLog("VARIABLE");
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
		// bitsyLog("EXPRESSION " + line);
		var exp = CreateExpression(line);
		// bitsyLog(exp);
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
		font_scale : 0.5, // we draw font at half-size compared to everything else
		padding_vert : 2,
		padding_horz : 4,
		arrow_height : 5,
	};

	var font = null;
	this.SetFont = function(f) {
		font = f;
		textboxInfo.height = (textboxInfo.padding_vert * 3) + (relativeFontHeight() * 2) + textboxInfo.arrow_height;

		// todo : clean up all the scale stuff
		var textboxScaleW = textboxInfo.width / textboxInfo.font_scale;
		var textboxScaleH = textboxInfo.height / textboxInfo.font_scale;
		bitsySetTextboxSize(textboxScaleW, textboxScaleH);
	}

	function textScale() {
		return scale * textboxInfo.font_scale;
	}

	function relativeFontWidth() {
		return Math.ceil( font.getWidth() * textboxInfo.font_scale );
	}

	function relativeFontHeight() {
		return Math.ceil( font.getHeight() * textboxInfo.font_scale );
	}

	this.ClearTextbox = function() {
		bitsyDrawBegin(1);
		bitsyClear(textBackgroundIndex);
		bitsyDrawEnd();
	};

	var isCentered = false;
	this.SetCentered = function(centered) {
		isCentered = centered;
	};

	this.DrawTextbox = function() {
		bitsyDrawBegin(0);

		if (isCentered) {
			// todo : will the height calculations always work?
			bitsyDrawTextbox(textboxInfo.left, ((height / 2) - (textboxInfo.height / 2)));
		}
		else if (player().y < (mapsize / 2)) {
			// bottom
			bitsyDrawTextbox(textboxInfo.left, (height - textboxInfo.bottom - textboxInfo.height));
		}
		else {
			// top
			bitsyDrawTextbox(textboxInfo.left, textboxInfo.top);
		}

		bitsyDrawEnd();
	};

	var arrowdata = [
		1,1,1,1,1,
		0,1,1,1,0,
		0,0,1,0,0
	];

	this.DrawNextArrow = function() {
		// bitsyLog("draw arrow!");
		bitsyDrawBegin(1);

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
							bitsyDrawPixel(textArrowIndex, left + (x * text_scale) + sx, top + (y * text_scale) + sy);
						}
					}
				}
			}
		}

		bitsyDrawEnd();
	};

	var text_scale = 2; //using a different scaling factor for text feels like cheating... but it looks better
	this.DrawChar = function(char, row, col, leftPos) {
		bitsyDrawBegin(1);

		char.offset = {
			x: char.base_offset.x,
			y: char.base_offset.y
		}; // compute render offset *every* frame

		char.SetPosition(row,col);
		char.ApplyEffects(effectTime);

		var charData = char.bitmap;

		var top = (4 * text_scale) + (row * 2 * text_scale) + (row * font.getHeight()) + Math.floor(char.offset.y);
		var left = (4 * text_scale) + leftPos + Math.floor(char.offset.x);

		for (var y = 0; y < char.height; y++) {
			for (var x = 0; x < char.width; x++) {
				var i = (y * char.width) + x;
				if (charData[i] == 1) {
					// todo : other colors
					bitsySetPixelAtIndex(char.color, ((top + y) * (textboxInfo.width * text_scale)) + (left + x));
				}
			}
		}

		bitsyDrawEnd();

		// call printHandler for character
		char.OnPrint();
	};

	var effectTime = 0; // TODO this variable should live somewhere better
	this.Draw = function(buffer, dt) {
		effectTime += dt;

		this.ClearTextbox();

		buffer.ForEachActiveChar(this.DrawChar);

		if (buffer.CanContinue()) {
			this.DrawNextArrow();
		}

		this.DrawTextbox();

		if (buffer.DidPageFinishThisFrame() && onPageFinish != null) {
			onPageFinish();
		}
	};

	/* this is a hook for GIF rendering */
	var onPageFinish = null;
	this.SetPageFinishHandler = function(handler) {
		onPageFinish = handler;
	};

	this.Reset = function() {
		effectTime = 0;
		// TODO - anything else?
	}

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
	var font = null;
	var arabicHandler = new ArabicHandler();
	var onDialogEndCallbacks = [];

	this.SetFont = function(f) {
		font = f;
	}

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
			// bitsyLog(charCount);

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
					// bitsyLog(j + " " + leftPos);

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

	this.Skip = function() {
		bitsyLog("SKIPPP");
		didPageFinishThisFrame = false;
		didFlipPageThisFrame = false;
		// add new characters until you get to the end of the current line of dialog
		while (rowIndex < this.CurRowCount()) {
			this.DoNextChar();

			if(isDialogReadyToContinue) {
				//make sure to push the rowIndex past the end to break out of the loop
				rowIndex++;
				charIndex = 0;
			}
		}
		rowIndex = this.CurRowCount()-1;
		charIndex = this.CurCharCount()-1;
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
		bitsyLog("CONTINUE");

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
			bitsyLog("FLIP PAGE!");
			//start next page
			this.FlipPage();
			return true; /* hasMoreDialog */
		}
		else {
			bitsyLog("END DIALOG!");
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

	function DialogChar(effectList) {
		this.effectList = effectList.slice(); // clone effect list (since it can change between chars)

		this.color = textColorIndex; // white
		this.offset = { x:0, y:0 }; // in pixels (screen pixels?)

		this.col = 0;
		this.row = 0;

		this.SetPosition = function(row,col) {
			// bitsyLog("SET POS");
			// bitsyLog(this);
			this.row = row;
			this.col = col;
		}

		this.ApplyEffects = function(time) {
			// bitsyLog("APPLY EFFECTS! " + time);
			for(var i = 0; i < this.effectList.length; i++) {
				var effectName = this.effectList[i];
				// bitsyLog("FX " + effectName);
				TextEffects[ effectName ].DoEffect( this, time );
			}
		}

		var printHandler = null; // optional function to be called once on printing character
		this.SetPrintHandler = function(handler) {
			printHandler = handler;
		}
		this.OnPrint = function() {
			if (printHandler != null) {
				// bitsyLog("PRINT HANDLER ---- DIALOG BUFFER");
				printHandler();
				printHandler = null; // only call handler once (hacky)
			}
		}

		this.bitmap = [];
		this.width = 0;
		this.height = 0;
		this.base_offset = { // hacky name
 			x: 0,
			y: 0
		};
		this.spacing = 0;
	}

	function DialogFontChar(font, char, effectList) {
		Object.assign(this, new DialogChar(effectList));

		var charData = font.getChar(char);
		this.bitmap = charData.data;
		this.width = charData.width;
		this.height = charData.height;
		this.base_offset.x = charData.offset.x;
		this.base_offset.y = charData.offset.y;
		this.spacing = charData.spacing;
	}

	function DialogDrawingChar(drawingId, effectList) {
		Object.assign(this, new DialogChar(effectList));

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
		Object.assign(this, new DialogChar([]));

		this.width = 0;
		this.height = 0;
		this.spacing = 0;
	}

	// is a control character really the best way to handle page breaks?
	function DialogPageBreakChar() {
		Object.assign(this, new DialogChar([]));

		this.width = 0;
		this.height = 0;
		this.spacing = 0;

		this.isPageBreak = true;

		var continueHandler = null;

		this.SetContinueHandler = function(handler) {
			continueHandler = handler;
		}

		this.OnContinue = function() {
			if (continueHandler) {
				continueHandler();
			}
		}
	}

	function AddWordToCharArray(charArray,word,effectList) {
		for(var i = 0; i < word.length; i++) {
			charArray.push( new DialogFontChar( font, word[i], effectList ) );
		}
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
		// bitsyLog("DRAWING ID " + drawingId);

		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		var drawingChar = new DialogDrawingChar(drawingId, activeTextEffects);

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
		bitsyLog("ADD TEXT " + textStr);

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
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects);

				afterManualPagebreak = false;
			}
			else if (rowLength + wordLength <= pixelsPerRow || rowLength <= 0) {
				//stay on same row
				curRowArr = AddWordToCharArray(curRowArr, wordWithPrecedingSpace, activeTextEffects);
			}
			else if (curRowIndex == 0) {
				//start next row
				buffer[curPageIndex][curRowIndex] = curRowArr;
				buffer[curPageIndex].push([]);
				curRowIndex++;
				curRowArr = buffer[curPageIndex][curRowIndex];
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects);
			}
			else {
				//start next page
				buffer[curPageIndex][curRowIndex] = curRowArr;
				buffer.push([]);
				curPageIndex++;
				buffer[curPageIndex].push([]);
				curRowIndex = 0;
				curRowArr = buffer[curPageIndex][curRowIndex];
				curRowArr = AddWordToCharArray(curRowArr, word, activeTextEffects);
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

		// bitsyLog(buffer);

		isActive = true;
	};

	this.AddLinebreak = function() {
		var lastPage = buffer[buffer.length-1];
		if (lastPage.length <= 1) {
			// bitsyLog("LINEBREAK - NEW ROW ");
			// add new row
			lastPage.push([]);
		}
		else {
			// add new page
			buffer.push([[]]);
		}
		// bitsyLog(buffer);

		isActive = true;
	}

	this.AddPagebreak = function(onReturnHandler) {
		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		// need to actually create a whole new page if following another pagebreak character
		if (this.CurChar() && this.CurChar().isPageBreak) {
			buffer.push([]);
			curPageIndex++;
			buffer[curPageIndex].push([]);
			curRowIndex = 0;
			curRowArr = buffer[curPageIndex][curRowIndex];
		}

		var pagebreakChar = new DialogPageBreakChar();
		pagebreakChar.SetContinueHandler(onReturnHandler);

		curRowArr.push(pagebreakChar);

		isActive = true;		
	}

	/* new text effects */
	this.HasTextEffect = function(name) {
		return activeTextEffects.indexOf( name ) > -1;
	}
	this.AddTextEffect = function(name) {
		activeTextEffects.push( name );
	}
	this.RemoveTextEffect = function(name) {
		activeTextEffects.splice( activeTextEffects.indexOf( name ), 1 );
	}

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

/* NEW TEXT EFFECTS */
var TextEffects = {};

var RainbowEffect = function() {
	this.DoEffect = function(char, time) {
		char.color = rainbowColorStartIndex + Math.floor(((time / 100) - char.col * 0.5) % rainbowColorCount);
	}
};
TextEffects["rbw"] = new RainbowEffect();

var ColorEffect = function(index) {
	this.DoEffect = function(char) {
		char.color = tileColorStartIndex + index;
	}
};
TextEffects["clr1"] = new ColorEffect(0);
TextEffects["clr2"] = new ColorEffect(1); // TODO : should I use parameters instead of special names?
TextEffects["clr3"] = new ColorEffect(2);

var WavyEffect = function() {
	this.DoEffect = function(char,time) {
		char.offset.y += Math.sin((time / 250) - (char.col / 2)) * 2;
	}
};
TextEffects["wvy"] = new WavyEffect();

var ShakyEffect = function() {
	function disturb(func, time, offset, mult1, mult2) {
		return func((time * mult1) - (offset * mult2));
	}

	this.DoEffect = function(char,time) {
		char.offset.y += 1.5
						* disturb(Math.sin, time, char.col, 0.1, 0.5)
						* disturb(Math.cos, time, char.col, 0.3, 0.2)
						* disturb(Math.sin, time, char.row, 2.0, 1.0);
		char.offset.x += 1.5
						* disturb(Math.cos, time, char.row, 0.1, 1.0)
						* disturb(Math.sin, time, char.col, 3.0, 0.7)
						* disturb(Math.cos, time, char.col, 0.2, 0.3);
	}
};
TextEffects["shk"] = new ShakyEffect();

var DebugHighlightEffect = function() {
	this.DoEffect = function(char) {
		char.color = tileColorStartIndex;
	}
}
TextEffects["_debug_highlight"] = new DebugHighlightEffect();

} // Dialog()
<\/script>

<script>
function TileRenderer(tilesize) {
// todo : do I need to pass in tilesize? or can I use the global value?

bitsyLog("!!!!! NEW TILE RENDERER");

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
	// bitsyLog("RENDER COUNT " + debugRenderCount);

	var col = drawing.col;
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
		var frameTileId = renderTileFromDrawingData(frameData, col);
		drawingCache.render[cacheId].push(frameTileId);
	}
}

function renderTileFromDrawingData(drawingData, col) {
	var tileId = bitsyAddTile();

	var backgroundColor = tileColorStartIndex + 0;
	var foregroundColor = tileColorStartIndex + col;

	bitsyDrawBegin(tileId);

	for (var y = 0; y < tilesize; y++) {
		for (var x = 0; x < tilesize; x++) {
			var px = drawingData[y][x];

			if (px === 1) {
				bitsyDrawPixel(foregroundColor, x, y);
			}
			else {
				bitsyDrawPixel(backgroundColor, x, y);
			}
		}
	}

	bitsyDrawEnd();

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
	// bitsyLog("frame render: " + drawing.type + " " + drawing.id + " f:" + frameOverride);

	if (!isDrawingRendered(drawing)) {
		// bitsyLog("frame render: doesn't exist");
		renderDrawing(drawing);
	}

	return getDrawingFrameTileId(drawing, frameOverride);
}

/* PUBLIC INTERFACE */
this.GetDrawingFrame = getOrRenderDrawingFrame;

this.SetDrawingSource = function(drawingId, drawingData) {
	drawingCache.source[drawingId] = drawingData;
	// TODO : reset render cache for this image
}

this.GetDrawingSource = function(drawingId) {
	return drawingCache.source[drawingId];
}

this.GetFrameCount = function(drawingId) {
	return drawingCache.source[drawingId].length;
}

this.ClearCache = function() {
	bitsyResetTiles();
	drawingCache.render = {};
}

} // Renderer()
<\/script>

<script>
var room = {};
var tile = {};
var sprite = {};
var item = {};
var dialog = {};
var palette = { //start off with a default palette
		"default" : {
			name : "default",
			colors : [[0,0,0],[255,255,255],[255,255,255]]
		}
	};
var variable = {}; // these are starting variable values -- they don't update (or I don't think they will)
var playerId = "A";

var titleDialogId = "title";
function getTitle() {
	return dialog[titleDialogId].src;
}
function setTitle(titleSrc) {
	dialog[titleDialogId] = { src:titleSrc, name:null };
}

var defaultFontName = "ascii_small";
var fontName = defaultFontName;
var TextDirection = {
	LeftToRight : "LTR",
	RightToLeft : "RTL"
};
var textDirection = TextDirection.LeftToRight;

/* NAME-TO-ID MAPS */
var names = {
	room : {},
	tile : {},
	sprite : {},
	item : {},
	dialog : {},
};

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
}

var spriteStartLocations = {};

/* VERSION */
var version = {
	major: 7, // major changes
	minor: 11, // smaller changes
	devBuildPhase: "RELEASE",
};
function getEngineVersion() {
	return version.major + "." + version.minor;
}

/* FLAGS */
var flags;
function resetFlags() {
	flags = {
		ROOM_FORMAT : 0 // 0 = non-comma separated, 1 = comma separated
	};
}
resetFlags(); //init flags on load script

// SUPER hacky location... :/
var editorDevFlags = {
	// NONE right now!
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

	// TODO RENDERER : clear data?

	spriteStartLocations = {};

	updateNamesFromCurData();

	fontName = defaultFontName; // TODO : reset font manager too?
	textDirection = TextDirection.LeftToRight;
}

var width = 256;
var height = 256;
var scale = 2; //this is stupid but necessary
var tilesize = 16;
var mapsize = 16;

var curRoom = "0";

var prevTime = 0;
var deltaTime = 0;

// engine event hooks for the editor
var onInventoryChanged = null;
var onVariableChanged = null;
var onGameReset = null;
var onInitRoom = null;

var isPlayerEmbeddedInEditor = false;

var renderer = new TileRenderer(tilesize);

var curGameData = null;
var curDefaultFontData = null;

function load_game(gameData, defaultFontData, startWithTitle) {
	curGameData = gameData; //remember the current game (used to reset the game)

	dialogBuffer.Reset();
	scriptInterpreter.ResetEnvironment(); // ensures variables are reset -- is this the best way?

	parseWorld(gameData);

	if (!isPlayerEmbeddedInEditor && defaultFontData) {
		curDefaultFontData = defaultFontData; // store for resetting game

		// todo : consider replacing this with a more general system for requesting resources from the system?
		// hack to ensure default font is available
		fontManager.AddResource(defaultFontName + fontManager.GetExtension(), defaultFontData);
	}

	var font = fontManager.Get( fontName );
	dialogBuffer.SetFont(font);
	dialogRenderer.SetFont(font);

	setInitialVariables();

	onready(startWithTitle);
}

function reset_cur_game() {
	if (curGameData == null) {
		return; //can't reset if we don't have the game data
	}

	stopGame();
	clearGameData();
	load_game(curGameData, curDefaultFontData);

	if (isPlayerEmbeddedInEditor && onGameReset != null) {
		onGameReset();
	}
}

function onready(startWithTitle) {
	if (startWithTitle === undefined || startWithTitle === null) {
		startWithTitle = true;
	}

	if (startWithTitle) { // used by editor 
		startNarrating(getTitle());
	}
}

function setInitialVariables() {
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
	bitsyLog("stop GAME!");
}

function update() {
	var curTime = Date.now();
	deltaTime = curTime - prevTime;

	if (curRoom == null) {
		// in the special case where there is no valid room, end the game
		startNarrating( "", true /*isEnding*/ );
	}

	if (!transition.IsTransitionActive()) {
		updateInput();
	}

	if (transition.IsTransitionActive()) {
		// transition animation takes over everything!
		transition.UpdateTransition(deltaTime);
	}
	else {
		bitsySetGraphicsMode(1);

		if (!isNarrating && !isEnding) {
			updateAnimation();
			drawRoom(room[curRoom]); // draw world if game has begun
		}
		else {
			clearRoom();
		}

		// if (isDialogMode) { // dialog mode
		if(dialogBuffer.IsActive()) {
			dialogRenderer.Draw( dialogBuffer, deltaTime );
			dialogBuffer.Update( deltaTime );
		}

		// keep moving avatar if player holds down button
		if( !dialogBuffer.IsActive() && !isEnding )
		{
			if( curPlayerDirection != Direction.None ) {
				playerHoldToMoveTimer -= deltaTime;

				if( playerHoldToMoveTimer <= 0 )
				{
					movePlayer( curPlayerDirection );
					playerHoldToMoveTimer = 150;
				}
			}
		}
	}

	prevTime = curTime;
}

var isAnyButtonHeld = false;
var isIgnoringInput = false;

function isAnyButtonDown() {
	return bitsyGetButton(0) || bitsyGetButton(1) || bitsyGetButton(2) || bitsyGetButton(3) || bitsyGetButton(4);
}

function updateInput() {
	if (dialogBuffer.IsActive()) {
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
	else if (isEnding) {
		if (!isAnyButtonHeld && isAnyButtonDown()) {
			/* RESTART GAME */
			reset_cur_game();
		}
	}
	else if (!isIgnoringInput) {
		/* WALK */
		var prevPlayerDirection = curPlayerDirection;

		if (bitsyGetButton(0)) {
			curPlayerDirection = Direction.Up;
		}
		else if (bitsyGetButton(1)) {
			curPlayerDirection = Direction.Down;
		}
		else if (bitsyGetButton(2)) {
			curPlayerDirection = Direction.Left;
		}
		else if (bitsyGetButton(3)) {
			curPlayerDirection = Direction.Right;
		}
		else {
			curPlayerDirection = Direction.None;
		}

		if (curPlayerDirection != Direction.None && curPlayerDirection != prevPlayerDirection) {
			movePlayer(curPlayerDirection);
			playerHoldToMoveTimer = 500;
		}
	}

	if (!isAnyButtonDown()) {
		isIgnoringInput = false;
	}

	isAnyButtonHeld = isAnyButtonDown();
}

var animationCounter = 0;
var animationTime = 400;
function updateAnimation() {
	animationCounter += deltaTime;

	if ( animationCounter >= animationTime ) {

		// animate sprites
		for (id in sprite) {
			var spr = sprite[id];
			if (spr.animation.isAnimated) {
				spr.animation.frameIndex = ( spr.animation.frameIndex + 1 ) % spr.animation.frameCount;
			}
		}

		// animate tiles
		for (id in tile) {
			var til = tile[id];
			if (til.animation.isAnimated) {
				til.animation.frameIndex = ( til.animation.frameIndex + 1 ) % til.animation.frameCount;
			}
		}

		// animate items
		for (id in item) {
			var itm = item[id];
			if (itm.animation.isAnimated) {
				itm.animation.frameIndex = ( itm.animation.frameIndex + 1 ) % itm.animation.frameCount;
			}
		}

		// reset counter
		animationCounter = 0;

	}
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

function getSpriteAt(x,y) {
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === curRoom) {
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

function movePlayer(direction) {
	var roomIds = Object.keys(room);

	if (player().room == null || roomIds.indexOf(player().room) < 0) {
		return; // player room is missing or invalid.. can't move them!
	}

	var spr = null;

	if ( curPlayerDirection == Direction.Left && !(spr = getSpriteLeft()) && !isWallLeft()) {
		player().x -= 1;
	}
	else if ( curPlayerDirection == Direction.Right && !(spr = getSpriteRight()) && !isWallRight()) {
		player().x += 1;
	}
	else if ( curPlayerDirection == Direction.Up && !(spr = getSpriteUp()) && !isWallUp()) {
		player().y -= 1;
	}
	else if ( curPlayerDirection == Direction.Down && !(spr = getSpriteDown()) && !isWallDown()) {
		player().y += 1;
	}
	
	var ext = getExit( player().room, player().x, player().y );
	var end = getEnding( player().room, player().x, player().y );
	var itmIndex = getItemIndex( player().room, player().x, player().y );

	// do items first, because you can pick up an item AND go through a door
	if (itmIndex > -1) {
		var itm = room[player().room].items[itmIndex];
		var itemRoom = player().room;

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
		startSpriteDialog(spr /*spriteId*/);
	}
}

var transition = new TransitionManager();

function movePlayerThroughExit(ext) {
	var GoToDest = function() {
		if (ext.transition_effect != null) {
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
				curRoom = ext.dest.room;

				initRoom(curRoom);
			});
		}
		else {
			player().room = ext.dest.room;
			player().x = ext.dest.x;
			player().y = ext.dest.y;
			curRoom = ext.dest.room;

			initRoom(curRoom);
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
var textBackgroundIndex = 0;
var textArrowIndex = 1;
var textColorIndex = 2;

// precalculated rainbow colors
var rainbowColorStartIndex = 3;
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

// todo : where should this be stored?
var tileColorStartIndex = 16;

function updatePaletteWithTileColors(tileColors) {
	// clear existing colors
	bitsyResetColors();

	// textbox colors
	bitsySetColor(textBackgroundIndex, 0, 0, 0); // black
	bitsySetColor(textArrowIndex, 255, 255, 255); // white
	bitsySetColor(textColorIndex, 255, 255, 255); // white

	// todo : move this to game init?
	// rainbow colors
	for (var i = 0; i < rainbowColorCount; i++) {
		var color = rainbowColors[i];
		bitsySetColor(rainbowColorStartIndex + i, color[0], color[1], color[2]);
	}

	// tile colors
	for (var i = 0; i < tileColors.length; i++) {
		var color = tileColors[i];
		bitsySetColor(tileColorStartIndex + i, color[0], color[1], color[2]);
	}
}

function updatePalette(palId) {
	var pal = palette[palId];
	bitsyLog(pal.colors.length, "editor");
	updatePaletteWithTileColors(pal.colors);
}

function initRoom(roomId) {
	bitsyLog("init room " + roomId);

	updatePalette(curPal());

	renderer.ClearCache();

	// init exit properties
	for (var i = 0; i < room[roomId].exits.length; i++) {
		room[roomId].exits[i].property = { locked:false };
	}

	// init ending properties
	for (var i = 0; i < room[roomId].endings.length; i++) {
		room[roomId].endings[i].property = { locked:false };
	}

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
	return (player().x + 1 >= 16) || isWall( player().x + 1, player().y );
}

function isWallUp() {
	return (player().y - 1 < 0) || isWall( player().x, player().y - 1 );
}

function isWallDown() {
	return (player().y + 1 >= 16) || isWall( player().x, player().y + 1 );
}

function isWall(x,y,roomId) {
	if(roomId == undefined || roomId == null)
		roomId = curRoom;

	var tileId = getTile( x, y );

	if( tileId === '0' )
		return false; // Blank spaces aren't walls, ya doofus

	if( tile[tileId].isWall === undefined || tile[tileId].isWall === null ) {
		// No wall-state defined: check room-specific walls
		var i = room[roomId].walls.indexOf( getTile(x,y) );
		return i > -1;
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

function getExit(roomId,x,y) {
	for (i in room[roomId].exits) {
		var e = room[roomId].exits[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getEnding(roomId,x,y) {
	for (i in room[roomId].endings) {
		var e = room[roomId].endings[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getTile(x,y) {
	// bitsyLog(x + " " + y);
	var t = getRoom().tilemap[y][x];
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

function getRoom() {
	return room[curRoom];
}

function isSpriteOffstage(id) {
	return sprite[id].room == null;
}

function parseWorld(file) {
	spriteStartLocations = {};

	resetFlags();

	var versionNumber = 0;

	// flags to keep track of which compatibility conversions
	// need to be applied to this game data
	var compatibilityFlags = {
		convertSayToPrint : false,
		combineEndingsWithDialog : false,
		convertImplicitSpriteDialogIds : false,
	};

	var lines = file.split("\\n");
	var i = 0;
	while (i < lines.length) {
		var curLine = lines[i];

		// bitsyLog(lines[i]);

		if (i == 0) {
			i = parseTitle(lines, i);
		}
		else if (curLine.length <= 0 || curLine.charAt(0) === "#") {
			// collect version number (from a comment.. hacky I know)
			if (curLine.indexOf("# BITSY VERSION ") != -1) {
				versionNumber = parseFloat(curLine.replace("# BITSY VERSION ", ""));

				if (versionNumber < 5.0) {
					compatibilityFlags.convertSayToPrint = true;
				}

				if (versionNumber < 7.0) {
					compatibilityFlags.combineEndingsWithDialog = true;
					compatibilityFlags.convertImplicitSpriteDialogIds = true;
				}
			}

			//skip blank lines & comments
			i++;
		}
		else if (getType(curLine) == "PAL") {
			i = parsePalette(lines, i);
		}
		else if (getType(curLine) === "ROOM" || getType(curLine) === "SET") { //SET for back compat
			i = parseRoom(lines, i, compatibilityFlags);
		}
		else if (getType(curLine) === "TIL") {
			i = parseTile(lines, i);
		}
		else if (getType(curLine) === "SPR") {
			i = parseSprite(lines, i);
		}
		else if (getType(curLine) === "ITM") {
			i = parseItem(lines, i);
		}
		else if (getType(curLine) === "DRW") {
			i = parseDrawing(lines, i);
		}
		else if (getType(curLine) === "DLG") {
			i = parseDialog(lines, i, compatibilityFlags);
		}
		else if (getType(curLine) === "END" && compatibilityFlags.combineEndingsWithDialog) {
			// parse endings for back compat
			i = parseEnding(lines, i, compatibilityFlags);
		}
		else if (getType(curLine) === "VAR") {
			i = parseVariable(lines, i);
		}
		else if (getType(curLine) === "DEFAULT_FONT") {
			i = parseFontName(lines, i);
		}
		else if (getType(curLine) === "TEXT_DIRECTION") {
			i = parseTextDirection(lines, i);
		}
		else if (getType(curLine) === "FONT") {
			i = parseFontData(lines, i);
		}
		else if (getType(curLine) === "!") {
			i = parseFlag(lines, i);
		}
		else {
			i++;
		}
	}

	placeSprites();

	var roomIds = Object.keys(room);

	if (player() != undefined && player().room != null && roomIds.indexOf(player().room) != -1) {
		// player has valid room
		curRoom = player().room;
	}
	else if (roomIds.length > 0) {
		// player not in any room! what the heck
		curRoom = roomIds[0];
	}
	else {
		// uh oh there are no rooms I guess???
		curRoom = null;
	}

	if (curRoom != null) {
		initRoom(curRoom);
	}

	scriptCompatibility(compatibilityFlags);

	return versionNumber;
}

function scriptCompatibility(compatibilityFlags) {
	if (compatibilityFlags.convertSayToPrint) {
		bitsyLog("CONVERT SAY TO PRINT!");

		var PrintFunctionVisitor = function() {
			var didChange = false;
			this.DidChange = function() { return didChange; };

			this.Visit = function(node) {
				if (node.type != "function") {
					return;
				}

				if (node.name === "say") {
					node.name = "print";
					didChange = true;
				}
			};
		};

		for (dlgId in dialog) {
			var dialogScript = scriptInterpreter.Parse(dialog[dlgId].src);
			var visitor = new PrintFunctionVisitor();
			dialogScript.VisitAll(visitor);
			if (visitor.DidChange()) {
				var newDialog = dialogScript.Serialize();
				if (newDialog.indexOf("\\n") > -1) {
					newDialog = '"""\\n' + newDialog + '\\n"""';
				}
				dialog[dlgId].src = newDialog;
			}
		}
	}
}

//TODO this is in progress and doesn't support all features
function serializeWorld(skipFonts) {
	if (skipFonts === undefined || skipFonts === null)
		skipFonts = false;

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
			if( palette[id].name != null )
				worldStr += "NAME " + palette[id].name + "\\n";
			for (i in getPal(id)) {
				for (j in getPal(id)[i]) {
					worldStr += getPal(id)[i][j];
					if (j < 2) worldStr += ",";
				}
				worldStr += "\\n";
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
	/* VARIABLES */
	for (id in variable) {
		worldStr += "VAR " + id + "\\n";
		worldStr += variable[id] + "\\n";
		worldStr += "\\n";
	}
	/* FONT */
	// TODO : support multiple fonts
	if (fontName != defaultFontName && !skipFonts) {
		worldStr += fontManager.GetData(fontName);
	}

	return worldStr;
}

function serializeDrawing(drwId) {
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
	var hasValidStartPos = e.x >= 0 && e.x < 16 && e.y >= 0 && e.y < 16;
	var hasDest = e.dest != null;
	var hasValidRoomDest = (e.dest.room != null && e.dest.x >= 0 && e.dest.x < 16 && e.dest.y >= 0 && e.dest.y < 16);
	return hasValidStartPos && hasDest && hasValidRoomDest;
}

function placeSprites() {
	for (id in spriteStartLocations) {
		//bitsyLog(id);
		//bitsyLog( spriteStartLocations[id] );
		//bitsyLog(sprite[id]);
		sprite[id].room = spriteStartLocations[id].room;
		sprite[id].x = spriteStartLocations[id].x;
		sprite[id].y = spriteStartLocations[id].y;
		//bitsyLog(sprite[id]);
	}
}

/* ARGUMENT GETTERS */
function getType(line) {
	return getArg(line,0);
}

function getId(line) {
	return getArg(line,1);
}

function getArg(line,arg) {
	return line.split(" ")[arg];
}

function getCoord(line,arg) {
	return getArg(line,arg).split(",");
}

function parseTitle(lines, i) {
	var results = scriptUtils.ReadDialogScript(lines,i);
	setTitle(results.script);
	i = results.index;

	i++;

	return i;
}

function parseRoom(lines, i, compatibilityFlags) {
	var id = getId(lines[i]);
	room[id] = {
		id : id,
		tilemap : [],
		walls : [],
		exits : [],
		endings : [],
		items : [],
		pal : null,
		name : null
	};
	i++;

	// create tile map
	if ( flags.ROOM_FORMAT == 0 ) {
		// old way: no commas, single char tile ids
		var end = i + mapsize;
		var y = 0;
		for (; i<end; i++) {
			room[id].tilemap.push( [] );
			for (x = 0; x<mapsize; x++) {
				room[id].tilemap[y].push( lines[i].charAt(x) );
			}
			y++;
		}
	}
	else if ( flags.ROOM_FORMAT == 1 ) {
		// new way: comma separated, multiple char tile ids
		var end = i + mapsize;
		var y = 0;
		for (; i<end; i++) {
			room[id].tilemap.push( [] );
			var lineSep = lines[i].split(",");
			for (x = 0; x<mapsize; x++) {
				room[id].tilemap[y].push( lineSep[x] );
			}
			y++;
		}
	}

	while (i < lines.length && lines[i].length > 0) { //look for empty line
		// bitsyLog(getType(lines[i]));
		if (getType(lines[i]) === "SPR") {
			/* NOTE SPRITE START LOCATIONS */
			var sprId = getId(lines[i]);
			if (sprId.indexOf(",") == -1 && lines[i].split(" ").length >= 3) { //second conditional checks for coords
				/* PLACE A SINGLE SPRITE */
				var sprCoord = lines[i].split(" ")[2].split(",");
				spriteStartLocations[sprId] = {
					room : id,
					x : parseInt(sprCoord[0]),
					y : parseInt(sprCoord[1])
				};
			}
			else if ( flags.ROOM_FORMAT == 0 ) { // TODO: right now this shortcut only works w/ the old comma separate format
				/* PLACE MULTIPLE SPRITES*/ 
				//Does find and replace in the tilemap (may be hacky, but its convenient)
				var sprList = sprId.split(",");
				for (row in room[id].tilemap) {
					for (s in sprList) {
						var col = room[id].tilemap[row].indexOf( sprList[s] );
						//if the sprite is in this row, replace it with the "null tile" and set its starting position
						if (col != -1) {
							room[id].tilemap[row][col] = "0";
							spriteStartLocations[ sprList[s] ] = {
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
			room[id].items.push( itm );
		}
		else if (getType(lines[i]) === "WAL") {
			/* DEFINE COLLISIONS (WALLS) */
			room[id].walls = getId(lines[i]).split(",");
		}
		else if (getType(lines[i]) === "EXT") {
			/* ADD EXIT */
			var exitArgs = lines[i].split(" ");
			//arg format: EXT 10,5 M 3,2 [AVA:7 LCK:a,9] [AVA 7 LCK a 9]
			var exitCoords = exitArgs[1].split(",");
			var destName = exitArgs[2];
			var destCoords = exitArgs[3].split(",");
			var ext = {
				x : parseInt(exitCoords[0]),
				y : parseInt(exitCoords[1]),
				dest : {
					room : destName,
					x : parseInt(destCoords[0]),
					y : parseInt(destCoords[1])
				},
				transition_effect : null,
				dlg: null,
			};

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

			room[id].exits.push(ext);
		}
		else if (getType(lines[i]) === "END") {
			/* ADD ENDING */
			var endId = getId(lines[i]);

			// compatibility with when endings were stored separate from other dialog
			if (compatibilityFlags.combineEndingsWithDialog) {
				endId = "end_" + endId;
			}

			var endCoords = getCoord(lines[i], 2);
			var end = {
				id : endId,
				x : parseInt(endCoords[0]),
				y : parseInt(endCoords[1])
			};

			room[id].endings.push(end);
		}
		else if (getType(lines[i]) === "PAL") {
			/* CHOOSE PALETTE (that's not default) */
			room[id].pal = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			var name = lines[i].split(/\\s(.+)/)[1];
			room[id].name = name;
			names.room[name] = id;
		}

		i++;
	}

	return i;
}

function parsePalette(lines,i) { //todo this has to go first right now :(
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
	palette[id] = {
		id : id,
		name : name,
		colors : colors
	};
	return i;
}

function parseTile(lines, i) {
	var id = getId(lines[i]);
	var tileData = createDrawingData("TIL", id);

	i++;

	// read & store tile image source
	i = parseDrawingCore(lines, i, tileData.drw);

	// update animation info
	tileData.animation.frameCount = renderer.GetFrameCount(tileData.drw);
	tileData.animation.isAnimated = tileData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			tileData.col = parseInt(getId(lines[i]));
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			tileData.name = lines[i].split(/\\s(.+)/)[1];
			names.tile[tileData.name] = id;
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
	tile[id] = tileData;

	return i;
}

function parseSprite(lines, i) {
	var id = getId(lines[i]);
	var type = (id === "A") ? "AVA" : "SPR";
	var spriteData = createDrawingData(type, id);

	bitsyLog(spriteData);

	i++;

	// read & store sprite image source
	i = parseDrawingCore(lines, i, spriteData.drw);

	// update animation info
	spriteData.animation.frameCount = renderer.GetFrameCount(spriteData.drw);
	spriteData.animation.isAnimated = spriteData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			spriteData.col = parseInt(getId(lines[i]));
		}
		else if (getType(lines[i]) === "POS") {
			/* STARTING POSITION */
			var posArgs = lines[i].split(" ");
			var roomId = posArgs[1];
			var coordArgs = posArgs[2].split(",");
			spriteStartLocations[id] = {
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
			spriteData.name = lines[i].split(/\\s(.+)/)[1];
			names.sprite[spriteData.name] = id;
		}
		else if (getType(lines[i]) === "ITM") {
			/* ITEM STARTING INVENTORY */
			var itemId = getId(lines[i]);
			var itemCount = parseFloat(getArg(lines[i], 2));
			spriteData.inventory[itemId] = itemCount;
		}

		i++;
	}

	// store sprite data
	sprite[id] = spriteData;

	return i;
}

function parseItem(lines, i) {
	var id = getId(lines[i]);
	var itemData = createDrawingData("ITM", id);

	i++;

	// read & store item image source
	i = parseDrawingCore(lines, i, itemData.drw);

	// update animation info
	itemData.animation.frameCount = renderer.GetFrameCount(itemData.drw);
	itemData.animation.isAnimated = itemData.animation.frameCount > 1;

	// read other properties
	while (i < lines.length && lines[i].length > 0) { // look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			itemData.col = parseInt(getArg(lines[i], 1));
		}
		else if (getType(lines[i]) === "DLG") {
			itemData.dlg = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			itemData.name = lines[i].split(/\\s(.+)/)[1];
			names.item[itemData.name] = id;
		}

		i++;
	}

	// store item data
	item[id] = itemData;

	return i;
}

function parseDrawing(lines, i) {
	// store drawing source
	var drwId = getId( lines[i] );
	return parseDrawingCore( lines, i, drwId );
}

function parseDrawingCore(lines, i, drwId) {
	var frameList = []; //init list of frames
	frameList.push( [] ); //init first frame
	var frameIndex = 0;
	var y = 0;
	while ( y < tilesize ) {
		var l = lines[i+y];
		var row = [];
		for (x = 0; x < tilesize; x++) {
			row.push( parseInt( l.charAt(x) ) );
		}
		frameList[frameIndex].push( row );
		y++;

		if (y === tilesize) {
			i = i + y;
			if ( lines[i] != undefined && lines[i].charAt(0) === ">" ) {
				// start next frame!
				frameList.push( [] );
				frameIndex++;
				//start the count over again for the next frame
				i++;
				y = 0;
			}
		}
	}

	renderer.SetDrawingSource(drwId, frameList);

	return i;
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
		col : (type === "TIL") ? 1 : 2,
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
	}

	return drawingData;
}

function parseScript(lines, i, backCompatPrefix, compatibilityFlags) {
	var id = getId(lines[i]);
	id = backCompatPrefix + id;
	i++;

	var results = scriptUtils.ReadDialogScript(lines,i);

	dialog[id] = { src: results.script, name: null, id: id, };

	if (compatibilityFlags.convertImplicitSpriteDialogIds) {
		// explicitly hook up dialog that used to be implicitly
		// connected by sharing sprite and dialog IDs in old versions
		if (sprite[id]) {
			if (sprite[id].dlg === undefined || sprite[id].dlg === null) {
				sprite[id].dlg = id;
			}
		}
	}

	i = results.index;

	return i;
}

function parseDialog(lines, i, compatibilityFlags) {
	// hacky but I need to store this so I can set the name below
	var id = getId(lines[i]);

	i = parseScript(lines, i, "", compatibilityFlags);

	if (lines[i].length > 0 && getType(lines[i]) === "NAME") {
		dialog[id].name = lines[i].split(/\\s(.+)/)[1]; // TODO : hacky to keep copying this regex around...
		names.dialog[dialog[id].name] = id;
		i++;
	}

	return i;
}

// keeping this around to parse old files where endings were separate from dialogs
function parseEnding(lines, i, compatibilityFlags) {
	return parseScript(lines, i, "end_", compatibilityFlags);
}

function parseVariable(lines, i) {
	var id = getId(lines[i]);
	i++;
	var value = lines[i];
	i++;
	variable[id] = value;
	return i;
}

function parseFontName(lines, i) {
	fontName = getArg(lines[i], 1);
	i++;
	return i;
}

function parseTextDirection(lines, i) {
	textDirection = getArg(lines[i], 1);
	i++;
	return i;
}

function parseFontData(lines, i) {
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

function parseFlag(lines, i) {
	var id = getId(lines[i]);
	var valStr = lines[i].split(" ")[2];
	flags[id] = parseInt( valStr );
	i++;
	return i;
}

function drawTile(tileId, x, y) {
	bitsyDrawBegin(0);
	bitsyDrawTile(tileId, x, y);
	bitsyDrawEnd();
}

function drawSprite(tileId, x, y) {
	drawTile(tileId, x, y);
}

function drawItem(tileId, x, y) {
	drawTile(tileId, x, y);
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

	bitsyDrawBegin(0);
	bitsyClear(tileColorStartIndex);
	bitsyDrawEnd();
}

function drawRoom(room, frameIndex) { // frameIndex is optional
	// if (room.id != debugLastRoomDrawn) {
	// 	debugLastRoomDrawn = room.id;
	// 	bitsyLog("DRAW ROOM " + debugLastRoomDrawn);
	// }

	if (room === undefined) {
		// protect against invalid rooms
		return;
	}

	// clear the screen buffer
	bitsyDrawBegin(0);
	bitsyClear(tileColorStartIndex);
	bitsyDrawEnd();

	//draw tiles
	for (i in room.tilemap) {
		for (j in room.tilemap[i]) {
			var id = room.tilemap[i][j];
			var x = parseInt(j);
			var y = parseInt(i);

			if (id != "0") {
				//bitsyLog(id);
				if (tile[id] == null) { // hack-around to avoid corrupting files (not a solution though!)
					id = "0";
					room.tilemap[i][j] = id;
				}
				else {
					// bitsyLog(id);
					drawTile(getTileFrame(tile[id], frameIndex), x, y);
				}
			}
		}
	}

	//draw items
	for (var i = 0; i < room.items.length; i++) {
		var itm = room.items[i];
		drawItem(getItemFrame(item[itm.id], frameIndex), itm.x, itm.y);
	}

	//draw sprites
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === room.id) {
			drawSprite(getSpriteFrame(spr, frameIndex), spr.x, spr.y);
		}
	}
}

// TODO : remove these get*Image methods
function getTileFrame(t, frameIndex) {
	return renderer.GetDrawingFrame(t, frameIndex);
}

function getSpriteFrame(s, frameIndex) {
	return renderer.GetDrawingFrame(s, frameIndex);
}

function getItemFrame(itm, frameIndex) {
	return renderer.GetDrawingFrame(itm, frameIndex);
}

function curPal() {
	return getRoomPal(curRoom);
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
var dialogModule = new Dialog();
var dialogRenderer = dialogModule.CreateRenderer();
var dialogBuffer = dialogModule.CreateBuffer();
var fontManager = new FontManager();

// TODO : is this scriptResult thing being used anywhere???
function onExitDialog(scriptResult, dialogCallback) {
	bitsyLog("EXIT DIALOG!");

	isDialogMode = false;

	if (isNarrating) {
		isNarrating = false;
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
}

/*
TODO
- titles and endings should also take advantage of the script pre-compilation if possible??
- could there be a namespace collision?
- what about dialog NAMEs vs IDs?
- what about a special script block separate from DLG?
*/
function startNarrating(dialogStr,end) {
	bitsyLog("NARRATE " + dialogStr);

	if(end === undefined) {
		end = false;
	}

	isNarrating = true;
	isEnding = end;

	startDialog(dialogStr);
}

function startEndingDialog(ending) {
	isNarrating = true;
	isEnding = true;

	startDialog(
		dialog[ending.id].src,
		ending.id,
		function() {
			var isLocked = ending.property && ending.property.locked === true;
			if (isLocked) {
				isEnding = false;
			}
		},
		ending);
}

function startItemDialog(itemId, dialogCallback) {
	var dialogId = item[itemId].dlg;
	// bitsyLog("START ITEM DIALOG " + dialogId);
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
	// bitsyLog("START SPRITE DIALOG " + dialogId);
	if (dialog[dialogId]){
		var dialogStr = dialog[dialogId].src;
		startDialog(dialogStr,dialogId);
	}
}

function startDialog(dialogStr, scriptId, dialogCallback, objectContext) {
	// bitsyLog("START DIALOG ");
	if (dialogStr.length <= 0) {
		// bitsyLog("ON EXIT DIALOG -- startDialog 1");
		onExitDialog(null, dialogCallback);
		return;
	}

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
var scriptModule = new Script();
var scriptInterpreter = scriptModule.CreateInterpreter();
var scriptUtils = scriptModule.CreateUtils(); // TODO: move to editor.js?
// scriptInterpreter.SetDialogBuffer( dialogBuffer );

/* EVENTS */
bitsyOnUpdate(update);
bitsyOnQuit(stopGame);
bitsyOnLoad(load_game);
<\/script>

<!-- store default font in separate script tag for back compat-->
<!-- Borksy modification: uses better encoded default font. -->
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
