var t=`<!DOCTYPE HTML>
<html>

<!-- HEADER -->

<!-- Borksy {{BORKSY-VERSION}} -->
<!-- bitsy-hacks {{HACKS-VERSION}} -->
<!-- Bitsy 7.0 -->
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
	attachCanvas( document.getElementById("game") );
	load_game( document.getElementById("exportedGameData").text.slice(1) );
}
<\/script>

<script>
//hex-to-rgb method borrowed from stack overflow
function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

function hslToHex(h,s,l) {
    var rgbArr = hslToRgb(h,s,l);
    return rgbToHex( Math.floor(rgbArr[0]), Math.floor(rgbArr[1]), Math.floor(rgbArr[2]) );
}

function hexToHsl(hex) {
    var rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// really just a vector distance
function colorDistance(a1,b1,c1,a2,b2,c2) {
    return Math.sqrt( Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2) + Math.pow(c1 - c2, 2) );
}

function hexColorDistance(hex1,hex2) {
    var color1 = hexToRgb(hex1);
    var color2 = hexToRgb(hex2);
    return rgbColorDistance(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
}


// source : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

// source : https://gist.github.com/mjackson/5311256
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

/**
 * From: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
<\/script>

<script>
var TransitionManager = function() {
	var transitionStart = null;
	var transitionEnd = null;
	var effectImage = null;

	var isTransitioning = false;
	var transitionTime = 0; // milliseconds
	var frameRate = 8; // cap the FPS
	var prevStep = -1; // used to avoid running post-process effect constantly

	this.BeginTransition = function(startRoom,startX,startY,endRoom,endX,endY,effectName) {
		// console.log("--- START ROOM TRANSITION ---");

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

		drawRoom(room[startRoom]);
		var startPalette = getPal( room[startRoom].pal );
		var startImage = new PostProcessImage( ctx.getImageData(0,0,canvas.width,canvas.height) ); // TODO : don't use global ctx?
		transitionStart = new TransitionInfo(startImage, startPalette, startX, startY);

		if (transitionEffects[curEffect].showPlayerEnd) {
			player().room = endRoom;
			player().x = endX;
			player().y = endY;
		}
		else {
			player().room = "_transition_none";
		}

		drawRoom(room[endRoom]);
		var endPalette = getPal( room[endRoom].pal );
		var endImage = new PostProcessImage( ctx.getImageData(0,0,canvas.width,canvas.height) );
		transitionEnd = new TransitionInfo(endImage, endPalette, endX, endY);

		effectImage = new PostProcessImage( ctx.createImageData(canvas.width,canvas.height) );

		isTransitioning = true;
		transitionTime = 0;
		prevStep = -1;

		player().room = tmpRoom;
		player().x = tmpX;
		player().y = tmpY;
	}

	this.UpdateTransition = function(dt) {
		if (!isTransitioning) {
			return;
		}

		transitionTime += dt;

		var transitionDelta = transitionTime / transitionEffects[curEffect].duration;
		var maxStep = Math.floor(frameRate * (transitionEffects[curEffect].duration / 1000));
		var step = Math.floor(transitionDelta * maxStep);

		if (step != prevStep) {
			// console.log("step! " + step + " " + transitionDelta);
			for (var y = 0; y < effectImage.Height; y++) {
				for (var x = 0; x < effectImage.Width; x++) {
					var color = transitionEffects[curEffect].pixelEffectFunc(transitionStart,transitionEnd,x,y,(step / maxStep));
					effectImage.SetPixel(x,y,color);
				}
			}
		}
		prevStep = step;

		ctx.putImageData(effectImage.GetData(), 0, 0);

		if (transitionTime >= transitionEffects[curEffect].duration) {
			isTransitioning = false;
			transitionTime = 0;
			transitionStart = null;
			transitionEnd = null;
			effectImage = null;
			prevStep = -1;

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
		pixelEffectFunc : function() {},
	});

	this.RegisterTransitionEffect("fade_w", { // TODO : have it linger on full white briefly?
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 750,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelColorA = delta < 0.5 ? start.Image.GetPixel(pixelX,pixelY) : {r:255,g:255,b:255,a:255};
			var pixelColorB = delta < 0.5 ? {r:255,g:255,b:255,a:255} : end.Image.GetPixel(pixelX,pixelY);

			delta = delta < 0.5 ? (delta / 0.5) : ((delta - 0.5) / 0.5); // hacky

			return PostProcessUtilities.LerpColor(pixelColorA, pixelColorB, delta);
		}
	});

	this.RegisterTransitionEffect("fade_b", {
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 750,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelColorA = delta < 0.5 ? start.Image.GetPixel(pixelX,pixelY) : {r:0,g:0,b:0,a:255};
			var pixelColorB = delta < 0.5 ? {r:0,g:0,b:0,a:255} : end.Image.GetPixel(pixelX,pixelY);

			delta = delta < 0.5 ? (delta / 0.5) : ((delta - 0.5) / 0.5); // hacky

			return PostProcessUtilities.LerpColor(pixelColorA, pixelColorB, delta);
		}
	});

	this.RegisterTransitionEffect("wave", {
		showPlayerStart : true,
		showPlayerEnd : true,
		duration : 1500,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
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
			return curImage.GetPixel(pixelX,pixelY);
		}
	});

	this.RegisterTransitionEffect("tunnel", {
		showPlayerStart : true,
		showPlayerEnd : true,
		duration : 1500,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			if (delta <= 0.4) {
				var tunnelDelta = 1 - (delta / 0.4);

				var xDist = start.PlayerCenter.x - pixelX;
				var yDist = start.PlayerCenter.y - pixelY;
				var dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

				if (dist > start.Image.Width * tunnelDelta) {
					return {r:0,g:0,b:0,a:255};
				}
				else {
					return start.Image.GetPixel(pixelX,pixelY);
				}
			}
			else if (delta <= 0.6)
			{
				return {r:0,g:0,b:0,a:255};
			}
			else {
				var tunnelDelta = (delta - 0.6) / 0.4;

				var xDist = end.PlayerCenter.x - pixelX;
				var yDist = end.PlayerCenter.y - pixelY;
				var dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

				if (dist > end.Image.Width * tunnelDelta) {
					return {r:0,g:0,b:0,a:255};
				}
				else {
					return end.Image.GetPixel(pixelX,pixelY);
				}
			}
		}
	});

	this.RegisterTransitionEffect("slide_u", {
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 1000,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelOffset = -1 * Math.floor(start.Image.Height * delta);
			var slidePixelY = pixelY + pixelOffset;

			var colorDelta = clampLerp(delta, 0.4);

			if (slidePixelY >= 0) {
				var colorA = start.Image.GetPixel(pixelX,slidePixelY);
				var colorB = PostProcessUtilities.GetCorrespondingColorFromPal(colorA,start.Palette,end.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
			else {
				slidePixelY += start.Image.Height;
				var colorB = end.Image.GetPixel(pixelX,slidePixelY);
				var colorA = PostProcessUtilities.GetCorrespondingColorFromPal(colorB,end.Palette,start.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
		}
	});

	this.RegisterTransitionEffect("slide_d", {
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 1000,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelOffset = Math.floor(start.Image.Height * delta);
			var slidePixelY = pixelY + pixelOffset;

			var colorDelta = clampLerp(delta, 0.4);

			if (slidePixelY < start.Image.Height) {
				var colorA = start.Image.GetPixel(pixelX,slidePixelY);
				var colorB = PostProcessUtilities.GetCorrespondingColorFromPal(colorA,start.Palette,end.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
			else {
				slidePixelY -= start.Image.Height;
				var colorB = end.Image.GetPixel(pixelX,slidePixelY);
				var colorA = PostProcessUtilities.GetCorrespondingColorFromPal(colorB,end.Palette,start.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
		}
	});

	this.RegisterTransitionEffect("slide_l", {
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 1000,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelOffset = -1 * Math.floor(start.Image.Width * delta);
			var slidePixelX = pixelX + pixelOffset;

			var colorDelta = clampLerp(delta, 0.4);

			if (slidePixelX >= 0) {
				var colorA = start.Image.GetPixel(slidePixelX,pixelY);
				var colorB = PostProcessUtilities.GetCorrespondingColorFromPal(colorA,start.Palette,end.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
			else {
				slidePixelX += start.Image.Width;
				var colorB = end.Image.GetPixel(slidePixelX,pixelY);
				var colorA = PostProcessUtilities.GetCorrespondingColorFromPal(colorB,end.Palette,start.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
		}
	});

	this.RegisterTransitionEffect("slide_r", {
		showPlayerStart : false,
		showPlayerEnd : true,
		duration : 1000,
		pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
			var pixelOffset = Math.floor(start.Image.Width * delta);
			var slidePixelX = pixelX + pixelOffset;

			var colorDelta = clampLerp(delta, 0.4);

			if (slidePixelX < start.Image.Width) {
				var colorA = start.Image.GetPixel(slidePixelX,pixelY);
				var colorB = PostProcessUtilities.GetCorrespondingColorFromPal(colorA,start.Palette,end.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
			else {
				slidePixelX -= start.Image.Width;
				var colorB = end.Image.GetPixel(slidePixelX,pixelY);
				var colorA = PostProcessUtilities.GetCorrespondingColorFromPal(colorB,end.Palette,start.Palette);
				var colorLerped = PostProcessUtilities.LerpColor(colorA, colorB, colorDelta);
				return colorLerped;
			}
		}
	});

	function clampLerp(deltaIn, clampDuration) {
		var clampOffset = (1.0 - clampDuration) / 2;
		var deltaOut = Math.min(clampDuration, Math.max(0.0, deltaIn - clampOffset)) / clampDuration;
		return deltaOut;
	}

	// TODO : WIP
	// this.RegisterTransitionEffect("fuzz", {
	// 	showPlayerStart : true,
	// 	showPlayerEnd : true,
	// 	duration : 1500,
	// 	pixelEffectFunc : function(start,end,pixelX,pixelY,delta) {
	// 		var curImage = delta <= 0.5 ? start : end;
	// 		var sampleSize = delta <= 0.5 ? (2 + Math.floor(14 * (delta/0.5))) : (16 - Math.floor(14 * ((delta-0.5)/0.5)));

	// 		var palIndex = 0;

	// 		var sampleX = Math.floor(pixelX / sampleSize) * sampleSize;
	// 		var sampleY = Math.floor(pixelY / sampleSize) * sampleSize;

	// 		var frameState = transitionEffects["fuzz"].frameState;

	// 		if (frameState.time != delta) {
	// 			frameState.time = delta;
	// 			frameState.preCalcSampleValues = {};
	// 		}

	// 		if (frameState.preCalcSampleValues[[sampleX,sampleY]]) {
	// 			palIndex = frameState.preCalcSampleValues[[sampleX,sampleY]];
	// 		}
	// 		else {
	// 			var paletteCount = {};
	// 			var foregroundValue = 1.0;
	// 			var backgroundValue = 0.4;
	// 			for (var y = sampleY; y < sampleY + sampleSize; y++) {
	// 				for (var x = sampleX; x < sampleX + sampleSize; x++) {
	// 					var color = curImage.Image.GetPixel(x,y)
	// 					var palIndex = PostProcessUtilities.GetColorPalIndex(color,curImage.Palette);
	// 					if (palIndex != -1) {
	// 						if (paletteCount[palIndex]) {
	// 							paletteCount[palIndex] += (palIndex != 0) ? foregroundValue : backgroundValue;
	// 						}
	// 						else {
	// 							paletteCount[palIndex] = (palIndex != 0) ? foregroundValue : backgroundValue;
	// 						}
	// 					}
	// 				}
	// 			}

	// 			var maxCount = 0;
	// 			for (var i in paletteCount) {
	// 				if (paletteCount[i] > maxCount) {
	// 					palIndex = i;
	// 					maxCount = paletteCount[i];
	// 				}
	// 			}

	// 			frameState.preCalcSampleValues[[sampleX,sampleY]] = palIndex;
	// 		}

	// 		return PostProcessUtilities.GetPalColor(curImage.Palette,palIndex);
	// 	},
	// 	frameState : { // ok this is hacky but it's for performance ok
	// 		time : -1,
	// 		preCalcSampleValues : {}
	// 	}
	// });
}; // TransitionManager()


// TODO : extract the scale variable so it can be changed?
var PostProcessUtilities = {
	SamplePixelColor : function(image,x,y) {
		var pixelIndex = (y * scale * image.width * 4) + (x * scale * 4);
		var r = image.data[pixelIndex + 0];
		var g = image.data[pixelIndex + 1];
		var b = image.data[pixelIndex + 2];
		var a = image.data[pixelIndex + 3];
		return { r:r, g:g, b:b, a:a };
	},
	SetPixelColor : function(image,x,y,colorRgba) {
		for (var yDelta = 0; yDelta <= scale; yDelta++) {
			for (var xDelta = 0; xDelta <= scale; xDelta++) {
				var pixelIndex = (((y * scale) + yDelta) * image.width * 4) + (((x * scale) + xDelta) * 4);
				image.data[pixelIndex + 0] = colorRgba.r;
				image.data[pixelIndex + 1] = colorRgba.g;
				image.data[pixelIndex + 2] = colorRgba.b;
				image.data[pixelIndex + 3] = colorRgba.a;
			}
		}
	},
	LerpColor : function(colorA,colorB,t) {
		// TODO: move to color_util.js?
		return {
			r : colorA.r + ((colorB.r - colorA.r) * t),
			g : colorA.g + ((colorB.g - colorA.g) * t),
			b : colorA.b + ((colorB.b - colorA.b) * t),
			a : colorA.a + ((colorB.a - colorA.a) * t),
		};
	},
	GetColorPalIndex : function(colorIn,curPal) {
		var colorIndex = -1;

		for (var i = 0; i < curPal.length; i++) {
			if (colorIn.r == curPal[i][0] && colorIn.g == curPal[i][1] && colorIn.b == curPal[i][2]) {
				colorIndex = i;
			}
		}

		return colorIndex;
	},
	GetPalColor : function(palette,index) {
		return { r: palette[index][0], g: palette[index][1], b: palette[index][2], a: 255 }
	},
	GetCorrespondingColorFromPal : function(colorIn,curPal,otherPal) { // this is kind of hacky!
		var colorIndex = PostProcessUtilities.GetColorPalIndex(colorIn,curPal);

		if (colorIndex >= 0 && colorIndex <= otherPal.length) {
			return PostProcessUtilities.GetPalColor(otherPal,colorIndex);
		}
		else {
			return colorIn;
		}
	},
};

var PostProcessImage = function(imageData) {
	this.Width = imageData.width / scale;
	this.Height = imageData.height / scale;

	this.GetPixel = function(x,y) {
		return PostProcessUtilities.SamplePixelColor(imageData,x,y);
	};

	this.SetPixel = function(x,y,colorRgba) {
		PostProcessUtilities.SetPixelColor(imageData,x,y,colorRgba);
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
	var invalidCharData = {};

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

	function parseFont(fontData) {
		if (fontData == null)
			return;

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
					chardata[curCharCode] = { 
						width: width,
						height: height,
						offset: {
							x: 0,
							y: 0
						},
						spacing: width,
						data: []
					};
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

		// init invalid character box
		invalidCharData = { 
			width: width,
			height: height,
			offset: {
				x: 0,
				y: 0
			},
			spacing: width, // TODO : name?
			data: []
		};
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
		// console.log("COMPILE");
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
		// console.log("INTERPRET");
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
				console.log("-".repeat(depth) + "- " + node.ToString());
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
	console.log("BITSY SCRIPT WARNING: Tried to use deprecated function");
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
	// console.log("LINEBREAK FUNC");
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
	if(names.sprite.has(spriteId)) spriteId = names.sprite.get(spriteId); // id is actually a name
	var drawingId = sprite[spriteId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printTileFunc(environment,parameters,onReturn) {
	var tileId = parameters[0];
	if(names.tile.has(tileId)) tileId = names.tile.get(tileId); // id is actually a name
	var drawingId = tile[tileId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printItemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];
	if(names.item.has(itemId)) itemId = names.item.get(itemId); // id is actually a name
	var drawingId = item[itemId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printFontFunc(environment, parameters, onReturn) {
	var allCharacters = "";
	var font = fontManager.Get( fontName );
	var codeList = font.allCharCodes();
	for (var i = 0; i < codeList.length; i++) {
		allCharacters += String.fromCharCode(codeList[i]) + " ";
	}
	printFunc(environment, [allCharacters], onReturn);
}

function itemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];

	if (names.item.has(itemId)) {
		// id is actually a name
		itemId = names.item.get(itemId);
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

	console.log("PROPERTY! " + propertyName + " " + outValue);

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

	if (names.room.has(destRoom)) {
		// it's a name, not an id! (note: these could cause trouble if people names things weird)
		destRoom = names.room.get(destRoom);
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

	player().room = destRoom;
	player().x = destX;
	player().y = destY;
	curRoom = destRoom;
	initRoom(curRoom);

	// TODO : this doesn't play nice with pagebreak because it thinks the dialog is finished!
	if (transition.IsTransitionActive()) {
		transition.OnTransitionComplete(function() { onReturn(null); });
	}
	else {
		onReturn(null);
	}
}

/* BUILT-IN OPERATORS */
function setExp(environment,left,right,onReturn) {
	// console.log("SET " + left.name);

	if(left.type != "variable") {
		// not a variable! return null and hope for the best D:
		onReturn( null );
		return;
	}

	right.Eval(environment,function(rVal) {
		environment.SetVariable( left.name, rVal );
		// console.log("VAL " + environment.GetVariable( left.name ) );
		left.Eval(environment,function(lVal) {
			onReturn( lVal );
		});
	});
}
function equalExp(environment,left,right,onReturn) {
	// console.log("EVAL EQUAL");
	// console.log(left);
	// console.log(right);
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

	var functionMap = new Map();
	functionMap.set("print", printFunc);
	functionMap.set("say", printFunc);
	functionMap.set("br", linebreakFunc);
	functionMap.set("item", itemFunc);
	functionMap.set("rbw", rainbowFunc);
	functionMap.set("clr1", color1Func);
	functionMap.set("clr2", color2Func);
	functionMap.set("clr3", color3Func);
	functionMap.set("wvy", wavyFunc);
	functionMap.set("shk", shakyFunc);
	functionMap.set("printSprite", printSpriteFunc);
	functionMap.set("printTile", printTileFunc);
	functionMap.set("printItem", printItemFunc);
	functionMap.set("debugOnlyPrintFont", printFontFunc); // DEBUG ONLY
	functionMap.set("end", endFunc);
	functionMap.set("exit", exitFunc);
	functionMap.set("pg", pagebreakFunc);
	functionMap.set("property", propertyFunc);

	this.HasFunction = function(name) { return functionMap.has(name); };
	this.EvalFunction = function(name,parameters,onReturn,env) {
		if (env == undefined || env == null) {
			env = this;
		}

		functionMap.get(name)(env, parameters, onReturn);
	}

	var variableMap = new Map();

	this.HasVariable = function(name) { return variableMap.has(name); };
	this.GetVariable = function(name) { return variableMap.get(name); };
	this.SetVariable = function(name,value,useHandler) {
		// console.log("SET VARIABLE " + name + " = " + value);
		if(useHandler === undefined) useHandler = true;
		variableMap.set(name, value);
		if(onVariableChangeHandler != null && useHandler){
			onVariableChangeHandler(name);
		}
	};
	this.DeleteVariable = function(name,useHandler) {
		if(useHandler === undefined) useHandler = true;
		if(variableMap.has(name)) {
			variableMap.delete(name);
			if(onVariableChangeHandler != null && useHandler) {
				onVariableChangeHandler(name);
			}
		}
	};

	var operatorMap = new Map();
	operatorMap.set("=", setExp);
	operatorMap.set("==", equalExp);
	operatorMap.set(">", greaterExp);
	operatorMap.set("<", lessExp);
	operatorMap.set(">=", greaterEqExp);
	operatorMap.set("<=", lessEqExp);
	operatorMap.set("*", multExp);
	operatorMap.set("/", divExp);
	operatorMap.set("+", addExp);
	operatorMap.set("-", subExp);

	this.HasOperator = function(sym) { return operatorMap.get(sym); };
	this.EvalOperator = function(sym,left,right,onReturn) {
		operatorMap.get( sym )( this, left, right, onReturn );
	}

	var scriptMap = new Map();
	this.HasScript = function(name) { return scriptMap.has(name); };
	this.GetScript = function(name) { return scriptMap.get(name); };
	this.SetScript = function(name,script) { scriptMap.set(name, script); };

	var onVariableChangeHandler = null;
	this.SetOnVariableChangeHandler = function(onVariableChange) {
		onVariableChangeHandler = onVariableChange;
	}
	this.GetVariableNames = function() {
		return Array.from( variableMap.keys() );
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
	// console.log("WHITESPACE " + depth + " ::" + str + "::");
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
		// console.log(this);
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
		// console.log("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// console.log(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// console.log("<< CHILD " + i);
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

			var curNodeIsNonInlineCode = curNode.type === "code_block" && !isInlineCode(curNode);
			var prevNodeIsNonInlineCode = lastNode && lastNode.type === "code_block" && !isInlineCode(lastNode);

			var shouldIndentFirstLine = (i == 0 && doIndentFirstLine);
			var shouldIndentAfterLinebreak = (lastNode && lastNode.type === "function" && lastNode.name === "br");
			var shouldIndentCodeBlock = i > 0 && curNodeIsNonInlineCode;
			var shouldIndentAfterCodeBlock = prevNodeIsNonInlineCode;

			// need to insert a newline before the first block of non-inline code that isn't 
			// preceded by a {br}, since those will create their own newline
			if (i > 0 && curNodeIsNonInlineCode && !prevNodeIsNonInlineCode && !shouldIndentAfterLinebreak) {
				str += "\\n";
			}

			if (shouldIndentFirstLine || shouldIndentAfterLinebreak || shouldIndentCodeBlock || shouldIndentAfterCodeBlock) {
				str += leadingWhitespace(depth);
			}

			str += curNode.Serialize(depth);

			if (i < this.children.length-1 && curNodeIsNonInlineCode) {
				str += "\\n";
			}

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
		// console.log("EVAL BLOCK " + this.children.length);

		if (isPlayerEmbeddedInEditor && events != undefined && events != null) {
			events.Raise("script_node_enter", { id: this.GetId() });
		}

		var lastVal = null;
		var i = 0;

		function evalChildren(children, done) {
			if (i < children.length) {
				// console.log(">> CHILD " + i);
				children[i].Eval(environment, function(val) {
					// console.log("<< CHILD " + i);
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

		// console.log("SERIALIZE BLOCK!!!");
		// console.log(depth);
		// console.log(doIndentFirstLine);

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
		// console.log("EVAL " + this.name + " " + environment.HasVariable(this.name) + " " + environment.GetVariable(this.name));
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
		// console.log("EVAL " + this.operator);
		var self = this; // hack to deal with scope
		environment.EvalOperator( this.operator, this.left, this.right, 
			function(val){
				// console.log("EVAL EXP " + self.operator + " " + val);
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
		// console.log("SEQUENCE " + index);
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
		// console.log("CYCLE " + index);
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
		// console.log("EVAL IF");
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

		console.log(scriptStr);
		console.log(state.Source());

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
			// console.log(str);
			str = "" + str; // hack to turn single chars into strings
			// console.log(str);
			// console.log(str.length);
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
			// console.log(j);
			while (j < sourceStr.length && end.indexOf(sourceStr[j]) == -1) {
				str += sourceStr[j];
				j++;
			}
			// console.log("PEAK ::" + str + "::");
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

		this.Print = function() { console.log(sourceStr); };
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
		// console.log("IsSequence? " + str);
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
		console.log("~~~ PARSE FUNCTION " + funcName);

		var args = [];

		var curSymbol = "";
		function OnSymbolEnd() {
			curSymbol = curSymbol.trim();
			// console.log("PARAMTER " + curSymbol);
			args.push( StringToValue(curSymbol) );
			// console.log(args);
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
				// console.log("STRING " + str);
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
		// console.log("VALID variable??? " + isValid);
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
			// console.log("STRING");
			var str = "";
			var i = 1;
			while (i < valStr.length && valStr[i] != Sym.String) {
				str += valStr[i];
				i++;
			}
			// console.log(str);
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
			// console.log("NUMBER!!! " + valStr);
			return new LiteralNode( parseFloat(valStr) );
		}
		else if(IsValidVariableName(valStr)) {
			// VARIABLE!!
			// console.log("VARIABLE");
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
		// console.log("EXPRESSION " + line);
		var exp = CreateExpression(line);
		// console.log(exp);
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
		img : null,
		width : 104,
		height : 8+4+2+5, //8 for text, 4 for top-bottom padding, 2 for line padding, 5 for arrow
		top : 12,
		left : 12,
		bottom : 12, //for drawing it from the bottom
		font_scale : 0.5, // we draw font at half-size compared to everything else
		padding_vert : 2,
		padding_horz : 4,
		arrow_height : 5,
	};

	var font = null;
	this.SetFont = function(f) {
		font = f;
		textboxInfo.height = (textboxInfo.padding_vert * 3) + (relativeFontHeight() * 2) + textboxInfo.arrow_height;
		textboxInfo.img = context.createImageData(textboxInfo.width*scale, textboxInfo.height*scale);
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

	var context = null;
	this.AttachContext = function(c) {
		context = c;
	};

	this.ClearTextbox = function() {
		if(context == null) return;

		//create new image none exists
		if(textboxInfo.img == null)
			textboxInfo.img = context.createImageData(textboxInfo.width*scale, textboxInfo.height*scale);

		// fill text box with black
		for (var i=0;i<textboxInfo.img.data.length;i+=4)
		{
			textboxInfo.img.data[i+0]=0;
			textboxInfo.img.data[i+1]=0;
			textboxInfo.img.data[i+2]=0;
			textboxInfo.img.data[i+3]=255;
		}
	};

	var isCentered = false;
	this.SetCentered = function(centered) {
		isCentered = centered;
	};

	this.DrawTextbox = function() {
		if(context == null) return;
		if (isCentered) {
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, ((height/2)-(textboxInfo.height/2))*scale);
		}
		else if (player().y < mapsize/2) {
			//bottom
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, (height-textboxInfo.bottom-textboxInfo.height)*scale);
		}
		else {
			//top
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, textboxInfo.top*scale);
		}
	};

	var arrowdata = [
		1,1,1,1,1,
		0,1,1,1,0,
		0,0,1,0,0
	];
	this.DrawNextArrow = function() {
		// console.log("draw arrow!");
		var top = (textboxInfo.height-5) * scale;
		var left = (textboxInfo.width-(5+4)) * scale;
		if (textDirection === TextDirection.RightToLeft) { // RTL hack
			left = 4 * scale;
		}

		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 5; x++) {
				var i = (y * 5) + x;
				if (arrowdata[i] == 1) {
					//scaling nonsense
					for (var sy = 0; sy < scale; sy++) {
						for (var sx = 0; sx < scale; sx++) {
							var pxl = 4 * ( ((top+(y*scale)+sy) * (textboxInfo.width*scale)) + (left+(x*scale)+sx) );
							textboxInfo.img.data[pxl+0] = 255;
							textboxInfo.img.data[pxl+1] = 255;
							textboxInfo.img.data[pxl+2] = 255;
							textboxInfo.img.data[pxl+3] = 255;
						}
					}
				}
			}
		}
	};

	var text_scale = 2; //using a different scaling factor for text feels like cheating... but it looks better
	this.DrawChar = function(char, row, col, leftPos) {
		char.offset = {
			x: char.base_offset.x,
			y: char.base_offset.y
		}; // compute render offset *every* frame

		char.SetPosition(row,col);
		char.ApplyEffects(effectTime);

		var charData = char.bitmap;

		var top = (4 * scale) + (row * 2 * scale) + (row * font.getHeight() * text_scale) + Math.floor( char.offset.y );
		var left = (4 * scale) + (leftPos * text_scale) + Math.floor( char.offset.x );

		var debug_r = Math.random() * 255;

		for (var y = 0; y < char.height; y++) {
			for (var x = 0; x < char.width; x++) {

				var i = (y * char.width) + x;
				if ( charData[i] == 1 ) {

					//scaling nonsense
					for (var sy = 0; sy < text_scale; sy++) {
						for (var sx = 0; sx < text_scale; sx++) {
							var pxl = 4 * ( ((top+(y*text_scale)+sy) * (textboxInfo.width*scale)) + (left+(x*text_scale)+sx) );
							textboxInfo.img.data[pxl+0] = char.color.r;
							textboxInfo.img.data[pxl+1] = char.color.g;
							textboxInfo.img.data[pxl+2] = char.color.b;
							textboxInfo.img.data[pxl+3] = char.color.a;
						}
					}
				}
				// else {
				// 	// DEBUG

				// 	//scaling nonsense
				// 	for (var sy = 0; sy < text_scale; sy++) {
				// 		for (var sx = 0; sx < text_scale; sx++) {
				// 			var pxl = 4 * ( ((top+(y*text_scale)+sy) * (textboxInfo.width*scale)) + (left+(x*text_scale)+sx) );
				// 			textboxInfo.img.data[pxl+0] = debug_r;
				// 			textboxInfo.img.data[pxl+1] = 0;
				// 			textboxInfo.img.data[pxl+2] = 0;
				// 			textboxInfo.img.data[pxl+3] = 255;
				// 		}
				// 	}
				// }

			}
		}
		
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
			// console.log(charCount);

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
					// console.log(j + " " + leftPos);

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
		console.log("SKIPPP");
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
		console.log("CONTINUE");

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
			console.log("FLIP PAGE!");
			//start next page
			this.FlipPage();
			return true; /* hasMoreDialog */
		}
		else {
			console.log("END DIALOG!");
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

		this.color = { r:255, g:255, b:255, a:255 };
		this.offset = { x:0, y:0 }; // in pixels (screen pixels?)

		this.col = 0;
		this.row = 0;

		this.SetPosition = function(row,col) {
			// console.log("SET POS");
			// console.log(this);
			this.row = row;
			this.col = col;
		}

		this.ApplyEffects = function(time) {
			// console.log("APPLY EFFECTS! " + time);
			for(var i = 0; i < this.effectList.length; i++) {
				var effectName = this.effectList[i];
				// console.log("FX " + effectName);
				TextEffects[ effectName ].DoEffect( this, time );
			}
		}

		var printHandler = null; // optional function to be called once on printing character
		this.SetPrintHandler = function(handler) {
			printHandler = handler;
		}
		this.OnPrint = function() {
			if (printHandler != null) {
				// console.log("PRINT HANDLER ---- DIALOG BUFFER");
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

		var imageData = renderer.GetImageSource(drawingId)[0];
		var imageDataFlat = [];
		for (var i = 0; i < imageData.length; i++) {
			// console.log(imageData[i]);
			imageDataFlat = imageDataFlat.concat(imageData[i]);
		}

		this.bitmap = imageDataFlat;
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
		// console.log("DRAWING ID " + drawingId);

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
		console.log("ADD TEXT " + textStr);

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

		// console.log(buffer);

		isActive = true;
	};

	this.AddLinebreak = function() {
		var lastPage = buffer[buffer.length-1];
		if (lastPage.length <= 1) {
			// console.log("LINEBREAK - NEW ROW ");
			// add new row
			lastPage.push([]);
		}
		else {
			// add new page
			buffer.push([[]]);
		}
		// console.log(buffer);

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
var TextEffects = new Map();

var RainbowEffect = function() { // TODO - should it be an object or just a method?
	this.DoEffect = function(char,time) {
		// console.log("RAINBOW!!!");
		// console.log(char);
		// console.log(char.color);
		// console.log(char.col);

		var h = Math.abs( Math.sin( (time / 600) - (char.col / 8) ) );
		var rgb = hslToRgb( h, 1, 0.5 );
		char.color.r = rgb[0];
		char.color.g = rgb[1];
		char.color.b = rgb[2];
		char.color.a = 255;
	}
};
TextEffects["rbw"] = new RainbowEffect();

var ColorEffect = function(index) {
	this.DoEffect = function(char) {
		var pal = getPal( curPal() );
		var color = pal[ parseInt( index ) ];
		// console.log(color);
		char.color.r = color[0];
		char.color.g = color[1];
		char.color.b = color[2];
		char.color.a = 255;
	}
};
TextEffects["clr1"] = new ColorEffect(0);
TextEffects["clr2"] = new ColorEffect(1); // TODO : should I use parameters instead of special names?
TextEffects["clr3"] = new ColorEffect(2);

var WavyEffect = function() {
	this.DoEffect = function(char,time) {
		char.offset.y += Math.sin( (time / 250) - (char.col / 2) ) * 4;
	}
};
TextEffects["wvy"] = new WavyEffect();

var ShakyEffect = function() {
	function disturb(func,time,offset,mult1,mult2) {
		return func( (time * mult1) - (offset * mult2) );
	}

	this.DoEffect = function(char,time) {
		char.offset.y += 3
						* disturb(Math.sin,time,char.col,0.1,0.5)
						* disturb(Math.cos,time,char.col,0.3,0.2)
						* disturb(Math.sin,time,char.row,2.0,1.0);
		char.offset.x += 3
						* disturb(Math.cos,time,char.row,0.1,1.0)
						* disturb(Math.sin,time,char.col,3.0,0.7)
						* disturb(Math.cos,time,char.col,0.2,0.3);
	}
};
TextEffects["shk"] = new ShakyEffect();

var DebugHighlightEffect = function() {
	this.DoEffect = function(char) {
		char.color.r = 255;
		char.color.g = 255;
		char.color.b = 0;
		char.color.a = 255;
	}
}
TextEffects["_debug_highlight"] = new DebugHighlightEffect();

} // Dialog()
<\/script>

<script>
/*
TODO
- reset renderer function
- react to changes in: drawings, palettes
- possible future plan: limit size of cache (remove old images)
- change image store path from (pal > col > draw) to (draw > pal > col)
- get rid of old getSpriteImage (etc) methods
- get editor working again [in progress]
- move debug timer class into core (seems useful)
*/

function Renderer(tilesize, scale) {

console.log("!!!!! NEW RENDERER");

var imageStore = { // TODO : rename to imageCache
	source: {},
	render: {}
};

var palettes = null; // TODO : need null checks?
var context = null;

function setPalettes(paletteObj) {
	palettes = paletteObj;

	// TODO : should this really clear out the render cache?
	imageStore.render = {};
}

function getPaletteColor(paletteId, colorIndex) {
	if (palettes[paletteId] === undefined) {
		paletteId = "default";
	}

	var palette = palettes[paletteId];

	if (colorIndex > palette.colors.length) { // do I need this failure case? (seems un-reliable)
		colorIndex = 0;
	}

	var color = palette.colors[colorIndex];

	return {
		r : color[0],
		g : color[1],
		b : color[2]
	};
}

var debugRenderCount = 0;

// TODO : change image store path from (pal > col > draw) to (draw > pal > col)
function renderImage(drawing, paletteId) {
	// debugRenderCount++;
	// console.log("RENDER COUNT " + debugRenderCount);

	var col = drawing.col;
	var colStr = "" + col;
	var pal = paletteId;
	var drwId = drawing.drw;
	var imgSrc = imageStore.source[ drawing.drw ];

	// initialize render cache entry
	if (imageStore.render[drwId] === undefined || imageStore.render[drwId] === null) {
		imageStore.render[drwId] = {};
	}

	if (imageStore.render[drwId][pal] === undefined || imageStore.render[drwId][pal] === null) {
		imageStore.render[drwId][pal] = {};
	}

	// create array of ImageData frames
	imageStore.render[drwId][pal][colStr] = [];

	for (var i = 0; i < imgSrc.length; i++) {
		var frameSrc = imgSrc[i];
		var frameData = imageDataFromImageSource( frameSrc, pal, col );
		imageStore.render[drwId][pal][colStr].push(frameData);
	}
}

function imageDataFromImageSource(imageSource, pal, col) {
	//console.log(imageSource);

	var img = context.createImageData(tilesize*scale,tilesize*scale);

	var backgroundColor = getPaletteColor(pal,0);
	var foregroundColor = getPaletteColor(pal,col);

	for (var y = 0; y < tilesize; y++) {
		for (var x = 0; x < tilesize; x++) {
			var px = imageSource[y][x];
			for (var sy = 0; sy < scale; sy++) {
				for (var sx = 0; sx < scale; sx++) {
					var pxl = (((y * scale) + sy) * tilesize * scale * 4) + (((x*scale) + sx) * 4);
					if ( px === 1 ) {
						img.data[pxl + 0] = foregroundColor.r;
						img.data[pxl + 1] = foregroundColor.g;
						img.data[pxl + 2] = foregroundColor.b;
						img.data[pxl + 3] = 255;
					}
					else { //ch === 0
						img.data[pxl + 0] = backgroundColor.r;
						img.data[pxl + 1] = backgroundColor.g;
						img.data[pxl + 2] = backgroundColor.b;
						img.data[pxl + 3] = 255;
					}
				}
			}
		}
	}

	// convert to canvas: chrome has poor performance when working directly with image data
	var imageCanvas = document.createElement("canvas");
	imageCanvas.width = img.width;
	imageCanvas.height = img.height;
	var imageContext = imageCanvas.getContext("2d");
	imageContext.putImageData(img,0,0);

	return imageCanvas;
}

// TODO : move into core
function undefinedOrNull(x) {
	return x === undefined || x === null;
}

function isImageRendered(drawing, paletteId) {
	var col = drawing.col;
	var colStr = "" + col;
	var pal = paletteId;
	var drwId = drawing.drw;

	if (undefinedOrNull(imageStore.render[drwId]) ||
		undefinedOrNull(imageStore.render[drwId][pal]) ||
		undefinedOrNull(imageStore.render[drwId][pal][colStr])) {
			return false;
	}
	else {
		return true;
	}
}

function getImageSet(drawing, paletteId) {
	return imageStore.render[drawing.drw][paletteId][drawing.col];
}

function getImageFrame(drawing, paletteId, frameOverride) {
	var frameIndex = 0;
	if (drawing.animation.isAnimated) {
		if (frameOverride != undefined && frameOverride != null) {
			frameIndex = frameOverride;
		}
		else {
			frameIndex = drawing.animation.frameIndex;
		}
	}

	return getImageSet(drawing, paletteId)[frameIndex];
}

function getOrRenderImage(drawing, paletteId, frameOverride) {
	if (!isImageRendered(drawing, paletteId)) {
		renderImage(drawing, paletteId);
	}

	return getImageFrame(drawing, paletteId, frameOverride);
}

/* PUBLIC INTERFACE */
this.GetImage = getOrRenderImage;

this.SetPalettes = setPalettes;

this.SetImageSource = function(drawingId, imageSourceData) {
	imageStore.source[drawingId] = imageSourceData;
	imageStore.render[drawingId] = {}; // reset render cache for this image
}

this.GetImageSource = function(drawingId) {
	return imageStore.source[drawingId];
}

this.GetFrameCount = function(drawingId) {
	return imageStore.source[drawingId].length;
}

this.AttachContext = function(ctx) {
	context = ctx;
}

} // Renderer()
<\/script>

<script>
var xhr; // TODO : remove
var canvas;
var context; // TODO : remove if safe?
var ctx;

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

var names = {
	room : new Map(),
	tile : new Map(), // Note: Not currently enabled in the UI
	sprite : new Map(),
	item : new Map(),
	dialog : new Map(),
};
function updateNamesFromCurData() {

	function createNameMap(objectStore) {
		var map = new Map();
		for (id in objectStore) {
			if (objectStore[id].name != undefined && objectStore[id].name != null) {
				map.set(objectStore[id].name, id);
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
	minor: 0, // smaller changes
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

	// hacky to have this multiple times...
	names = {
		room : new Map(),
		tile : new Map(),
		sprite : new Map(),
		item : new Map(),
		dialog : new Map(),
	};

	fontName = defaultFontName; // TODO : reset font manager too?
	textDirection = TextDirection.LeftToRight;
}

var width = 128;
var height = 128;
var scale = 4; //this is stupid but necessary
var tilesize = 8;
var mapsize = 16;

var curRoom = "0";

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

var prevTime = 0;
var deltaTime = 0;

//methods used to trigger gif recording
var didPlayerMoveThisFrame = false;
var onPlayerMoved = null;
// var didDialogUpdateThisFrame = false;
var onDialogUpdate = null;

//inventory update UI handles
var onInventoryChanged = null;
var onVariableChanged = null;
var onGameReset = null;

var isPlayerEmbeddedInEditor = false;

var renderer = new Renderer(tilesize, scale);

function getGameNameFromURL() {
	var game = window.location.hash.substring(1);
	// console.log("game name --- " + game);
	return game;
}

function attachCanvas(c) {
	canvas = c;
	canvas.width = width * scale;
	canvas.height = width * scale;
	ctx = canvas.getContext("2d");
	dialogRenderer.AttachContext(ctx);
	renderer.AttachContext(ctx);
}

var curGameData = null;
function load_game(game_data, startWithTitle) {
	curGameData = game_data; //remember the current game (used to reset the game)

	dialogBuffer.Reset();
	scriptInterpreter.ResetEnvironment(); // ensures variables are reset -- is this the best way?

	parseWorld(game_data);

	if (!isPlayerEmbeddedInEditor) {
		// hack to ensure default font is available
		fontManager.AddResource(defaultFontName + fontManager.GetExtension(), document.getElementById(defaultFontName).text.slice(1));
	}

	var font = fontManager.Get( fontName );
	dialogBuffer.SetFont(font);
	dialogRenderer.SetFont(font);

	setInitialVariables();

	// setInterval(updateLoadingScreen, 300); // hack test

	onready(startWithTitle);
}

function reset_cur_game() {
	if (curGameData == null) {
		return; //can't reset if we don't have the game data
	}

	stopGame();
	clearGameData();
	load_game(curGameData);

	if (isPlayerEmbeddedInEditor && onGameReset != null) {
		onGameReset();
	}
}

var update_interval = null;
function onready(startWithTitle) {
	if(startWithTitle === undefined || startWithTitle === null) startWithTitle = true;

	clearInterval(loading_interval);

	input = new InputManager();

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
	  	if (existingTouchTrigger === null){
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

	update_interval = setInterval(update,16);

	if(startWithTitle) { // used by editor 
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
	console.log("stop GAME!");

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
    		if (existingTouchTrigger !== null){
    			existingTouchTrigger.removeEventListener('touchstart', input.ontouchstart);
    			existingTouchTrigger.removeEventListener('touchmove', input.ontouchmove);
    			existingTouchTrigger.removeEventListener('touchend', input.ontouchend);

    			existingTouchTrigger.parentElement.removeChild(existingTouchTrigger);
    		}
	}

	window.onblur = null;

	clearInterval(update_interval);
}

/* loading animation */
var loading_anim_data = [
	[
		0,1,1,1,1,1,1,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,1,1,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,0,0,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,1,
		1,1,1,0,0,1,1,1,
		1,1,1,1,1,0,0,1,
		1,1,1,1,1,0,0,1,
		1,1,1,0,0,1,1,1,
		1,0,0,0,0,0,0,1,
		0,0,0,0,0,0,0,0,
	]
];
var loading_anim_frame = 0;
var loading_anim_speed = 500;
var loading_interval = null;

function loadingAnimation() {
	//create image
	var loadingAnimImg = ctx.createImageData(8*scale, 8*scale);
	//draw image
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			var i = (y * 8) + x;
			if (loading_anim_data[loading_anim_frame][i] == 1) {
				//scaling nonsense
				for (var sy = 0; sy < scale; sy++) {
					for (var sx = 0; sx < scale; sx++) {
						var pxl = 4 * ( (((y*scale)+sy) * (8*scale)) + ((x*scale)+sx) );
						loadingAnimImg.data[pxl+0] = 255;
						loadingAnimImg.data[pxl+1] = 255;
						loadingAnimImg.data[pxl+2] = 255;
						loadingAnimImg.data[pxl+3] = 255;
					}
				}
			}
		}
	}
	//put image on canvas
	ctx.putImageData(loadingAnimImg,scale*(width/2 - 4),scale*(height/2 - 4));
	//update frame
	loading_anim_frame++;
	if (loading_anim_frame >= 5) loading_anim_frame = 0;
}

function updateLoadingScreen() {
	// TODO : in progress
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	loadingAnimation();
	drawSprite( getSpriteImage(sprite["a"],"0",0), 8, 8, ctx );
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
		if (!isNarrating && !isEnding) {
			updateAnimation();
			drawRoom( room[curRoom] ); // draw world if game has begun
		}
		else {
			//make sure to still clear screen
			ctx.fillStyle = "rgb(" + getPal(curPal())[0][0] + "," + getPal(curPal())[0][1] + "," + getPal(curPal())[0][2] + ")";
			ctx.fillRect(0,0,canvas.width,canvas.height);
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

	//for gif recording
	if (didPlayerMoveThisFrame && onPlayerMoved != null) {
		onPlayerMoved();
	}
	didPlayerMoveThisFrame = false;

	/* hacky replacement */
	if (onDialogUpdate != null) {
		dialogRenderer.SetPageFinishHandler( onDialogUpdate );
	}

	input.resetKeyPressed();
	input.resetTapReleased();
}

function updateInput() {
	if( dialogBuffer.IsActive() ) {
		if (input.anyKeyPressed() || input.isTapReleased()) {
			/* CONTINUE DIALOG */
			if (dialogBuffer.CanContinue()) {
				var hasMoreDialog = dialogBuffer.Continue();
				if(!hasMoreDialog) {
					// ignore currently held keys UNTIL they are released (stops player from insta-moving)
					input.ignoreHeldKeys();
				}
			}
			else {
				dialogBuffer.Skip();
			}
		}
	}
	else if ( isEnding ) {
		if (input.anyKeyPressed() || input.isTapReleased()) {
			/* RESTART GAME */
			reset_cur_game();
		}
	}
	else {
		/* WALK */
		var prevPlayerDirection = curPlayerDirection;

		if ( input.isKeyDown( key.left ) || input.isKeyDown( key.a ) || input.swipeLeft() ) {
			curPlayerDirection = Direction.Left;
		}
		else if ( input.isKeyDown( key.right ) || input.isKeyDown( key.d ) || input.swipeRight() ) {
			curPlayerDirection = Direction.Right;
		}
		else if ( input.isKeyDown( key.up ) || input.isKeyDown( key.w ) || input.swipeUp() ) {
			curPlayerDirection = Direction.Up;
		}
		else if ( input.isKeyDown( key.down ) || input.isKeyDown( key.s ) || input.swipeDown() ) {
			curPlayerDirection = Direction.Down;
		}
		else {
			curPlayerDirection = Direction.None;
		}

		if (curPlayerDirection != Direction.None && curPlayerDirection != prevPlayerDirection) {
			movePlayer( curPlayerDirection );
			playerHoldToMoveTimer = 500;
		}
	}
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

var InputManager = function() {
	var self = this;

	var pressed;
	var ignored;
	var newKeyPress;
	var touchState;

	function resetAll() {
		pressed = {};
		ignored = {};
		newKeyPress = false;

		touchState = {
			isDown : false,
			startX : 0,
			startY : 0,
			curX : 0,
			curY : 0,
			swipeDistance : 30,
			swipeDirection : Direction.None,
			tapReleased : false
		};
	}
	resetAll();

	function stopWindowScrolling(e) {
		if(e.keyCode == key.left || e.keyCode == key.right || e.keyCode == key.up || e.keyCode == key.down || !isPlayerEmbeddedInEditor)
			e.preventDefault();
	}

	function tryRestartGame(e) {
		/* RESTART GAME */
		if ( e.keyCode === key.r && ( e.getModifierState("Control") || e.getModifierState("Meta") ) ) {
			if ( confirm("Restart the game?") ) {
				reset_cur_game();
			}
		}
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
				// console.log("IGNORE -- " + key);
			}
		}
	}

	this.onkeydown = function(event) {
		// console.log("KEYDOWN -- " + event.keyCode);

		stopWindowScrolling(event);

		tryRestartGame(event);

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

		if (!self.isKeyDown(event.keyCode)) {
			newKeyPress = true;
		}

		pressed[event.keyCode] = true;
		ignored[event.keyCode] = false;
	}

	this.onkeyup = function(event) {
		// console.log("KEYUP -- " + event.keyCode);
		pressed[event.keyCode] = false;
		ignored[event.keyCode] = false;
	}

	this.ontouchstart = function(event) {
		event.preventDefault();

		if( event.changedTouches.length > 0 ) {
			touchState.isDown = true;

			touchState.startX = touchState.curX = event.changedTouches[0].clientX;
			touchState.startY = touchState.curY = event.changedTouches[0].clientY;

			touchState.swipeDirection = Direction.None;
		}
	}

	this.ontouchmove = function(event) {
		event.preventDefault();

		if( touchState.isDown && event.changedTouches.length > 0 ) {
			touchState.curX = event.changedTouches[0].clientX;
			touchState.curY = event.changedTouches[0].clientY;

			var prevDirection = touchState.swipeDirection;

			if( touchState.curX - touchState.startX <= -touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Left;
			}
			else if( touchState.curX - touchState.startX >= touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Right;
			}
			else if( touchState.curY - touchState.startY <= -touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Up;
			}
			else if( touchState.curY - touchState.startY >= touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Down;
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

		if( touchState.swipeDirection == Direction.None ) {
			// tap!
			touchState.tapReleased = true;
		}

		touchState.swipeDirection = Direction.None;
	}

	this.isKeyDown = function(keyCode) {
		return pressed[keyCode] != null && pressed[keyCode] == true && (ignored[keyCode] == null || ignored[keyCode] == false);
	}

	this.anyKeyPressed = function() {
		return newKeyPress;
	}

	this.resetKeyPressed = function() {
		newKeyPress = false;
	}

	this.swipeLeft = function() {
		return touchState.swipeDirection == Direction.Left;
	}

	this.swipeRight = function() {
		return touchState.swipeDirection == Direction.Right;
	}

	this.swipeUp = function() {
		return touchState.swipeDirection == Direction.Up;
	}

	this.swipeDown = function() {
		return touchState.swipeDirection == Direction.Down;
	}

	this.isTapReleased = function() {
		return touchState.tapReleased;
	}

	this.resetTapReleased = function() {
		touchState.tapReleased = false;
	}

	this.onblur = function() {
		// console.log("~~~ BLUR ~~");
		resetAll();
	}
}
var input = null;

function movePlayer(direction) {
	if (player().room == null || !Object.keys(room).includes(player().room)) {
		return; // player room is missing or invalid.. can't move them!
	}

	var spr = null;

	if ( curPlayerDirection == Direction.Left && !(spr = getSpriteLeft()) && !isWallLeft()) {
		player().x -= 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Right && !(spr = getSpriteRight()) && !isWallRight()) {
		player().x += 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Up && !(spr = getSpriteUp()) && !isWallUp()) {
		player().y -= 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Down && !(spr = getSpriteDown()) && !isWallDown()) {
		player().y += 1;
		didPlayerMoveThisFrame = true;
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
			transition.BeginTransition(player().room, player().x, player().y, ext.dest.room, ext.dest.x, ext.dest.y, ext.transition_effect);
			transition.UpdateTransition(0);
		}

		player().room = ext.dest.room;
		player().x = ext.dest.x;
		player().y = ext.dest.y;
		curRoom = ext.dest.room;

		initRoom(curRoom);
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

function initRoom(roomId) {
	// init exit properties
	for (var i = 0; i < room[roomId].exits.length; i++) {
		room[roomId].exits[i].property = { locked:false };
	}

	// init ending properties
	for (var i = 0; i < room[roomId].endings.length; i++) {
		room[roomId].endings[i].property = { locked:false };
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
	// console.log(x + " " + y);
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

		// console.log(lines[i]);

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
	if (player() != undefined && player().room != null && roomIds.includes(player().room)) {
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

	renderer.SetPalettes(palette);

	scriptCompatibility(compatibilityFlags);

	return versionNumber;
}

function scriptCompatibility(compatibilityFlags) {
	if (compatibilityFlags.convertSayToPrint) {
		console.log("CONVERT SAY TO PRINT!");

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
	var imageSource = renderer.GetImageSource(drwId);
	var drwStr = "";
	for (f in imageSource) {
		for (y in imageSource[f]) {
			var rowStr = "";
			for (x in imageSource[f][y]) {
				rowStr += imageSource[f][y][x];
			}
			drwStr += rowStr + "\\n";
		}
		if (f < (imageSource.length-1)) drwStr += ">\\n";
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
		//console.log(id);
		//console.log( spriteStartLocations[id] );
		//console.log(sprite[id]);
		sprite[id].room = spriteStartLocations[id].room;
		sprite[id].x = spriteStartLocations[id].x;
		sprite[id].y = spriteStartLocations[id].y;
		//console.log(sprite[id]);
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
		// console.log(getType(lines[i]));
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
			names.room.set(name, id);
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
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store tile source
		drwId = "TIL_" + id;
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 1; // default palette color index is 1
	var isWall = null; // null indicates it can vary from room to room (original version)
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			colorIndex = parseInt( getId(lines[i]) );
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.tile.set( name, id );
		}
		else if (getType(lines[i]) === "WAL") {
			var wallArg = getArg( lines[i], 1 );
			if( wallArg === "true" ) {
				isWall = true;
			}
			else if( wallArg === "false" ) {
				isWall = false;
			}
		}
		i++;
	}

	//tile data
	tile[id] = {
		id : id,
		drw : drwId, //drawing id
		col : colorIndex,
		animation : {
			isAnimated : (renderer.GetFrameCount(drwId) > 1),
			frameIndex : 0,
			frameCount : renderer.GetFrameCount(drwId)
		},
		name : name,
		isWall : isWall
	};

	return i;
}

function parseSprite(lines, i) {
	var id = getId(lines[i]);
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store sprite source
		drwId = "SPR_" + id;
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 2; //default palette color index is 2
	var dialogId = null;
	var startingInventory = {};
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			colorIndex = parseInt( getId(lines[i]) );
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
			dialogId = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.sprite.set( name, id );
		}
		else if (getType(lines[i]) === "ITM") {
			/* ITEM STARTING INVENTORY */
			var itemId = getId(lines[i]);
			var itemCount = parseFloat( getArg(lines[i], 2) );
			startingInventory[itemId] = itemCount;
		}
		i++;
	}

	//sprite data
	sprite[id] = {
		id : id,
		drw : drwId, //drawing id
		col : colorIndex,
		dlg : dialogId,
		room : null, //default location is "offstage"
		x : -1,
		y : -1,
		animation : {
			isAnimated : (renderer.GetFrameCount(drwId) > 1),
			frameIndex : 0,
			frameCount : renderer.GetFrameCount(drwId)
		},
		inventory : startingInventory,
		name : name
	};
	return i;
}

function parseItem(lines, i) {
	var id = getId(lines[i]);
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store item source
		drwId = "ITM_" + id; // these prefixes are maybe a terrible way to differentiate drawing tyepes :/
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 2; //default palette color index is 2
	var dialogId = null;
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			colorIndex = parseInt( getArg( lines[i], 1 ) );
		}
		// else if (getType(lines[i]) === "POS") {
		// 	/* STARTING POSITION */
		// 	var posArgs = lines[i].split(" ");
		// 	var roomId = posArgs[1];
		// 	var coordArgs = posArgs[2].split(",");
		// 	spriteStartLocations[id] = {
		// 		room : roomId,
		// 		x : parseInt(coordArgs[0]),
		// 		y : parseInt(coordArgs[1])
		// 	};
		// }
		else if(getType(lines[i]) === "DLG") {
			dialogId = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.item.set( name, id );
		}
		i++;
	}

	//item data
	item[id] = {
		id : id,
		drw : drwId, //drawing id
		col : colorIndex,
		dlg : dialogId,
		// room : null, //default location is "offstage"
		// x : -1,
		// y : -1,
		animation : {
			isAnimated : (renderer.GetFrameCount(drwId) > 1),
			frameIndex : 0,
			frameCount : renderer.GetFrameCount(drwId)
		},
		name : name
	};

	// console.log("ITM " + id);
	// console.log(item[id]);

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

	renderer.SetImageSource(drwId, frameList);

	return i;
}

function parseScript(lines, i, backCompatPrefix, compatibilityFlags) {
	var id = getId(lines[i]);
	id = backCompatPrefix + id;
	i++;

	var results = scriptUtils.ReadDialogScript(lines,i);

	dialog[id] = { src:results.script, name:null };

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
		names.dialog.set(dialog[id].name, id);
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

function drawTile(img,x,y,context) {
	if (!context) { //optional pass in context; otherwise, use default
		context = ctx;
	}
	// NOTE: images are now canvases, instead of raw image data (for chrome performance reasons)
	context.drawImage(img,x*tilesize*scale,y*tilesize*scale,tilesize*scale,tilesize*scale);
}

function drawSprite(img,x,y,context) { //this may differ later (or not haha)
	drawTile(img,x,y,context);
}

function drawItem(img,x,y,context) {
	drawTile(img,x,y,context); //TODO these methods are dumb and repetitive
}

// var debugLastRoomDrawn = "0";

function drawRoom(room,context,frameIndex) { // context & frameIndex are optional
	if (!context) { //optional pass in context; otherwise, use default (ok this is REAL hacky isn't it)
		context = ctx;
	}

	// if (room.id != debugLastRoomDrawn) {
	// 	debugLastRoomDrawn = room.id;
	// 	console.log("DRAW ROOM " + debugLastRoomDrawn);
	// }

	var paletteId = "default";

	if (room === undefined) {
		// protect against invalid rooms
		context.fillStyle = "rgb(" + getPal(paletteId)[0][0] + "," + getPal(paletteId)[0][1] + "," + getPal(paletteId)[0][2] + ")";
		context.fillRect(0,0,canvas.width,canvas.height);
		return;
	}

	//clear screen
	if (room.pal != null && palette[paletteId] != undefined) {
		paletteId = room.pal;
	}
	context.fillStyle = "rgb(" + getPal(paletteId)[0][0] + "," + getPal(paletteId)[0][1] + "," + getPal(paletteId)[0][2] + ")";
	context.fillRect(0,0,canvas.width,canvas.height);

	//draw tiles
	for (i in room.tilemap) {
		for (j in room.tilemap[i]) {
			var id = room.tilemap[i][j];
			if (id != "0") {
				//console.log(id);
				if (tile[id] == null) { // hack-around to avoid corrupting files (not a solution though!)
					id = "0";
					room.tilemap[i][j] = id;
				}
				else {
					// console.log(id);
					drawTile( getTileImage(tile[id],paletteId,frameIndex), j, i, context );
				}
			}
		}
	}

	//draw items
	for (var i = 0; i < room.items.length; i++) {
		var itm = room.items[i];
		drawItem( getItemImage(item[itm.id],paletteId,frameIndex), itm.x, itm.y, context );
	}

	//draw sprites
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === room.id) {
			drawSprite( getSpriteImage(spr,paletteId,frameIndex), spr.x, spr.y, context );
		}
	}
}

// TODO : remove these get*Image methods
function getTileImage(t,palId,frameIndex) {
	return renderer.GetImage(t,palId,frameIndex);
}

function getSpriteImage(s,palId,frameIndex) {
	return renderer.GetImage(s,palId,frameIndex);
}

function getItemImage(itm,palId,frameIndex) {
	return renderer.GetImage(itm,palId,frameIndex);
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

function onExitDialog(scriptResult, dialogCallback) {
	console.log("EXIT DIALOG!");

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
	console.log("NARRATE " + dialogStr);

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
	// console.log("START ITEM DIALOG " + dialogId);
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
	// console.log("START SPRITE DIALOG " + dialogId);
	if (dialog[dialogId]){
		var dialogStr = dialog[dialogId].src;
		startDialog(dialogStr,dialogId);
	}
}

function startDialog(dialogStr, scriptId, dialogCallback, objectContext) {
	// console.log("START DIALOG ");
	if (dialogStr.length <= 0) {
		// console.log("ON EXIT DIALOG -- startDialog 1");
		onExitDialog(dialogCallback);
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

<\/script>

<!-- store default font in separate script tag for back compat-->
<!-- Borksy modification: uses better encoded default font. -->
<script type="bitsyFontData" id="ascii_small">
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
