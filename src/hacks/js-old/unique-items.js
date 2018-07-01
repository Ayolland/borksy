// unique-items

var uniqueItemsHackOptions = {
	BORKSY-OPTIONS
};

var uniqueItems_onInventoryChanged = bitsy.onInventoryChanged;
bitsy.onInventoryChanged = function (id) {
	var r;
	if (uniqueItems_onInventoryChanged) {
		uniqueItems_onInventoryChanged(id);
	}
	if (uniqueItemsHackOptions.itemIsUnique(bitsy.item[id])) {
		for (r in bitsy.room) {
			if (bitsy.room.hasOwnProperty(r)) {
				r = bitsy.room[r];
				r.items = r.items.filter(function (i) {
					return i.id != id;
				});
			}
		}
	}
};