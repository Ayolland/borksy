var t=`<!DOCTYPE HTML>
<html>

<!-- HEADER -->

<!-- Borksy {{BORKSY-VERSION}} -->
<!-- bitsy-hacks {{HACKS-VERSION}} -->
<!-- Bitsy HD ~> Bitsy 5.1 -->
<head>

<meta charset="UTF-8">

<title>{{TITLE}}</title>

<script type="bitsyGameData" id="exportedGameData">
{{{GAMEDATA}}}
<\/script>

<style>
{{{CSS}}}
</style>

<!-- SCRIPTS -->
<script>
function startExportedGame() {
	attachCanvas( document.getElementById("game") );
	load_game( document.getElementById("exportedGameData").text.slice(1) );
}
<\/script>

<script>
//hex-to-rgb method borrowed from stack overflow
function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hslToHex(h,s,l) {
    var rgbArr = hslToRgb(h,s,l);
    return rgbToHex( Math.floor(rgbArr[0]), Math.floor(rgbArr[1]), Math.floor(rgbArr[2]) );
}

function hexToHsl(hex) {
    var rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// really just a vector distance
function colorDistance(a1,b1,c1,a2,b2,c2) {
    return Math.sqrt( Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2) + Math.pow(c1 - c2, 2) );
}

function hexColorDistance(hex1,hex2) {
    var color1 = hexToRgb(hex1);
    var color2 = hexToRgb(hex2);
    return rgbColorDistance(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
}


// source : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

// source : https://gist.github.com/mjackson/5311256
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

/**
 * From: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
<\/script>

<script>
/*
TODO:
- untangle local & external resource use in font manager (still more to do here)
*/

function FontManager(useExternalResources) {

if (useExternalResources === undefined || useExternalResources === null) {
	useExternalResources = false;
}

var self = this;

var fontExtension = ".bitsyfont";
this.GetExtension = function() {
	return fontExtension;
}

// place to store font data that is part of the local game data
var localResources = {};

// place to store font data fetched from a server (only used in editor)
var externalResources = null;
if (useExternalResources) {
	externalResources = new ResourceLoader();// NOTE : this class doesn't exist in exported game
}

this.LoadResources = function(filenames, onLoadAll) {
	if (!useExternalResources)
		return;

	// TODO : is this being called too many times?
	var onLoad = function() {
		var count = externalResources.getResourceLoadedCount();

		if (count >= filenames.length && onLoadAll != null) {
			onLoadAll();
		}
	}

	for (var i = 0; i < filenames.length; i++) {
		externalResources.load("bitsyfont", filenames[i], onLoad);
	}
}

// manually add resource
this.AddResource = function(filename, fontdata) {
	if (useExternalResources) {
		externalResources.set(filename, fontdata);
	}
	else {
		localResources[filename] = fontdata;
	}
}

this.ContainsResource = function(filename) {
	if (useExternalResources) {
		return externalResources.contains(filename);
	}
	else {
		return localResources[filename] != null;
	}
}

function GetData(fontName) {
	if (useExternalResources) {
		return externalResources.get(fontName + fontExtension);
	}
	else {
		return localResources[fontName + fontExtension];
	}
}
this.GetData = GetData;

function Create(fontData) {
	return new Font(fontData);
}
this.Create = Create;

this.Get = function(fontName) {
	var fontData = self.GetData(fontName);
	return self.Create(fontData);
}

function Font(fontData) {
	var name = "unknown";
	var width = 6; // default size so if you have NO font or an invalid font it displays boxes
	var height = 8;
	var fontdata = {};
	var invalidCharData = [];

	this.getName = function() {
		return name;
	}

	this.getData = function() {
		return fontdata;
	}

	this.getWidth = function() {
		return width;
	}

	this.getHeight = function() {
		return height;
	}

	this.hasChar = function(char) {
		var codepoint = char.charCodeAt(0);
		return fontdata[codepoint] != null;
	}

	this.getChar = function(char) {

		var codepoint = char.charCodeAt(0);

		if (fontdata[codepoint] != null) {
			return fontdata[codepoint];
		}
		else {
			return invalidCharData;
		}
	}

	function parseFont(fontData) {
		if (fontData == null)
			return;

		var lines = fontData.split("\\n");

		var isReadingChar = false;
		var curCharLineCount = 0;
		var curCharCode = 0;

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (!isReadingChar) {
				// READING NON CHARACTER DATA LINE
				var args = line.split(" ");
				if (args[0] == "FONT") {
					name = args[1];
				}
				else if (args[0] == "SIZE") {
					width = parseInt(args[1]);
					height = parseInt(args[2]);
				}
				else if (args[0] == "CHAR") {
					isReadingChar = true;
					curCharLineCount = 0;
					curCharCode = parseInt(args[1]);
					fontdata[curCharCode] = [];
				}
			}
			else {
				// READING CHARACTER DATA LINE
				for (var j = 0; j < width; j++)
				{
					fontdata[curCharCode].push( parseInt(line[j]) );
				}

				curCharLineCount++;
				if (curCharLineCount >= height) {
					isReadingChar = false;
				}
			}
		}

		// init invalid character box
		invalidCharData = [];
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				if (x < width-1 && y < height-1) {
					invalidCharData.push(1);
				}
				else {
					invalidCharData.push(0);
				}
			}
		}
	}

	parseFont(fontData);
}

} // FontManager
<\/script>

<script>
function Script() {

this.CreateInterpreter = function() {
	return new Interpreter();
};

this.CreateUtils = function() {
	return new Utils();
};

var Interpreter = function() {
	var env = new Environment();
	var parser = new Parser( env );

	this.SetDialogBuffer = function(buffer) { env.SetDialogBuffer( buffer ); };

	// TODO -- maybe this should return a string instead othe actual script??
	this.Compile = function(scriptName, scriptStr) {
		// console.log("COMPILE");
		var script = parser.Parse( scriptStr );
		env.SetScript( scriptName, script );
	}
	this.Run = function(scriptName, exitHandler) { // Runs pre-compiled script
		// console.log("RUN");
		env.GetScript( scriptName )
			.Eval( env, function() { if(exitHandler!=null) exitHandler(); } );

		// console.log("SERIALIZE!!!!");
		// console.log( env.GetScript( scriptName ).Serialize() );
	}
	this.Interpret = function(scriptStr, exitHandler) { // Compiles and runs code immediately
		// console.log("INTERPRET");
		var script = parser.Parse( scriptStr );
		script.Eval( env, function() { if(exitHandler!=null) exitHandler(); } );
	}
	this.HasScript = function(name) { return env.HasScript(name); };

	this.ResetEnvironment = function() {
		env = new Environment();
		parser = new Parser( env );
	}

	// TODO : move to utils?
	// for reading in dialog from the larger file format
	this.ReadDialogScript = function(lines, i) {
		return parser.ReadDialogScript(lines,i);
	}

	this.Parse = function(scriptStr) { // parses a script but doesn't save it
		return parser.Parse( scriptStr );
	}
	this.Eval = function(scripTree, exitHandler) { // runs a script stored externally
		scripTree.Eval( env, function() { if(exitHandler!=null) exitHandler(); } );
	}

	this.CreateExpression = function(expStr) {
		return parser.CreateExpression( expStr );
	}

	this.SetVariable = function(name,value,useHandler) {
		env.SetVariable(name,value,useHandler);
	}

	this.DeleteVariable = function(name,useHandler) {
		env.DeleteVariable(name,useHandler);
	}
	this.HasVariable = function(name) {
		return env.HasVariable(name);
	}

	this.SetOnVariableChangeHandler = function(onVariableChange) {
		env.SetOnVariableChangeHandler(onVariableChange);
	}
	this.GetVariableNames = function() {
		return env.GetVariableNames();
	}
	this.GetVariable = function(name) {
		return env.GetVariable(name);
	}
}


var Utils = function() {
	// for editor ui
	this.CreateDialogBlock = function(children,doIndentFirstLine) {
		if(doIndentFirstLine === undefined) doIndentFirstLine = true;
		var block = new BlockNode( BlockMode.Dialog, doIndentFirstLine );
		for(var i = 0; i < children.length; i++) {
			block.AddChild( children[i] );
		}
		return block;
	}

	this.ChangeSequenceType = function(oldSequence,type) {
		if(type === "sequence") {
			return new SequenceNode( oldSequence.options );
		}
		else if(type === "cycle") {
			return new CycleNode( oldSequence.options );
		}
		else if(type === "shuffle") {
			return new ShuffleNode( oldSequence.options );
		}
		return oldSequence;
	}

	this.CreateSequenceBlock = function() {
		var option1 = new BlockNode( BlockMode.Dialog, false /*doIndentFirstLine*/ );
		var option2 = new BlockNode( BlockMode.Dialog, false /*doIndentFirstLine*/ );
		var sequence = new SequenceNode( [ option1, option2 ] );
		var block = new BlockNode( BlockMode.Code );
		block.AddChild( sequence );
		return block;
	}

	this.CreateIfBlock = function() {
		var leftNode = new BlockNode( BlockMode.Code );
		leftNode.AddChild( new FuncNode("item", [new LiteralNode("0")] ) );
		var rightNode = new LiteralNode( 1 );
		var condition1 = new ExpNode("==", leftNode, rightNode );

		var condition2 = new ElseNode();

		var result1 = new BlockNode( BlockMode.Dialog );
		var result2 = new BlockNode( BlockMode.Dialog );

		var ifNode = new IfNode( [ condition1, condition2 ], [ result1, result2 ] );
		var block = new BlockNode( BlockMode.Code );
		block.AddChild( ifNode );
		return block;
	}
}


/* BUILT-IN FUNCTIONS */ // TODO: better way to encapsulate these?
function deprecatedFunc(environment,parameters,onReturn) {
	console.log("BITSY SCRIPT WARNING: Tried to use deprecated function");
	onReturn(null);
}

function printFunc(environment,parameters,onReturn) {
	// console.log("PRINT FUNC");
	// console.log(parameters);
	if( parameters[0] != undefined && parameters[0] != null ) {
		// console.log(parameters[0]);
		// console.log(parameters[0].toString());
		// var textStr = parameters[0].toString();
		var textStr = "" + parameters[0];
		// console.log(textStr);
		var onFinishHandler = function() {
			// console.log("FINISHED PRINTING ---- SCRIPT");
			onReturn(null);
		}; // called when dialog is finished printing
		environment.GetDialogBuffer().AddText( textStr, onFinishHandler );
	}
	else {
		onReturn(null);
	}
}

function linebreakFunc(environment,parameters,onReturn) {
	// console.log("LINEBREAK FUNC");
	environment.GetDialogBuffer().AddLinebreak();
	onReturn(null);
}

function printDrawingFunc(environment,parameters,onReturn) {
	var drawingId = parameters[0];
	environment.GetDialogBuffer().AddDrawing( drawingId, function() {
		onReturn(null);
	});
}

function printSpriteFunc(environment,parameters,onReturn) {
	var spriteId = parameters[0];
	if(names.sprite.has(spriteId)) spriteId = names.sprite.get(spriteId); // id is actually a name
	var drawingId = sprite[spriteId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printTileFunc(environment,parameters,onReturn) {
	var tileId = parameters[0];
	if(names.tile.has(tileId)) tileId = names.tile.get(tileId); // id is actually a name
	var drawingId = tile[tileId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function printItemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];
	if(names.item.has(itemId)) itemId = names.item.get(itemId); // id is actually a name
	var drawingId = item[itemId].drw;
	printDrawingFunc(environment, [drawingId], onReturn);
}

function itemFunc(environment,parameters,onReturn) {
	var itemId = parameters[0];
	if(names.item.has(itemId)) itemId = names.item.get(itemId); // id is actually a name
	var itemCount = player().inventory[itemId] ? player().inventory[itemId] : 0; // TODO : ultimately the environment should include a reference to the game state
	// console.log("ITEM FUNC " + itemId + " " + itemCount);
	onReturn(itemCount);
}

function addOrRemoveTextEffect(environment,name) {
	if( environment.GetDialogBuffer().HasTextEffect(name) )
		environment.GetDialogBuffer().RemoveTextEffect(name);
	else
		environment.GetDialogBuffer().AddTextEffect(name);
}

function rainbowFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"rbw");
	onReturn(null);
}

// TODO : should the colors use a parameter instead of special names?
function color1Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr1");
	onReturn(null);
}

function color2Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr2");
	onReturn(null);
}

function color3Func(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"clr3");
	onReturn(null);
}

function wavyFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"wvy");
	onReturn(null);
}

function shakyFunc(environment,parameters,onReturn) {
	addOrRemoveTextEffect(environment,"shk");
	onReturn(null);
}

/* BUILT-IN OPERATORS */
function setExp(environment,left,right,onReturn) {
	// console.log("SET " + left.name);

	if(left.type != "variable") {
		// not a variable! return null and hope for the best D:
		onReturn( null );
		return;
	}

	right.Eval(environment,function(rVal) {
		environment.SetVariable( left.name, rVal );
		// console.log("VAL " + environment.GetVariable( left.name ) );
		left.Eval(environment,function(lVal) {
			onReturn( lVal );
		});
	});
}
function equalExp(environment,left,right,onReturn) {
	// console.log("EVAL EQUAL");
	// console.log(left);
	// console.log(right);
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal === rVal );
		});
	});
}
function greaterExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal > rVal );
		});
	});
}
function lessExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal < rVal );
		});
	});
}
function greaterEqExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal >= rVal );
		});
	});
}
function lessEqExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal <= rVal );
		});
	});
}
function multExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal * rVal );
		});
	});
}
function divExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal / rVal );
		});
	});
}
function addExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal + rVal );
		});
	});
}
function subExp(environment,left,right,onReturn) {
	right.Eval(environment,function(rVal){
		left.Eval(environment,function(lVal){
			onReturn( lVal - rVal );
		});
	});
}

/* ENVIRONMENT */
var Environment = function() {
	var dialogBuffer = null;
	this.SetDialogBuffer = function(buffer) { dialogBuffer = buffer; };
	this.GetDialogBuffer = function() { return dialogBuffer; };

	var functionMap = new Map();
	functionMap.set("print", printFunc);
	functionMap.set("say", deprecatedFunc);
	functionMap.set("br", linebreakFunc);
	functionMap.set("item", itemFunc);
	functionMap.set("rbw", rainbowFunc);
	functionMap.set("clr1", color1Func);
	functionMap.set("clr2", color2Func);
	functionMap.set("clr3", color3Func);
	functionMap.set("wvy", wavyFunc);
	functionMap.set("shk", shakyFunc);
	functionMap.set("printSprite", printSpriteFunc);
	functionMap.set("printTile", printTileFunc);
	functionMap.set("printItem", printItemFunc);

	this.HasFunction = function(name) { return functionMap.has(name); };
	this.EvalFunction = function(name,parameters,onReturn) {
		// console.log(functionMap);
		// console.log(name);
		functionMap.get( name )( this, parameters, onReturn );
	}

	var variableMap = new Map();

	this.HasVariable = function(name) { return variableMap.has(name); };
	this.GetVariable = function(name) { return variableMap.get(name); };
	this.SetVariable = function(name,value,useHandler) {
		// console.log("SET VARIABLE " + name + " = " + value);
		if(useHandler === undefined) useHandler = true;
		variableMap.set(name, value);
		if(onVariableChangeHandler != null && useHandler)
			onVariableChangeHandler(name);
	};
	this.DeleteVariable = function(name,useHandler) {
		if(useHandler === undefined) useHandler = true;
		if(variableMap.has(name)) {
			variableMap.delete(name);
			if(onVariableChangeHandler != null && useHandler)
				onVariableChangeHandler(name);
		}
	};

	var operatorMap = new Map();
	operatorMap.set("=", setExp);
	operatorMap.set("==", equalExp);
	operatorMap.set(">", greaterExp);
	operatorMap.set("<", lessExp);
	operatorMap.set(">=", greaterEqExp);
	operatorMap.set("<=", lessEqExp);
	operatorMap.set("*", multExp);
	operatorMap.set("/", divExp);
	operatorMap.set("+", addExp);
	operatorMap.set("-", subExp);

	this.HasOperator = function(sym) { return operatorMap.get(sym); };
	this.EvalOperator = function(sym,left,right,onReturn) {
		operatorMap.get( sym )( this, left, right, onReturn );
	}

	var scriptMap = new Map();
	this.HasScript = function(name) { return scriptMap.has(name); };
	this.GetScript = function(name) { return scriptMap.get(name); };
	this.SetScript = function(name,script) { scriptMap.set(name, script); };

	var onVariableChangeHandler = null;
	this.SetOnVariableChangeHandler = function(onVariableChange) {
		onVariableChangeHandler = onVariableChange;
	}
	this.GetVariableNames = function() {
		return Array.from( variableMap.keys() );
	}
}

function leadingWhitespace(depth) {
	var str = "";
	for(var i = 0; i < depth; i++) {
		str += "  "; // two spaces per indent
	}
	// console.log("WHITESPACE " + depth + " ::" + str + "::");
	return str;
}

/* NODES */
var TreeRelationship = function() {
	this.parent = null;
	this.children = [];
	this.AddChild = function(node) {
		this.children.push( node );
		node.parent = this;
	};

	this.VisitAll = function(visitor) {
		visitor.Visit( this );
		for( var i = 0; i < this.children.length; i++ ) {
			this.children[i].VisitAll( visitor );
		}
	};
}

var BlockMode = {
	Code : "code",
	Dialog : "dialog"
};

var BlockNode = function(mode, doIndentFirstLine) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "block";
	this.mode = mode;

	this.Eval = function(environment,onReturn) {
		// console.log("EVAL BLOCK " + this.children.length);

		if( this.onEnter != null ) this.onEnter();

		var lastVal = null;
		var i = 0;
		function evalChildren(children,done) {
			if(i < children.length) {
				// console.log(">> CHILD " + i);
				children[i].Eval( environment, function(val) {
					// console.log("<< CHILD " + i);
					lastVal = val;
					i++;
					evalChildren(children,done);
				} );
			}
			else {
				done();
			}
		};
		var self = this;
		evalChildren( this.children, function() {
			if( self.onExit != null ) self.onExit();
			onReturn(lastVal);
		} );
	}

	if(doIndentFirstLine === undefined) doIndentFirstLine = true; // This is just for serialization

	this.Serialize = function(depth) {
		if(depth === undefined) depth = 0;

		console.log("SERIALIZE BLOCK!!!");
		console.log(depth);
		console.log(doIndentFirstLine);

		var str = "";
		var lastNode = null;
		if (this.mode === BlockMode.Code) str += "{"; // todo: increase scope of Sym?
		for (var i = 0; i < this.children.length; i++) {

			var curNode = this.children[i];

			if(curNode.type === "block" && lastNode && lastNode.type === "block" && !isBlockWithNoNewline(curNode) && !isBlockWithNoNewline(lastNode))
				str += "\\n";

			var shouldIndentFirstLine = (i == 0 && doIndentFirstLine);
			var shouldIndentAfterLinebreak = (lastNode && lastNode.type === "function" && lastNode.name === "br");
			if(this.mode === BlockMode.Dialog && (shouldIndentFirstLine || shouldIndentAfterLinebreak))
				str += leadingWhitespace(depth);
			str += curNode.Serialize(depth);
			lastNode = curNode;
		}
		if (this.mode === BlockMode.Code) str += "}";
		return str;
	}
}

function isBlockWithNoNewline(node) {
	return isTextEffectBlock(node) || isMultilineListBlock(node);
}

function isTextEffectBlock(node) {
	if(node.type === "block") {
		if(node.children.length > 0 && node.children[0].type === "function") {
			var func = node.children[0];
			if(func.name === "clr1" || func.name === "clr2" || func.name === "clr3" || func.name === "wvy" || func.name === "shk" || func.name === "rbw") {
				return true;
			}
		}
	}
	return false;
}

function isMultilineListBlock(node) {
	if(node.type === "block") {
		if(node.children.length > 0) {
			var child = node.children[0];
			if(child.type === "sequence" || child.type === "cycle" || child.type === "shuffle" || child.type === "if") {
				return true;
			}
		}
	}
	return false;
}

var FuncNode = function(name,arguments) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "function";
	this.name = name;
	this.arguments = arguments;

	this.Eval = function(environment,onReturn) {

		if( this.onEnter != null ) this.onEnter();

		// console.log("FUNC");
		// console.log(this.arguments);
		var argumentValues = [];
		var i = 0;
		function evalArgs(arguments,done) {
			if(i < arguments.length) {
				// Evaluate each argument
				arguments[i].Eval( environment, function(val) {
					argumentValues.push( val );
					i++;
					evalArgs(arguments,done);
				} );
			}
			else {
				done();
			}
		};
		var self = this; // hack to deal with scope
		evalArgs( this.arguments, function() {
			// Then evaluate the function
			// console.log("ARGS");
			// console.log(argumentValues);

			if( self.onExit != null ) self.onExit();

			environment.EvalFunction( self.name, argumentValues, onReturn );
		} );
	}

	this.Serialize = function(depth) {
		var isDialogBlock = this.parent.mode && this.parent.mode === BlockMode.Dialog;
		if(isDialogBlock && this.name === "print") {
			// TODO this could cause problems with "real" print functions
			return this.arguments[0].value; // first argument should be the text of the {print} func
		}
		else if(isDialogBlock && this.name === "br") {
			return "\\n";
		}
		else {
			var str = "";
			str += this.name;
			for(var i = 0; i < this.arguments.length; i++) {
				str += " ";
				str += this.arguments[i].Serialize(depth);
			}
			return str;
		}
	}
}

var LiteralNode = function(value) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "literal";
	this.value = value;

	this.Eval = function(environment,onReturn) {
		onReturn(this.value);
	}

	this.Serialize = function(depth) {
		var str = "";

		if(this.value === null)
			return str;

		if(typeof this.value === "string") str += '"';
		str += this.value;
		if(typeof this.value === "string") str += '"';

		return str;
	}
}

var VarNode = function(name) {
	Object.assign( this, new TreeRelationship() );
	// Object.assign( this, new Runnable() );
	this.type = "variable";
	this.name = name;

	this.Eval = function(environment,onReturn) {
		// console.log("EVAL " + this.name + " " + environment.HasVariable(this.name) + " " + environment.GetVariable(this.name));
		if( environment.HasVariable(this.name) )
			onReturn( environment.GetVariable( this.name ) );
		else
			onReturn(null); // not a valid variable -- return null and hope that's ok
	} // TODO: might want to store nodes in the variableMap instead of values???

	this.Serialize = function(depth) {
		var str = "" + this.name;
		return str;
	}
}

var ExpNode = function(operator, left, right) {
	Object.assign( this, new TreeRelationship() );
	this.type = "operator";
	this.operator = operator;
	this.left = left;
	this.right = right;

	this.Eval = function(environment,onReturn) {
		// console.log("EVAL " + this.operator);
		var self = this; // hack to deal with scope
		environment.EvalOperator( this.operator, this.left, this.right, 
			function(val){
				// console.log("EVAL EXP " + self.operator + " " + val);
				onReturn(val);
			} );
		// NOTE : sadly this pushes a lot of complexity down onto the actual operator methods
	}

	this.Serialize = function(depth) {
		var isNegativeNumber = this.operator === "-" && this.left.type === "literal" && this.left.value === null;

		if(!isNegativeNumber) {
			var str = "";
			str += this.left.Serialize(depth);
			str += " " + this.operator + " ";
			str += this.right.Serialize(depth);
			return str;
		}
		else {
			return this.operator + this.right.Serialize(depth); // hacky but seems to work
		}
	}

	this.VisitAll = function(visitor) {
		visitor.Visit( this );
		if(this.left != null)
			this.left.VisitAll( visitor );
		if(this.right != null)
			this.right.VisitAll( visitor );
	};
}

var SequenceBase = function() {
	this.Serialize = function(depth) {
		var str = "";
		str += this.type + "\\n";
		for (var i = 0; i < this.options.length; i++) {
			// console.log("SERIALIZE SEQUENCE ");
			// console.log(depth);
			str += leadingWhitespace(depth + 1) + Sym.List + " " + this.options[i].Serialize(depth + 2) + "\\n";
		}
		str += leadingWhitespace(depth);
		return str;
	}

	this.VisitAll = function(visitor) {
		visitor.Visit( this );
		for( var i = 0; i < this.options.length; i++ ) {
			this.options[i].VisitAll( visitor );
		}
	};
}

var SequenceNode = function(options) {
	Object.assign( this, new TreeRelationship() );
	Object.assign( this, new SequenceBase() );
	this.type = "sequence";
	this.options = options;

	var index = 0;
	this.Eval = function(environment,onReturn) {
		// console.log("SEQUENCE " + index);
		this.options[index].Eval( environment, onReturn );

		var next = index + 1;
		if(next < this.options.length)
			index = next;
	}
}

var CycleNode = function(options) {
	Object.assign( this, new TreeRelationship() );
	Object.assign( this, new SequenceBase() );
	this.type = "cycle";
	this.options = options;

	var index = 0;
	this.Eval = function(environment,onReturn) {
		// console.log("CYCLE " + index);
		this.options[index].Eval( environment, onReturn );

		var next = index + 1;
		if(next < this.options.length)
			index = next;
		else
			index = 0;
	}
}

var ShuffleNode = function(options) {
	Object.assign( this, new TreeRelationship() );
	Object.assign( this, new SequenceBase() );
	this.type = "shuffle";
	this.options = options;

	var optionsShuffled = [];
	function shuffle(options) {
		optionsShuffled = [];
		var optionsUnshuffled = options.slice();
		while(optionsUnshuffled.length > 0) {
			var i = Math.floor( Math.random() * optionsUnshuffled.length );
			optionsShuffled.push( optionsUnshuffled.splice(i,1)[0] );
		}
	}
	shuffle(this.options);

	var index = 0;
	this.Eval = function(environment,onReturn) {
		// OLD RANDOM VERSION
		// var index = Math.floor(Math.random() * this.options.length);
		// this.options[index].Eval( environment, onReturn );

		optionsShuffled[index].Eval( environment, onReturn );
		
		index++;
		if (index >= this.options.length) {
			shuffle(this.options);
			index = 0;
		}
	}
}

var IfNode = function(conditions, results, isSingleLine) {
	Object.assign( this, new TreeRelationship() );
	this.type = "if";
	this.conditions = conditions;
	this.results = results;

	this.Eval = function(environment,onReturn) {
		// console.log("EVAL IF");
		var i = 0;
		var self = this;
		function TestCondition() {
			// console.log("EVAL " + i);
			self.conditions[i].Eval(environment, function(val) {
				// console.log(val);
				if(val == true) {
					self.results[i].Eval(environment, onReturn);
				}
				else if(i+1 < self.conditions.length) {
					i++;
					TestCondition(); // test next condition
				}
				else {
					onReturn(null); // out of conditions and none were true
				}
			});
		};
		TestCondition();
	}

	if(isSingleLine === undefined) isSingleLine = false; // This is just for serialization

	this.Serialize = function(depth) {
		var str = "";
		if(isSingleLine) {
			str += this.conditions[0].Serialize() + " ? " + this.results[0].Serialize();
			if(this.conditions.length > 1 && this.conditions[1].type === "else")
				str += " : " + this.results[1].Serialize();
		}
		else {
			str += "\\n";
			for (var i = 0; i < this.conditions.length; i++) {
				str += leadingWhitespace(depth + 1) + Sym.List + " " + this.conditions[i].Serialize(depth) + " ?\\n";
				str += this.results[i].Serialize(depth + 2) + "\\n";
			}
			str += leadingWhitespace(depth);
		}
		return str;
	}

	this.IsSingleLine = function() {
		return isSingleLine;
	}

	this.VisitAll = function(visitor) {
		visitor.Visit( this );
		for( var i = 0; i < this.conditions.length; i++ ) {
			this.conditions[i].VisitAll( visitor );
		}
		for( var i = 0; i < this.results.length; i++ ) {
			this.results[i].VisitAll( visitor );
		}
	};
}

var ElseNode = function() {
	Object.assign( this, new TreeRelationship() );
	this.type = "else";

	this.Eval = function(environment,onReturn) {
		onReturn(true);
	}

	this.Serialize = function() {
		return "else";
	}
}

var Sym = {
	// DialogOpen : "/\\"",
	// DialogClose : "\\"/",
	DialogOpen : '"""',
	DialogClose : '"""',
	CodeOpen : "{",
	CodeClose : "}",
	Linebreak : "\\n", // just call it "break" ?
	Separator : ":",
	List : "-",
	String : '"'
};

var Parser = function(env) {
	var environment = env;

	this.Parse = function(scriptStr) {
		// console.log("NEW PARSE!!!!!!");

		// TODO : make this work for single-line, no dialog block scripts

		var state = new ParserState( new BlockNode(BlockMode.Dialog), scriptStr );

		if( state.MatchAhead(Sym.DialogOpen) ) {
			// multi-line dialog block
			var dialogStr = state.ConsumeBlock( Sym.DialogOpen, Sym.DialogClose );
			state = new ParserState( new BlockNode(BlockMode.Dialog), dialogStr );
			state = ParseDialog( state );
		}
		// else if( state.MatchAhead(Sym.CodeOpen) ) { // NOTE: This causes problems when you lead with a code block
		// 	// code-block: should this ever happen?
		// 	state = ParseCodeBlock( state );
		// }
		else {
			// single-line dialog block
			state = ParseDialog( state );
		}

		// console.log( state.rootNode );
		return state.rootNode;
	};

	this.ReadDialogScript = function(lines, i) {
		var scriptStr = "";
		if (lines[i] === Sym.DialogOpen) {
			scriptStr += lines[i] + "\\n";
			i++;
			while(lines[i] != Sym.DialogClose) {
				scriptStr += lines[i] + "\\n";
				i++;
			}
			scriptStr += lines[i];
			i++;
		}
		else {
			scriptStr += lines[i];
		}
		return { script:scriptStr, index:i };
	}

	var ParserState = function( rootNode, str ) {
		this.rootNode = rootNode;
		this.curNode = this.rootNode;

		var sourceStr = str;
		var i = 0;
		this.Index = function() { return i; };
		this.Count = function() { return sourceStr.length; };
		this.Done = function() { return i >= sourceStr.length; };
		this.Char = function() { return sourceStr[i]; };
		this.Step = function(n) { if(n===undefined) n=1; i += n; };
		this.MatchAhead = function(str) {
			// console.log(str);
			str = "" + str; // hack to turn single chars into strings
			// console.log(str);
			// console.log(str.length);
			for(var j = 0; j < str.length; j++) {
				if( i + j >= sourceStr.length )
					return false;
				else if( str[j] != sourceStr[i+j] )
					return false;
			}
			return true;
		}
		this.Peak = function(end) {
			var str = "";
			var j = i;
			// console.log(j);
			while(j < sourceStr.length && end.indexOf( sourceStr[j] ) == -1 ) {
				str += sourceStr[j];
				j++;
			}
			// console.log("PEAK ::" + str + "::");
			return str;
		}
		this.ConsumeBlock = function( open, close ) {
			var startIndex = i;

			var matchCount = 0;
			if( this.MatchAhead( open ) ) {
				matchCount++;
				this.Step( open.length );
			}

			while( matchCount > 0 && !this.Done() ) {
				if( this.MatchAhead( close ) ) {
					matchCount--;
					this.Step( close.length );
				}
				else if( this.MatchAhead( open ) ) {
					matchCount++;
					this.Step( open.length );
				}
				else {
					this.Step();
				}
			}

			// console.log("!!! " + startIndex + " " + i);

			return sourceStr.slice( startIndex + open.length, i - close.length );
		}
		this.Print = function() {console.log(sourceStr);};
	};

	function ParseDialog(state) {
		// console.log("PARSE DIALOG");
		state.Print();

		// for linebreak logic: add linebreaks after lines with dialog or empty lines (if it's not the very first line)
		var hasBlock = false;
		var hasDialog = false;
		var isFirstLine = true;

		// console.log("---- PARSE DIALOG ----");

		var text = "";
		var addTextNode = function() {
			// console.log("TEXT " + text.length);
			if (text.length > 0) {
				// console.log("TEXT " + text);
				// console.log("text!!");
				// console.log([text]);

				state.curNode.AddChild( new FuncNode( "print", [new LiteralNode(text)] ) );
				text = "";

				hasDialog = true;
			}
		}

		while ( !state.Done() ) {

			if( state.MatchAhead(Sym.CodeOpen) ) {
				addTextNode();
				state = ParseCodeBlock( state );

				// console.log("CODE");

				var len = state.curNode.children.length;
				if(len > 0 && state.curNode.children[len-1].type === "block") {
					var block = state.curNode.children[len-1];
					if(isMultilineListBlock(block))
						hasDialog = true; // hack to get correct newline behavior for multiline blocks
				}

				hasBlock = true;
			}
			// NOTE: nested dialog blocks disabled for now
			// else if( state.MatchAhead(Sym.DialogOpen) ) {
			// 	addTextNode();
			// 	state = ParseDialogBlock( state ); // These can be nested (should they though???)

			// 	hasBlock = true;
			// }
			else {
				if ( state.MatchAhead(Sym.Linebreak) ) {
					addTextNode();

					/*
					NOTES:
					linebreaks SHOULD happen on
					- lines with text (including the first or last line)
					- empty lines (that are NOT the first or last line)
					linebreaks should NOT happen on
					- lines with only CODE blocks
					- empty FIRST or LAST lines

					also, apparently:
					- NEVER line break on the last line
					*/
					var isLastLine = (state.Index() + 1) == state.Count();
					// console.log("block " + hasBlock);
					// console.log("dialog " + hasDialog);
					var isEmptyLine = !hasBlock && !hasDialog;
					// console.log("empty " + isEmptyLine);
					var isValidEmptyLine = isEmptyLine && !(isFirstLine || isLastLine);
					// console.log("valid empty " + isValidEmptyLine);
					var shouldAddLinebreak = (hasDialog || isValidEmptyLine) && !isLastLine; // last clause is a hack (but it works - why?)
					// console.log("LINEBREAK? " + shouldAddLinebreak);
					if( shouldAddLinebreak ) {
						// console.log("NEWLINE");
						// console.log("empty? " + isEmptyLine);
						// console.log("dialog? " + hasDialog);
						state.curNode.AddChild( new FuncNode( "br", [] ) ); // use function or character?
					}

					// linebreak logic
					isFirstLine = false;
					hasBlock = false;
					hasDialog = false;

					text = "";
				}
				else {
					text += state.Char();
				}
				state.Step();
			}

		}
		addTextNode();

		// console.log("---- PARSE DIALOG ----");

		// console.log(state);
		return state;
	}

	function ParseDialogBlock(state) {
		var dialogStr = state.ConsumeBlock( Sym.DialogOpen, Sym.DialogClose );

		var dialogState = new ParserState( new BlockNode(BlockMode.Dialog), dialogStr );
		dialogState = ParseDialog( dialogState );

		state.curNode.AddChild( dialogState.rootNode );

		return state;
	}

	function ParseIf(state) {
		var conditionStrings = [];
		var resultStrings = [];
		var curIndex = -1;
		var isNewline = true;
		var isConditionDone = false;
		var codeBlockCount = 0;

		while( !state.Done() ) {
			if(state.Char() === Sym.CodeOpen)
				codeBlockCount++;
			else if(state.Char() === Sym.CodeClose)
				codeBlockCount--;

			var isWhitespace = (state.Char() === " " || state.Char() === "\\t");
			var isSkippableWhitespace = isNewline && isWhitespace;
			var isNewListItem = isNewline && (codeBlockCount <= 0) && (state.Char() === Sym.List);

			if(isNewListItem) {
				curIndex++;
				isConditionDone = false;
				conditionStrings[curIndex] = "";
				resultStrings[curIndex] = "";
			}
			else if(curIndex > -1) {
				if(!isConditionDone) {
					if(state.Char() === "?" || state.Char() === "\\n") { // TODO: use Sym
						// end of condition
						isConditionDone = true;
					}
					else {
						// read in condition
						conditionStrings[curIndex] += state.Char();
					}
				}
				else {
					// read in result
					if(!isSkippableWhitespace)
						resultStrings[curIndex] += state.Char();
				}
			}

			isNewline = (state.Char() === Sym.Linebreak) || isSkippableWhitespace || isNewListItem;

			state.Step();
		}

		// console.log("PARSE IF:");
		// console.log(conditionStrings);
		// console.log(resultStrings);

		var conditions = [];
		for(var i = 0; i < conditionStrings.length; i++) {
			var str = conditionStrings[i].trim();
			if(str === "else") {
				conditions.push( new ElseNode() );
			}
			else {
				var exp = CreateExpression( str );
				conditions.push( exp );
			}
		}

		var results = [];
		for(var i = 0; i < resultStrings.length; i++) {
			var str = resultStrings[i];
			var dialogBlockState = new ParserState( new BlockNode(BlockMode.Dialog), str );
			dialogBlockState = ParseDialog( dialogBlockState );
			var dialogBlock = dialogBlockState.rootNode;
			results.push( dialogBlock );
		}

		state.curNode.AddChild( new IfNode( conditions, results ) );

		return state;
	}

	function IsSequence(str) {
		// console.log("IsSequence? " + str);
		return str === "sequence" || str === "cycle" || str === "shuffle";
	}

	// TODO: don't forget about eating whitespace
	function ParseSequence(state, sequenceType) {
		// console.log("SEQUENCE " + sequenceType);
		state.Print();

		var isNewline = false;
		var itemStrings = [];
		var curItemIndex = -1; // -1 indicates not reading an item yet
		var codeBlockCount = 0;

		while( !state.Done() ) {
			if(state.Char() === Sym.CodeOpen)
				codeBlockCount++;
			else if(state.Char() === Sym.CodeClose)
				codeBlockCount--;

			var isWhitespace = (state.Char() === " " || state.Char() === "\\t");
			var isSkippableWhitespace = isNewline && isWhitespace;
			var isNewListItem = isNewline && (codeBlockCount <= 0) && (state.Char() === Sym.List);

			if(isNewListItem) {
				// console.log("found next list item");
				curItemIndex++;
				itemStrings[curItemIndex] = "";
			}
			else if(curItemIndex > -1) {
				if(!isSkippableWhitespace)
					itemStrings[curItemIndex] += state.Char();
			}

			isNewline = (state.Char() === Sym.Linebreak) || isSkippableWhitespace || isNewListItem;

			// console.log(state.Char());
			state.Step();
		}
		// console.log(itemStrings);
		// console.log("SEQUENCE DONE");

		var options = [];
		for(var i = 0; i < itemStrings.length; i++) {
			var str = itemStrings[i];
			var dialogBlockState = new ParserState( new BlockNode( BlockMode.Dialog, false /* doIndentFirstLine */ ), str );
			dialogBlockState = ParseDialog( dialogBlockState );
			var dialogBlock = dialogBlockState.rootNode;
			options.push( dialogBlock );
		}

		// console.log(options);

		if(sequenceType === "sequence")
			state.curNode.AddChild( new SequenceNode( options ) );
		else if(sequenceType === "cycle")
			state.curNode.AddChild( new CycleNode( options ) );
		else if(sequenceType === "shuffle")
			state.curNode.AddChild( new ShuffleNode( options ) );

		return state;
	}

	function ParseFunction(state, funcName) {
		var args = [];

		var curSymbol = "";
		function OnSymbolEnd() {
			curSymbol = curSymbol.trim();
			console.log("PARAMTER " + curSymbol);
			args.push( StringToValue(curSymbol) );
			console.log(args);
			curSymbol = "";
		}

		while( !( state.Char() === "\\n" || state.Done() ) ) {
			if( state.MatchAhead(Sym.CodeOpen) ) {
				var codeBlockState = new ParserState( new BlockNode(BlockMode.Code), state.ConsumeBlock( Sym.CodeOpen, Sym.CodeClose ) );
				codeBlockState = ParseCode( codeBlockState );
				var codeBlock = codeBlockState.rootNode;
				args.push( codeBlock );
				curSymbol = "";
			}
			else if( state.MatchAhead(Sym.String) ) {
				/* STRING LITERAL */
				var str = state.ConsumeBlock(Sym.String, Sym.String);
				// console.log("STRING " + str);
				args.push( new LiteralNode(str) );
				curSymbol = "";
			}
			else if(state.Char() === " " && curSymbol.length > 0) {
				OnSymbolEnd();
			}
			else {
				curSymbol += state.Char();
			}
			state.Step();
		}

		if(curSymbol.length > 0) {
			OnSymbolEnd();
		}

		state.curNode.AddChild( new FuncNode( funcName, args ) );

		return state;
	}

	function IsValidVariableName(str) {
		var reg = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
		var isValid = reg.test(str);
		console.log("VALID variable??? " + isValid);
		return isValid;
	}

	function StringToValue(valStr) {
		if(valStr[0] === Sym.CodeOpen) {
			// CODE BLOCK!!!
			var codeStr = (new ParserState( null, valStr )).ConsumeBlock(Sym.CodeOpen, Sym.CodeClose); //hacky
			var codeBlockState = new ParserState( new BlockNode( BlockMode.Code ), codeStr );
			codeBlockState = ParseCode( codeBlockState );
			return codeBlockState.rootNode;
		}
		else if(valStr[0] === Sym.String) {
			// STRING!!
			console.log("STRING");
			var str = "";
			var i = 1;
			while (i < valStr.length && valStr[i] != Sym.String) {
				str += valStr[i];
				i++;
			}
			console.log(str);
			return new LiteralNode( str );
		}
		else if(valStr === "true") {
			// BOOL
			return new LiteralNode( true );
		}
		else if(valStr === "false") {
			// BOOL
			return new LiteralNode( false );
		}
		else if( !isNaN(parseFloat(valStr)) ) {
			// NUMBER!!
			// console.log("NUMBER!!! " + valStr);
			return new LiteralNode( parseFloat(valStr) );
		}
		else if(IsValidVariableName(valStr)) {
			// VARIABLE!!
			// console.log("VARIABLE");
			return new VarNode(valStr); // TODO : check for valid potential variables
		}
		else {
			// uh oh
			return new LiteralNode(null);
		}
	}

	var setSymbol = "=";
	var ifSymbol = "?";
	var elseSymbol = ":";
	// var operatorSymbols = ["==", ">", "<", ">=", "<=", "*", "/", "+", "-"];
	var operatorSymbols = ["-", "+", "/", "*", "<=", ">=", "<", ">", "=="]; // operators need to be in reverse order
	function CreateExpression(expStr) {
		expStr = expStr.trim();

		function IsInsideString(index) {
			var inString = false;
			for(var i = 0; i < expStr.length; i++) {
				if(expStr[i] === Sym.String)
					inString = !inString;

				if(index === i)
					return inString;
			}
			return false;
		}

		function IsInsideCode(index) {
			var count = 0;
			for(var i = 0; i < expStr.length; i++) {
				if(expStr[i] === Sym.CodeOpen)
					count++;
				else if(expStr[i] === Sym.CodeClose)
					count--;

				if(index === i)
					return count > 0;
			}
			return false;
		}
	
		var operator = null;

		// set is special because other operator can look like it, and it has to go first in the order of operations
		var setIndex = expStr.indexOf(setSymbol);
		if( setIndex > -1 && !IsInsideString(setIndex) && !IsInsideCode(setIndex) ) { // it might be a set operator
			if( expStr[setIndex+1] != "=" && expStr[setIndex-1] != ">" && expStr[setIndex-1] != "<" ) {
				// ok it actually IS a set operator and not ==, >=, or <=
				operator = setSymbol;
				var variableName = expStr.substring(0,setIndex).trim(); // TODO : valid variable name testing
				var left = IsValidVariableName(variableName) ? new VarNode( variableName ) : new LiteralNode(null);
				var right = CreateExpression( expStr.substring(setIndex+setSymbol.length) );
				var exp = new ExpNode( operator, left, right );
				return exp;
			}
		}

		// special if "expression" for single-line if statements
		var ifIndex = expStr.indexOf(ifSymbol);
		if( ifIndex > -1 && !IsInsideString(ifIndex) && !IsInsideCode(ifIndex) ) {
			operator = ifSymbol;
			var conditionStr = expStr.substring(0,ifIndex).trim();
			var conditions = [ CreateExpression(conditionStr) ];

			var resultStr = expStr.substring(ifIndex+ifSymbol.length);
			var results = [];
			function AddResult(str) {
				var dialogBlockState = new ParserState( new BlockNode(BlockMode.Dialog), str );
				dialogBlockState = ParseDialog( dialogBlockState );
				var dialogBlock = dialogBlockState.rootNode;
				results.push( dialogBlock );
			}

			var elseIndex = resultStr.indexOf(elseSymbol); // does this need to test for strings?
			if(elseIndex > -1) {
				conditions.push( new ElseNode() );

				var elseStr = resultStr.substring(elseIndex+elseSymbol.length);
				var resultStr = resultStr.substring(0,elseIndex);

				AddResult( resultStr.trim() );
				AddResult( elseStr.trim() );
			}
			else {
				AddResult( resultStr.trim() );
			}

			return new IfNode( conditions, results, true /*isSingleLine*/ );
		}

		for( var i = 0; (operator == null) && (i < operatorSymbols.length); i++ ) {
			var opSym = operatorSymbols[i];
			var opIndex = expStr.indexOf( opSym );
			if( opIndex > -1 && !IsInsideString(opIndex) && !IsInsideCode(opIndex) ) {
				operator = opSym;
				var left = CreateExpression( expStr.substring(0,opIndex) );
				var right = CreateExpression( expStr.substring(opIndex+opSym.length) );
				var exp = new ExpNode( operator, left, right );
				return exp;
			}
		}

		if( operator == null ) {
			return StringToValue(expStr);
		}
	}
	this.CreateExpression = CreateExpression;

	function ParseExpression(state) {
		var line = state.Peak( [Sym.Linebreak] );
		// console.log("EXPRESSION " + line);
		var exp = CreateExpression( line );
		// console.log(exp);
		state.curNode.AddChild( exp );
		state.Step( line.length );
		return state;
	}

	function ParseCode(state) {
		// TODO : how do I do this parsing??? one expression per block? or per line?
		while ( !state.Done() ) {

			if( state.Char() === " " || state.Char() === "\\t" || state.Char() === "\\n" ) { // TODO: symbols? IsWhitespace func?
				state.Step(); // consume whitespace
			}
			else if( state.MatchAhead(Sym.CodeOpen) ) {
				state = ParseCodeBlock( state );
			}
			// NOTE: nested dialog blocks disabled for now
			// else if( state.MatchAhead(Sym.DialogOpen) ) {
			// 	state = ParseDialogBlock( state ); // These can be nested (should they though???)
			// }
			else if( state.Char() === Sym.List && (state.Peak([]).indexOf("?") > -1) ) { // TODO : symbols? matchahead?
				// console.log("PEAK IF " + state.Peak( ["?"] ));
				state = ParseIf( state );
			}
			else if( environment.HasFunction( state.Peak( [" "] ) ) ) { // TODO --- what about newlines???
				var funcName = state.Peak( [" "] );
				state.Step( funcName.length );
				state = ParseFunction( state, funcName );
			}
			else if( IsSequence( state.Peak( [" ", Sym.Linebreak] ) ) ) {
				var sequenceType = state.Peak( [" ", Sym.Linebreak] );
				state.Step( sequenceType.length );
				state = ParseSequence( state, sequenceType );
			}
			else {
				state = ParseExpression( state );
			}
		}

		return state;
	}

	function ParseCodeBlock(state) {
		var codeStr = state.ConsumeBlock( Sym.CodeOpen, Sym.CodeClose );

		// console.log("PARSE CODE");
		// console.log(codeStr);

		var codeState = new ParserState( new BlockNode(BlockMode.Code), codeStr );
		codeState = ParseCode( codeState );
		
		state.curNode.AddChild( codeState.rootNode );

		return state;
	}

}

} // Script()
<\/script>

<script>
function Dialog() {

this.CreateRenderer = function() {
	return new DialogRenderer();
};

this.CreateBuffer = function() {
	return new DialogBuffer();
};

var DialogRenderer = function() {

	// TODO : refactor this eventually? remove everything from struct.. avoid the defaults?
	var textboxInfo = {
		img : null,
		width : 232,
		height : (8+4+2) +5, //8 for text, 4 for top-bottom padding, 2 for line padding, 5 for arrow,
		top : 12,
		left : 12,
		bottom : 12, //for drawing it from the bottom
		font_scale : 1, // we draw font at half-size compared to everything else
		padding_vert : 2,
		padding_horz : 4,
		arrow_height : 5,
	};

	var font = null;
	this.SetFont = function(f) {
		font = f;
		textboxInfo.height = (textboxInfo.padding_vert * 3) + (relativeFontHeight() * 2) + textboxInfo.arrow_height;
		textboxInfo.img = context.createImageData(textboxInfo.width*scale, textboxInfo.height*scale);
	}

	function textScale() {
		return scale * textboxInfo.font_scale;
	}

	function relativeFontWidth() {
		return Math.ceil( font.getWidth() * textboxInfo.font_scale );
	}

	function relativeFontHeight() {
		return Math.ceil( font.getHeight() * textboxInfo.font_scale );
	}

	var context = null;
	this.AttachContext = function(c) {
		context = c;
	};

	this.ClearTextbox = function() {
		if(context == null) return;

		//create new image none exists
		if(textboxInfo.img == null)
			textboxInfo.img = context.createImageData(textboxInfo.width*scale, textboxInfo.height*scale);

		// fill text box with black
		for (var i=0;i<textboxInfo.img.data.length;i+=4)
		{
			textboxInfo.img.data[i+0]=0;
			textboxInfo.img.data[i+1]=0;
			textboxInfo.img.data[i+2]=0;
			textboxInfo.img.data[i+3]=255;
		}
	};

	var isCentered = false;
	this.SetCentered = function(centered) {
		isCentered = centered;
	};

	this.DrawTextbox = function() {
		if(context == null) return;
		if (isCentered) {
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, ((height/2)-(textboxInfo.height/2))*scale);
		}
		else if (player().y < mapsize/2) {
			//bottom
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, (height-textboxInfo.bottom-textboxInfo.height)*scale);
		}
		else {
			//top
			context.putImageData(textboxInfo.img, textboxInfo.left*scale, textboxInfo.top*scale);
		}
	};

	var arrowdata = [
		1,1,1,1,1,
		0,1,1,1,0,
		0,0,1,0,0
	];
	this.DrawNextArrow = function() {
		// console.log("draw arrow!");
		var top = (textboxInfo.height-5) * scale;
		var left = (textboxInfo.width-(5+4)) * scale;
		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 5; x++) {
				var i = (y * 5) + x;
				if (arrowdata[i] == 1) {
					//scaling nonsense
					for (var sy = 0; sy < scale; sy++) {
						for (var sx = 0; sx < scale; sx++) {
							var pxl = 4 * ( ((top+(y*scale)+sy) * (textboxInfo.width*scale)) + (left+(x*scale)+sx) );
							textboxInfo.img.data[pxl+0] = 255;
							textboxInfo.img.data[pxl+1] = 255;
							textboxInfo.img.data[pxl+2] = 255;
							textboxInfo.img.data[pxl+3] = 255;
						}
					}
				}
			}
		}
	};

	var text_scale = 2; //using a different scaling factor for text feels like cheating... but it looks better
	this.DrawChar = function(char, row, col, leftPos) {
		char.offset = {x:0, y:0};

		char.SetPosition(row,col);
		char.ApplyEffects(effectTime);

		var charData = char.bitmap;

		var top = (4 * scale) + (row * 2 * scale) + (row * font.getHeight() * text_scale) + Math.floor( char.offset.y );
		var left = (4 * scale) + (leftPos * text_scale) + Math.floor( char.offset.x );

		var debug_r = Math.random() * 255;

		for (var y = 0; y < char.height; y++) {
			for (var x = 0; x < char.width; x++) {

				var i = (y * char.width) + x;
				if ( charData[i] == 1 ) {

					//scaling nonsense
					for (var sy = 0; sy < text_scale; sy++) {
						for (var sx = 0; sx < text_scale; sx++) {
							var pxl = 4 * ( ((top+(y*text_scale)+sy) * (textboxInfo.width*scale)) + (left+(x*text_scale)+sx) );
							textboxInfo.img.data[pxl+0] = char.color.r;
							textboxInfo.img.data[pxl+1] = char.color.g;
							textboxInfo.img.data[pxl+2] = char.color.b;
							textboxInfo.img.data[pxl+3] = char.color.a;
						}
					}
				}
				// else {
				// 	// DEBUG

				// 	//scaling nonsense
				// 	for (var sy = 0; sy < text_scale; sy++) {
				// 		for (var sx = 0; sx < text_scale; sx++) {
				// 			var pxl = 4 * ( ((top+(y*text_scale)+sy) * (textboxInfo.width*scale)) + (left+(x*text_scale)+sx) );
				// 			textboxInfo.img.data[pxl+0] = debug_r;
				// 			textboxInfo.img.data[pxl+1] = 0;
				// 			textboxInfo.img.data[pxl+2] = 0;
				// 			textboxInfo.img.data[pxl+3] = 255;
				// 		}
				// 	}
				// }

			}
		}

		// call printHandler for character
		char.OnPrint();
	};

	var effectTime = 0; // TODO this variable should live somewhere better
	this.Draw = function(buffer,dt) {
		effectTime += dt;

		this.ClearTextbox();

		buffer.ForEachActiveChar( this.DrawChar );

		if( buffer.CanContinue() )
			this.DrawNextArrow();

		this.DrawTextbox();

		if( buffer.DidPageFinishThisFrame() && onPageFinish != null )
			onPageFinish();
	};

	/* this is a hook for GIF rendering */
	var onPageFinish = null;
	this.SetPageFinishHandler = function(handler) {
		onPageFinish = handler;
	};

	this.Reset = function() {
		effectTime = 0;
		// TODO - anything else?
	}

	// this.CharsPerRow = function() {
	// 	return textboxInfo.charsPerRow;
	// }
}


var DialogBuffer = function() {
	var buffer = [[[]]]; // holds dialog in an array buffer
	var pageIndex = 0;
	var rowIndex = 0;
	var charIndex = 0;
	var nextCharTimer = 0;
	var nextCharMaxTime = 50; // in milliseconds
	var isDialogReadyToContinue = false;
	var activeTextEffects = [];
	var font = null;

	this.SetFont = function(f) {
		font = f;
	}

	this.CurPage = function() { return buffer[ pageIndex ]; };
	this.CurRow = function() { return this.CurPage()[ rowIndex ]; };
	this.CurChar = function() { return this.CurRow()[ charIndex ]; };
	this.CurPageCount = function() { return buffer.length; };
	this.CurRowCount = function() { return this.CurPage().length; };
	this.CurCharCount = function() { return this.CurRow().length; };

	this.ForEachActiveChar = function(handler) { // Iterates over visible characters on the active page
		var rowCount = rowIndex + 1;
		for (var i = 0; i < rowCount; i++) {
			var row = this.CurPage()[i];
			var charCount = (i == rowIndex) ? charIndex+1 : row.length;
			// console.log(charCount);

			var leftPos = 0;

			for(var j = 0; j < charCount; j++) {
				var char = row[j];
				if(char) {
					// handler( char, i /*rowIndex*/, j /*colIndex*/ );
					handler(char, i /*rowIndex*/, j /*colIndex*/, leftPos)

					leftPos += char.width;
				}
			}
		}
	}

	this.Reset = function() {
		buffer = [[[]]];
		pageIndex = 0;
		rowIndex = 0;
		charIndex = 0;
		isDialogReadyToContinue = false;

		activeTextEffects = [];

		isActive = false;
	};

	this.DoNextChar = function() {
		// console.log("DO NEXT CHAR");

		nextCharTimer = 0; //reset timer

		//time to update characters
		if (charIndex + 1 < this.CurCharCount()) {
			//add char to current row
			charIndex++;
		}
		else if (rowIndex + 1 < this.CurRowCount()) {
			//start next row
			rowIndex++;
			charIndex = 0;
		}
		else {
			//the page is full!
			isDialogReadyToContinue = true;
			didPageFinishThisFrame = true;

			// console.log("WAITING FOR INPUT");
		}

		// console.log(this.CurChar());
		if(this.CurChar() != null)
			this.CurChar().OnPrint(); // make sure we hit the callback before we run out of text
	};

	this.Update = function(dt) {
		didPageFinishThisFrame = false;
		didFlipPageThisFrame = false;
		// this.Draw(dt); // TODO move into a renderer object
		if (isDialogReadyToContinue) {
			return; //waiting for dialog to be advanced by player
		}

		nextCharTimer += dt; //tick timer

		if (nextCharTimer > nextCharMaxTime) {
			this.DoNextChar();
		}
	};

	this.Skip = function() {
		console.log("SKIPPP");
		didPageFinishThisFrame = false;
		didFlipPageThisFrame = false;
		// add new characters until you get to the end of the current line of dialog
		while (rowIndex < this.CurRowCount()) {
			this.DoNextChar();

			if(isDialogReadyToContinue) {
				//make sure to push the rowIndex past the end to break out of the loop
				rowIndex++;
				charIndex = 0;
			}
		}
		rowIndex = this.CurRowCount()-1;
		charIndex = this.CurCharCount()-1;
	};

	this.FlipPage = function() {
		didFlipPageThisFrame = true;
		isDialogReadyToContinue = false;
		pageIndex++;
		rowIndex = 0;
		charIndex = 0;
	}

	this.EndDialog = function() {
		console.log("END!!!!");
		isActive = false; // no more text to show... this should be a sign to stop rendering dialog
	}

	this.Continue = function() {
		console.log("CONTINUE");
		if (pageIndex + 1 < this.CurPageCount()) {
			//start next page
			this.FlipPage();
			return true; /* hasMoreDialog */
		}
		else {
			//end dialog mode
			this.EndDialog();
			return false; /* hasMoreDialog */
		}
	};

	var isActive = false;
	this.IsActive = function() { return isActive; };

	this.CanContinue = function() { return isDialogReadyToContinue; };

	function DialogChar(effectList) {
		this.effectList = effectList.slice(); // clone effect list (since it can change between chars)

		this.color = { r:255, g:255, b:255, a:255 };
		this.offset = { x:0, y:0 }; // in pixels (screen pixels?)

		this.col = 0;
		this.row = 0;

		this.SetPosition = function(row,col) {
			// console.log("SET POS");
			// console.log(this);
			this.row = row;
			this.col = col;
		}

		this.ApplyEffects = function(time) {
			// console.log("APPLY EFFECTS! " + time);
			for(var i = 0; i < this.effectList.length; i++) {
				var effectName = this.effectList[i];
				// console.log("FX " + effectName);
				TextEffects[ effectName ].DoEffect( this, time );
			}
		}

		var printHandler = null; // optional function to be called once on printing character
		this.SetPrintHandler = function(handler) {
			printHandler = handler;
		}
		this.OnPrint = function() {
			if (printHandler != null) {
				console.log("PRINT HANDLER ---- DIALOG BUFFER");
				printHandler();
				printHandler = null; // only call handler once (hacky)
			}
		}

		this.bitmap = [];
		this.width = 0;
		this.height = 0;
	}

	function DialogFontChar(font, char, effectList) {
		Object.assign(this, new DialogChar(effectList));

		this.bitmap = font.getChar(char);
		this.width = font.getWidth();
		this.height = font.getHeight();
	}

	function DialogDrawingChar(drawingId, effectList) {
		Object.assign(this, new DialogChar(effectList));

		var imageData = imageStore.source[drawingId][0];
		var imageDataFlat = [];
		for (var i = 0; i < imageData.length; i++) {
			// console.log(imageData[i]);
			imageDataFlat = imageDataFlat.concat(imageData[i]);
		}

		this.bitmap = imageDataFlat;
		this.width = 8;
		this.height = 8;
	}

	function AddWordToCharArray(charArray,word,effectList) {
		for(var i = 0; i < word.length; i++) {
			charArray.push( new DialogFontChar( font, word[i], effectList ) );
		}
		return charArray;
	}

	function GetCharArrayWidth(charArray) {
		var width = 0;
		for(var i = 0; i < charArray.length; i++) {
			width += charArray[i].width;
		}
		return width;
	}

	function GetStringWidth(str) {
		var width = 0;
		for (var i = 0; i < str.length; i++) {
			width += font.getWidth();
		}
		return width;
	}

	var pixelsPerRow = 192; // hard-coded fun times!!!

	this.AddDrawing = function(drawingId, onFinishHandler) {
		// console.log("DRAWING ID " + drawingId);

		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		var drawingChar = new DialogDrawingChar(drawingId, activeTextEffects)
		drawingChar.SetPrintHandler( onFinishHandler );

		var rowLength = GetCharArrayWidth(curRowArr);

		// TODO : clean up copy-pasted code here :/
		if (rowLength + drawingChar.width  <= pixelsPerRow || rowLength <= 0)
		{
			//stay on same row
			curRowArr.push( drawingChar );
		}
		else if (curRowIndex == 0)
		{
			//start next row
			buffer[ curPageIndex ][ curRowIndex ] = curRowArr;
			buffer[ curPageIndex ].push( [] );
			curRowIndex++;
			curRowArr = buffer[ curPageIndex ][ curRowIndex ];
			curRowArr.push( drawingChar );
		}
		else {
			//start next page
			buffer[ curPageIndex ][ curRowIndex ] = curRowArr;
			buffer.push( [] );
			curPageIndex++;
			buffer[ curPageIndex ].push( [] );
			curRowIndex = 0;
			curRowArr = buffer[ curPageIndex ][ curRowIndex ];
			curRowArr.push( drawingChar );
		}

		isActive = true; // this feels like a bad way to do this???
	}

	// TODO : convert this into something that takes DialogChar arrays
	this.AddText = function(textStr,onFinishHandler) {
		// console.log("ADD TEXT " + textStr);

		//process dialog so it's easier to display
		var words = textStr.split(" ");

		// var curPageIndex = this.CurPageCount() - 1;
		// var curRowIndex = this.CurRowCount() - 1;
		// var curRowArr = this.CurRow();

		var curPageIndex = buffer.length - 1;
		var curRowIndex = buffer[curPageIndex].length - 1;
		var curRowArr = buffer[curPageIndex][curRowIndex];

		for (var i = 0; i < words.length; i++) {
			var word = words[i];

			var wordWithPrecedingSpace = ((i == 0) ? "" : " ") + word;
			var wordLength = GetStringWidth( wordWithPrecedingSpace );

			var rowLength = GetCharArrayWidth(curRowArr);

			if (rowLength + wordLength <= pixelsPerRow || rowLength <= 0) {
				//stay on same row
				curRowArr = AddWordToCharArray( curRowArr, wordWithPrecedingSpace, activeTextEffects );
			}
			else if (curRowIndex == 0) {
				//start next row
				buffer[ curPageIndex ][ curRowIndex ] = curRowArr;
				buffer[ curPageIndex ].push( [] );
				curRowIndex++;
				curRowArr = buffer[ curPageIndex ][ curRowIndex ];
				curRowArr = AddWordToCharArray( curRowArr, word, activeTextEffects );
			}
			else {
				//start next page
				buffer[ curPageIndex ][ curRowIndex ] = curRowArr;
				buffer.push( [] );
				curPageIndex++;
				buffer[ curPageIndex ].push( [] );
				curRowIndex = 0;
				curRowArr = buffer[ curPageIndex ][ curRowIndex ];
				curRowArr = AddWordToCharArray( curRowArr, word, activeTextEffects );
			}
		}

		//destroy any empty stuff
		var lastPage = buffer[ buffer.length-1 ];
		var lastRow = lastPage[ lastPage.length-1 ];
		if( lastRow.length == 0 )
			lastPage.splice( lastPage.length-1, 1 );
		if( lastPage.length == 0 )
			buffer.splice( buffer.length-1, 1 );

		//finish up
		lastPage = buffer[ buffer.length-1 ];
		lastRow = lastPage[ lastPage.length-1 ];
		if( lastRow.length > 0 ) {
			var lastChar = lastRow[ lastRow.length-1 ];
			lastChar.SetPrintHandler( onFinishHandler );
		}

		console.log(buffer);

		isActive = true;
	};

	this.AddLinebreak = function() {
		var lastPage = buffer[ buffer.length-1 ];
		if( lastPage.length <= 1 ) {
			console.log("LINEBREAK - NEW ROW ");
			// add new row
			lastPage.push( [] );
		}
		else {
			// add new page
			buffer.push( [[]] );
		}
		console.log(buffer);

		isActive = true;
	}

	/* new text effects */
	this.HasTextEffect = function(name) {
		return activeTextEffects.indexOf( name ) > -1;
	}
	this.AddTextEffect = function(name) {
		activeTextEffects.push( name );
	}
	this.RemoveTextEffect = function(name) {
		activeTextEffects.splice( activeTextEffects.indexOf( name ), 1 );
	}

	/* this is a hook for GIF rendering */
	var didPageFinishThisFrame = false;
	this.DidPageFinishThisFrame = function(){ return didPageFinishThisFrame; };

	var didFlipPageThisFrame = false;
	this.DidFlipPageThisFrame = function(){ return didFlipPageThisFrame; };

	// this.SetCharsPerRow = function(num){ charsPerRow = num; }; // hacky
};

/* NEW TEXT EFFECTS */
var TextEffects = new Map();

var RainbowEffect = function() { // TODO - should it be an object or just a method?
	this.DoEffect = function(char,time) {
		// console.log("RAINBOW!!!");
		// console.log(char);
		// console.log(char.color);
		// console.log(char.col);

		var h = Math.abs( Math.sin( (time / 600) - (char.col / 8) ) );
		var rgb = hslToRgb( h, 1, 0.5 );
		char.color.r = rgb[0];
		char.color.g = rgb[1];
		char.color.b = rgb[2];
		char.color.a = 255;
	}
};
TextEffects["rbw"] = new RainbowEffect();

var ColorEffect = function(index) {
	this.DoEffect = function(char) {
		var pal = getPal( curPal() );
		var color = pal[ parseInt( index ) ];
		// console.log(color);
		char.color.r = color[0];
		char.color.g = color[1];
		char.color.b = color[2];
		char.color.a = 255;
	}
};
TextEffects["clr1"] = new ColorEffect(0);
TextEffects["clr2"] = new ColorEffect(1); // TODO : should I use parameters instead of special names?
TextEffects["clr3"] = new ColorEffect(2);

var WavyEffect = function() {
	this.DoEffect = function(char,time) {
		char.offset.y += Math.sin( (time / 250) - (char.col / 2) ) * 4;
	}
};
TextEffects["wvy"] = new WavyEffect();

var ShakyEffect = function() {
	function disturb(func,time,offset,mult1,mult2) {
		return func( (time * mult1) - (offset * mult2) );
	}

	this.DoEffect = function(char,time) {
		char.offset.y += 3
						* disturb(Math.sin,time,char.col,0.1,0.5)
						* disturb(Math.cos,time,char.col,0.3,0.2)
						* disturb(Math.sin,time,char.row,2.0,1.0);
		char.offset.x += 3
						* disturb(Math.cos,time,char.row,0.1,1.0)
						* disturb(Math.sin,time,char.col,3.0,0.7)
						* disturb(Math.cos,time,char.col,0.2,0.3);
	}
};
TextEffects["shk"] = new ShakyEffect();

} // Dialog()

<\/script>

<script>
var xhr;
var canvas;
var context;
var ctx;

var title = "";
var room = {};
var tile = {};
var sprite = {};
var item = {};
var dialog = {};
var palette = {
	"0" : [[0,0,0],[255,0,0],[255,255,255]] //start off with a default palette (can be overriden)
};
var ending = {};
var variable = {}; // these are starting variable values -- they don't update (or I don't think they will)
var playerId = "A";

var defaultFontName = "ascii_small";
var fontName = defaultFontName;

var names = {
	room : new Map(),
	tile : new Map(), // Note: Not currently enabled in the UI
	sprite : new Map(),
	item : new Map(),
	/*dialog : new Map()*/ // TODO
	/*ending : new Map()*/ // TODO
};
function updateNamesFromCurData() {
	names.room = new Map();
	for(id in room) {
		if(room[id].name != undefined && room[id].name != null)
			names.room.set( room[id].name, id );
	}
	names.tile = new Map();
	for(id in tile) {
		if(tile[id].name != undefined && tile[id].name != null)
			names.tile.set( tile[id].name, id );
	}
	names.sprite = new Map();
	for(id in sprite) {
		if(sprite[id].name != undefined && sprite[id].name != null)
			names.sprite.set( sprite[id].name, id );
	}
	names.item = new Map();
	for(id in item) {
		if(item[id].name != undefined && item[id].name != null)
			names.item.set( item[id].name, id );
	}
}

//stores all image data for tiles, sprites, drawings
var imageStore = {
	source: {},
	render: {}
};

var spriteStartLocations = {};

/* VERSION */
var version = {
	major: 5, // for file format / engine changes
	minor: 1 // for editor changes and bugfixes
};
function getEngineVersion() {
	return version.major + "." + version.minor;
}

/* FLAGS */
var flags;
function resetFlags() {
	flags = {
		ROOM_FORMAT : 0 // 0 = non-comma separated, 1 = comma separated
	};
}
resetFlags(); //init flags on load script

function clearGameData() {
	title = "";
	room = {};
	tile = {};
	sprite = {};
	item = {};
	dialog = {};
	palette = { //start off with a default palette (can be overriden)
		"0" : {
			name : null,
			colors : [[0,0,0],[255,0,0],[255,255,255]]
		}
	};
	ending = {};
	isEnding = false; //todo - correct place for this?
	variable = {};

	//stores all image data for tiles, sprites, drawings
	imageStore = {
		source: {},
		render: {}
	};

	spriteStartLocations = {};

	names = {
		room : new Map(),
		tile : new Map(),
		sprite : new Map(),
		item : new Map()
	};

	fontName = defaultFontName; // TODO : reset font manager too?
}

var width = 256;
var height = 256;
var scale = 2; //this is stupid but necessary
var tilesize = 16;
var mapsize = 16;

var curRoom = "0";

var key = {
	left : 37,
	right : 39,
	up : 38,
	down : 40,
	space : 32,
	enter : 13,
	w : 87,
	a : 65,
	s : 83,
	d : 68,
	r : 82,
	shift : 16,
	ctrl : 17,
	alt : 18,
	cmd : 224
};

var prevTime = 0;
var deltaTime = 0;

//methods used to trigger gif recording
var didPlayerMoveThisFrame = false;
var onPlayerMoved = null;
// var didDialogUpdateThisFrame = false;
var onDialogUpdate = null;

//inventory update UI handles
var onInventoryChanged = null;
var onVariableChanged = null;

var isPlayerEmbeddedInEditor = false;

function getGameNameFromURL() {
	var game = window.location.hash.substring(1);
	// console.log("game name --- " + game);
	return game;
}

function attachCanvas(c) {
	canvas = c;
	canvas.width = width * scale;
	canvas.height = width * scale;
	ctx = canvas.getContext("2d");
	dialogRenderer.AttachContext(ctx);
}

var curGameData = null;
function load_game(bitsy_x2_data, startWithTitle) {
	curGameData = bitsy_x2_data; //remember the current game (used to reset the game)

	dialogBuffer.Reset();
	scriptInterpreter.ResetEnvironment(); // ensures variables are reset -- is this the best way?

	parseWorld(bitsy_x2_data);

	if (!isPlayerEmbeddedInEditor) {
		// hack to ensure default font is available
		fontManager.AddResource(defaultFontName + fontManager.GetExtension(), document.getElementById(defaultFontName).text.slice(1));
	}

	var font = fontManager.Get( fontName );
	dialogBuffer.SetFont(font);
	dialogRenderer.SetFont(font);

	setInitialVariables();
	renderImages();

	// setInterval(updateLoadingScreen, 300); // hack test

	onready(startWithTitle);
}

function reset_cur_game() {
	if (curGameData == null) return; //can't reset if we don't have the game data
	stopGame();
	clearGameData();
	load_game(curGameData);
}

var update_interval = null;
function onready(startWithTitle) {
	if(startWithTitle === undefined || startWithTitle === null) startWithTitle = true;

	clearInterval(loading_interval);

	input = new InputManager();

	document.addEventListener('keydown', input.onkeydown);
	document.addEventListener('keyup', input.onkeyup);

	if (isPlayerEmbeddedInEditor) {
		canvas.addEventListener('touchstart', input.ontouchstart);
		canvas.addEventListener('touchmove', input.ontouchmove);
		canvas.addEventListener('touchend', input.ontouchend);
	}
	else {
    	//borksy modification, fixing touch controls on itch.io mobile embeds
	
    	let existingTouchTrigger = document.querySelector('#touchTrigger');
    	if (existingTouchTrigger === null){
    		var touchTrigger = document.createElement("div");
    		touchTrigger.setAttribute("id","touchTrigger");
    		touchTrigger.setAttribute(
    		  "style","position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden;"
    		);
    		document.body.appendChild(touchTrigger);

    		touchTrigger.addEventListener('touchstart', input.ontouchstart);
    		touchTrigger.addEventListener('touchmove', input.ontouchmove);
    		touchTrigger.addEventListener('touchend', input.ontouchend);
    	}
	}

	window.onblur = input.onblur;

	update_interval = setInterval(update,-1);

	console.log("TITLE ??? " + startWithTitle);
	if(startWithTitle) // used by editor
		startNarrating(title);
}

function setInitialVariables() {
	for(id in variable) {
		var value = variable[id]; // default to string
		if(value === "true") {
			value = true;
		}
		else if(value === "false") {
			value = false;
		}
		else if(!isNaN(parseFloat(value))) {
			value = parseFloat(value);
		}
		scriptInterpreter.SetVariable(id,value);
	}
	scriptInterpreter.SetOnVariableChangeHandler( onVariableChanged );
}

// TODO: this is likely broken
function breadthFirstSearch(map, from, to) {
	from.trail = [];
	var visited = [];
	var queue = [from];
	visited.push( posToString(from) );

	//console.log( "~ bfs ~");
	//console.log( posToString(from) + " to " + posToString(to) );

	while ( queue.length > 0 ) {

		//grab pos from queue and mark as visited
		var curPos = queue.shift();

		//console.log( posToString(curPos) );
		//console.log( ".. " + pathToString(curPos.trail) );
		//console.log( visited );

		if (curPos.x == to.x && curPos.y == to.y) {
			//found a path!
			var path = curPos.trail.splice(0);
			path.push( curPos );
			return path;
		}

		//look at neighbors
		neighbors(curPos).forEach( function(n) {
			var inBounds = (n.x >= 0 && n.x < 16 && n.y >= 0 && n.y < 16);
			if (inBounds) {
				var noCollision = map[n.y][n.x] <= 0;
				var notVisited = visited.indexOf( posToString(n) ) == -1;
				if (noCollision && notVisited) {
					n.trail = curPos.trail.slice();
					n.trail.push(curPos);
					queue.push( n );
					visited.push( posToString(n) );
				}
			}
		});

	}

	return []; // no path found
}

function posToString(pos) {
	return pos.x + "," + pos.y;
}

function pathToString(path) {
	var s = "";
	for (i in path) {
		s += posToString(path[i]) + " ";
	}
	return s;
}

function neighbors(pos) {
	var neighborList = [];
	neighborList.push( {x:pos.x+1, y:pos.y+0} );
	neighborList.push( {x:pos.x-1, y:pos.y+0} );
	neighborList.push( {x:pos.x+0, y:pos.y+1} );
	neighborList.push( {x:pos.x+0, y:pos.y-1} );
	return neighborList;
}

function collisionMap(roomId) {
	var map = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	for (r in room[roomId].tilemap) {
		var row = room[roomId].tilemap[r];
		for (var c = 0; c < row.length; c++) {
			if (room[roomId].walls.indexOf( row[x] ) != -1) {
				map[r][c] = 1;
			}
		}
	}

	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === roomId) {
			map[spr.y][spr.x] = 2;
		}
	}

	return map;
}

function getOffset(evt) {
	var offset = { x:0, y:0 };

	var el = evt.target;
	var rect = el.getBoundingClientRect();

	offset.x += rect.left + el.scrollLeft;
	offset.y += rect.top + el.scrollTop;

	offset.x = evt.clientX - offset.x;
	offset.y = evt.clientY - offset.y;

	return offset;
}

function stopGame() {
	console.log("stop GAME!");

	document.removeEventListener('keydown', input.onkeydown);
	document.removeEventListener('keyup', input.onkeyup);

	if (isPlayerEmbeddedInEditor) {
		canvas.removeEventListener('touchstart', input.ontouchstart);
		canvas.removeEventListener('touchmove', input.ontouchmove);
		canvas.removeEventListener('touchend', input.ontouchend);
	}
	else {
	
	    //borksy modifications
	
    	let existingTouchTrigger = document.querySelector('#touchTrigger');
    	if (existingTouchTrigger !== null){
    	 	existingTouchTrigger.removeEventListener('touchstart', input.ontouchstart);
    	 	existingTouchTrigger.removeEventListener('touchmove', input.ontouchmove);
    	 	existingTouchTrigger.removeEventListener('touchend', input.ontouchend);

    	 	existingTouchTrigger.parentElement.removeChild(existingTouchTrigger);
    	}
	}

	window.onblur = null;

	clearInterval(update_interval);
}

/* loading animation */
var loading_anim_data = [
	[
		0,1,1,1,1,1,1,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,1,1,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,0,0,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,1,1,1,1,1,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,0,0,1,1,0,0,0,
		0,0,0,1,1,0,0,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
	],
	[
		0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,1,
		1,1,1,0,0,1,1,1,
		1,1,1,1,1,0,0,1,
		1,1,1,1,1,0,0,1,
		1,1,1,0,0,1,1,1,
		1,0,0,0,0,0,0,1,
		0,0,0,0,0,0,0,0,
	]
];
var loading_anim_frame = 0;
var loading_anim_speed = 500;
var loading_interval = null;

function loadingAnimation() {
	//create image
	var loadingAnimImg = ctx.createImageData(tilesize*scale, tilesize*scale);
	//draw image
	for (var y = 0; y < tilesize; y++) {
		for (var x = 0; x < tilesize; x++) {
			var i = (y * tilesize) + x;
			if (loading_anim_data[loading_anim_frame][i] == 1) {
				//scaling nonsense
				for (var sy = 0; sy < scale; sy++) {
					for (var sx = 0; sx < scale; sx++) {
						var pxl = 4 * ( (((y*scale)+sy) * (tilesize*scale)) + ((x*scale)+sx) );
						loadingAnimImg.data[pxl+0] = 255;
						loadingAnimImg.data[pxl+1] = 255;
						loadingAnimImg.data[pxl+2] = 255;
						loadingAnimImg.data[pxl+3] = 255;
					}
				}
			}
		}
	}
	//put image on canvas
	ctx.putImageData(loadingAnimImg,scale*(width/4 - 4),scale*(height/4 - 4));
	//update frame
	loading_anim_frame++;
	if (loading_anim_frame >= 5) loading_anim_frame = 0;
}

function updateLoadingScreen() {
	// TODO : in progress
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	loadingAnimation();
	drawSprite( getSpriteImage(sprite["a"],"0",0), tilesize, tilesize, ctx );
}

function update() {
	var curTime = Date.now();
	deltaTime = curTime - prevTime;

	updateInput();

	if (!isNarrating && !isEnding) {
		updateAnimation();
		drawRoom( room[curRoom] ); // draw world if game has begun
	}
	else {
		//make sure to still clear screen
		ctx.fillStyle = "rgb(" + getPal(curPal())[0][0] + "," + getPal(curPal())[0][1] + "," + getPal(curPal())[0][2] + ")";
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}

	// if (isDialogMode) { // dialog mode
	if(dialogBuffer.IsActive()) {
		dialogRenderer.Draw( dialogBuffer, deltaTime );
		dialogBuffer.Update( deltaTime );
	}
	else if (!isEnding) {
		moveSprites();
	}

	// keep moving avatar if player holds down button
	if( !dialogBuffer.IsActive() && !isEnding )
	{
		if( curPlayerDirection != Direction.None ) {
			playerHoldToMoveTimer -= deltaTime;

			if( playerHoldToMoveTimer <= 0 )
			{
				movePlayer( curPlayerDirection );
				playerHoldToMoveTimer = 150;
			}
		}
	}

	prevTime = curTime;

	//for gif recording
	if (didPlayerMoveThisFrame && onPlayerMoved != null) onPlayerMoved();
	didPlayerMoveThisFrame = false;
	// if (didDialogUpdateThisFrame && onDialogUpdate != null) onDialogUpdate();
	// didDialogUpdateThisFrame = false;
	/* hacky replacement */
	if (onDialogUpdate != null)
		dialogRenderer.SetPageFinishHandler( onDialogUpdate );

	input.resetKeyPressed();
	input.resetTapReleased();
}

function updateInput() {
	if( dialogBuffer.IsActive() ) {
		if (input.anyKeyPressed() || input.isTapReleased()) {
			/* CONTINUE DIALOG */
			if (dialogBuffer.CanContinue()) {
				var hasMoreDialog = dialogBuffer.Continue();
				if(!hasMoreDialog) {
					// ignore currently held keys UNTIL they are released (stops player from insta-moving)
					input.ignoreHeldKeys();

					onExitDialog();
				}
			}
			else {
				dialogBuffer.Skip();
			}
		}
	}
	else if ( isEnding ) {
		if (input.anyKeyPressed() || input.isTapReleased()) {
			/* RESTART GAME */
			reset_cur_game();
		}
	}
	else {
		/* WALK */
		var prevPlayerDirection = curPlayerDirection;

		if ( input.isKeyDown( key.left ) || input.isKeyDown( key.a ) || input.swipeLeft() ) {
			curPlayerDirection = Direction.Left;
		}
		else if ( input.isKeyDown( key.right ) || input.isKeyDown( key.d ) || input.swipeRight() ) {
			curPlayerDirection = Direction.Right;
		}
		else if ( input.isKeyDown( key.up ) || input.isKeyDown( key.w ) || input.swipeUp() ) {
			curPlayerDirection = Direction.Up;
		}
		else if ( input.isKeyDown( key.down ) || input.isKeyDown( key.s ) || input.swipeDown() ) {
			curPlayerDirection = Direction.Down;
		}
		else {
			curPlayerDirection = Direction.None;
		}

		if (curPlayerDirection != Direction.None && curPlayerDirection != prevPlayerDirection) {
			movePlayer( curPlayerDirection );
			playerHoldToMoveTimer = 500;
		}
	}
}

var animationCounter = 0;
var animationTime = 400;
function updateAnimation() {
	animationCounter += deltaTime;

	if ( animationCounter >= animationTime ) {

		// animate sprites
		for (id in sprite) {
			var spr = sprite[id];
			if (spr.animation.isAnimated) {
				spr.animation.frameIndex = ( spr.animation.frameIndex + 1 ) % spr.animation.frameCount;
			}
		}

		// animate tiles
		for (id in tile) {
			var til = tile[id];
			if (til.animation.isAnimated) {
				til.animation.frameIndex = ( til.animation.frameIndex + 1 ) % til.animation.frameCount;
			}
		}

		// animate items
		for (id in item) {
			var itm = item[id];
			if (itm.animation.isAnimated) {
				itm.animation.frameIndex = ( itm.animation.frameIndex + 1 ) % itm.animation.frameCount;
			}
		}

		// reset counter
		animationCounter = 0;

	}
}

var moveCounter = 0;
var moveTime = 200;
function moveSprites() {
	moveCounter += deltaTime;

	if (moveCounter >= moveTime) {

		for (id in sprite) {
			var spr = sprite[id];
			if (spr.walkingPath.length > 0) {
				//move sprite
				var nextPos = spr.walkingPath.shift();
				spr.x = nextPos.x;
				spr.y = nextPos.y;


				var end = getEnding( spr.room, spr.x, spr.y );
				var ext = getExit( spr.room, spr.x, spr.y );
				var itmIndex = getItemIndex( spr.room, spr.x, spr.y );
				if (end) { //if the sprite hits an ending
					if (id === playerId) { // only the player can end the game
						startNarrating( ending[end.id], true /*isEnding*/ );
					}
				}
				else if (ext) { //if the sprite hits an exit
					//move it to another scene
					spr.room = ext.dest.room;
					spr.x = ext.dest.x;
					spr.y = ext.dest.y;
					if (id === playerId) {
						//if the player changes scenes, change the visible scene
						curRoom = ext.dest.room;
					}
				}
				else if(itmIndex > -1) {
					var itm = room[ spr.room ].items[ itmIndex ];
					room[ spr.room ].items.splice( itmIndex, 1 );
					if( spr.inventory[ itm.id ] )
						spr.inventory[ itm.id ] += 1;
					else
						spr.inventory[ itm.id ] = 1;

					if(onInventoryChanged != null)
						onInventoryChanged( itm.id );

					if(id === playerId)
						startItemDialog( itm.id  /*itemId*/ );

					// stop moving : is this a good idea?
					spr.walkingPath = [];
				}

				if (id === playerId) didPlayerMoveThisFrame = true;
			}
		}

		moveCounter = 0;
	}

}

function getSpriteAt(x,y) {
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === curRoom) {
			if (spr.x == x && spr.y == y) {
				return id;
			}
		}
	}
	return null;
}

var Direction = {
	None : -1,
	Up : 0,
	Down : 1,
	Left : 2,
	Right : 3
};

var curPlayerDirection = Direction.None;
var playerHoldToMoveTimer = 0;

var InputManager = function() {
	var self = this;

	var pressed;
	var ignored;
	var newKeyPress;
	var touchState;

	function resetAll() {
		pressed = {};
		ignored = {};
		newKeyPress = false;

		touchState = {
			isDown : false,
			startX : 0,
			startY : 0,
			curX : 0,
			curY : 0,
			swipeDistance : 30,
			swipeDirection : Direction.None,
			tapReleased : false
		};
	}
	resetAll();

	function stopWindowScrolling(e) {
		if(e.keyCode == key.left || e.keyCode == key.right || e.keyCode == key.up || e.keyCode == key.down || !isPlayerEmbeddedInEditor)
			e.preventDefault();
	}

	function tryRestartGame(e) {
		/* RESTART GAME */
		if ( e.keyCode === key.r && ( e.getModifierState("Control") || e.getModifierState("Meta") ) ) {
			if ( confirm("Restart the game?") ) {
				reset_cur_game();
			}
		}
	}

	function eventIsModifier(event) {
		return (event.keyCode == key.shift || event.keyCode == key.ctrl || event.keyCode == key.alt || event.keyCode == key.cmd);
	}

	function isModifierKeyDown() {
		return ( self.isKeyDown(key.shift) || self.isKeyDown(key.ctrl) || self.isKeyDown(key.alt) || self.isKeyDown(key.cmd) );
	}

	this.ignoreHeldKeys = function() {
		for (var key in pressed) {
			if (pressed[key]) { // only ignore keys that are actually held
				ignored[key] = true;
				// console.log("IGNORE -- " + key);
			}
		}
	}

	this.onkeydown = function(event) {
		// console.log("KEYDOWN -- " + event.keyCode);

		stopWindowScrolling(event);

		tryRestartGame(event);

		// Special keys being held down can interfere with keyup events and lock movement
		// so just don't collect input when they're held
		{
			if (isModifierKeyDown()) {
				return;
			}

			if (eventIsModifier(event)) {
				resetAll();
			}
		}

		if (ignored[event.keyCode]) {
			return;
		}

		if (!self.isKeyDown(event.keyCode)) {
			newKeyPress = true;
		}

		pressed[event.keyCode] = true;
		ignored[event.keyCode] = false;
	}

	this.onkeyup = function(event) {
		// console.log("KEYUP -- " + event.keyCode);
		pressed[event.keyCode] = false;
		ignored[event.keyCode] = false;
	}

	this.ontouchstart = function(event) {
		if( event.changedTouches.length > 0 ) {
			touchState.isDown = true;

			touchState.startX = touchState.curX = event.changedTouches[0].clientX;
			touchState.startY = touchState.curY = event.changedTouches[0].clientY;

			touchState.swipeDirection = Direction.None;
		}
	}

	this.ontouchmove = function(event) {
		if( touchState.isDown && event.changedTouches.length > 0 ) {
			touchState.curX = event.changedTouches[0].clientX;
			touchState.curY = event.changedTouches[0].clientY;

			var prevDirection = touchState.swipeDirection;

			if( touchState.curX - touchState.startX <= -touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Left;
			}
			else if( touchState.curX - touchState.startX >= touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Right;
			}
			else if( touchState.curY - touchState.startY <= -touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Up;
			}
			else if( touchState.curY - touchState.startY >= touchState.swipeDistance ) {
				touchState.swipeDirection = Direction.Down;
			}

			if( touchState.swipeDirection != prevDirection ) {
				// reset center so changing directions is easier
				touchState.startX = touchState.curX;
				touchState.startY = touchState.curY;
			}
		}
	}

	this.ontouchend = function(event) {
		touchState.isDown = false;

		if( touchState.swipeDirection == Direction.None ) {
			// tap!
			touchState.tapReleased = true;
		}

		touchState.swipeDirection = Direction.None;
	}

	this.isKeyDown = function(keyCode) {
		return pressed[keyCode] != null && pressed[keyCode] == true && (ignored[keyCode] == null || ignored[keyCode] == false);
	}

	this.anyKeyPressed = function() {
		return newKeyPress;
	}

	this.resetKeyPressed = function() {
		newKeyPress = false;
	}

	this.swipeLeft = function() {
		return touchState.swipeDirection == Direction.Left;
	}

	this.swipeRight = function() {
		return touchState.swipeDirection == Direction.Right;
	}

	this.swipeUp = function() {
		return touchState.swipeDirection == Direction.Up;
	}

	this.swipeDown = function() {
		return touchState.swipeDirection == Direction.Down;
	}

	this.isTapReleased = function() {
		return touchState.tapReleased;
	}

	this.resetTapReleased = function() {
		touchState.tapReleased = false;
	}

	this.onblur = function() {
		// console.log("~~~ BLUR ~~");
		resetAll();
	}
}
var input = null;

function movePlayer(direction) {
	var spr = null;

	if ( curPlayerDirection == Direction.Left && !(spr = getSpriteLeft()) && !isWallLeft()) {
		player().x -= 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Right && !(spr = getSpriteRight()) && !isWallRight()) {
		player().x += 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Up && !(spr = getSpriteUp()) && !isWallUp()) {
		player().y -= 1;
		didPlayerMoveThisFrame = true;
	}
	else if ( curPlayerDirection == Direction.Down && !(spr = getSpriteDown()) && !isWallDown()) {
		player().y += 1;
		didPlayerMoveThisFrame = true;
	}

	var ext = getExit( player().room, player().x, player().y );
	var end = getEnding( player().room, player().x, player().y );
	var itmIndex = getItemIndex( player().room, player().x, player().y );

	// do items first, because you can pick up an item AND go through a door
	if (itmIndex > -1) {
		// TODO pick up items (what about touch?)
		// console.log("HIT ITM ");
		// console.log( itmIndex );
		var itm = room[ player().room ].items[ itmIndex ];
		// console.log(itm);
		room[ player().room ].items.splice( itmIndex, 1 );
		if( player().inventory[ itm.id ] )
			player().inventory[ itm.id ] += 1;
		else
			player().inventory[ itm.id ] = 1;

		if(onInventoryChanged != null)
			onInventoryChanged( itm.id );

		startItemDialog( itm.id  /*itemId*/ );

		// console.log( player().inventory );
	}

	if (end) {
		startNarrating( ending[end.id], true /*isEnding*/ );
	}
	else if (ext) {
		player().room = ext.dest.room;
		player().x = ext.dest.x;
		player().y = ext.dest.y;
		curRoom = ext.dest.room;
	}
	else if (spr) {
		startSpriteDialog( spr /*spriteId*/ );
	}
}

function getItemIndex( roomId, x, y ) {
	for( var i = 0; i < room[roomId].items.length; i++ ) {
		var itm = room[roomId].items[i];
		if ( itm.x == x && itm.y == y)
			return i;
	}
	return -1;
}

function getSpriteLeft() { //repetitive?
	return getSpriteAt( player().x - 1, player().y );
}

function getSpriteRight() {
	return getSpriteAt( player().x + 1, player().y );
}

function getSpriteUp() {
	return getSpriteAt( player().x, player().y - 1 );
}

function getSpriteDown() {
	return getSpriteAt( player().x, player().y + 1 );
}

function isWallLeft() {
	return (player().x - 1 < 0) || isWall( player().x - 1, player().y );
}

function isWallRight() {
	return (player().x + 1 >= 16) || isWall( player().x + 1, player().y );
}

function isWallUp() {
	return (player().y - 1 < 0) || isWall( player().x, player().y - 1 );
}

function isWallDown() {
	return (player().y + 1 >= 16) || isWall( player().x, player().y + 1 );
}

function isWall(x,y,roomId) {
	if(roomId == undefined || roomId == null)
		roomId = curRoom;

	var tileId = getTile( x, y );

	if( tileId === '0' )
		return false; // Blank spaces aren't walls, ya doofus

	if( tile[tileId].isWall === undefined || tile[tileId].isWall === null ) {
		// No wall-state defined: check room-specific walls
		var i = room[roomId].walls.indexOf( getTile(x,y) );
		return i > -1;
	}

	// Otherwise, use the tile's own wall-state
	return tile[tileId].isWall;
}

function getItem(roomId,x,y) {
	for (i in room[roomId].items) {
		var item = room[roomId].items[i];
		if (x == item.x && y == item.y) {
			return item;
		}
	}
	return null;
}

function getExit(roomId,x,y) {
	for (i in room[roomId].exits) {
		var e = room[roomId].exits[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getEnding(roomId,x,y) {
	for (i in room[roomId].endings) {
		var e = room[roomId].endings[i];
		if (x == e.x && y == e.y) {
			return e;
		}
	}
	return null;
}

function getTile(x,y) {
	// console.log(x + " " + y);
	var t = getRoom().tilemap[y][x];
	return t;
}

function player() {
	return sprite[playerId];
}

// Sort of a hack for legacy palette code (when it was just an array)
function getPal(id) {
	return palette[ id ].colors;
}

function getRoom() {
	return room[curRoom];
}

function isSpriteOffstage(id) {
	return sprite[id].room == null;
}

function parseWorld(file) {
	resetFlags();

	var versionNumber = 0;

	var lines = file.split("\\n");
	var i = 0;
	while (i < lines.length) {
		var curLine = lines[i];

		// console.log(lines[i]);

		if (i == 0) {
			i = parseTitle(lines, i);
		}
		else if (curLine.length <= 0 || curLine.charAt(0) === "#") {
			// collect version number (from a comment.. hacky I know)
			if (curLine.indexOf("# BITSY VERSION ") != -1) {
				versionNumber = parseFloat(curLine.replace("# BITSY VERSION ", ""));
			}

			//skip blank lines & comments
			i++;
		}
		else if (getType(curLine) == "PAL") {
			i = parsePalette(lines, i);
		}
		else if (getType(curLine) === "ROOM" || getType(curLine) === "SET") { //SET for back compat
			i = parseRoom(lines, i);
		}
		else if (getType(curLine) === "TIL") {
			i = parseTile(lines, i);
		}
		else if (getType(curLine) === "SPR") {
			i = parseSprite(lines, i);
		}
		else if (getType(curLine) === "ITM") {
			i = parseItem(lines, i);
		}
		else if (getType(curLine) === "DRW") {
			i = parseDrawing(lines, i);
		}
		else if (getType(curLine) === "DLG") {
			i = parseDialog(lines, i);
		}
		else if (getType(curLine) === "END") {
			i = parseEnding(lines, i);
		}
		else if (getType(curLine) === "VAR") {
			i = parseVariable(lines, i);
		}
		else if (getType(curLine) === "DEFAULT_FONT") {
			i = parseFontName(lines, i);
		}
		else if (getType(curLine) === "FONT") {
			i = parseFontData(lines, i);
		}
		else if (getType(curLine) === "!") {
			i = parseFlag(lines, i);
		}
		else {
			i++;
		}
	}
	placeSprites();
	if (player().room != null) {
		curRoom = player().room;
	}

	// console.log(names);

	return versionNumber;
}

//TODO this is in progress and doesn't support all features
function serializeWorld(skipFonts) {
	if (skipFonts === undefined || skipFonts === null)
		skipFonts = false;

	var worldStr = "";
	/* TITLE */
	worldStr += title + "\\n";
	worldStr += "\\n";
	/* VERSION */
	worldStr += "# BITSY VERSION " + getEngineVersion() + "\\n"; // add version as a comment for debugging purposes
	worldStr += "\\n";
	/* FLAGS */
	for (f in flags) {
		worldStr += "! " + f + " " + flags[f] + "\\n";
	}
	worldStr += "\\n"
	/* FONT */
	if (fontName != defaultFontName) {
		worldStr += "DEFAULT_FONT " + fontName + "\\n";
		worldStr += "\\n"
	}
	/* PALETTE */
	for (id in palette) {
		worldStr += "PAL " + id + "\\n";
		if( palette[id].name != null )
			worldStr += "NAME " + palette[id].name + "\\n";
		for (i in getPal(id)) {
			for (j in getPal(id)[i]) {
				worldStr += getPal(id)[i][j];
				if (j < 2) worldStr += ",";
			}
			worldStr += "\\n";
		}
		worldStr += "\\n";
	}
	/* ROOM */
	for (id in room) {
		worldStr += "ROOM " + id + "\\n";
		if ( flags.ROOM_FORMAT == 0 ) {
			// old non-comma separated format
			for (i in room[id].tilemap) {
				for (j in room[id].tilemap[i]) {
					worldStr += room[id].tilemap[i][j];
				}
				worldStr += "\\n";
			}
		}
		else if ( flags.ROOM_FORMAT == 1 ) {
			// new comma separated format
			for (i in room[id].tilemap) {
				for (j in room[id].tilemap[i]) {
					worldStr += room[id].tilemap[i][j];
					if (j < room[id].tilemap[i].length-1) worldStr += ","
				}
				worldStr += "\\n";
			}
		}
		if (room[id].name != null) {
			/* NAME */
			worldStr += "NAME " + room[id].name + "\\n";
		}
		if (room[id].walls.length > 0) {
			/* WALLS */
			worldStr += "WAL ";
			for (j in room[id].walls) {
				worldStr += room[id].walls[j];
				if (j < room[id].walls.length-1) {
					worldStr += ",";
				}
			}
			worldStr += "\\n";
		}
		if (room[id].items.length > 0) {
			/* ITEMS */
			for (j in room[id].items) {
				var itm = room[id].items[j];
				worldStr += "ITM " + itm.id + " " + itm.x + "," + itm.y;
				worldStr += "\\n";
			}
		}
		if (room[id].exits.length > 0) {
			/* EXITS */
			for (j in room[id].exits) {
				var e = room[id].exits[j];
				if ( isExitValid(e) ) {
					worldStr += "EXT " + e.x + "," + e.y + " " + e.dest.room + " " + e.dest.x + "," + e.dest.y;
					worldStr += "\\n";
				}
			}
		}
		if (room[id].endings.length > 0) {
			/* ENDINGS */
			for (j in room[id].endings) {
				var e = room[id].endings[j];
				// todo isEndingValid
				worldStr += "END " + e.id + " " + e.x + "," + e.y;
				worldStr += "\\n";
			}
		}
		if (room[id].pal != null) {
			/* PALETTE */
			worldStr += "PAL " + room[id].pal + "\\n";
		}
		worldStr += "\\n";
	}
	/* TILES */
	for (id in tile) {
		worldStr += "TIL " + id + "\\n";
		worldStr += serializeDrawing( "TIL_" + id );
		if (tile[id].name != null && tile[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + tile[id].name + "\\n";
		}
		if (tile[id].isWall != null && tile[id].isWall != undefined) {
			/* WALL */
			worldStr += "WAL " + tile[id].isWall + "\\n";
		}
		if (tile[id].col != null && tile[id].col != undefined && tile[id].col != 1) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + tile[id].col + "\\n";
		}
		worldStr += "\\n";
	}
	/* SPRITES */
	for (id in sprite) {
		worldStr += "SPR " + id + "\\n";
		worldStr += serializeDrawing( "SPR_" + id );
		if (sprite[id].name != null && sprite[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + sprite[id].name + "\\n";
		}
		if (sprite[id].dlg != null) {
			worldStr += "DLG " + sprite[id].dlg + "\\n";
		}
		if (sprite[id].room != null) {
			/* SPRITE POSITION */
			worldStr += "POS " + sprite[id].room + " " + sprite[id].x + "," + sprite[id].y + "\\n";
		}
		if (sprite[id].inventory != null) {
			for(itemId in sprite[id].inventory) {
				worldStr += "ITM " + itemId + " " + sprite[id].inventory[itemId] + "\\n";
			}
		}
		if (sprite[id].col != null && sprite[id].col != undefined && sprite[id].col != 2) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + sprite[id].col + "\\n";
		}
		worldStr += "\\n";
	}
	/* ITEMS */
	for (id in item) {
		worldStr += "ITM " + id + "\\n";
		worldStr += serializeDrawing( "ITM_" + id );
		if (item[id].name != null && item[id].name != undefined) {
			/* NAME */
			worldStr += "NAME " + item[id].name + "\\n";
		}
		if (item[id].dlg != null) {
			worldStr += "DLG " + item[id].dlg + "\\n";
		}
		if (item[id].col != null && item[id].col != undefined && item[id].col != 2) {
			/* COLOR OVERRIDE */
			worldStr += "COL " + item[id].col + "\\n";
		}
		worldStr += "\\n";
	}
	/* DIALOG */
	for (id in dialog) {
		worldStr += "DLG " + id + "\\n";
		worldStr += dialog[id] + "\\n";
		worldStr += "\\n";
	}
	/* ENDINGS */
	for (id in ending) {
		worldStr += "END " + id + "\\n";
		worldStr += ending[id] + "\\n";
		worldStr += "\\n";
	}
	/* VARIABLES */
	for (id in variable) {
		worldStr += "VAR " + id + "\\n";
		worldStr += variable[id] + "\\n";
		worldStr += "\\n";
	}
	/* FONT */
	// TODO : support multiple fonts
	if (fontName != defaultFontName && !skipFonts) {
		worldStr += fontManager.GetData(fontName);
	}

	return worldStr;
}

function serializeDrawing(drwId) {
	var drwStr = "";
	for (f in imageStore.source[drwId]) {
		for (y in imageStore.source[drwId][f]) {
			var rowStr = "";
			for (x in imageStore.source[drwId][f][y]) {
				rowStr += imageStore.source[drwId][f][y][x];
			}
			drwStr += rowStr + "\\n";
		}
		if (f < (imageStore.source[drwId].length-1)) drwStr += ">\\n";
	}
	return drwStr;
}

function isExitValid(e) {
	var hasValidStartPos = e.x >= 0 && e.x < 16 && e.y >= 0 && e.y < 16;
	var hasDest = e.dest != null;
	var hasValidRoomDest = (e.dest.room != null && e.dest.x >= 0 && e.dest.x < 16 && e.dest.y >= 0 && e.dest.y < 16);
	return hasValidStartPos && hasDest && hasValidRoomDest;
}

function placeSprites() {
	for (id in spriteStartLocations) {
		//console.log(id);
		//console.log( spriteStartLocations[id] );
		//console.log(sprite[id]);
		sprite[id].room = spriteStartLocations[id].room;
		sprite[id].x = spriteStartLocations[id].x;
		sprite[id].y = spriteStartLocations[id].y;
		//console.log(sprite[id]);
	}
}

/* ARGUMENT GETTERS */
function getType(line) {
	return getArg(line,0);
}

function getId(line) {
	return getArg(line,1);
}

function getArg(line,arg) {
	return line.split(" ")[arg];
}

function getCoord(line,arg) {
	return getArg(line,arg).split(",");
}

function parseTitle(lines, i) {
	title = lines[i];
	i++;
	return i;
}

function parseRoom(lines, i) {
	var id = getId(lines[i]);
	room[id] = {
		id : id,
		tilemap : [],
		walls : [],
		exits : [],
		endings : [],
		items : [],
		pal : null,
		name : null
	};
	i++;

	// create tile map
	if ( flags.ROOM_FORMAT == 0 ) {
		// old way: no commas, single char tile ids
		var end = i + mapsize;
		var y = 0;
		for (; i<end; i++) {
			room[id].tilemap.push( [] );
			for (x = 0; x<mapsize; x++) {
				room[id].tilemap[y].push( lines[i].charAt(x) );
			}
			y++;
		}
	}
	else if ( flags.ROOM_FORMAT == 1 ) {
		// new way: comma separated, multiple char tile ids
		var end = i + mapsize;
		var y = 0;
		for (; i<end; i++) {
			room[id].tilemap.push( [] );
			var lineSep = lines[i].split(",");
			for (x = 0; x<mapsize; x++) {
				room[id].tilemap[y].push( lineSep[x] );
			}
			y++;
		}
	}

	while (i < lines.length && lines[i].length > 0) { //look for empty line
		// console.log(getType(lines[i]));
		if (getType(lines[i]) === "SPR") {
			/* NOTE SPRITE START LOCATIONS */
			var sprId = getId(lines[i]);
			if (sprId.indexOf(",") == -1 && lines[i].split(" ").length >= 3) { //second conditional checks for coords
				/* PLACE A SINGLE SPRITE */
				var sprCoord = lines[i].split(" ")[2].split(",");
				spriteStartLocations[sprId] = {
					room : id,
					x : parseInt(sprCoord[0]),
					y : parseInt(sprCoord[1])
				};
			}
			else if ( flags.ROOM_FORMAT == 0 ) { // TODO: right now this shortcut only works w/ the old comma separate format
				/* PLACE MULTIPLE SPRITES*/
				//Does find and replace in the tilemap (may be hacky, but its convenient)
				var sprList = sprId.split(",");
				for (row in room[id].tilemap) {
					for (s in sprList) {
						var col = room[id].tilemap[row].indexOf( sprList[s] );
						//if the sprite is in this row, replace it with the "null tile" and set its starting position
						if (col != -1) {
							room[id].tilemap[row][col] = "0";
							spriteStartLocations[ sprList[s] ] = {
								room : id,
								x : parseInt(col),
								y : parseInt(row)
							};
						}
					}
				}
			}
		}
		else if (getType(lines[i]) === "ITM") {
			var itmId = getId(lines[i]);
			var itmCoord = lines[i].split(" ")[2].split(",");
			var itm = {
				id: itmId,
				x : parseInt(itmCoord[0]),
				y : parseInt(itmCoord[1])
			};
			room[id].items.push( itm );
		}
		else if (getType(lines[i]) === "WAL") {
			/* DEFINE COLLISIONS (WALLS) */
			room[id].walls = getId(lines[i]).split(",");
		}
		else if (getType(lines[i]) === "EXT") {
			/* ADD EXIT */
			var exitArgs = lines[i].split(" ");
			//arg format: EXT 10,5 M 3,2 [AVA:7 LCK:a,9] [AVA 7 LCK a 9]
			var exitCoords = exitArgs[1].split(",");
			var destName = exitArgs[2];
			var destCoords = exitArgs[3].split(",");
			var ext = {
				x : parseInt(exitCoords[0]),
				y : parseInt(exitCoords[1]),
				dest : {
					room : destName,
					x : parseInt(destCoords[0]),
					y : parseInt(destCoords[1])
				}
			};
			room[id].exits.push(ext);
		}
		else if (getType(lines[i]) === "END") {
			/* ADD ENDING */
			var endId = getId( lines[i] );
			var endCoords = getCoord( lines[i], 2 );
			var end = {
				id : endId,
				x : parseInt( endCoords[0] ),
				y : parseInt( endCoords[1] )
			};
			room[id].endings.push(end);
		}
		else if (getType(lines[i]) === "PAL") {
			/* CHOOSE PALETTE (that's not default) */
			room[id].pal = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			var name = lines[i].split(/\\s(.+)/)[1];
			room[id].name = name;
			names.room.set( name, id);
		}
		i++;
	}
	return i;
}

function parsePalette(lines,i) { //todo this has to go first right now :(
	var id = getId(lines[i]);
	i++;
	var colors = [];
	var name = null;
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		var args = lines[i].split(" ");
		if(args[0] === "NAME") {
			name = lines[i].split(/\\s(.+)/)[1];
		}
		else {
			var col = [];
			lines[i].split(",").forEach(function(i) {
				col.push(parseInt(i));
			});
			colors.push(col);
		}
		i++;
	}
	palette[id] = {
		name : name,
		colors : colors
	};
	return i;
}

function parseTile(lines, i) {
	var id = getId(lines[i]);
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store tile source
		drwId = "TIL_" + id;
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 1; // default palette color index is 1
	var isWall = null; // null indicates it can vary from room to room (original version)
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			colorIndex = parseInt( getId(lines[i]) );
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.tile.set( name, id );
		}
		else if (getType(lines[i]) === "WAL") {
			var wallArg = getArg( lines[i], 1 );
			if( wallArg === "true" ) {
				isWall = true;
			}
			else if( wallArg === "false" ) {
				isWall = false;
			}
		}
		i++;
	}

	//tile data
	tile[id] = {
		drw : drwId, //drawing id
		col : colorIndex,
		animation : {
			isAnimated : (imageStore.source[drwId].length > 1),
			frameIndex : 0,
			frameCount : imageStore.source[drwId].length
		},
		name : name,
		isWall : isWall
	};

	return i;
}

function parseSprite(lines, i) {
	var id = getId(lines[i]);
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store sprite source
		drwId = "SPR_" + id;
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 2; //default palette color index is 2
	var dialogId = null;
	var startingInventory = {};
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			colorIndex = parseInt( getId(lines[i]) );
		}
		else if (getType(lines[i]) === "POS") {
			/* STARTING POSITION */
			var posArgs = lines[i].split(" ");
			var roomId = posArgs[1];
			var coordArgs = posArgs[2].split(",");
			spriteStartLocations[id] = {
				room : roomId,
				x : parseInt(coordArgs[0]),
				y : parseInt(coordArgs[1])
			};
		}
		else if(getType(lines[i]) === "DLG") {
			dialogId = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.sprite.set( name, id );
		}
		else if (getType(lines[i]) === "ITM") {
			/* ITEM STARTING INVENTORY */
			var itemId = getId(lines[i]);
			var itemCount = parseFloat( getArg(lines[i], 2) );
			startingInventory[itemId] = itemCount;
		}
		i++;
	}

	//sprite data
	sprite[id] = {
		drw : drwId, //drawing id
		col : colorIndex,
		dlg : dialogId,
		room : null, //default location is "offstage"
		x : -1,
		y : -1,
		walkingPath : [], //tile by tile movement path (isn't saved)
		animation : {
			isAnimated : (imageStore.source[drwId].length > 1),
			frameIndex : 0,
			frameCount : imageStore.source[drwId].length
		},
		inventory : startingInventory,
		name : name
	};
	return i;
}

function parseItem(lines, i) {
	var id = getId(lines[i]);
	var drwId = null;
	var name = null;

	i++;

	if (getType(lines[i]) === "DRW") { //load existing drawing
		drwId = getId(lines[i]);
		i++;
	}
	else {
		// store item source
		drwId = "ITM_" + id; // these prefixes are maybe a terrible way to differentiate drawing tyepes :/
		i = parseDrawingCore( lines, i, drwId );
	}

	//other properties
	var colorIndex = 2; //default palette color index is 2
	var dialogId = null;
	while (i < lines.length && lines[i].length > 0) { //look for empty line
		if (getType(lines[i]) === "COL") {
			/* COLOR OFFSET INDEX */
			colorIndex = parseInt( getArg( lines[i], 1 ) );
		}
		// else if (getType(lines[i]) === "POS") {
		// 	/* STARTING POSITION */
		// 	var posArgs = lines[i].split(" ");
		// 	var roomId = posArgs[1];
		// 	var coordArgs = posArgs[2].split(",");
		// 	spriteStartLocations[id] = {
		// 		room : roomId,
		// 		x : parseInt(coordArgs[0]),
		// 		y : parseInt(coordArgs[1])
		// 	};
		// }
		else if(getType(lines[i]) === "DLG") {
			dialogId = getId(lines[i]);
		}
		else if (getType(lines[i]) === "NAME") {
			/* NAME */
			name = lines[i].split(/\\s(.+)/)[1];
			names.item.set( name, id );
		}
		i++;
	}

	//item data
	item[id] = {
		drw : drwId, //drawing id
		col : colorIndex,
		dlg : dialogId,
		// room : null, //default location is "offstage"
		// x : -1,
		// y : -1,
		animation : {
			isAnimated : (imageStore.source[drwId].length > 1),
			frameIndex : 0,
			frameCount : imageStore.source[drwId].length
		},
		name : name
	};

	// console.log("ITM " + id);
	// console.log(item[id]);

	return i;
}

function parseDrawing(lines, i) {
	// store drawing source
	var drwId = getId( lines[i] );
	return parseDrawingCore( lines, i, drwId );
}

function parseDrawingCore(lines, i, drwId) {
	imageStore.source[drwId] = []; //init list of frames
	imageStore.source[drwId].push( [] ); //init first frame
	var frameIndex = 0;
	var y = 0;
	while ( y < tilesize ) {
		var l = lines[i+y];
		var row = [];
		for (x = 0; x < tilesize; x++) {
			row.push( parseInt( l.charAt(x) ) );
		}
		imageStore.source[drwId][frameIndex].push( row );
		y++;

		if (y === tilesize) {
			i = i + y;
			if ( lines[i] != undefined && lines[i].charAt(0) === ">" ) {
				// start next frame!
				imageStore.source[drwId].push( [] );
				frameIndex++;
				//start the count over again for the next frame
				i++;
				y = 0;
			}
		}
	}

	//console.log(imageStore.source[drwId]);
	return i;
}

function renderImages() {
	// console.log(" -- RENDER IMAGES -- ");

	//init image store
	for (pal in palette) {
		imageStore.render[pal] = {
			"1" : {}, //images with primary color index 1 (usually tiles)
			"2" : {}  //images with primary color index 2 (usually sprites)
		};
	}

	//render images required by sprites
	for (s in sprite) {
		var spr = sprite[s];
		renderImageForAllPalettes( spr );
	}
	//render images required by tiles
	for (t in tile) {
		var til = tile[t];
		renderImageForAllPalettes( til );
	}
	//render images required by tiles
	for (i in item) {
		var itm = item[i];
		renderImageForAllPalettes( itm );
	}
}

function renderImageForAllPalettes(drawing) {
	// console.log("RENDER IMAGE");
	for (pal in palette) {
		// console.log(pal);

		var col = drawing.col;
		var colStr = "" + col;

		// slightly hacky initialization of image store for palettes with more than 3 colors ~~~ SECRET FEATURE DO NOT USE :P ~~~
		if(imageStore.render[pal][colStr] === undefined || imageStore.render[pal][colStr] === null) {
			// console.log("UNDEFINED " + colStr);
			imageStore.render[pal][colStr] = {};
		}

		// console.log(drawing);
		// console.log(drawing.drw);
		// console.log(imageStore);

		var imgSrc = imageStore.source[ drawing.drw ];

		if ( imgSrc.length <= 1 ) {
			// non-animated drawing
			var frameSrc = imgSrc[0];
			// console.log(drawing);
			// console.log(imageStore);
			imageStore.render[pal][colStr][drawing.drw] = imageDataFromImageSource( frameSrc, pal, col );
		}
		else {
			// animated drawing
			var frameCount = 0;
			for (f in imgSrc) {
				var frameSrc = imgSrc[f];
				var frameId = drawing.drw + "_" + frameCount;
				imageStore.render[pal][colStr][frameId] = imageDataFromImageSource( frameSrc, pal, col );
				frameCount++;
			}
		}
	}
}

function imageDataFromImageSource(imageSource, pal, col) {
	//console.log(imageSource);

	var img = ctx.createImageData(tilesize*scale,tilesize*scale);
	for (var y = 0; y < tilesize; y++) {
		for (var x = 0; x < tilesize; x++) {
			var px = imageSource[y][x];
			for (var sy = 0; sy < scale; sy++) {
				for (var sx = 0; sx < scale; sx++) {
					var pxl = (((y * scale) + sy) * tilesize * scale * 4) + (((x*scale) + sx) * 4);
					if ( px === 1 && getPal(pal).length > col ) {
						img.data[pxl + 0] = getPal(pal)[col][0]; //ugly
						img.data[pxl + 1] = getPal(pal)[col][1];
						img.data[pxl + 2] = getPal(pal)[col][2];
						img.data[pxl + 3] = 255;
					}
					else { //ch === 0
						img.data[pxl + 0] = getPal(pal)[0][0];
						img.data[pxl + 1] = getPal(pal)[0][1];
						img.data[pxl + 2] = getPal(pal)[0][2];
						img.data[pxl + 3] = 255;
					}
				}
			}
		}
	}
	return img;
}

function parseDialog(lines, i) {
	var id = getId(lines[i]);
	i++;

	// TODO : use this for titles & endings too
	var results = scriptInterpreter.ReadDialogScript(lines,i);
	dialog[id] = results.script;
	i = results.index;

	return i;
}

function parseEnding(lines, i) {
	var id = getId(lines[i]);
	i++;
	var text = lines[i];
	i++;
	ending[id] = text;
	return i;
}

function parseVariable(lines, i) {
	var id = getId(lines[i]);
	i++;
	var value = lines[i];
	i++;
	variable[id] = value;
	return i;
}

function parseFontName(lines, i) {
	fontName = getArg(lines[i], 1);
	i++;
	return i;
}

function parseFontData(lines, i) {
	// NOTE : we're not doing the actual parsing here --
	// just grabbing the block of text that represents the font
	// and giving it to the font manager to use later

	var localFontName = getId(lines[i]);
	var localFontData = lines[i];
	i++;

	while (i < lines.length && lines[i] != "") {
		localFontData += "\\n" + lines[i];
		i++;
	}

	var localFontFilename = localFontName + fontManager.GetExtension();
	fontManager.AddResource( localFontFilename, localFontData );

	return i;
}

function parseFlag(lines, i) {
	var id = getId(lines[i]);
	var valStr = lines[i].split(" ")[2];
	flags[id] = parseInt( valStr );
	i++;
	return i;
}

function drawTile(img,x,y,context) {
	if (!context) { //optional pass in context; otherwise, use default
		context = ctx;
	}
	context.putImageData(img,x*tilesize*scale,y*tilesize*scale);
}

function drawSprite(img,x,y,context) { //this may differ later (or not haha)
	drawTile(img,x,y,context);
}

function drawItem(img,x,y,context) {
	drawTile(img,x,y,context); //TODO these methods are dumb and repetitive
}

function drawRoom(room,context,frameIndex) { // context & frameIndex are optional
	if (!context) { //optional pass in context; otherwise, use default (ok this is REAL hacky isn't it)
		context = ctx;
	}

	//clear screen
	context.fillStyle = "rgb(" + getPal(curPal())[0][0] + "," + getPal(curPal())[0][1] + "," + getPal(curPal())[0][2] + ")";
	context.fillRect(0,0,canvas.width,canvas.height);

	//draw tiles
	for (i in room.tilemap) {
		for (j in room.tilemap[i]) {
			var id = room.tilemap[i][j];
			if (id != "0") {
				//console.log(id);
				if (tile[id] == null) { // hack-around to avoid corrupting files (not a solution though!)
					id = "0";
					room.tilemap[i][j] = id;
				}
				else {
					// console.log(id);
					drawTile( getTileImage(tile[id],getRoomPal(room.id),frameIndex), j, i, context );
				}
			}
		}
	}

	//draw items
	for (var i = 0; i < room.items.length; i++) {
		var itm = room.items[i];
		drawItem( getItemImage(item[itm.id],getRoomPal(room.id),frameIndex), itm.x, itm.y, context );
	}

	//draw sprites
	for (id in sprite) {
		var spr = sprite[id];
		if (spr.room === room.id) {
			drawSprite( getSpriteImage(spr,getRoomPal(room.id),frameIndex), spr.x, spr.y, context );
		}
	}
}

function getTileImage(t,palId,frameIndex) {
	if( frameIndex === undefined ) frameIndex = null; // no default parameter support on iOS

	var drwId = t.drw;

	if (!palId) palId = curPal(); // TODO : will this break on iOS?

	if ( t.animation.isAnimated ) {
		if (frameIndex != null) { // use optional provided frame index
			// console.log("GET TILE " + frameIndex);
			drwId += "_" + frameIndex;
		}
		else { // or the one bundled with the tile
			drwId += "_" + t.animation.frameIndex;
		}
	}
	return imageStore.render[ palId ][ t.col ][ drwId ];
}

function getSpriteImage(s,palId,frameIndex) {
	if( frameIndex === undefined ) frameIndex = null; // no default parameter support on iOS

	var drwId = s.drw;

	if (!palId) palId = curPal();

	if ( s.animation.isAnimated ) {
		if (frameIndex != null) {
			drwId += "_" + frameIndex;
		}
		else {
			drwId += "_" + s.animation.frameIndex;
		}
	}

	return imageStore.render[ palId ][ s.col ][ drwId ];
}

function getItemImage(itm,palId,frameIndex) { //aren't these all the same????
	if( frameIndex === undefined ) frameIndex = null; // no default parameter support on iOS

	var drwId = itm.drw;
	// console.log(drwId);

	if (!palId) palId = curPal();

	if ( itm.animation.isAnimated ) {
		if (frameIndex != null) {
			drwId += "_" + frameIndex;
		}
		else {
			drwId += "_" + itm.animation.frameIndex;
		}
	}

	// console.log(imageStore.render[ palId ][ itm.col ]);
	// console.log(imageStore.render[ palId ][ itm.col ][ drwId ]);
	return imageStore.render[ palId ][ itm.col ][ drwId ];
}

function curPal() {
	return getRoomPal(curRoom);
}

function getRoomPal(roomId) {
	if (room[roomId].pal != null) {
		//a specific palette was chosen
		return room[roomId].pal;
	}
	else {
		if (roomId in palette) {
			//there is a palette matching the name of the room
			return roomId;
		}
		else {
			//use the default palette
			return "0";
		}
	}
	return "0";
}

var isDialogMode = false;
var isNarrating = false;
var isEnding = false;
var dialogModule = new Dialog();
var dialogRenderer = dialogModule.CreateRenderer();
var dialogBuffer = dialogModule.CreateBuffer();
var fontManager = new FontManager();

function onExitDialog() {
	// var breakShit = null;
	// breakShit();
	console.log("EXIT DIALOG");
	isDialogMode = false;
	if (isNarrating) isNarrating = false;
	if (isDialogPreview) {
		isDialogPreview = false;
		if (onDialogPreviewEnd != null)
			onDialogPreviewEnd();
	}
}

/*
TODO
- titles and endings should also take advantage of the script pre-compilation if possible??
- could there be a namespace collision?
- what about dialog NAMEs vs IDs?
- what about a special script block separate from DLG?
*/
function startNarrating(dialogStr,end) {
	console.log("NARRATE " + dialogStr);

	if(end === undefined) end = false;

	isNarrating = true;
	isEnding = end;
	startDialog(dialogStr);
}

function startItemDialog(itemId) {
	var dialogId = item[itemId].dlg;
	// console.log("START ITEM DIALOG " + dialogId);
	if(dialog[dialogId]){
		var dialogStr = dialog[dialogId];
		startDialog(dialogStr,dialogId);
	}
}

function startSpriteDialog(spriteId) {
	var spr = sprite[spriteId];
	var dialogId = spr.dlg ? spr.dlg : spriteId;
	// console.log("START SPRITE DIALOG " + dialogId);
	if(dialog[dialogId]){
		var dialogStr = dialog[dialogId];
		startDialog(dialogStr,dialogId);
	}
}

function startDialog(dialogStr,scriptId) {
	console.log("START DIALOG ");
	console.log(dialogStr);

	if(dialogStr.length <= 0) {
		console.log("ON EXIT DIALOG -- startDialog 1");
		onExitDialog();
		return;
	}

	isDialogMode = true;

	dialogRenderer.Reset();
	dialogRenderer.SetCentered( isNarrating /*centered*/ );
	dialogBuffer.Reset();
	scriptInterpreter.SetDialogBuffer( dialogBuffer );

	var onScriptEnd = function() {
		if(!dialogBuffer.IsActive()){
			console.log("ON EXIT DIALOG -- startDialog 2");
			onExitDialog();
		}
	};

	if(scriptId === undefined) {
		scriptInterpreter.Interpret( dialogStr, onScriptEnd );
	}
	else {
		if( !scriptInterpreter.HasScript(scriptId) )
			scriptInterpreter.Compile( scriptId, dialogStr );
		scriptInterpreter.Run( scriptId, onScriptEnd );
	}

}

var isDialogPreview = false;
function startPreviewDialog(script, onScriptEnd) {
	isNarrating = true;

	isDialogMode = true;

	isDialogPreview = true;

	dialogRenderer.Reset();
	dialogRenderer.SetCentered( true );
	dialogBuffer.Reset();
	scriptInterpreter.SetDialogBuffer( dialogBuffer );

	onDialogPreviewEnd = onScriptEnd;

	scriptInterpreter.Eval( script, null );
}

/* NEW SCRIPT STUFF */
var scriptModule = new Script();
var scriptInterpreter = scriptModule.CreateInterpreter();
var scriptUtils = scriptModule.CreateUtils(); // TODO: move to editor.js?
// scriptInterpreter.SetDialogBuffer( dialogBuffer );

<\/script>

<!-- store default font in separate script tag for back compat-->
<!-- Borksy modification: uses better encoded default font. -->
<script type="bitsyFontData" id="ascii_small">
FONT ascii_small
SIZE 6 8
CHAR 0
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 32
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 33
000100
001110
001110
000100
000100
000000
000100
000000
CHAR 34
011011
011011
010010
000000
000000
000000
000000
000000
CHAR 35
000000
001010
011111
001010
001010
011111
001010
000000
CHAR 36
001000
001110
010000
001100
000010
011100
000100
000000
CHAR 37
011001
011001
000010
000100
001000
010011
010011
000000
CHAR 38
001000
010100
010100
001000
010101
010010
001101
000000
CHAR 39
001100
001100
001000
000000
000000
000000
000000
000000
CHAR 40
000100
001000
001000
001000
001000
001000
000100
000000
CHAR 41
001000
000100
000100
000100
000100
000100
001000
000000
CHAR 42
000000
001010
001110
011111
001110
001010
000000
000000
CHAR 43
000000
000100
000100
011111
000100
000100
000000
000000
CHAR 44
000000
000000
000000
000000
000000
001100
001100
001000
CHAR 45
000000
000000
000000
011111
000000
000000
000000
000000
CHAR 46
000000
000000
000000
000000
000000
001100
001100
000000
CHAR 47
000000
000001
000010
000100
001000
010000
000000
000000
CHAR 48
001110
010001
010011
010101
011001
010001
001110
000000
CHAR 49
000100
001100
000100
000100
000100
000100
001110
000000
CHAR 50
001110
010001
000001
000110
001000
010000
011111
000000
CHAR 51
001110
010001
000001
001110
000001
010001
001110
000000
CHAR 52
000010
000110
001010
010010
011111
000010
000010
000000
CHAR 53
011111
010000
010000
011110
000001
010001
001110
000000
CHAR 54
000110
001000
010000
011110
010001
010001
001110
000000
CHAR 55
011111
000001
000010
000100
001000
001000
001000
000000
CHAR 56
001110
010001
010001
001110
010001
010001
001110
000000
CHAR 57
001110
010001
010001
001111
000001
000010
001100
000000
CHAR 58
000000
000000
001100
001100
000000
001100
001100
000000
CHAR 59
000000
000000
001100
001100
000000
001100
001100
001000
CHAR 60
000010
000100
001000
010000
001000
000100
000010
000000
CHAR 61
000000
000000
011111
000000
000000
011111
000000
000000
CHAR 62
001000
000100
000010
000001
000010
000100
001000
000000
CHAR 63
001110
010001
000001
000110
000100
000000
000100
000000
CHAR 64
001110
010001
010111
010101
010111
010000
001110
000000
CHAR 65
001110
010001
010001
010001
011111
010001
010001
000000
CHAR 66
011110
010001
010001
011110
010001
010001
011110
000000
CHAR 67
001110
010001
010000
010000
010000
010001
001110
000000
CHAR 68
011110
010001
010001
010001
010001
010001
011110
000000
CHAR 69
011111
010000
010000
011110
010000
010000
011111
000000
CHAR 70
011111
010000
010000
011110
010000
010000
010000
000000
CHAR 71
001110
010001
010000
010111
010001
010001
001111
000000
CHAR 72
010001
010001
010001
011111
010001
010001
010001
000000
CHAR 73
001110
000100
000100
000100
000100
000100
001110
000000
CHAR 74
000001
000001
000001
000001
010001
010001
001110
000000
CHAR 75
010001
010010
010100
011000
010100
010010
010001
000000
CHAR 76
010000
010000
010000
010000
010000
010000
011111
000000
CHAR 77
010001
011011
010101
010001
010001
010001
010001
000000
CHAR 78
010001
011001
010101
010011
010001
010001
010001
000000
CHAR 79
001110
010001
010001
010001
010001
010001
001110
000000
CHAR 80
011110
010001
010001
011110
010000
010000
010000
000000
CHAR 81
001110
010001
010001
010001
010101
010010
001101
000000
CHAR 82
011110
010001
010001
011110
010010
010001
010001
000000
CHAR 83
001110
010001
010000
001110
000001
010001
001110
000000
CHAR 84
011111
000100
000100
000100
000100
000100
000100
000000
CHAR 85
010001
010001
010001
010001
010001
010001
001110
000000
CHAR 86
010001
010001
010001
010001
010001
001010
000100
000000
CHAR 87
010001
010001
010101
010101
010101
010101
001010
000000
CHAR 88
010001
010001
001010
000100
001010
010001
010001
000000
CHAR 89
010001
010001
010001
001010
000100
000100
000100
000000
CHAR 90
011110
000010
000100
001000
010000
010000
011110
000000
CHAR 91
001110
001000
001000
001000
001000
001000
001110
000000
CHAR 92
000000
010000
001000
000100
000010
000001
000000
000000
CHAR 93
001110
000010
000010
000010
000010
000010
001110
000000
CHAR 94
000100
001010
010001
000000
000000
000000
000000
000000
CHAR 95
000000
000000
000000
000000
000000
000000
000000
111111
CHAR 96
001100
001100
000100
000000
000000
000000
000000
000000
CHAR 97
000000
000000
001110
000001
001111
010001
001111
000000
CHAR 98
010000
010000
011110
010001
010001
010001
011110
000000
CHAR 99
000000
000000
001110
010001
010000
010001
001110
000000
CHAR 100
000001
000001
001111
010001
010001
010001
001111
000000
CHAR 101
000000
000000
001110
010001
011110
010000
001110
000000
CHAR 102
000110
001000
001000
011110
001000
001000
001000
000000
CHAR 103
000000
000000
001111
010001
010001
001111
000001
001110
CHAR 104
010000
010000
011100
010010
010010
010010
010010
000000
CHAR 105
000100
000000
000100
000100
000100
000100
000110
000000
CHAR 106
000010
000000
000110
000010
000010
000010
010010
001100
CHAR 107
010000
010000
010010
010100
011000
010100
010010
000000
CHAR 108
000100
000100
000100
000100
000100
000100
000110
000000
CHAR 109
000000
000000
011010
010101
010101
010001
010001
000000
CHAR 110
000000
000000
011100
010010
010010
010010
010010
000000
CHAR 111
000000
000000
001110
010001
010001
010001
001110
000000
CHAR 112
000000
000000
011110
010001
010001
010001
011110
010000
CHAR 113
000000
000000
001111
010001
010001
010001
001111
000001
CHAR 114
000000
000000
010110
001001
001000
001000
011100
000000
CHAR 115
000000
000000
001110
010000
001110
000001
001110
000000
CHAR 116
000000
001000
011110
001000
001000
001010
000100
000000
CHAR 117
000000
000000
010010
010010
010010
010110
001010
000000
CHAR 118
000000
000000
010001
010001
010001
001010
000100
000000
CHAR 119
000000
000000
010001
010001
010101
011111
001010
000000
CHAR 120
000000
000000
010010
010010
001100
010010
010010
000000
CHAR 121
000000
000000
010010
010010
010010
001110
000100
011000
CHAR 122
000000
000000
011110
000010
001100
010000
011110
000000
CHAR 123
000110
001000
001000
011000
001000
001000
000110
000000
CHAR 124
000100
000100
000100
000100
000100
000100
000100
000100
CHAR 125
001100
000010
000010
000011
000010
000010
001100
000000
CHAR 126
000000
000000
000000
001010
010100
000000
000000
000000
CHAR 160
000000
000000
000000
000000
000000
000000
000000
000000
CHAR 161
000100
000000
000100
000100
001110
001110
000100
000000
CHAR 162
000000
000100
001110
010000
010000
001110
000100
000000
CHAR 163
000110
001001
001000
011110
001000
001001
010111
000000
CHAR 165
010001
001010
000100
011111
000100
011111
000100
000000
CHAR 167
001110
010001
001100
001010
000110
010001
001110
000000
CHAR 171
000000
000000
001001
010010
001001
000000
000000
000000
CHAR 172
000000
000000
111111
000001
000001
000000
000000
000000
CHAR 177
000000
000100
001110
000100
000000
001110
000000
000000
CHAR 178
011000
000100
001000
011100
000000
000000
000000
000000
CHAR 181
000000
000000
010010
010010
010010
011100
010000
010000
CHAR 182
001111
010101
010101
001101
000101
000101
000101
000000
CHAR 187
000000
000000
010010
001001
010010
000000
000000
000000
CHAR 188
010000
010010
010100
001011
010101
000111
000001
000000
CHAR 189
010000
010010
010100
001110
010001
000010
000111
000000
CHAR 191
000100
000000
000100
001100
010000
010001
001110
000000
CHAR 196
001010
000000
000100
001010
010001
011111
010001
000000
CHAR 197
001110
001010
001110
011011
010001
011111
010001
000000
CHAR 198
001111
010100
010100
011111
010100
010100
010111
000000
CHAR 199
001110
010001
010000
010000
010001
001110
000100
001100
CHAR 201
000011
000000
011111
010000
011110
010000
011111
000000
CHAR 209
001010
010100
000000
010010
011010
010110
010010
000000
CHAR 214
010010
001100
010010
010010
010010
010010
001100
000000
CHAR 220
001010
000000
010010
010010
010010
010010
001100
000000
CHAR 223
000000
011100
010010
011100
010010
010010
011100
010000
CHAR 224
001100
000000
001110
000001
001111
010001
001111
000000
CHAR 225
000110
000000
001110
000001
001111
010001
001111
000000
CHAR 226
001110
000000
001110
000001
001111
010001
001111
000000
CHAR 228
001010
000000
001110
000001
001111
010001
001111
000000
CHAR 229
001110
001010
001110
000001
001111
010001
001111
000000
CHAR 230
000000
000000
011110
000101
011111
010100
001111
000000
CHAR 231
000000
001110
010001
010000
010001
001110
000100
001100
CHAR 232
001100
000000
001110
010001
011110
010000
001110
000000
CHAR 233
000011
000000
001110
010001
011110
010000
001110
000000
CHAR 234
001110
000000
001110
010001
011110
010000
001110
000000
CHAR 235
001010
000000
001110
010001
011110
010000
001110
000000
CHAR 236
001000
000000
000100
000100
000100
000100
000110
000000
CHAR 237
000110
000000
000100
000100
000100
000100
000110
000000
CHAR 238
000100
001010
000000
000100
000100
000100
000110
000000
CHAR 239
001010
000000
000100
000100
000100
000100
000110
000000
CHAR 241
001010
010100
000000
011100
010010
010010
010010
000000
CHAR 242
011000
000000
001100
010010
010010
010010
001100
000000
CHAR 243
000110
000000
001100
010010
010010
010010
001100
000000
CHAR 244
001110
000000
001100
010010
010010
010010
001100
000000
CHAR 246
001010
000000
001100
010010
010010
010010
001100
000000
CHAR 247
001010
000000
001110
010001
010001
010001
001110
000000
CHAR 249
011000
000000
010010
010010
010010
010110
001010
000000
CHAR 250
000110
000000
010010
010010
010010
010110
001010
000000
CHAR 251
001110
000000
010010
010010
010010
010110
001010
000000
CHAR 252
010010
000000
010010
010010
010010
010110
001010
000000
CHAR 255
001010
000000
010010
010010
010010
001110
000100
011000
CHAR 402
000010
000101
000100
001110
000100
000100
010100
001000
CHAR 915
011110
010010
010000
010000
010000
010000
010000
000000
CHAR 920
001100
010010
010010
011110
010010
010010
001100
000000
CHAR 931
011111
010000
001000
000100
001000
010000
011111
000000
CHAR 934
001110
000100
001110
010001
001110
000100
001110
000000
CHAR 937
000000
001110
010001
010001
001010
001010
011011
000000
CHAR 948
001100
010000
001000
000100
001110
010010
001100
000000
CHAR 949
000000
001110
010000
011110
010000
001110
000000
000000
CHAR 960
000000
011111
001010
001010
001010
001010
001010
000000
CHAR 963
000000
000000
001111
010010
010010
001100
000000
000000
CHAR 964
000000
000000
001010
010100
000100
000100
000100
000000
CHAR 966
000000
000100
001110
010101
010101
001110
000100
000000
CHAR 8226
000000
000000
000000
001100
001100
000000
000000
000000
CHAR 8252
001010
001010
001010
001010
001010
000000
001010
000000
CHAR 8592
000000
000100
001100
011111
001100
000100
000000
000000
CHAR 8593
000100
001110
011111
000100
000100
000100
000100
000000
CHAR 8594
000000
000100
000110
011111
000110
000100
000000
000000
CHAR 8595
000100
000100
000100
000100
011111
001110
000100
000000
CHAR 8734
000000
000000
001010
010101
010101
001010
000000
000000
CHAR 8735
000000
000000
000000
010000
010000
010000
011111
000000
CHAR 8801
000000
011110
000000
011110
000000
011110
000000
000000
CHAR 8804
000010
001100
010000
001100
000010
000000
011110
000000
CHAR 8805
010000
001100
000010
001100
010000
000000
011110
000000
CHAR 8962
000100
001110
011011
010001
010001
011111
000000
000000
CHAR 8976
000000
000000
011111
010000
010000
010000
000000
000000
CHAR 9472
000000
000000
000000
111111
000000
000000
000000
000000
CHAR 9474
000100
000100
000100
000100
000100
000100
000100
000100
CHAR 9488
000000
000000
000000
111100
000100
000100
000100
000100
CHAR 9492
000100
000100
000100
000111
000000
000000
000000
000000
CHAR 9500
000100
000100
000100
000111
000100
000100
000100
000100
CHAR 9508
000100
000100
000100
111100
000100
000100
000100
000100
CHAR 9516
000000
000000
000000
111111
000100
000100
000100
000100
CHAR 9524
000100
000100
000100
111111
000000
000000
000000
000000
CHAR 9532
000100
000100
000100
111111
000100
000100
000100
000100
CHAR 9552
000000
111111
000000
111111
000000
000000
000000
000000
CHAR 9553
010100
010100
010100
010100
010100
010100
010100
010100
CHAR 9556
000000
011111
010000
010111
010100
010100
010100
010100
CHAR 9557
000000
111100
000100
111100
000100
000100
000100
000100
CHAR 9558
000000
000000
000000
111100
010100
010100
010100
010100
CHAR 9559
000000
111100
000100
110100
010100
010100
010100
010100
CHAR 9561
010100
010100
010100
011111
000000
000000
000000
000000
CHAR 9562
010100
010111
010000
011111
000000
000000
000000
000000
CHAR 9563
000100
111100
000100
111100
000000
000000
000000
000000
CHAR 9564
010100
010100
010100
111100
000000
000000
000000
000000
CHAR 9565
010100
110100
000100
111100
000000
000000
000000
000000
CHAR 9566
000100
000111
000100
000111
000100
000100
000100
000100
CHAR 9567
010100
010100
010100
010111
010100
010100
010100
010100
CHAR 9568
010100
010111
010000
010111
010100
010100
010100
010100
CHAR 9569
000000
000000
010010
010010
010010
011100
010000
010000
CHAR 9570
010100
010100
010100
110100
010100
010100
010100
010100
CHAR 9571
010100
110100
000100
110100
010100
010100
010100
010100
CHAR 9572
000000
111111
000000
111111
000100
000100
000100
000100
CHAR 9573
000000
000000
000000
111111
010100
010100
010100
010100
CHAR 9574
000000
111111
000000
110111
010100
010100
010100
010100
CHAR 9575
000100
111111
000000
111111
000000
000000
000000
000000
CHAR 9576
010100
010100
010100
111111
000000
000000
000000
000000
CHAR 9577
010100
110111
000000
111111
000000
000000
000000
000000
CHAR 9580
010100
110111
000000
110111
010100
010100
010100
010100
CHAR 9601
000000
000000
000000
000000
000000
000000
000000
111111
CHAR 9602
000000
000000
000000
000000
000000
000000
111111
111111
CHAR 9603
000000
000000
000000
000000
000000
111111
111111
111111
CHAR 9604
000000
000000
000000
000000
111111
111111
111111
111111
CHAR 9605
000000
000000
000000
111111
111111
111111
111111
111111
CHAR 9606
000000
000000
111111
111111
111111
111111
111111
111111
CHAR 9607
000000
111111
111111
111111
111111
111111
111111
111111
CHAR 9608
111111
111111
111111
111111
111111
111111
111111
111111
CHAR 9609
111100
111100
111100
111100
111100
111100
111100
111100
CHAR 9610
111100
111100
111100
111100
111100
111100
111100
111100
CHAR 9611
111000
111000
111000
111000
111000
111000
111000
111000
CHAR 9613
110000
110000
110000
110000
110000
110000
110000
110000
CHAR 9615
100000
100000
100000
100000
100000
100000
100000
100000
CHAR 9617
010101
000000
101010
000000
010101
000000
101010
000000
CHAR 9618
010101
101010
010101
101010
010101
101010
010101
101010
CHAR 9619
101010
111111
010101
111111
101010
111111
010101
111111
CHAR 9644
000000
000000
000000
000000
000000
011110
011110
000000
CHAR 9650
000100
000100
001110
001110
011111
011111
000000
000000
CHAR 9658
001000
001100
001110
001111
001110
001100
001000
000000
CHAR 9660
011111
011111
001110
001110
000100
000100
000000
000000
CHAR 9668
000010
000110
001110
011110
001110
000110
000010
000000
CHAR 9675
000000
000000
011110
010010
010010
011110
000000
000000
CHAR 9688
111111
111111
111111
110011
110011
111111
111111
111111
CHAR 9689
111111
111111
100001
101101
101101
100001
111111
111111
CHAR 9786
001110
010001
011011
010001
010101
010001
001110
000000
CHAR 9787
001110
011111
010101
011111
010001
011111
001110
000000
CHAR 9788
000000
010101
001110
011011
001110
010101
000000
000000
CHAR 9792
001110
010001
010001
001110
000100
001110
000100
000000
CHAR 9794
000000
000111
000011
001101
010010
010010
001100
000000
CHAR 9824
000000
000100
001110
011111
011111
000100
001110
000000
CHAR 9827
000100
001110
001110
000100
011111
011111
000100
000000
CHAR 9829
000000
001010
011111
011111
011111
001110
000100
000000
CHAR 9830
000000
000100
001110
011111
011111
001110
000100
000000
CHAR 9834
000100
000110
000101
000100
001100
011100
011000
000000
CHAR 9835
000011
001101
001011
001101
001011
011011
011000
000000
<\/script>

<!-- BORKSY HACKS -->
<script type="text/javascript" id="borksyHacks">
{{{HACKS}}}
<\/script>

<script type="text/javascript" id="borksyAdditionalJS">
{{{ADDITIONALJS}}}
<\/script>

</head>


<!-- DOCUMENT BODY -->
<body onload='startExportedGame()'>
{{{MARKUP}}}
</body>


</html>
`;export{t as default};
