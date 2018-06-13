//solid-items

var solidItemsHackOptions = {
	BORKSY-OPTIONS
};

// true if item should be treated as sprite
// false if item should be treated normally
function getSolidItemFromIndex(itemIndex) {
	if (itemIndex === -1) {
		return;
	}
	var itemId = bitsy.room[bitsy.curRoom].items[itemIndex].id;
	var item = bitsy.item[itemId];
	if (solidItemsHackOptions.itemIsSolid(item)) {
		return item;
	}
	return;
}

var solidItemsGetItemIndex = bitsy.getItemIndex;
bitsy.getItemIndex = function () {
	var itemIndex = solidItemsGetItemIndex.apply(this, arguments);
	var sprItem = getSolidItemFromIndex(itemIndex);
	if (sprItem) {
		return -1;
	}
	return itemIndex;
};

var solidItemsGetSpriteAt = bitsy.getSpriteAt;
bitsy.getSpriteAt = function (x, y) {
	var spr = solidItemsGetSpriteAt.apply(this, arguments);
	if (spr) {
		return spr;
	}
	var itemIndex = solidItemsGetItemIndex(bitsy.curRoom, x, y);
	var item = getSolidItemFromIndex(itemIndex);
	if (item) {
		return item.drw;
	}
};

var solidItemsStartSpriteDialog = bitsy.startSpriteDialog;
bitsy.startSpriteDialog = function (spriteId) {
	var item = spriteId.split("ITM_")[1];
	if (item) {
		return bitsy.startItemDialog(item);
	}
	solidItemsStartSpriteDialog.apply(this, arguments);
}