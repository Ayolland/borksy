//permanent items

var permanentItemsOptions = {
	itemIsPermanent: function (item) {
		//return item.name == 'tea'; // specific permanent item
		//return ['tea', 'flower', 'hat'].indexOf(item.name) !== -1; // specific permanent item list
		return item.name.indexOf('PERMANENT') !== -1; // permanent item flag in name
		//return true; // all items are permanent
	}
};

var permanentItems_onInventoryChanged = bitsy.onInventoryChanged;
bitsy.onInventoryChanged = function(itemId) {
	if(permanentItems_onInventoryChanged){
		permanentItems_onInventoryChanged.apply(this, arguments);
	}
	// if a permanent item is picked up, immediately add another instance
	// to replace the one that was just picked up
	if(permanentItemsOptions.itemIsPermanent(bitsy.item[itemId])){
		bitsy.room[bitsy.curRoom].items.push({
			id: itemId,
			x: bitsy.player().x,
			y: bitsy.player().y
		});
	}
};