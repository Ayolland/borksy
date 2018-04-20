/**
☕
@file javascript dialog
@summary execute arbitrary javascript from dialog
@license MIT
@version 1.0.0
@requires Bitsy Version: 4.5, 4.6
@author Sean S. LeBlanc
*/
before("load_game",function(e,n){return[e.replace(/(^|[^\\])\((.*? ".+?")\)/g,"$1{$2}").replace(/\\\((.*? ".+")\\?\)/g,"($1)"),n]}),inject("var functionMap = new Map();","functionMap.set('js', "+function(environment,parameters,onReturn){eval(parameters[0]),onReturn(null)}.toString()+");");