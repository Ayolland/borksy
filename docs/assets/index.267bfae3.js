var R=Object.defineProperty;var k=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable;var v=(t,n,r)=>n in t?R(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,B=(t,n)=>{for(var r in n||(n={}))P.call(n,r)&&v(t,r,n[r]);if(k)for(var r of k(n))E.call(n,r)&&v(t,r,n[r]);return t};import{$ as i,F}from"./vendor.b3c093d9.js";const _=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerpolicy&&(o.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?o.credentials="include":a.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}};_();const w=`<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.7...v4.6.8">4.6.8</a> (2021-10-13)</h2>
<h3>Bug Fixes</h3>
<ul>
<li><code>gamedate</code> -&gt; <code>gamedata</code> typo (<a href="https://github.com/Ayolland/borksy/commit/a112e7a52b6099a8d8c950a0c5d1eb1b834b787b">a112e7a</a>)</li>
<li><code>loadDefaults</code> always checking save data, regardless of param (<a href="https://github.com/Ayolland/borksy/commit/1bddac0966b6c2e28ba4dc22c52110380e0172ba">1bddac0</a>)</li>
<li>add error case to loading defaults (<a href="https://github.com/Ayolland/borksy/commit/65a4a41566982f4b7bab4b74a4011b200ce38d2e">65a4a41</a>)</li>
<li>avoid race condition causing hacks to appear in non-alphabetical order (<a href="https://github.com/Ayolland/borksy/commit/bbc129f4c0a51ed70567792ecd77dba54520c08d">bbc129f</a>)</li>
<li>close self-closing html tags (<a href="https://github.com/Ayolland/borksy/commit/153a666fe48a5eebb9c28116e21ae226f74dde1d">153a666</a>)</li>
<li>format default css (<a href="https://github.com/Ayolland/borksy/commit/4230e23f158c4b5202088cac49d6e3e49eafabb0">4230e23</a>)</li>
<li>missing global reference (<a href="https://github.com/Ayolland/borksy/commit/5e75991f1c57867c736f8f09737c243247d2d535">5e75991</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.6...v4.6.7">4.6.7</a> (2021-10-12)</h2>
<h3>Bug Fixes</h3>
<ul>
<li><code>$collapsibles</code> variable used before it was defined (<a href="https://github.com/Ayolland/borksy/commit/d269ccd91967ccb2291c6f216163713f77cde1f4">d269ccd</a>)</li>
<li><code>$option</code> variable used before it was defined (<a href="https://github.com/Ayolland/borksy/commit/c231e90c17fa5e52753d74d99f8639314f71db51">c231e90</a>)</li>
<li>explicitly reference <code>window</code> when defining/accessing global variables (<a href="https://github.com/Ayolland/borksy/commit/4ca4d014301b38197903364346e830d885e113a2">4ca4d01</a>)</li>
<li>use relative filepaths (<a href="https://github.com/Ayolland/borksy/commit/4aeeee345b8f88420bd5b1187ed6070137673828">4aeeee3</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.5...v4.6.6">4.6.6</a> (2021-10-12)</h2>
<h3>Bug Fixes</h3>
<ul>
<li><code>Ctrl</code> instead of <code>Ctl</code> (<a href="https://github.com/Ayolland/borksy/commit/c6d10ea757a6b1bf2b3bd248d8c7953bf81c1792">c6d10ea</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.4...v4.6.5">4.6.5</a> (2021-10-12)</h2>
<h3>Bug Fixes</h3>
<ul>
<li>remove unused test game data (<a href="https://github.com/Ayolland/borksy/commit/67998b04cf8f669f73d9269b729a44dfe498f014">67998b0</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.3...v4.6.4">4.6.4</a> (2021-10-11)</h2>
<h3>Bug Fixes</h3>
<ul>
<li>open external links in new tab (<a href="https://github.com/Ayolland/borksy/commit/d335ed2d3a208f5cc85f18bc13a2b2f8b69fd354">d335ed2</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.2...v4.6.3">4.6.3</a> (2021-10-11)</h2>
<h3>Bug Fixes</h3>
<ul>
<li>add <code>lang</code> to html tag (<a href="https://github.com/Ayolland/borksy/commit/2fd9bdbbf61bd5141410a277da1d940ce66a8b50">2fd9bdb</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.1...v4.6.2">4.6.2</a> (2021-10-11)</h2>
<h3>Bug Fixes</h3>
<ul>
<li>test release (<a href="https://github.com/Ayolland/borksy/commit/753d3852e5d458056e69df1e8d26d11a292f312c">753d385</a>)</li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v4.6.0...v4.6.1">4.6.1</a> (2021-10-10)</h2>
<ul>
<li>Added MIT license</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.5.0...v4.6.0">4.6.0</a> (2021-09-27)</h1>
<ul>
<li>Added Bitsy 7.10 template</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.4.0...v4.5.0">4.5.0</a> (2021-09-09)</h1>
<ul>
<li>Added Bitsy 7.8 and 7.9 templates</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.3.0...v4.4.0">4.4.0</a> (2020-12-02)</h1>
<ul>
<li>Added Bitsy 7.2 template</li>
<li>Updated hack filepaths to work with Github again</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.2.0...v4.3.0">4.3.0</a> (2020-04-23)</h1>
<ul>
<li>Added Bitsy 6.5 and 7.0 templates</li>
<li>Added &quot;Gravity&quot;, &quot;Textbox Styler&quot; and &quot;Edit Room From Dialog&quot; hacks</li>
<li>Cleaned up hack options and readme files to be more accurate and helpful</li>
<li>Removed &quot;3D&quot;, &quot;Extended Logic Operators&quot; and &quot;Character Portraits Animated&quot; hacks (due to bugs/borksy compatibility issues)</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.1.0...v4.2.0">4.2.0</a> (2019-10-07)</h1>
<ul>
<li>Added Bitsy 6.4 template</li>
<li>Added &quot;Tracery Processing&quot;, &quot;3D&quot;, and &quot;Replace Image&quot; hacks</li>
<li>Added &quot;Troublshooting/FAQs&quot; section</li>
<li>Party mode enhancements</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v4.0.0...v4.1.0">4.1.0</a> (2019-06-10)</h1>
<ul>
<li>Added Bitsy 6.3 template</li>
<li>Added &quot;Long Dialog&quot; and &quot;Character Portraits Animated&quot; hacks</li>
<li>Deprecated &quot;Paragraph Break&quot; hack</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.6.0...v4.0.0">4.0.0</a> (2019-04-16)</h1>
<ul>
<li>Multiple Bitsy version templates</li>
<li>Added Bitsy 6.0 template</li>
<li>Added Bitsy HD template</li>
<li>Added text-to-speech hack</li>
<li>Updated options for transparent sprites hack</li>
<li>Improved &quot;Other Tools&quot; section</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.5.0...v3.6.0">3.6.0</a> (2019-03-12)</h1>
<ul>
<li>Updated to use Bitsy 5.5</li>
<li>Added more hacks</li>
<li>Hacks updated to use Github again</li>
<li>Hacks are now alphabetized</li>
<li>Removed Bitspy indicators</li>
<li>Removed modifications to expose bitsy variables</li>
<li>Added special tips section</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.4.0...v3.5.0">3.5.0</a> (2018-10-15)</h1>
<ul>
<li>Fixed mobile touch controls for itch.io embeds</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.3.0...v3.4.0">3.4.0</a> (2018-09-10)</h1>
<ul>
<li>Updated to Bitsy 5.3</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.2.0...v3.3.0">3.3.0</a> (2018-08-24)</h1>
<ul>
<li>Borksy now uses a repaired/edited version of the default bitsy font that has more consistent unicode support</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.1.0...v3.2.0">3.2.0</a> (2018-08-16)</h1>
<ul>
<li>Updated to Bitsy 5.1</li>
<li>Deprecated the font tool</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v3.0.0...v3.1.0">3.1.0</a> (2018-06-18)</h1>
<ul>
<li>Fixed bugs in importing files locally</li>
<li>Added ability to force borksy to use a local version</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v2.4.0...v3.0.0">3.0.0</a> (2018-06-13)</h1>
<ul>
<li>Hacks are now retrieved from GIthub, with local backups</li>
<li>Added the &quot;how to use borksy&quot; section</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v2.3.5...v2.4.0">2.4.0</a> (2018-06-07)</h1>
<ul>
<li>Added bitsymuse hack</li>
<li>Added multi-sprite avatar hack</li>
<li>Added link to overworld witchery in &quot;other tools&quot;</li>
<li>Hacks updated to current versions</li>
<li>Bitsy variables are exposed in JS as global variable <code>bitsyVariableMap</code></li>
</ul>
<h2><a href="https://github.com/Ayolland/borksy/compare/v2.3.0...v2.3.5">2.3.5</a> (2018-05-30)</h2>
<ul>
<li>Fixed bug where hack options were unescaped</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v2.2.0...v2.3.0">2.3.0</a> (2018-05-26)</h1>
<ul>
<li>Added editable hack options to relevant hacks</li>
<li>Added &quot;Directional Avatar&quot; hack</li>
<li>Added &quot;Bitspy Friendliness&quot; indicators to all hacks</li>
<li>Added ability to change filename</li>
<li>Added &quot;Other Bitsy tools&quot; links to &quot;About&quot; section</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v2.1.0...v2.2.0">2.2.0</a> (2018-05-21)</h1>
<ul>
<li>Actually really updated to Bitsy 4.8 this time</li>
<li>Fixed conflict between unique items and permanent items</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v2.0.0...v2.1.0">2.1.0</a> (2018-05-15)</h1>
<ul>
<li>Updated to Bitsy 4.8</li>
<li>Fixed bug in solid items hack</li>
<li>Loading screen</li>
</ul>
<h1><a href="https://github.com/Ayolland/borksy/compare/v1.0.0...v2.0.0">2.0.0</a> (2018-04-23)</h1>
<ul>
<li>Preloaded hacks menu</li>
<li>Hotkeys</li>
</ul>
<h1>0.1.0 (2018-04-13)</h1>
<ul>
<li>Initial version</li>
</ul>
`,G=`<p>Borksy is a hacking tool to be used in conjunction with <a href="https://ledoux.itch.io/bitsy">Bitsy Game Maker</a>! Use it to customize your games and add hacks without needing a web server or any manual cut-and-paste work.</p>
<p>If you're not sure how to use this tool, check out the 'How To Use Borksy' section. If you're having issues, check the 'Troubleshooting/FAQs' section. If you're not familiar with how Bitsy can be extended, explore <a href="https://github.com/seleb/bitsy-hacks/">Sean's great collection of Bitsy hacks</a>.</p>
<p>The Bitsy 7.8 templates and older are kept in Borksy as a legacy feature, however currently most hacks have been updated to support Bitsy 7.10 and may not be compatible with older versions. If you are building a project using an older version of Bitsy, Borksy may not be a good solution for you. Seek help in the Bitsy discord if you are working on a Bitsy project that requires older versions of Bitsy.</p>
<p>Borksy Features:</p>
<ul>
<li>Multiple Bitsy version templates</li>
<li>Preloaded Hacks Menu</li>
<li>Hacks are retrieved from Github, with local backups</li>
<li>Editable hack options</li>
<li>Customize HTML/CSS</li>
<li>Customize page title / filename</li>
<li>Field for extra JS / hacks</li>
<li>Saves work to LocalStorage for persistence</li>
<li>Updated default Bitsy font with more consistent unicode support</li>
<li>Party Mode!</li>
</ul>
<p>Report any bugs you find to <a href="https://twitter.com/AYolland">me on twitter!</a></p>
`,U=`<ul>
<li>
<p>Looking for the 'Paragraph Break' hack? Use 'Long Dialog' instead. It has all the same functionality and more!</p>
</li>
<li>
<p>If you're still using the exit-from-dialog or end-from-dialog hacks, make sure to check out and new the new locked exits functionality in Bitsy 7.0! (These hacks are likely to be deprecated in the future.)</p>
</li>
<li>
<p>You can access the Bitsy game variables from JavaScript using <code>window.scriptInterpreter.GetVariable(variableName)</code> and <code>window.scriptInterpreter.SetVariable(variableName)</code></p>
</li>
<li>
<p>Using CSS to add a background image to your game can add a lot of polish for mimimal effort, especially on mobile.</p>
</li>
<li>
<p>Borksy changes the canvas rendering of Bitsy game to display crisp pixel-edges. This can be commented out in the CSS if your prefer the default anti-aliasing.</p>
</li>
<li>
<p>Remember, you can add hacks that aren't included in Borksy using the 'Additional JS' field.</p>
</li>
</ul>
`,Y=`<p>In order to use Borksy, you need to already have a Bitsy game you wish to add functionality to.</p>
<p>Borksy accepts the game data from Bitsy and combines that with a Bitsy template to create modified HTML file that includes your bitsy game as well as any hacks or modifications you chose to include. You'll need to copy the game data from the Bitsy editor and paste it into Borksy. The file Borksy saves is the file you will release as your game.</p>
<p>Hacks are not guaranteed to work with each other, and particular hacks are not guaranteed to work with particular templates. Make sure you test the particular load-out of hacks you plan to use before developing with them.</p>
<p>While Borksy uses your browser data to save your work, it is a good idea to save any modifications (hackOptions, additional JS, HTML modifications) somewhere on your computer separately, as there is no way for Borksy to load these from a saved Borksy game.</p>
`,K=`<p>If you haven't already, check out some of the other tools created to enhance Bitsy!</p>
<ul>
<li><a href="https://github.com/seleb/bitsy-hacks/" target="_blank" rel="noopener">Bitsy Hack Repo</a> - Almost All the Bitsy hacks (not just borksy-included ones)</li>
<li><a href="https://aloelazoe.itch.io/bitsy-3d" target="_blank" rel="noopener">Bitsy 3D</a> - Bitsy but in 3D!!!</li>
<li><a href="https://vonbednar.itch.io/bitsy-x2" target="_blank" rel="noopener">Bitsy HD</a> - Bitsy but with 16x16 drawings</li>
<li><a href="https://ruin.itch.io/image-to-bitsy" target="_blank" rel="noopener">Image To Bitsy</a> - Convert images into rooms</li>
<li><a href="https://janosc.itch.io/rgbitsy" target="_blank" rel="noopener">RGBitsy</a> - Convert COLOR images to rooms!</li>
<li><a href="https://janosc.itch.io/rgbsprite" target="_blank" rel="noopener">RGBsprite</a> - Convert color images to sprites/items/avatars!</li>
<li><a href="https://tinybird.info/image-to-bitsy-hd/" target="_blank" rel="noopener">Image To Bitsy HD</a> - Convert images into rooms... in HD!</li>
<li><a href="https://seansleblanc.itch.io/fontsy" target="_blank" rel="noopener">Fontsy</a> - Bitsy font editor</li>
<li><a href="https://tommakesstuff.itch.io/spritesy" target="_blank" rel="noopener">Spritesy</a> - Tool for multiframe animations</li>
<li><a href="https://voec.github.io/witchery/" target="_blank" rel="noopener">Overworld Witchery</a> - Create maps linking multiple rooms (May not work w/ Bitsy 6.0+ ?)</li>
<li><a href="https://11808s8.itch.io/flipsy" target="_blank" rel="noopener">Flipsy</a> - Flip your room</li>
<li><a href="https://brandonmakesthings.itch.io/shiftsy" target="_blank" rel="noopener">Shiftsy</a> - Shift your room a little</li>
<li><a href="https://candle.itch.io/bitsy-audio" target="_blank" rel="noopener">Bitsy Audio</a> - Quick and Easy background audio</li>
<li><a href="https://erikaverkaaik.itch.io/bitsy-museum-hack" target="_blank" rel="noopener">Bitsy Museum Hack</a> - Link multiple Bitsy games together</li>
<li><a href="https://zenzoa.itch.io/palettsy" target="_blank" rel="noopener">Palettesy</a> - Bitsy Palette generator</li>
<li><a href="https://seansleblanc.itch.io/bitsy-merge" target="_blank" rel="noopener">Bitsy Merge</a> - Combine multiple bitsy files together.</li>
<li><a href="https://aloelazoe.itch.io/bitsy-savior" target="_blank" rel="noopener">Bitsy Savior</a> - Save your Bitsy game to a hacked file w/o copy-pasting!</li>
</ul>
<p>Check out <a href="https://itch.io/c/381992/that-good-good-bitsy-tools" target="_blank" rel="noopener">this list of tools/tips on itch</a> for even more!</p>
`,z=`<ul>
<li>
<blockquote>
<p>After I add hacks using Borksy, when I load my html file back into Bitsy, all my hacks are gone.</p>
</blockquote>
<p>Yes. Bitsy can't read hacks added through Borksy. So you need to edit your game in the Bitsy editor, and then modify it with Borksy. It is wise to keep a copy of your Bitsy game saved without any Borky modifications.</p>
</li>
<li>
<blockquote>
<p>My Borksy game won't download?</p>
</blockquote>
<p>Some game files can be too big for Borksy on certain browsers. If your game reaches a certain size, you may have to add hacks manually using a text-editor instead of using Borksy.</p>
</li>
<li>
<blockquote>
<p>What happened to the 3d hack? Can I use Borksy with Bitsy 3d?</p>
</blockquote>
<p>Unfortunately, not at this moment. Hopefully Bitsy 3d support will be back in the future!</p>
</li>
<li>
<blockquote>
<p>After using Borksy, the dialogue in my game isn't showing up, and instead there's just an empty dialogue box.</p>
</blockquote>
<p>If you're using a custom font, make sure that the font data is included when you paste your game data into Borksy. In Bitsy, the font data is hidden by default, even if you're using a custom font. In order for it be able to be copied, you'll need to click the 'font data' button on the button of the 'game data' window in Bitsy before copy your game data.</p>
</li>
<li>
<blockquote>
<p>My Bitsy HD game is not working after I use Borksy.</p>
</blockquote>
<p>Make sure you've selected a 'Borksy HD' option from the 'Bitsy Version' menu before you save out your Bitsy HD game.</p>
</li>
<li>
<blockquote>
<p>I'm using X hack and it's not working.</p>
</blockquote>
<p>Unfortunately, I can't guarantee every hack will work with every Bitsy version, or even at all. It could be a bug or issue with the hack, or with Borksy, or even with Bitsy. Make sure and test the hacks you want to use for your game before you get too far into development.</p>
</li>
<li>
<blockquote>
<p>I don't see the hack I need in Borksy.</p>
</blockquote>
<p>You can still add other hacks into your game using Borksy. You'll need to paste the hack into the 'Additional JS' field. This isn't too tricky, but you'll have to make sure you're pasting everything you need in.</p>
</li>
<li>
<blockquote>
<p>I need further help getting my game to work.</p>
</blockquote>
<p>The <a href="discordapp.com/invite/9rAjhtr">Bitsy discord</a> is a great place to get help with Bitsy or Borksy.</p>
</li>
</ul>
`;var N=`<!-- GAME CANVAS -->\r
<canvas id='game'></canvas>`,V=`[\r
		/* num: 0 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 1 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,0,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 2 */\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,1,0,1,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 3 */\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 4 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/*0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,*/\r
		/* num: 5 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 6 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 7 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 8 */\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,0,0,1,1,\r
		1,1,0,0,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 9 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 10 */\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,0,0,0,0,1,\r
		1,0,1,1,0,1,\r
		1,0,1,1,0,1,\r
		1,0,0,0,0,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 11 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,1,1,\r
		0,0,0,0,1,1,\r
		0,0,1,1,0,1,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 12 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 13 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,1,0,1,\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		0,1,1,1,0,0,\r
		0,1,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 14 */\r
		0,0,0,0,1,1,\r
		0,0,1,1,0,1,\r
		0,0,1,0,1,1,\r
		0,0,1,1,0,1,\r
		0,0,1,0,1,1,\r
		0,1,1,0,1,1,\r
		0,1,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 15 */\r
		0,0,0,0,0,0,\r
		0,1,0,1,0,1,\r
		0,0,1,1,1,0,\r
		0,1,1,0,1,1,\r
		0,0,1,1,1,0,\r
		0,1,0,1,0,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 16 */\r
		0,0,1,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,1,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 17 */\r
		0,0,0,0,1,0,\r
		0,0,0,1,1,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 18 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 19 */\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 20 */\r
		0,0,1,1,1,1,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,0,1,1,0,1,\r
		0,0,0,1,0,1,\r
		0,0,0,1,0,1,\r
		0,0,0,1,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 21 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,0,0,\r
		0,0,1,0,1,0,\r
		0,0,0,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 22 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 23 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		/* num: 24 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 25 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 26 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 27 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 28 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 29 */\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,1,1,1,1,1,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 30 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 31 */\r
		0,1,1,1,1,1,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 32 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 33 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 34 */\r
		0,1,1,0,1,1,\r
		0,1,1,0,1,1,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 35 */\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,1,1,1,1,1,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,1,1,1,1,1,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 36 */\r
		0,0,1,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,1,0,\r
		0,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 37 */\r
		0,1,1,0,0,1,\r
		0,1,1,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,1,1,\r
		0,1,0,0,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 38 */\r
		0,0,1,0,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,0,1,0,1,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 39 */\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 40 */\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 41 */\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 42 */\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,0,1,1,1,0,\r
		0,1,1,1,1,1,\r
		0,0,1,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 43 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 44 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,0,0,0,\r
		/* num: 45 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 46 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 47 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 48 ZERO!!!!*/\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,1,1,\r
		0,1,0,1,0,1,\r
		0,1,1,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 49 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 50 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,0,1,1,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 51 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 52 */\r
		0,0,0,0,1,0,\r
		0,0,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 53 */\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 54 */\r
		0,0,0,1,1,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 55 */\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 56 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 57 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 58 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 59 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,1,0,0,0,\r
		/* num: 60 */\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 61 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 62 */\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 63 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,0,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 64 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,1,1,1,\r
		0,1,0,1,0,1,\r
		0,1,0,1,1,1,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 65 Start of Capital Letters*/\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 66 */\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 67 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 68 */\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 69 */\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 70 */\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 71 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 72 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 73 */\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 74 */\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 75 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,1,0,\r
		0,1,0,1,0,0,\r
		0,1,1,0,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 76 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 77 */\r
		0,1,0,0,0,1,\r
		0,1,1,0,1,1,\r
		0,1,0,1,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 78 */\r
		0,1,0,0,0,1,\r
		0,1,1,0,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,0,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 79 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 80 */\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 81 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 82 */\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 83 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 84 */\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 85 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 86 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 87 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 88 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 89 */\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 90 */\r
		0,1,1,1,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 91 */\r
		0,0,1,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 92 */\r
		0,0,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 93 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 94 */\r
		0,0,0,1,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 95 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		/* num: 96 */\r
		0,0,1,1,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 97 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 98 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 99 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 100 */\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 101 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 102 */\r
		0,0,0,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 103 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,0,\r
		/* num: 104 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 105 */\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 106 */\r
		0,0,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		/* num: 107 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,0,0,\r
		0,1,1,0,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 108 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 109 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,0,1,0,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 110 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 111 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 112 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		/* num: 113 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,1,\r
		/* num: 114 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,0,1,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,1,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 115 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 116 */\r
		0,0,0,0,0,0,\r
		0,0,1,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 117 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 118 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 119 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,1,0,1,\r
		0,1,1,1,1,1,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 120 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 121 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,1,1,0,0,0,\r
		/* num: 122 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 123 */\r
		0,0,0,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,1,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 124 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 125 */\r
		0,0,1,1,0,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,1,\r
		0,0,0,0,1,0,\r
		0,0,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 126 */\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 127 */\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,1,0,1,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 128 */\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		/* num: 129 */\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 130 */\r
		0,0,0,0,1,1,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 131 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 132 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 133 */\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 134 */\r
		0,0,1,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 135 */\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		/* num: 136 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 137 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 138 */\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 139 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 140 */\r
		0,0,0,1,0,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 141 */\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 142 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 143 */\r
		0,0,1,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,1,1,0,\r
		0,1,1,0,1,1,\r
		0,1,0,0,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 144 */\r
		0,0,0,0,1,1,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 145 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,1,0,1,\r
		0,1,1,1,1,1,\r
		0,1,0,1,0,0,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 146 */\r
		0,0,1,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 147 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 148 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 149 */\r
		0,1,1,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 150 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 151 */\r
		0,1,1,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 152 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,1,1,0,0,0,\r
		/* num: 153 */\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 154 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 155 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 156 */\r
		0,0,0,1,1,0,\r
		0,0,1,0,0,1,\r
		0,0,1,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,1,0,0,0,\r
		0,0,1,0,0,1,\r
		0,1,0,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 157 */\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 158 */\r
		0,1,1,0,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,1,0,1,0,\r
		0,1,0,1,1,1,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 159 */\r
		0,0,0,0,1,0,\r
		0,0,0,1,0,1,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,0,1,0,0,0,\r
		/* num: 160 */\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 161 */\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 162 */\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 163 */\r
		0,0,0,1,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 164 */\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 165 */\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,1,0,1,0,\r
		0,1,0,1,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 166 */\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 167 */\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 168 */\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 169 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 170 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 171 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,0,0,1,0,\r
		0,0,0,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 172 */\r
		0,1,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,1,0,1,1,\r
		0,1,0,1,0,1,\r
		0,0,0,1,1,1,\r
		0,0,0,0,0,1,\r
		0,0,0,0,0,0,\r
		/* num: 173 */\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 174 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,0,0,1,\r
		0,1,0,0,1,0,\r
		0,0,1,0,0,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 175 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,0,1,0,0,1,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 176 */\r
		0,1,0,1,0,1,\r
		0,0,0,0,0,0,\r
		1,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,1,0,1,\r
		0,0,0,0,0,0,\r
		1,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 177 */\r
		0,1,0,1,0,1,\r
		1,0,1,0,1,0,\r
		0,1,0,1,0,1,\r
		1,0,1,0,1,0,\r
		0,1,0,1,0,1,\r
		1,0,1,0,1,0,\r
		0,1,0,1,0,1,\r
		1,0,1,0,1,0,\r
		/* num: 178 */\r
		1,0,1,0,1,0,\r
		1,1,1,1,1,1,\r
		0,1,0,1,0,1,\r
		1,1,1,1,1,1,\r
		1,0,1,0,1,0,\r
		1,1,1,1,1,1,\r
		0,1,0,1,0,1,\r
		1,1,1,1,1,1,\r
		/* num: 179 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 180 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 181 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		/* num: 182 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		1,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 183 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 184 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 185 */\r
		0,1,0,1,0,0,\r
		1,1,0,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 186 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 187 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 188 */\r
		0,1,0,1,0,0,\r
		1,1,0,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 189 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 190 */\r
		0,0,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 191 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 192 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 193 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 194 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 195 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 196 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 197 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 198 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 199 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 200 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 201 */\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 202 */\r
		0,1,0,1,0,0,\r
		1,1,0,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 203 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,0,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 204 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,0,0,0,\r
		0,1,0,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 205 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 206 */\r
		0,1,0,1,0,0,\r
		1,1,0,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,0,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 207 */\r
		0,0,0,1,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 208 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 209 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		/* num: 210 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		/* num: 211 */\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,1,1,1,1,1,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 212 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		/* num: 213 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 214 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 215 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 216 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 217 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 218 */\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 219 */\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		1,1,1,1,1,1,\r
		/* num: 220 */\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		/* num: 221 */\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		/* num: 222 */\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		/* num: 223 */\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		/* num: 224 */\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		/* num: 225 */\r
		0,0,0,0,0,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,0,0,\r
		/* num: 226 */\r
		0,1,1,1,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 227 */\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,1,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 228 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 229 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,1,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 230 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,1,0,0,0,0,\r
		/* num: 231 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 232 */\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 233 */\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 234 */\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,0,1,0,\r
		0,0,1,0,1,0,\r
		0,1,1,0,1,1,\r
		0,0,0,0,0,0,\r
		/* num: 235 */\r
		0,0,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 236 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,0,1,0,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 237 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,1,0,1,\r
		0,1,0,1,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 238 */\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,1,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 239 */\r
		0,0,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 240 */\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 241 */\r
		0,0,0,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 242 */\r
		0,1,0,0,0,0,\r
		0,0,1,1,0,0,\r
		0,0,0,0,1,0,\r
		0,0,1,1,0,0,\r
		0,1,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 243 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		1,1,1,0,0,0,\r
		1,0,0,1,1,0,\r
		1,0,0,0,0,1,\r
		1,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		/* num: 244 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		1,1,1,1,1,1,\r
		0,0,0,1,1,1,\r
		0,1,1,0,0,1,\r
		1,0,0,0,0,1,\r
		0,0,0,0,0,1,\r
		1,1,1,1,1,1,\r
		/* num: 245 */\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,0,0,1,0,0,\r
		0,1,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 246 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,1,1,1,0,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,1,0,0,0,1,\r
		0,0,1,1,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 247 */\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		1,1,1,1,1,0,\r
		/* num: 248 */\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		1,1,1,1,0,0,\r
		/* num: 249 */\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		1,1,1,0,0,0,\r
		/* num: 250 */\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		1,1,0,0,0,0,\r
		/* num: 251 */\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		1,0,0,0,0,0,\r
		/* num: 252 */\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		0,1,0,1,1,0,\r
		0,0,1,0,1,0,\r
		0,0,0,0,0,0,\r
		/* num: 253 */\r
		0,1,1,0,0,0,\r
		0,0,0,1,0,0,\r
		0,0,1,0,0,0,\r
		0,1,1,1,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		/* num: 254 */\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0,\r
		0,1,1,1,1,0,\r
		1,1,0,0,1,0,\r
		1,1,0,0,1,1,\r
		1,1,1,1,1,0,\r
		0,0,1,1,1,1,\r
		/* num: 255 */\r
		0,1,0,0,1,0,\r
		1,1,1,1,1,1,\r
		0,1,0,0,1,0,\r
		0,1,0,0,1,0,\r
		1,1,1,1,1,1,\r
		0,1,0,0,1,0,\r
		0,0,0,0,0,0,\r
		0,0,0,0,0,0\r
]`,J=`BORK BORK BORK\r
\r
# BITSY VERSION 5.5\r
\r
! ROOM_FORMAT 1\r
\r
PAL 0\r
187,56,102\r
255,141,78\r
0,0,0\r
\r
ROOM 0\r
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\r
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0\r
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\r
PAL 0\r
\r
TIL a\r
11111111\r
10000001\r
10000001\r
10011001\r
10011001\r
10000001\r
10000001\r
11111111\r
WAL true\r
\r
SPR A\r
00011000\r
00111000\r
00011000\r
00111100\r
00111110\r
01111101\r
10100100\r
00100000\r
>\r
00011000\r
00111000\r
00011000\r
00111100\r
01111100\r
10111110\r
00100101\r
00000100\r
POS 0 4,4\r
\r
SPR a\r
00001000\r
11111000\r
11101000\r
11111000\r
00111000\r
01111010\r
01111010\r
11111100\r
>\r
11001000\r
11111000\r
00101000\r
11111000\r
00111000\r
01111001\r
01111010\r
11111100\r
NAME dog\r
DLG SPR_0\r
POS 0 8,12\r
\r
ITM 0\r
00000000\r
00000000\r
00000000\r
00111100\r
01100100\r
00100100\r
00011000\r
00000000\r
NAME tea\r
DLG ITM_0\r
\r
DLG SPR_0\r
"""\r
{sequence\r
  - BORKSY: bork bork bork i'm a cat\r
  - BORKSY: (heh heh i'm not a cat)\r
}\r
"""\r
\r
DLG ITM_0\r
You found a nice warm cup of tea\r
\r
VAR a\r
42`,A=`BORK BORK HD BORK\r
\r
# BITSY VERSION 5.1\r
\r
! ROOM_FORMAT 1\r
\r
PAL 0\r
220,255,104\r
110,168,62\r
159,10,237\r
\r
ROOM 0\r
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\r
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0\r
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0\r
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\r
PAL 0\r
\r
TIL a\r
0000000000000000\r
0111111111111110\r
0100000000000010\r
0101111111111010\r
0101000000001010\r
0101010000101010\r
0101001111001010\r
0101001001001010\r
0101001001001010\r
0101001111001010\r
0101010000101010\r
0101000000001010\r
0101111111111010\r
0100000000000010\r
0111111111111110\r
0000000000000000\r
\r
SPR A\r
0000001110000000\r
0000001110000000\r
0000001110000000\r
0000111111000000\r
0001111001100000\r
0001111111110000\r
0011111111110000\r
0011111111111000\r
0011111111111100\r
0111111111101100\r
0110111111100000\r
0000111111100000\r
0000110001100000\r
0001100001100000\r
0001100001100000\r
0001100001100000\r
>\r
0000011100000000\r
0000011100000000\r
0000011100000000\r
0000111100000000\r
0001110011100000\r
0001111111110110\r
0001111111111110\r
0011111111011100\r
0011111111100000\r
0011011111100000\r
0011011111100000\r
0000011111100000\r
0000111001100000\r
0000110011100000\r
0001100011000000\r
0001100011000000\r
POS 0 5,5\r
\r
SPR a\r
0000000000000000\r
0000000000000000\r
0000000000000000\r
0000000000000000\r
0010001000000000\r
0011011000001000\r
0011111000000100\r
0001101011000010\r
0011111011100010\r
0001110111110010\r
0010001111110010\r
0011111111110100\r
0011011110110100\r
0011011001111000\r
0100100011000000\r
0000000000000000\r
DLG SPR_0\r
\r
SPR b\r
0000000010000000\r
0000000011000000\r
1111111111000000\r
1011111111000000\r
0111111011000000\r
1111110011000000\r
1111111111000000\r
0011111110000000\r
0000000000000000\r
0001011110001000\r
0010111111000100\r
0001111111000100\r
0001110111101100\r
0011101111111000\r
0111101111110000\r
1111001111110000\r
>\r
1110000000000000\r
0111110011110000\r
1111111111100000\r
0011111111000000\r
0001111011000000\r
0100110011000000\r
1111111111000000\r
0011111110000000\r
0000000000000000\r
0011011110000000\r
0000111111000000\r
0001111111000011\r
0011110111101100\r
1111101111111000\r
1111001111110000\r
0000001111110000\r
DLG SPR_1\r
POS 0 10,10\r
\r
ITM 0\r
0000000000000000\r
0000000000000000\r
0000000000000000\r
0001111110000000\r
0010000001000000\r
0011111111100000\r
0011111110111000\r
0011111111011000\r
0011111111001100\r
0011111111001100\r
0011111111011000\r
0011111111111000\r
0011111110100000\r
0011111111000000\r
0001111110000000\r
0000000000000000\r
DLG ITM_0\r
\r
DLG SPR_0\r
I'm a cat\r
\r
DLG ITM_0\r
You found a nice warm cup of tea\r
\r
DLG SPR_1\r
Borksy: I'm in HD!! (If by HD you mean 16x16 2-bit graphics!)\r
\r
VAR a\r
42`,W=`html {\r
	margin: 0px;\r
	padding: 0px;\r
}\r
\r
body {\r
	margin: 0px;\r
	padding: 0px;\r
	overflow: hidden;\r
	background: #000;\r
}\r
\r
#game {\r
	background: black;\r
	width: 100vw;\r
	max-width: 100vh;\r
	margin: auto;\r
	display: block;\r
	touch-action: none; /* fixing touch-input errors in chrome */\r
\r
	/* sharp pixel edges */\r
	/* https://caniuse.com/#search=image-render */\r
	-ms-interpolation-mode: nearest-neighbor; /* IE */\r
	image-rendering: -moz-crisp-edges; /* FF 6.0+ */\r
	image-rendering: pixelated; /* Chrome, Safari */\r
}\r
`,Q=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",body:N,fontdata:V,gamedata:J,gamedataHD:A,style:W});const p={lastUpdated:"September 16, 2021",templates:[{filename:"Bitsy.5.5",description:"Bitsy 5.5 (modified for Borksy)",isDefault:!1},{filename:"BitsyHD.5.1",description:"Bitsy HD + Borksy (modified from Bitsy 5.1)",isDefault:!1},{filename:"Bitsy.6.0",description:"Bitsy 6.0 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.3",description:"Bitsy 6.3 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.4",description:"Bitsy 6.4 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.5",description:"Bitsy 6.5",isDefault:!1},{filename:"Bitsy.7.0",description:"Bitsy 7.0",isDefault:!1},{filename:"Bitsy.7.2",description:"Bitsy 7.2",isDefault:!1},{filename:"Bitsy.7.8",description:"Bitsy 7.8",isDefault:!1},{filename:"Bitsy.7.10",description:"Bitsy 7.10",isDefault:!0}]},u={"avatar-by-room":{title:"\u{1F465} Avatar By Room",description:"Allows changing the avatar in certain rooms.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"avatar-by-room.js",forceLocal:!1},backdrops:{title:"\u{1F5BC} Backdrops",description:"Gives the game a backdrop",author:"Cephalopodunk",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"backdrops.js",forceLocal:!1},bitsymuse:{title:"\u{1F60C} Bitsymuse",description:"A hack that a variety of audio controls, including music that changes as you move between rooms.",author:"David Mowatt",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"bitsymuse.js",forceLocal:!1},"character-portraits":{title:"\u{1F63D} Character Portraits",description:"High Quality Anime Jpegs (or pngs i guess)",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"character-portraits.js",forceLocal:!1},"dialog-choices":{title:"\u{1F500} Dialog Choices",description:"Allows binary(?) dialog choices.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-choices.js",forceLocal:!1},"dialog-jump":{title:"\u{1F680} Dialog Jump",description:"Allows jumping from one dialog entry to another.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-jump.js",forceLocal:!1},"dialog-pause":{title:"\u{1F4AC} Dialog Pause",description:"Allows adding pauses in between printing text.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-pause.js",forceLocal:!1},"direction-in-dialog":{title:"\u{1F51D} Direction in Dialog",description:"Provides a variable with player direction.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"direction-in-dialog.js",forceLocal:!1},"directional-avatar":{title:"\u2194 Directional Avatar",description:"Flips the player's sprite based on directional movement",author:"Sean S LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:10,conflicts:!1,github:"directional-avatar.js",forceLocal:!1},"dynamic-background":{title:"\u{1F5BC} Dynamic Background Color",description:"Changes the color of the BODY tag to the background color of the current room.",author:"Sean S LeBlanc",readme:!1,type:"simple",requires:!1,hidden:!1,order:10,conflicts:!1,github:"dynamic-background.js",forceLocal:!1},"edit-image-from-dialog":{title:"\u{1F58C} Edit Image from Dialog",description:"Allows editing of sprites, items, and tiles from dialog.",author:"Sean S LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"edit-image-from-dialog.js",forceLocal:!1},"edit-room-from-dialog":{title:"\u{1F3E0} Edit Room from Dialog",description:"Allows editing the content of a room from dialog.",author:"Dana Holdampf",readme:!0,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"edit-room-from-dialog.js",forceLocal:!1},"end-from-dialog":{title:"\u{1F51A} End From Dialog",description:"Adds (End) and (EndNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"end-from-dialog.js",forceLocal:!1},"exit-from-dialog":{title:"\u{1F6AA} Exit From Dialog",description:"Adds (Exit) and (ExitNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"exit-from-dialog.js",forceLocal:!1},"gamepad-input":{title:"\u{1F3AE} Gamepad Input",description:"Adds HTML5 gamepad support.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:3,conflicts:!1,github:"gamepad-input.js",forceLocal:!1},gravity:{title:"\u{1F342} Gravity",description:"Adds pseudo-platforming/gravity/physics.",author:"Cole Sea",readme:!0,type:"options",requires:"",hidden:!1,order:10,conflicts:!1,github:"gravity.js",forceLocal:!1},"javascript-dialog":{title:"\u2615 Javascript Dialog",description:"Lets you execute arbitrary JavaScript from dialog (including inside conditionals).",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:2,conflicts:!1,github:"javascript-dialog.js",forceLocal:!1},"long-dialog":{title:"\u{1F4DC} Long Dialog",description:"put more words onscreen",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:3,conflicts:!1,github:"long-dialog.js",forceLocal:!1},"multi-sprite-avatar":{title:"\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F467} Multi-Sprite Avatar",description:"Allows multiple sprites to be moved together along with the player to create the illusion of a larger avatar.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"multi-sprite-avatar.js",forceLocal:!1},"opaque-tiles":{title:"\u2B1B Opaque Tiles",description:"Adds tiles which hide the player.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"opaque-tiles.js",forceLocal:!1},"permanent-items":{title:"\u23F3 Permanent Items",description:"Prevents certain items from being picked up, but allows them to be walked over and triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:4,conflicts:!1,github:"permanent-items.js",forceLocal:!1},"replace-drawing":{title:"\u{1F3AD} Replace Drawing",description:"Add name-tags to replace drawings when the game is loading",author:"Elkie Nova",readme:!0,type:"simple",requires:"",hidden:!1,order:3,conflicts:!1,github:"replace-drawing.js",forceLocal:!1},save:{title:"\u{1F4BE} Save",description:"Save/Load Your Game",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"save.js",forceLocal:!1},"solid-items":{title:"\u{1F6D1} Solid Items",description:"Prevents certain items from being picked up or walked over, but still triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"solid-items.js",forceLocal:!1},stopwatch:{title:"\u23F1\uFE0F Stopwatch",description:"Allows timing player actions.",author:"Lenny Magner",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"stopwatch.js",forceLocal:!1},"text-to-speech":{title:"\u{1F5E3} Text to Speech",description:" Provides text-to-speech for bitsy dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"text-to-speech.js",forceLocal:!1},"textbox-styler":{title:"\u{1F4D0} Textbox Styler",description:" Customize the style and properties of the textbox.",author:"Dana Holdampf & Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"textbox-styler.js",forceLocal:!1},"tracery-processing":{title:"\u{1F3F0} Tracery Processing",description:"process all dialog text with a tracery grammar",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:3,conflicts:!1,github:"tracery-processing.js",forceLocal:!1},"transparent-dialog":{title:"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F Transparent Dialog",description:"Makes the dialog box have a transparent background.",author:"Sean S. LeBlanc",readme:!1,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"transparent-dialog.js",forceLocal:!1},"transparent-sprites":{title:"\u{1F3C1} Transparent Sprites",description:"Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:30,conflicts:!1,github:"transparent-sprites.js",forceLocal:!1},"unique-items":{title:"\u2744 Unique Items",description:"Adds support for items which, when picked up, remove all other instances of that item from the game.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"unique-items.js",forceLocal:!1}},f={};async function y(t,n,r,e,a){try{const s=await(await fetch(n+t)).text();f[a||t]=s,r==null||r(s,a)}catch(o){console.error(`Error loading ${t}`,o),e==null||e(o,a)}}function X(){const t=document.querySelector("select#template");t.innerHTML="";for(let n=p.templates.length-1;n>=0;n--){const r=`${p.templates[n].filename}.html`,{description:e}=p.templates[n],{isDefault:a}=p.templates[n];t.innerHTML+=`<option value="${r}" ${a?"data-default-option":""}>${e}</option>`,y(r,"template/")}}function Z(t,n){console.log(n),F.exports.saveAs(new Blob([n],{type:"text/html;charset=utf-8"}),t),console.log(`File '${t}' downloaded`)}function S(t,n=10){const r=t.toString(),e=r.length>n?"...":"";return r.substring(0,n)+e}function t0(t){return t.toLowerCase().replace(/-(.)/g,(n,r)=>r.toUpperCase())}function g(t){return t.replace(/[^\w\s]/gi,"")}function n0(t){return t.length>1?`${t.slice(0,t.length-1).join(", ")}, and ${t.slice(-1)}`:t[0]}function r0(t,n){const r=new RegExp(n,"g");t.val(t.val().replace(r,""))}function h(t,n){t.data("clean-regex")&&r0(t,t.data("clean-regex"));let r;t.prop("type")==="checkbox"?r=t.prop("checked"):n===void 0?r=t.val():(r=n,t.val(n));const e=t.attr("name");localStorage.setItem(e,r),console.log(`Key: '${e}' saved to localStorage: ${S(r)}`)}function b(t){const n=t.attr("name"),r=localStorage.getItem(n);if(r===null){console.log(` Attempted to get key: ${n} from localStorage, but nothing was found.`);return}if(t.prop("type")==="checkbox"){const e=r==="true";t.prop("checked",e)}else t.val(r);console.log(` Got key: ${n} from localStorage: ${S(r)}`),n==="template"&&r.split(".")[0]==="BitsyHD"&&(i("#mascot").addClass("borksyHD"),console.log("BitsyHD detected"))}function m(t){const n=t.attr("name");let r;switch(n){case"template":r=e0;break}t.change(()=>{h(t),r==null||r(t)})}function e0(t){const n=t.val().split(".")[0]==="BitsyHD",r=localStorage.getItem("gamedata")==null,e=A,a=e!==void 0,o=i("#mascot");if(n){if(o.addClass("borksyHD"),r&&a){const s=i("#gamedata");s.val(e),h(s)}}else o.removeClass("borksyHD")}function a0(t){i.each(t,(n,r)=>{const e=i(`#${r}`),a=e.prop("type")==="hidden"&&e.val()===!1,o=e.prop("type")==="checkbox"&&e.prop("checked")===!1;a||o||(e.val(!1),e.prop("checked",!1),D(e,!1))})}function q(t){const n=i(`[data-associated-hack=${t.data("hack")}]`);n.length>0&&x(n,t)}function x(t,n){n.prop("checked")===!0?t.addClass("included"):t.removeClass("included")}function D(t,n=!0){h(t),q(t);const r=u[t.data("hack")].conflicts;r&&n&&a0(r.split(","))}function o0(t){t.change(()=>{D(t)})}function i0(t){return Array.from(document.querySelectorAll("[data-borksy-replace-single]")).reduce((n,r)=>{const e=i(r),a=`BORKSY-${e.data("borksy-replace-single")}`,o=e.val();return n.replace(a,o)},t)}function s0(){return Object.entries(u).map(([t,n])=>B({name:t},n)).sort(({order:t},{order:n})=>t-n)}function l0(t){return s0().reduce((r,e)=>{const a=e.name,o=`${a}.js`,s=i(`#${a}`);if(!(s.prop("checked")||s.val()==="true"))return r;let c=f[o];if(e.type==="options"){c=unescape(c);const $=i(`#${a}-options`).val();c=c.replace(/(var hackOptions.*= ){[^]*?}(;$)/m,`$1 {
${$}
} $2`)}return`${r}${c}
`},t)}function L(){Array.from(document.querySelectorAll("[data-save]")).forEach(e=>{h(i(e))});const t=i("#template").val();let n=f[t].repeat(1),r="";n=i0(n),i("[data-borksy-replace-single]").promise().done(()=>{r=l0(r)}),i("[data-hack]").promise().done(()=>{const e=i("#filename").val();n=n.replace("BORKSY-HACKS",r),Z(`${e}.html`,n)})}function T(){const t=i("body");t.hasClass("party")?(t.removeClass("party"),window.alert("\u{1F63E} Party Mode Deactivated. Everyone out. \u{1F63E}")):(t.addClass("party"),window.alert("\u2728\u{1F308} Party Mode Activated! \u{1F308}\u2728"))}function c0(){var l;const t=document.querySelector("#about_content");t.innerHTML=G;const n=document.createElement("p");n.innerHTML=(l=w.match(/(<h[12][^]+?)<h[12]/m))==null?void 0:l[1].replace(/<h[12]>([^]+?)<\/h[12]>/g,"<h2>What's new in v$1</h2>"),t.prepend(n);const r=d("How To Use Borksy");r.append(Y),t.appendChild(r[0]);const e=d("Troubleshooting / FAQs");e.addClass("faq"),e.append(z),t.appendChild(e[0]);const a=d("Other Bitsy Tools");a.append(K),t.appendChild(a[0]);const o=d("AYo's Special Tips");o.append(U),t.appendChild(o[0]);const s=d("Changelog");s.append(w),t.appendChild(s[0])}function u0(t){t.val(t.data("default")),m(t)}function d0(t){const n=unescape(f[`${t.attr("name")}.txt`]);t.val(n),m(t)}function m0(t){let n=t.data("default");n=n==="true",t.prop("type")==="checkbox"?t.prop("checked",n):t.val(n),m(t)}function p0(t){const n=t.data("default"),r=Q[n];if(!r)throw new Error(`Could not find file ${n}`);f[n]=r,t.val(r),m(t)}function h0(t){g0(t.data("default"))}function f0(t){const{options:n}=t[0];for(let r=n.length-1;r>=0;r--)if(i(n[r]).data("default-option")!==void 0){t[0].selectedIndex=r;break}m(t)}function H(t=!0){Array.from(document.querySelectorAll("[data-save]")).forEach(n=>{const r=i(n),e=localStorage.getItem(r.attr("name")),a=typeof r.data("default")!="undefined",o=e!==null;if(a&&(!o||!t))switch(r.data("default-type")){case"string":u0(r);break;case"boolean":m0(r);break;case"textfile":p0(r);break;case"font":h0(r);break;case"option":f0(r);break;case"hackOptions":d0(r);break;default:throw new Error("Unknown type")}else o?b(r):r.val(""),m(r);q(r)}),console.log(`Defaults loaded. Forced? ${!t}`)}function I(){window.confirm("Are you sure you want to erase all data and restore defaults?")&&(Array.from(document.querySelectorAll("[data-save]")).forEach(t=>{localStorage.removeItem(i(t).attr("name"))}),console.log("Cookies removed"),H(!1),i("#mascot").removeClass("borksyHD"))}function y0(){const t={x:6,y:8},n={x:16,y:16},r=1,e=document.createElement("canvas");e.width=(t.x+r)*n.x+r,e.height=(t.y+r)*n.y+r;const a=e.getContext("2d");let o=[];a.drawImage(this,0,0);for(let s=0;s<n.y;++s)for(let l=0;l<n.x;++l){const c=a.getImageData(l*(t.x+r)+r,s*(t.y+r)+r,t.x,t.y);o.push(c.data)}for(let s=0;s<o.length;++s){const l=[];for(let c=0;c<o[s].length;c+=4)l.push(o[s][c]>255/2?1:0);o[s]=l}o=o.flat(),h(i("#fontdata"),`[/*${i("#fontfilename").val()}*/${o.toString()}]`)}function g0(t){let n;typeof t=="object"?n=t.target.result:(n=`fonts/${t}`,b0(t));const r=new Image;r.onload=y0,r.src=n,v0()}function b0(t){const n=i("#fontfilename");n.val()!==t&&(n.val(t),h(n))}function k0(){Array.from(document.querySelectorAll("[data-replace-element]")).forEach(t=>{C(i(t))})}function C(t){const n=t.data("replace-element"),r=window[n]();t.replaceWith(r)}function v0(){C(i("[data-replace-element=createFontPreview]"))}function O(t,n){const r=document.querySelector("#hacks-section"),e=n.substr(0,n.lastIndexOf("."))||n,a=Array.from(r.querySelectorAll(":scope > .collapsible")).map(l=>l.dataset.associatedHack);a.push(e),a.sort();const o=r.querySelector(`:scope > .collapsible[data-associated-hack="${a[a.indexOf(e)+1]}"]`),s=I0(e,u[e])[0];o?r.insertBefore(s,o):r.appendChild(s)}function B0(){}function j(t){const n=`${t.substr(0,t.lastIndexOf("."))||t}.js`;y(n,"hacks/dist/",O,B0,n)}function w0(t,n){const r=n.substr(0,n.lastIndexOf("."))||n;u[r].usingGithub=!0,O(t,n)}function A0(t,n){const r=n.substr(0,n.lastIndexOf("."))||n;u[r].usingGithub=!1,j(n,u[r])}function S0(t,n){const r=`${t}.js`,e=n.github;y(e,"https://raw.githubusercontent.com/seleb/bitsy-hacks/main/dist/",w0,A0,r)}function q0(t,n){n.forceLocal!==!1?j(t):n.github!==!1&&S0(t,n)}function x0(t,n,r){t.attr({"data-save":!0,"data-default":!1,"data-default-type":"boolean","data-hack":n,"data-hack-type":r.type}),r.requires&&t.attr("data-requires",r.requires)}function D0(t,n,r){const e=[];i.each(n.conflicts.split(","),(s,l)=>{e.push(g(u[l].title))});const a=n0(e),o=i("<p>",{text:`This hack conflicts with ${a}.`,class:"conflict-warning"});r.append(o)}function L0(t,n,r){let e="github-message",a="";const o=g(n.title);n.forceLocal!==!1?a=`Borksy is opting to use a local version of ${o} from ${p.lastUpdated}.`:u[t].usingGithub===!0?a=`${o} is using the most recent version from Github.`:(a=`${o} could not be loaded from Github, local version retrieved on ${p.lastUpdated} is being used.`,e+=" warning");const s=i("<p>",{text:a,class:e});r.append(s)}function T0(t,n,r){const e=d(`${g(n.title)} Options:`),a=i("<label>",{text:`var ${t0(t)}Options = {`});y(`${t}.options.txt`,"hacks/options/",o=>{const s=i("<textarea>",{rows:5,cols:50,text:o,name:`${t}.options`,id:`${t}-options`});s.attr({"data-save":!0,"data-default-type":"hackOptions","data-default":`${t}.options.txt`}),b(s),m(s),a.append(s),a.append(document.createTextNode("};")),e.append(a),r.append(e)})}function H0(t,n,r){const e=d(`${g(n.title)} README:`);y(`${t}.readme.txt`,"hacks/info/",a=>{const o=i("<pre>",{text:a});e.append(o),r.append(e)})}function I0(t,n){const r=d(`${n.title} (By ${n.author})`);r.attr("data-associated-hack",t);const e=i("<p>",{text:n.description});r.append(e),n.conflicts&&D0(t,n,r),L0(t,n,r);const a=i("<label>",{text:`Include ${g(n.title)}`}),o=i("<input>",{type:"checkbox",name:t,id:t});return x0(o,t,n),b(o),x(r,o),o0(o),a.append(o),r.append(a),n.type==="options"&&T0(t,n,r),n.readme===!0&&H0(t,n,r),r}function C0(){i.each(Object.keys(u),(t,n)=>{q0(n,u[n])})}function d(t){const n=document.createElement("details"),r=i(n);return n.className="collapsible",r.data("collapse",""),r.data("header",t),M(r),r}function O0(){Array.from(document.querySelectorAll("[data-collapsible]")).forEach(t=>{const n=i(t);M(n),n.attr("id")==="hacks-section"&&(console.log("HACK IT UP YO"),C0())}),i("#preloader").fadeOut()}function M(t){const n=document.createElement("summary");n.textContent=t.data("header"),n.className="collapsible_header",t.prepend(n)}function j0(){i(window).bind("keydown",t=>{if(t.ctrlKey||t.metaKey)switch(String.fromCharCode(t.which).toLowerCase()){case"s":t.preventDefault(),L();break;case"d":t.preventDefault(),I();break;case"p":t.preventDefault(),T();break}})}i(()=>{O0(),c0(),X(),H(),k0(),i("#download-button").on("click",L),i("#restore-button").on("click",I),j0(),i("#mascot").on("click",T)});
