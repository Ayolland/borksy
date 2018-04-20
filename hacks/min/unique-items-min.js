/**
❄
@file unique items
@summary items which, when picked up, remove all other instances of that item from the game
@license MIT
@version 1.0.0
@author Sean S. LeBlanc

*/
var uniqueItemsOptions={itemIsUnique:function(n){return-1!==n.name.indexOf("UNIQUE")}},_onInventoryChanged=bitsy.onInventoryChanged;bitsy.onInventoryChanged=function(n){var e;if(_onInventoryChanged&&_onInventoryChanged(n),uniqueItemsOptions.itemIsUnique(bitsy.item[n]))for(e in bitsy.room)bitsy.room.hasOwnProperty(e)&&(e=bitsy.room[e],e.items=e.items.filter(function(e){return e.id!=n}))};