var permanentItemsHackOptions={itemIsPermanent:function(e){return!0}},room,oldItems;before("movePlayer",function(){room=bitsy.room[bitsy.curRoom],oldItems=room.items.slice()}),after("movePlayer",function(){var e=room.items;if(e.length!==oldItems.length){for(var t=0;t<oldItems.length;++t)e[t]&&oldItems[t].x===e[t].x&&oldItems[t].y===e[t].y&&oldItems[t].id===e[t].id||(permanentItemsHackOptions.itemIsPermanent(bitsy.item[oldItems[t].id])?e.splice(t,0,oldItems[t]):e.splice(t,0,null));room.items=e.filter(function(e){return!!e})}});