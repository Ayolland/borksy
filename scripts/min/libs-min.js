var loadedFiles={},borksyInfo={lastUpdated:"April 16, 2019",templates:[{filename:"Bitsy.5.5",description:"Bitsy 5.5 (modified for Borksy)",isDefault:!1},{filename:"BitsyHD.5.1",description:"Bitsy HD + Borksy (modified from Bitsy 5.1)",isDefault:!1},{filename:"Bitsy.6.0",description:"Bitsy 6.0 (modified for Borksy)",isDefault:!0}]},hacks={"kitsy-script-toolkit":{title:"🛠 Kitsy",description:"Utilities needed for many hacks",author:"@mildmojo",readme:!1,type:"simple",requires:"utils",hidden:!0,order:2,conflicts:!1,github:!1,forceLocal:!1},utils:{title:"🛠 Utils",description:"Utilities needed for many hacks",author:"Sean S LeBlanc",readme:!1,type:"simple",requires:!1,hidden:!0,order:1,conflicts:!1,github:!1,forceLocal:!1},"edit-image-at-runtime":{title:"🛠 Edit Image At Runtime",description:"Utilities for changing drawings in-game",author:"Sean S LeBlanc",readme:!1,type:"simple",requires:"utils",hidden:!0,order:2,conflicts:!1,github:!1,forceLocal:!1},"directional-avatar":{title:"↔ Directional Avatar",description:"Flips the player's sprite based on directional movement",author:"Sean S LeBlanc",readme:!0,type:"options",requires:"edit-image-at-runtime",hidden:!1,order:10,conflicts:!1,github:"directional-avatar.js",forceLocal:!1},"dynamic-background":{title:"🖼 Dynamic Background Color",description:"Changes the color of the BODY tag to the background color of the current room.",author:"Sean S LeBlanc",readme:!1,type:"simple",requires:!1,hidden:!1,order:10,conflicts:!1,github:"dynamic-background.js",forceLocal:!1},"exit-from-dialog":{title:"🚪 Exit From Dialog",description:"Adds (Exit) and (ExitNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"exit-from-dialog.js",forceLocal:!1},"end-from-dialog":{title:"🔚 End From Dialog",description:"Adds (End) and (EndNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"end-from-dialog.js",forceLocal:!1},"javascript-dialog":{title:"☕ Javascript Dialog",description:"Lets you execute arbitrary JavaScript from dialog (including inside conditionals).",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:2,conflicts:!1,github:"javascript-dialog.js",forceLocal:!1},"transparent-sprites":{title:"🏁 Transparent Sprites",description:"Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",author:"Sean S. LeBlanc",readme:!1,type:"options",requires:!1,hidden:!1,order:10,conflicts:!1,github:"transparent-sprites.js",forceLocal:!1},"logic-operators-extended":{title:"🔀 Extended Logic Operators",description:"Adds conditional logic operators.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:2,conflicts:!1,github:"logic-operators-extended.js",forceLocal:!1},"permanent-items":{title:"⏳ Permanent Items",description:"Prevents certain items from being picked up, but allows them to be walked over and triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:4,conflicts:!1,github:"permanent-items.js",forceLocal:!1},"solid-items":{title:"🛑 Solid Items",description:"Prevents certain items from being picked up or walked over, but still triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"solid-items.js",forceLocal:!1},"unique-items":{title:"❄ Unique Items",description:"Adds support for items which, when picked up, remove all other instances of that item from the game.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"unique-items.js",forceLocal:!1},bitsymuse:{title:"😌 Bitsymuse",description:"A hack that a variety of audio controls, including music that changes as you move between rooms.",author:"David Mowatt",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"bitsymuse.js",forceLocal:!1},"multi-sprite-avatar":{title:"👨‍👨‍👧‍👧 Multi-Sprite Avatar",description:"Allows multiple sprites to be moved together along with the player to create the illusion of a larger avatar.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"multi-sprite-avatar.js",forceLocal:!1},"avatar-by-room":{title:"👥 Avatar By Room",description:"Allows changing the avatar in certain rooms.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"avatar-by-room.js",forceLocal:!1},save:{title:"💾 Save",description:"Save/Load Your Game",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"save.js",forceLocal:!1},"character-portraits":{title:"😽 Character Portraits",description:"High Quality Anime Jpegs (or pngs i guess)",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"character-portraits.js",forceLocal:!1},"transparent-dialog":{title:"👁️‍🗨️ Transparent Dialog",description:"Makes the dialog box have a transparent background.",author:"Sean S. LeBlanc",readme:!1,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"transparent-dialog.js",forceLocal:!1},stopwatch:{title:"⏱️ Stopwatch",description:"Allows timing player actions.",author:"Lenny Magner",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"stopwatch.js",forceLocal:!1},"paragraph-break":{title:"📃 Paragraph Break",description:"Adds paragraph breaks to the dialogue parser.",author:"Sean S. LeBlanc and David Mowatt",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"paragraph-break.js",forceLocal:!1},"opaque-tiles":{title:"⬛ Opaque Tiles",description:"Adds tiles which hide the player.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"opaque-tiles.js",forceLocal:!1},"gamepad-input":{title:"🎮 Gamepad Input",description:"Adds HTML5 gamepad support.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:3,conflicts:!1,github:"gamepad-input.js",forceLocal:!1},"edit-image-from-dialog":{title:"🖌 Edit Image from Dialog",description:"Allows editing of sprites, items, and tiles from dialog.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"edit-image-from-dialog.js",forceLocal:!1},"edit-image-from-dialog":{title:"🖌 Edit Image from Dialog",description:"Allows editing of sprites, items, and tiles from dialog.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"edit-image-from-dialog.js",forceLocal:!1},"direction-in-dialog":{title:"🔝 Direction in Dialog",description:"Provides a variable with player direction.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"direction-in-dialog.js",forceLocal:!1},"dialog-pause":{title:"💬 Dialog Pause",description:"Allows adding pauses in between printing text.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-pause.js",forceLocal:!1},"dialog-jump":{title:"🚀 Dialog Jump",description:"Allows jumping from one dialog entry to another.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-jump.js",forceLocal:!1},"dialog-choices":{title:"🔀 Dialog Choices",description:"Allows binary dialog choices.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-choices.js",forceLocal:!1},"text-to-speech":{title:"🗣 Text to Speech",description:" Provides text-to-speech for bitsy dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"text-to-speech.js",forceLocal:!1}};