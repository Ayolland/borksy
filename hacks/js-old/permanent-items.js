//permanent-items

var permanentItemsHackOptions = {
	BORKSY-OPTIONS
};

var room;
var oldItems;
before("movePlayer", function () {
	room = bitsy.room[bitsy.curRoom];
	oldItems = room.items.slice();
});
after("movePlayer", function () {
	var newItems = room.items;
	if (newItems.length === oldItems.length) {
		return; // nothing changed
	}

	// check for changes
	for (var i = 0; i < oldItems.length; ++i) {
		if (!newItems[i] ||
			oldItems[i].x !== newItems[i].x ||
			oldItems[i].y !== newItems[i].y ||
			oldItems[i].id !== newItems[i].id
		) {
			// something changed
			if (permanentItemsHackOptions.itemIsPermanent(bitsy.item[oldItems[i].id])) {
				// put that back!
				newItems.splice(i, 0, oldItems[i]);
			} else {
				// add an empty entry for now to keep the arrays aligned
				newItems.splice(i, 0, null);
			}
		}
	}
	// clear out those empty entries
	room.items = newItems.filter(function (item) {
		return !!item;
	});
});