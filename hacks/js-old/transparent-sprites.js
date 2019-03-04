//transparent-sprites

var transparentSpriteHackOptions = {
	BORKSY-OPTIONS
};

// override imageDataFromImageSource to use transparency for background pixels
// and save the results to a custom image cache
var _imageDataFromImageSource = bitsy.imageDataFromImageSource;
bitsy.imageDataFromImageSource = function (imageSource, pal) {
	var cache;
	return function (args) {
		if (cache) {
			return cache;
		}

		// get the bitsy image data
		var img = _imageDataFromImageSource.apply(undefined, args);

		// make background pixels transparent
		var bg = bitsy.getPal(pal)[0];
		var i;
		// discard unnecessary pixels
		if (transparentSpriteHackOptions.scaling) {
			var scaledImg = bitsy.ctx.createImageData(img.width / bitsy.scale, img.height / bitsy.scale);
			for (var y = 0; y < scaledImg.height; ++y) {
				for (var x = 0; x < scaledImg.width; ++x) {
					var idx = (y * scaledImg.width + x) * 4;
					var idx2 = (y * bitsy.scale * img.width + x * bitsy.scale) * 4;
					scaledImg.data[idx + 0] = img.data[idx2 + 0];
					scaledImg.data[idx + 1] = img.data[idx2 + 1];
					scaledImg.data[idx + 2] = img.data[idx2 + 2];
					scaledImg.data[idx + 3] = img.data[idx2 + 3];
				}
			}
			img = scaledImg;
		}

		// set background pixels to transparent
		for (i = 0; i < img.data.length; i += 4) {
			if (
				img.data[i + 0] === bg[0] &&
				img.data[i + 1] === bg[1] &&
				img.data[i + 2] === bg[2]
			) {
				img.data[i + 3] = 0;
			}
		}

		// give ourselves a little canvas + context to work with
		var spriteCanvas = document.createElement("canvas");
		spriteCanvas.width = bitsy.tilesize * (transparentSpriteHackOptions.scaling ? 1 : bitsy.scale);
		spriteCanvas.height = bitsy.tilesize * (transparentSpriteHackOptions.scaling ? 1 : bitsy.scale);
		var spriteContext = spriteCanvas.getContext("2d");

		// put bitsy data to our canvas
		spriteContext.clearRect(0, 0, bitsy.tilesize, bitsy.tilesize);
		if (transparentSpriteHackOptions.scaling) {
			spriteContext.putImageData(img, 0, 0, 0, 0, bitsy.tilesize, bitsy.tilesize);
		} else {
			spriteContext.putImageData(img, 0, 0);
		}

		// save it in our cache
		cache = spriteCanvas;

		// return our image	
		return cache;
	}.bind(undefined, arguments)
};

// override drawTile to draw from our custom image cache
// instead of putting image data directly
bitsy.drawTile = function (img, x, y, context) {
	if (!context) { //optional pass in context; otherwise, use default
		context = bitsy.ctx;
	}

	if (transparentSpriteHackOptions.scaling) {
		context.drawImage(
			img(),
			x * bitsy.tilesize * bitsy.scale,
			y * bitsy.tilesize * bitsy.scale,
			bitsy.tilesize * bitsy.scale,
			bitsy.tilesize * bitsy.scale
		);
	} else {
		context.drawImage(
			img(),
			x * bitsy.tilesize * bitsy.scale,
			y * bitsy.tilesize * bitsy.scale
		);
	}
};