/**
❄
@file unique items
@summary items which, when picked up, remove all other instances of that item from the game
@license MIT
@version 1.0.0
@author Sean S. LeBlanc

*/

var uniqueItemsOptions = {
	itemIsUnique: function (item) {
		//return item.name == 'tea'; // specific unique item
		//return ['tea', 'flower', 'hat'].indexOf(item.name) !== -1; // specific unique item list
		return item.name.indexOf('UNIQUE') !== -1; // unique item flag in name
		//return true; // all items are unique
	}
};

var _onInventoryChanged = bitsy.onInventoryChanged;
bitsy.onInventoryChanged = function (id) {
	var r;
	if (_onInventoryChanged) {
		_onInventoryChanged(id);
	}
	if (uniqueItemsOptions.itemIsUnique(bitsy.item[id])) {
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