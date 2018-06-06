//edit-image-at-runtime

/*
Args:
	   id: string id or name
	frame: animation frame (0 or 1)
	  map: map of images (e.g. `sprite`, `tile`, `item`)

Returns: a single frame of a image data
*/
function getImageData(id, frame, map) {
	return bitsy.imageStore.source[getImage(id, map).drw][frame];
}

function getSpriteData(id, frame) {
	return getImageData(id, frame, bitsy.sprite);
}

function getTileData(id, frame) {
	return getImageData(id, frame, bitsy.tile);
}

function getItemData(id, frame) {
	return getImageData(id, frame, bitsy.item);
}

/*
Updates a single frame of image data

Args:
	     id: string id or name
	  frame: animation frame (0 or 1)
	    map: map of images (e.g. `sprite`, `tile`, `item`)
	newData: new data to write to the image data
*/
function setImageData(id, frame, map, newData) {
	var drawing = getImage(id, map);
	var drw = drawing.drw;
	bitsy.imageStore.source[drw][frame] = newData;
	if (drawing.animation.isAnimated) {
		drw += "_" + frame;
	}
	for (var pal in bitsy.palette) {
		if (bitsy.palette.hasOwnProperty(pal)) {
			var col = drawing.col;
			var colStr = "" + col;
			bitsy.imageStore.render[pal][colStr][drw] = bitsy.imageDataFromImageSource(newData, pal, col);
		}
	}
}

function setSpriteData(id, frame, newData) {
	setImageData(id, frame, bitsy.sprite, newData);
}

function setTileData(id, frame, newData) {
	setImageData(id, frame, bitsy.tile, newData);
}

function setItemData(id, frame, newData) {
	setImageData(id, frame, bitsy.item, newData);
}