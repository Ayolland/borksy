var uniqueItemsHackOptions={itemIsUnique:function(n){return!0}},uniqueItems_onInventoryChanged=bitsy.onInventoryChanged;bitsy.onInventoryChanged=function(n){var e;if(uniqueItems_onInventoryChanged&&uniqueItems_onInventoryChanged(n),uniqueItemsHackOptions.itemIsUnique(bitsy.item[n]))for(e in bitsy.room)bitsy.room.hasOwnProperty(e)&&(e=bitsy.room[e],e.items=e.items.filter(function(e){return e.id!=n}))};