/**
⏳
@file permanent items
@summary prevent some items from being picked up
@license MIT
@version 1.0.0
@author Sean S. LeBlanc
*/
var permanentItemsOptions={itemIsPermanent:function(n){return-1!==n.name.indexOf("PERMANENT")}},_onInventoryChanged=bitsy.onInventoryChanged;bitsy.onInventoryChanged=function(n){_onInventoryChanged&&_onInventoryChanged.apply(this,arguments),permanentItemsOptions.itemIsPermanent(bitsy.item[n])&&bitsy.room[bitsy.curRoom].items.push({id:n,x:bitsy.player().x,y:bitsy.player().y})};