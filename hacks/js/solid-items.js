//solid items

var solidItemsOptions = {
	itemIsSolid: function (item) {
		//return item.name == 'tea'; // specific solid item
		//return ['tea', 'flower', 'hat'].indexOf(item.name) !== -1; // specific solid item list
		return item.name.indexOf('SOLID') !== -1; // solid item flag in name
		//return true; // all items are solid
	}
};

// true if item should be treated as sprite
// false if item should be treated normally
function getSolidItemFromIndex(itemIndex) {
	if (itemIndex === -1) {
		return;
	}
	var itemId = bitsy.room[bitsy.curRoom].items[itemIndex].id;
	var item = bitsy.item[itemId];
	if (solidItemsOptions.itemIsSolid(item)) {
		return item;
	}
	return;
}

var _getItemIndex = bitsy.getItemIndex;
bitsy.getItemIndex = function () {
	var itemIndex = _getItemIndex.apply(this, arguments);
	var sprItem = getSolidItemFromIndex(itemIndex);
	if (sprItem) {
		return -1;
	}
	return itemIndex;
};

var _getSpriteAt = bitsy.getSpriteAt;
bitsy.getSpriteAt = function (x, y) {
	var spr = _getSpriteAt.apply(this, arguments);
	if (spr) {
		return spr;
	}
	var itemIndex = _getItemIndex(bitsy.curRoom, x, y);
	var item = getSolidItemFromIndex(itemIndex);
	if (item) {
		return item.drw;
	}
};

var _startSpriteDialog = bitsy.startSpriteDialog;
bitsy.startSpriteDialog = function (spriteId) {
	var item = spriteId.split("ITM_")[1];
	if (item) {
		return bitsy.startItemDialog(item);
	}
	_startSpriteDialog.apply(this, arguments);
}