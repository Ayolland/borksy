var O=Object.defineProperty;var v=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var k=(e,t,a)=>t in e?O(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,x=(e,t)=>{for(var a in t||(t={}))M.call(t,a)&&k(e,a,t[a]);if(v)for(var a of v(t))P.call(t,a)&&k(e,a,t[a]);return e};import{$ as n}from"./vendor.e7ab9a7f.js";const I=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}};I();const m={lastUpdated:"September 16, 2021",templates:[{filename:"Bitsy.5.5",description:"Bitsy 5.5 (modified for Borksy)",isDefault:!1},{filename:"BitsyHD.5.1",description:"Bitsy HD + Borksy (modified from Bitsy 5.1)",isDefault:!1},{filename:"Bitsy.6.0",description:"Bitsy 6.0 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.3",description:"Bitsy 6.3 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.4",description:"Bitsy 6.4 (modified for Borksy)",isDefault:!1},{filename:"Bitsy.6.5",description:"Bitsy 6.5",isDefault:!1},{filename:"Bitsy.7.0",description:"Bitsy 7.0",isDefault:!1},{filename:"Bitsy.7.2",description:"Bitsy 7.2",isDefault:!1},{filename:"Bitsy.7.8",description:"Bitsy 7.8",isDefault:!1},{filename:"Bitsy.7.10",description:"Bitsy 7.10",isDefault:!0}]},d={"avatar-by-room":{title:"\u{1F465} Avatar By Room",description:"Allows changing the avatar in certain rooms.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"avatar-by-room.js",forceLocal:!1},backdrops:{title:"\u{1F5BC} Backdrops",description:"Gives the game a backdrop",author:"Cephalopodunk",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"backdrops.js",forceLocal:!1},bitsymuse:{title:"\u{1F60C} Bitsymuse",description:"A hack that a variety of audio controls, including music that changes as you move between rooms.",author:"David Mowatt",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"bitsymuse.js",forceLocal:!1},"character-portraits":{title:"\u{1F63D} Character Portraits",description:"High Quality Anime Jpegs (or pngs i guess)",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"character-portraits.js",forceLocal:!1},"dialog-choices":{title:"\u{1F500} Dialog Choices",description:"Allows binary(?) dialog choices.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-choices.js",forceLocal:!1},"dialog-jump":{title:"\u{1F680} Dialog Jump",description:"Allows jumping from one dialog entry to another.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-jump.js",forceLocal:!1},"dialog-pause":{title:"\u{1F4AC} Dialog Pause",description:"Allows adding pauses in between printing text.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"dialog-pause.js",forceLocal:!1},"direction-in-dialog":{title:"\u{1F51D} Direction in Dialog",description:"Provides a variable with player direction.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:2,conflicts:!1,github:"direction-in-dialog.js",forceLocal:!1},"directional-avatar":{title:"\u2194 Directional Avatar",description:"Flips the player's sprite based on directional movement",author:"Sean S LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:10,conflicts:!1,github:"directional-avatar.js",forceLocal:!1},"dynamic-background":{title:"\u{1F5BC} Dynamic Background Color",description:"Changes the color of the BODY tag to the background color of the current room.",author:"Sean S LeBlanc",readme:!1,type:"simple",requires:!1,hidden:!1,order:10,conflicts:!1,github:"dynamic-background.js",forceLocal:!1},"edit-image-from-dialog":{title:"\u{1F58C} Edit Image from Dialog",description:"Allows editing of sprites, items, and tiles from dialog.",author:"Sean S LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"edit-image-from-dialog.js",forceLocal:!1},"edit-room-from-dialog":{title:"\u{1F3E0} Edit Room from Dialog",description:"Allows editing the content of a room from dialog.",author:"Dana Holdampf",readme:!0,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"edit-room-from-dialog.js",forceLocal:!1},"end-from-dialog":{title:"\u{1F51A} End From Dialog",description:"Adds (End) and (EndNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"end-from-dialog.js",forceLocal:!1},"exit-from-dialog":{title:"\u{1F6AA} Exit From Dialog",description:"Adds (Exit) and (ExitNow) to the the scripting language.",author:"@mildmojo",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"exit-from-dialog.js",forceLocal:!1},"gamepad-input":{title:"\u{1F3AE} Gamepad Input",description:"Adds HTML5 gamepad support.",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"",hidden:!1,order:3,conflicts:!1,github:"gamepad-input.js",forceLocal:!1},gravity:{title:"\u{1F342} Gravity",description:"Adds pseudo-platforming/gravity/physics.",author:"Cole Sea",readme:!0,type:"options",requires:"",hidden:!1,order:10,conflicts:!1,github:"gravity.js",forceLocal:!1},"javascript-dialog":{title:"\u2615 Javascript Dialog",description:"Lets you execute arbitrary JavaScript from dialog (including inside conditionals).",author:"Sean S. LeBlanc",readme:!0,type:"simple",requires:"kitsy-script-toolkit",hidden:!1,order:2,conflicts:!1,github:"javascript-dialog.js",forceLocal:!1},"long-dialog":{title:"\u{1F4DC} Long Dialog",description:"put more words onscreen",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:3,conflicts:!1,github:"long-dialog.js",forceLocal:!1},"multi-sprite-avatar":{title:"\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F467} Multi-Sprite Avatar",description:"Allows multiple sprites to be moved together along with the player to create the illusion of a larger avatar.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:5,conflicts:!1,github:"multi-sprite-avatar.js",forceLocal:!1},"opaque-tiles":{title:"\u2B1B Opaque Tiles",description:"Adds tiles which hide the player.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"opaque-tiles.js",forceLocal:!1},"permanent-items":{title:"\u23F3 Permanent Items",description:"Prevents certain items from being picked up, but allows them to be walked over and triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"kitsy-script-toolkit",hidden:!1,order:4,conflicts:!1,github:"permanent-items.js",forceLocal:!1},"replace-drawing":{title:"\u{1F3AD} Replace Drawing",description:"Add name-tags to replace drawings when the game is loading",author:"Elkie Nova",readme:!0,type:"simple",requires:"",hidden:!1,order:3,conflicts:!1,github:"replace-drawing.js",forceLocal:!1},save:{title:"\u{1F4BE} Save",description:"Save/Load Your Game",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"save.js",forceLocal:!1},"solid-items":{title:"\u{1F6D1} Solid Items",description:"Prevents certain items from being picked up or walked over, but still triggers their dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"solid-items.js",forceLocal:!1},stopwatch:{title:"\u23F1\uFE0F Stopwatch",description:"Allows timing player actions.",author:"Lenny Magner",readme:!0,type:"options",requires:"",hidden:!1,order:5,conflicts:!1,github:"stopwatch.js",forceLocal:!1},"text-to-speech":{title:"\u{1F5E3} Text to Speech",description:" Provides text-to-speech for bitsy dialog.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"text-to-speech.js",forceLocal:!1},"textbox-styler":{title:"\u{1F4D0} Textbox Styler",description:" Customize the style and properties of the textbox.",author:"Dana Holdampf & Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:2,conflicts:!1,github:"textbox-styler.js",forceLocal:!1},"tracery-processing":{title:"\u{1F3F0} Tracery Processing",description:"process all dialog text with a tracery grammar",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:"",hidden:!1,order:3,conflicts:!1,github:"tracery-processing.js",forceLocal:!1},"transparent-dialog":{title:"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F Transparent Dialog",description:"Makes the dialog box have a transparent background.",author:"Sean S. LeBlanc",readme:!1,type:"simple",requires:"",hidden:!1,order:5,conflicts:!1,github:"transparent-dialog.js",forceLocal:!1},"transparent-sprites":{title:"\u{1F3C1} Transparent Sprites",description:"Makes all sprites have transparent backgrounds. Tiles can be seen underneath the player, sprites, and items.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:30,conflicts:!1,github:"transparent-sprites.js",forceLocal:!1},"unique-items":{title:"\u2744 Unique Items",description:"Adds support for items which, when picked up, remove all other instances of that item from the game.",author:"Sean S. LeBlanc",readme:!0,type:"options",requires:!1,hidden:!1,order:5,conflicts:!1,github:"unique-items.js",forceLocal:!1}},u={};function h(e,t,a,o,s){const r=n.ajax(t+e);r.done(()=>{u[s||e]=escape(r.responseText),console.log(`Loaded ${s||e} via AJAX`),a==null||a(r.responseText,s)}),r.fail(()=>{console.log(`Error loading ${e} via AJAX`),o==null||o(r.responseText,s)})}function G(){const e=document.querySelector("select#template");e.innerHTML="";for(let t=m.templates.length-1;t>=0;t--){const a=`${m.templates[t].filename}.html`,{description:o}=m.templates[t],{isDefault:s}=m.templates[t];e.innerHTML+=`<option value="${a}" ${s?"data-default-option":""}>${o}</option>`,h(a,"template/")}}function R(e,t){const a=document.createElement("a");a.setAttribute("href",`data:text/plain;charset=utf-8,${encodeURIComponent(unescape(t))}`),a.setAttribute("download",e),a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a),console.log(`File '${e}' downloaded`)}function S(e,t=10){const a=e.toString(),o=a.length>t?"...":"";return a.substring(0,t)+o}function U(e){return e.toLowerCase().replace(/-(.)/g,(t,a)=>a.toUpperCase())}function y(e){return e.replace(/[^\w\s]/gi,"")}function F(e){return e.length>1?`${e.slice(0,e.length-1).join(", ")}, and ${e.slice(-1)}`:e[0]}function K(e,t){const a=new RegExp(t,"g");e.val(e.val().replace(a,""))}function g(e,t){e.data("clean-regex")&&K(e,e.data("clean-regex"));let a;e.prop("type")==="checkbox"?a=e.prop("checked"):t===void 0?a=e.val():(a=t,e.val(t));const o=e.attr("name");localStorage.setItem(o,a),console.log(`Key: '${o}' saved to localStorage: ${S(a)}`)}function b(e){const t=e.attr("name"),a=localStorage.getItem(t);if(a===null){console.log(` Attempted to get key: ${t} from localStorage, but nothing was found.`);return}if(e.prop("type")==="checkbox"){const o=a==="true";e.prop("checked",o)}else e.val(a);console.log(` Got key: ${t} from localStorage: ${S(a)}`),t==="template"&&a.split(".")[0]==="BitsyHD"&&(n("#mascot").addClass("borksyHD"),console.log("BitsyHD detected"))}function p(e){const t=e.attr("name");let a;switch(t){case"template":Q(),a=J;break}e.change(()=>{g(e),a==null||a(e)})}function J(e){const t=e.val().split(".")[0]==="BitsyHD",a=localStorage.getItem("gamedata")==null,o=u["gamedata.HD.txt"],s=o!==void 0,r=n("#mascot");if(t){if(r.addClass("borksyHD"),a&&s){const i=n("#gamedata");i.val(o),g(i)}}else r.removeClass("borksyHD")}function Y(e){n.each(e,(t,a)=>{const o=n(`#${a}`),s=o.prop("type")==="hidden"&&o.val()===!1,r=o.prop("type")==="checkbox"&&o.prop("checked")===!1;s||r||(o.val(!1),o.prop("checked",!1),L(o,!1))})}function w(e){const t=n(`[data-associated-hack=${e.data("hack")}]`);t.length>0&&D(t,e)}function D(e,t){t.prop("checked")===!0?e.addClass("included"):e.removeClass("included")}function L(e,t=!0){g(e),w(e);const a=d[e.data("hack")].conflicts;a&&t&&Y(a.split(","))}function _(e){e.change(()=>{L(e)})}function N(e){return Array.from(document.querySelectorAll("[data-borksy-replace-single]")).reduce((t,a)=>{const o=n(a),s=`BORKSY-${o.data("borksy-replace-single")}`,r=o.val();return t.replace(s,r)},e)}function V(){return Object.entries(d).map(([e,t])=>x({name:e},t)).sort(({order:e},{order:t})=>e-t)}function z(e){return V().reduce((a,o)=>{const s=o.name,r=`${s}.js`,i=n(`#${s}`);if(!(i.prop("checked")||i.val()==="true"))return a;let l=u[r];if(o.type==="options"){l=unescape(l);const E=n(`#${s}-options`).val();l=l.replace(/(var hackOptions.*= ){[^]*?}(;$)/m,`$1 {
${E}
} $2`)}return`${a}${l}
`},e)}function j(){Array.from(document.querySelectorAll("[data-save]")).forEach(o=>{g(n(o))});const e=n("#template").val();let t=u[e].repeat(1),a="";t=N(t),n("[data-borksy-replace-single]").promise().done(()=>{a=z(a)}),n("[data-hack]").promise().done(()=>{const o=n("#filename").val();t=t.replace("BORKSY-HACKS",a),R(`${o}.html`,t)})}function B(){const e=n("body");e.hasClass("party")?(e.removeClass("party"),window.alert("\u{1F63E} Party Mode Deactivated. Everyone out. \u{1F63E}")):(e.addClass("party"),window.alert("\u2728\u{1F308} Party Mode Activated! \u{1F308}\u2728"))}function Q(){const e="gamedata.HD.txt",t=n.ajax(`defaults/${e}`);t.done(()=>{const a=t.responseText;u[e]=a})}function W(){const e=n("#about_content"),t=n.ajax("about/about.html"),a="<p>Whoa, Something went wrong!</p>";t.done(()=>{const o=t.responseText;e.html(o);const s=n.ajax("about/how-to-use-borksy.html");s.done(()=>{const l=f("How To Use Borksy");l.append(s.responseText),e.append(l)});const r=n.ajax("about/troubleshooting-faqs.html");r.done(()=>{const l=f("Troubleshooting / FAQs");l.append(r.responseText),e.append(l)});const i=n.ajax("about/other-tools.html");i.done(()=>{const l=f("Other Bitsy Tools");l.append(i.responseText),e.append(l)});const c=n.ajax("about/ayos-special-tips.html");c.done(()=>{const l=f("AYo's Special Tips");l.append(c.responseText),e.append(l)})}),t.fail(()=>{e.html(a)})}function X(e){e.val(e.data("default")),p(e)}function Z(e){const t=unescape(u[`${e.attr("name")}.txt`]);e.val(t),p(e)}function ee(e){let t=e.data("default");t=t==="true",e.prop("type")==="checkbox"?e.prop("checked",t):e.val(t),p(e)}function te(e){const t=e.data("default"),a=`defaults/${t}`,o=n.ajax(a);o.done(()=>{const s=o.responseText;e.val(s),u[t]=s,p(e)}),o.fail(()=>{e.val("failed to load default!"),console.log(o.error),p(e)})}function ae(e){re(e.data("default"))}function oe(e){const{options:t}=e[0];for(let a=t.length-1;a>=0;a--)if(n(t[a]).data("default-option")!==void 0){e[0].selectedIndex=a;break}p(e)}function $(e=!0){Array.from(document.querySelectorAll("[data-save]")).forEach(t=>{const a=n(t),o=localStorage.getItem(a.attr("name")),s=typeof a.data("default")!="undefined",r=o!==null;if(s&&(!r||!e))switch(a.data("default-type")){case"string":X(a);break;case"boolean":ee(a);break;case"textfile":te(a);break;case"font":ae(a);break;case"option":oe(a);break;case"hackOptions":Z(a);break;default:throw new Error("Unknown type")}else r?b(a):a.val(""),p(a);w(a)}),console.log(`Defaults loaded. Forced? ${!e}`)}function A(){window.confirm("Are you sure you want to erase all data and restore defaults?")&&(Array.from(document.querySelectorAll("[data-save]")).forEach(e=>{localStorage.removeItem(n(e).attr("name"))}),console.log("Cookies removed"),$(!1),n("#mascot").removeClass("borksyHD"))}function se(){const e={x:6,y:8},t={x:16,y:16},a=1,o=document.createElement("canvas");o.width=(e.x+a)*t.x+a,o.height=(e.y+a)*t.y+a;const s=o.getContext("2d");let r=[];s.drawImage(this,0,0);for(let i=0;i<t.y;++i)for(let c=0;c<t.x;++c){const l=s.getImageData(c*(e.x+a)+a,i*(e.y+a)+a,e.x,e.y);r.push(l.data)}for(let i=0;i<r.length;++i){const c=[];for(let l=0;l<r[i].length;l+=4)c.push(r[i][l]>255/2?1:0);r[i]=c}r=r.flat(),g(n("#fontdata"),`[/*${n("#fontfilename").val()}*/${r.toString()}]`)}function re(e){let t;typeof e=="object"?t=e.target.result:(t=`fonts/${e}`,ne(e));const a=new Image;a.onload=se,a.src=t,le()}function ne(e){const t=n("#fontfilename");t.val()!==e&&(t.val(e),g(t))}function ie(){Array.from(document.querySelectorAll("[data-replace-element]")).forEach(e=>{q(n(e))})}function q(e){const t=e.data("replace-element"),a=window[t]();e.replaceWith(a)}function le(){q(n("[data-replace-element=createFontPreview]"))}function T(e,t){const a=document.querySelector("#hacks-section"),o=t.substr(0,t.lastIndexOf("."))||t,s=Array.from(a.querySelectorAll(":scope > .collapsible")).map(c=>c.dataset.associatedHack);s.push(o),s.sort();const r=a.querySelector(`:scope > .collapsible[data-associated-hack="${s[s.indexOf(o)+1]}"]`),i=ve(o,d[o])[0];r?a.insertBefore(i,r):a.appendChild(i)}function ce(){}function H(e){const t=`${e.substr(0,e.lastIndexOf("."))||e}.js`;h(t,"hacks/dist/",T,ce,t)}function de(e,t){const a=t.substr(0,t.lastIndexOf("."))||t;d[a].usingGithub=!0,T(e,t)}function pe(e,t){const a=t.substr(0,t.lastIndexOf("."))||t;d[a].usingGithub=!1,H(t,d[a])}function ue(e,t){const a=`${e}.js`,o=t.github;h(o,"https://raw.githubusercontent.com/seleb/bitsy-hacks/main/dist/",de,pe,a)}function fe(e,t){t.forceLocal!==!1?H(e):t.github!==!1&&ue(e,t)}function me(e,t,a){e.attr({"data-save":!0,"data-default":!1,"data-default-type":"boolean","data-hack":t,"data-hack-type":a.type}),a.requires&&e.attr("data-requires",a.requires)}function ge(e,t,a){const o=[];n.each(t.conflicts.split(","),(i,c)=>{o.push(y(d[c].title))});const s=F(o),r=n("<p>",{text:`This hack conflicts with ${s}.`,class:"conflict-warning"});a.append(r)}function he(e,t,a){let o="github-message",s="";const r=y(t.title);t.forceLocal!==!1?s=`Borksy is opting to use a local version of ${r} from ${m.lastUpdated}.`:d[e].usingGithub===!0?s=`${r} is using the most recent version from Github.`:(s=`${r} could not be loaded from Github, local version retrieved on ${m.lastUpdated} is being used.`,o+=" warning");const i=n("<p>",{text:s,class:o});a.append(i)}function ye(e,t,a){const o=f(`${y(t.title)} Options:`),s=n("<label>",{text:`var ${U(e)}Options = {`});h(`${e}.options.txt`,"hacks/options/",r=>{const i=n("<textarea>",{rows:5,cols:50,text:r,name:`${e}.options`,id:`${e}-options`});i.attr({"data-save":!0,"data-default-type":"hackOptions","data-default":`${e}.options.txt`}),b(i),p(i),s.append(i),s.append(document.createTextNode("};")),o.append(s),a.append(o)})}function be(e,t,a){const o=f(`${y(t.title)} README:`);h(`${e}.readme.txt`,"hacks/info/",s=>{const r=n("<pre>",{text:s});o.append(r),a.append(o)})}function ve(e,t){const a=f(`${t.title} (By ${t.author})`);a.attr("data-associated-hack",e);const o=n("<p>",{text:t.description});a.append(o),t.conflicts&&ge(e,t,a),he(e,t,a);const s=n("<label>",{text:`Include ${y(t.title)}`}),r=n("<input>",{type:"checkbox",name:e,id:e});return me(r,e,t),b(r),D(a,r),_(r),s.append(r),a.append(s),t.type==="options"&&ye(e,t,a),t.readme===!0&&be(e,t,a),a}function ke(){n.each(Object.keys(d),(e,t)=>{fe(t,d[t])})}function f(e){const t=n("<div>",{class:"collapsible"});return t.data("collapse",""),t.data("header",e),C(t),t}function xe(){Array.from(document.querySelectorAll("[data-collapsible]")).forEach(e=>{const t=n(e);C(t),t.attr("id")==="hacks-section"&&(console.log("HACK IT UP YO"),ke())}),n("#preloader").fadeOut()}function C(e){const t=n("<span>",{class:"collapsible_closer",click(){e.toggleClass("open")}}),a=n("<span>",{class:"collapsible_header",text:e.data("header"),click(){e.toggleClass("open")}});e.prepend(t),e.prepend(a)}function Se(){n(window).bind("keydown",e=>{if(e.ctrlKey||e.metaKey)switch(String.fromCharCode(e.which).toLowerCase()){case"s":e.preventDefault(),j();break;case"d":e.preventDefault(),A();break;case"p":e.preventDefault(),B();break}})}n(document).ready(()=>{xe(),W(),G(),$(),ie(),n("#download-button").on("click",j),n("#restore-button").on("click",A),Se(),n("#mascot").on("click",B)});
