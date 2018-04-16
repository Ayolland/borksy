/**

@file kitsy-script-toolkit
@summary makes it easier and cleaner to run code before and after Bitsy functions or to inject new code into Bitsy script tags
@license WTFPL (do WTF you want)
@version 2.0.0
@requires Bitsy Version: 4.5, 4.6
@author @mildmojo

@description
HOW TO USE:
  import {before, after, inject} from "./kitsy-script-toolkit.js";

  before(targetFuncName, beforeFn);
  after(targetFuncName, afterFn);
  inject(searchString, codeFragment1[, ...codefragmentN]);

  For more info, see the documentation at:
  https://github.com/seleb/bitsy-hacks/wiki/Coding-with-kitsy
*/
function inject(t,e){var i=kitsyInit();e=flatten([].slice.call(arguments).slice(1)),i.queuedInjectScripts.push({searchString:t,codeFragments:e})}function before(t,e){var i=kitsyInit();i.queuedBeforeScripts[t]=i.queuedBeforeScripts[t]||[],i.queuedBeforeScripts[t].push(e)}function after(t,e){var i=kitsyInit();i.queuedAfterScripts[t]=i.queuedAfterScripts[t]||[],i.queuedAfterScripts[t].push(e)}function kitsyInit(){if(bitsy.kitsy)return bitsy.kitsy;bitsy.kitsy={inject:inject,before:before,after:after,queuedInjectScripts:[],queuedBeforeScripts:{},queuedAfterScripts:{}};var t=bitsy.startExportedGame;return bitsy.startExportedGame=function e(){bitsy.startExportedGame=t,doInjects(),applyAllHooks(),bitsy.startExportedGame.apply(this,arguments)},bitsy.kitsy}function doInjects(){bitsy.kitsy.queuedInjectScripts.forEach(function(t){utilsInject(t.searchString,t.codeFragments)}),_reinitEngine()}function applyAllHooks(){unique(Object.keys(bitsy.kitsy.queuedBeforeScripts).concat(Object.keys(bitsy.kitsy.queuedAfterScripts))).forEach(applyHook)}function applyHook(t){var e=bitsy[t],i=e.length,n=[];n=n.concat(bitsy.kitsy.queuedBeforeScripts[t]||[]),n.push(e),n=n.concat(bitsy.kitsy.queuedAfterScripts[t]||[]),bitsy[t]=function(){function t(){if(r!==n.length)if(arguments.length>0&&(e=[].slice.call(arguments)),n[r].length>i)n[r++].apply(this,e.concat(t.bind(this)));else{var s=n[r++].apply(this,e)||e;t.apply(this,s)}}var e=[].slice.call(arguments),r=0;t.apply(this,arguments)}}function _reinitEngine(){bitsy.scriptModule=new bitsy.Script,bitsy.scriptInterpreter=bitsy.scriptModule.CreateInterpreter(),bitsy.dialogModule=new bitsy.Dialog,bitsy.dialogRenderer=bitsy.dialogModule.CreateRenderer(),bitsy.dialogBuffer=bitsy.dialogModule.CreateBuffer()}function utilsInject(t,e){e=flatten([].slice.call(arguments).slice(1)).join("");for(var i=document.getElementsByTagName("script"),n,r,s=0;s<i.length;++s){n=i[s];var c=-1!==n.textContent.indexOf(t),u=n===document.currentScript;if(c&&!u){r=n.textContent;break}}if(!r)throw"Couldn't find \""+t+'" in script tags';r=r.replace(t,t+e);var o=document.createElement("script");o.textContent=r,n.insertAdjacentElement("afterend",o),n.remove()}function expose(target){var code=target.toString();return code=code.substring(0,code.lastIndexOf("}")),code+="this.get = function(name) {return eval(name);};",code+="this.set = function(name, value) {eval(name+'=value');};",eval("["+code+"}]")[0]}function getImage(t,e){var i=e.hasOwnProperty(t)?t:Object.keys(e).find(function(i){return e[i].name==t});return e[i]}function unique(t){return t.filter(function(e,i){return t.indexOf(e)===i})}function flatten(t){return Array.isArray(t)?t.reduce(function(t,e){return t.concat(flatten(e))},[]):t}