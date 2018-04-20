/**
🛑
@file solid items
@summary treat some items like sprites that can be placed multiple times
@license MIT
@version 1.0.0
@author Sean S. LeBlanc
*/
function getSolidItemFromIndex(t){if(-1!==t){var i=bitsy.room[bitsy.curRoom].items[t].id,e=bitsy.item[i];return solidItemsOptions.itemIsSolid(e)?e:void 0}}var solidItemsOptions={itemIsSolid:function(t){return-1!==t.name.indexOf("SOLID")}},_getItemIndex=bitsy.getItemIndex;bitsy.getItemIndex=function(){var t=_getItemIndex.apply(this,arguments);return getSolidItemFromIndex(t)?-1:t};var _getSpriteAt=bitsy.getSpriteAt;bitsy.getSpriteAt=function(t,i){var e=_getSpriteAt.apply(this,arguments);if(e)return e;var r=_getItemIndex(bitsy.curRoom,t,i),o=getSolidItemFromIndex(r);return o?o.dlg:void 0};var _startSpriteDialog=bitsy.startSpriteDialog;bitsy.startSpriteDialog=function(t){var i=t.split("ITM_")[1];if(i)return bitsy.startItemDialog(i);_startSpriteDialog.apply(this,arguments)};