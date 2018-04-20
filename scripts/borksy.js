var loadedFiles ={};
var fonts = {
	"default" : "Default Bitsy Font by Adam LeDoux",
	"beeblebrox" : "Beeblebrox by AYolland",
	"blacksphinx" : "Blacksphinx by AYolland",
	"greengable" : "Greengable by AYolland",
	"hotcaps" : "Hotcaps by AYolland"
};
var hacks = [{
		name: "kitsy",
		title: "Kitsy",
		description: "Utilities needed for many hacks",
		author: "",
		readme: false,
		type: "simple",
		requiresKitsy: false,
		hidden: true
	},{
		name: "dynamic-background",
		title: "Dynamic Background Color",
		description: "Changes the color of the BODY tag to the background color of the current room.",
		author: "Sean S LeBlanc",
		readme: false,
		type: "simple",
		requiresKitsy: false,
		hidden: false
	},{
		name: "exit-from-dialog",
		title: "Exit From Dialog",
		description: "Adds (Exit) and (ExitNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requiresKitsy: true,
		hidden: false
	},{
		name: "end-from-dialog",
		title: "End From Dialog",
		description: "Adds (End) and (EndNow) to the the scripting language.",
		author: "@mildmojo",
		readme: true,
		type: "simple",
		requiresKitsy: true,
		hidden: false
	}

];

function loadFileFromPath(filename, pathToDir,callback){
	callback = callback || function(){};
	var $ajax = $.ajax( pathToDir + filename );
	$ajax.done(function(){
		loadedFiles[filename] = escape($ajax.responseText);
		console.log('Loaded ' + filename + ' via AJAX');
		callback($ajax.responseText);
	});
	$ajax.fail(function(){
		loadedFiles[filename] = "";
		console.log('Error loading ' + filename + ' via AJAX');
	});
}

function loadTemplate(){
	loadFileFromPath('template.html','template/');
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( unescape(text) ) );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    console.log("File '" + filename + "' downloaded");
}

function shortenString(value,length){
	length = length || 10;
	var string = value.toString();
	var ending = string.length > length ? "..." : "";
	return string.substring(0,length) + ending;
}

function dashesToCamelCase(string){
	return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function saveThisData($this, value){
	if (typeof(value) === "undefined"){
		value = $this.val();
	}
	if ( $this.prop('type') === "checkbox"){
		value = $this.prop('checked');
	}
	var name = $this.attr('name');
	localStorage.setItem(name, value);
	console.log("Key: '" + name + "' saved to localStorage: " + shortenString(value) );
}

function loadThisData($this){
	var name = $this.attr('name');
	var value = localStorage.getItem(name);
	if ( value === null ){
		console.log(" Attempted to get key: " + name + " from localStorage, but nothing was found.");
		return;
	} else if ( $this.prop('type') === "checkbox" ){
		var booleanVal = ( value === 'true');
		$this.prop('checked',booleanVal);
	} else {
		$this.val(value);
	}
	console.log(" Got key: " + name + " from localStorage: " + shortenString(value) );
}

function setSaveTrigger($this){
	$this.change(function(){
		saveThisData($this);
	});
}

function assembleSingles(modifiedTemplate){
	$('[data-borksy-replace-single]').each(function(){
		var $this = $(this);
		var valueToReplace = 'BORKSY-' + $this.data('borksy-replace-single');
		var formValue = $this.val();
		modifiedTemplate = modifiedTemplate.replace(valueToReplace, formValue);
	});
	return	modifiedTemplate;
}

function assembleHacks(hackBundle){
	$.each(hacks,function(index, value){
		var hackObj = value;
		var filename = hackObj.type === "simple" ? hackObj.name + "-min.js" : hackObj.name + ".js";
		var isIncluded = $('#' + hackObj.name ).prop('checked');
		if (isIncluded){
			hackBundle += loadedFiles[filename] + escape('\n');
		}
		
	});
	return hackBundle;
}

function assembleAndDownloadFile(){
	$('[data-save]').each(function(){
		saveThisData($(this));
	});

	var modifiedTemplate = loadedFiles['template.html'].repeat(1);
	var hackBundle = "";

	modifiedTemplate = assembleSingles(modifiedTemplate);

	$('[data-borksy-replace-single]').promise().done(function(){
		hackBundle = assembleHacks(hackBundle);
	});

	$('[data-hack]').promise().done(function(){
		modifiedTemplate = modifiedTemplate.replace('BORKSY-HACKS', hackBundle);
		download('myBORKSYgame.html', modifiedTemplate);
	});
}

function togglePartyMode(){
	$('body').toggleClass('party');
}

function loadAboutInfo(){
	var $aboutContent = $('#about_content');
	var $ajax = $.ajax('about/about.html');
	$ajax.done(function(){
		var response = $ajax.responseText;
		$aboutContent.html(response);
	});
	$ajax.fail(function(){
		$aboutContent.html('<p>Whoa, Something went wrong!</p>');
	});
}

function loadDefaultString($thisField){
	$thisField.val($thisField.data('default'));
	setSaveTrigger($thisField);
}

function loadDefaultBoolean($thisField){
	var defaultVal = $thisField.data('default');
	defaultVal = ( defaultVal === 'true' );
	if ($thisField.prop('type') === 'checkbox'){
		$thisField.prop('checked', defaultVal );
	} else {
		$thisField.val(defaultVal);
	}
	setSaveTrigger($thisField);
}

function loadDefaultTextfile($thisField){
	var filename = $thisField.data('default');
	var path = 'defaults/' + filename;
	var $ajax = $.ajax(path);
	$ajax.done(function(){
		var response = $ajax.responseText;
		$thisField.val(response);
		loadedFiles[filename] = response;
		setSaveTrigger($thisField);
	});
	$ajax.fail(function(){
		$thisField.val('failed to load default!');
		console.log($ajax.error);
		setSaveTrigger($thisField);
	});
}

function loadDefaultFont($thisField){
	readFontFile($thisField.data('default'));
}

function loadDefaults(checkSaveData){
	checkSaveData = checkSaveData || true;
	$('[data-save]').each(function(){
		var $thisField = $(this);
		var thisSaveData = localStorage.getItem($thisField.attr('name'));
		var hasDefault = typeof($thisField.data('default')) !== 'undefined';
		var hasSaveData = thisSaveData !== null;

		if( hasDefault && (!hasSaveData || !checkSaveData) ){

			var defaultType = $thisField.data('default-type');

			switch(defaultType){
				case "string":
					loadDefaultString($thisField);
				break;
				case "boolean":
					loadDefaultBoolean($thisField);
				break;
				case "textfile":
					loadDefaultTextfile($thisField);
				break;
				case "font":
					loadDefaultFont($thisField);
				break;
			}

		} else {
			if( hasSaveData ){
				loadThisData($thisField);
			} else {
				$thisField.val("");
			}
			setSaveTrigger($thisField);
		}
	});
	console.log("Defaults loaded. Forced? " + !checkSaveData);
}

function restoreDefaults(){
	var $fields = $('[data-save]');
	var totalFields = $fields.length;
	if ( confirm('Are you sure you want to erase all data and restore defaults?') ){
		$fields.each(function(){
			localStorage.removeItem($(this).attr('name'));
			if(!--totalFields){
				console.log('Cookies removed');
				loadDefaults(false);
			}
		});
	}
}

function onFontImageLoaded() {
	var fontsize = {
		x: 6,
		y: 8
	}; // bitsy font size
	var characters = {
		x: 16,
		y: 16
	}; // x * y must equal 256
	var padding = 1;
	// canvas context
	var canvas = document.createElement('canvas');
	canvas.width = (fontsize.x + padding) * characters.x + padding;
	canvas.height = (fontsize.y + padding) * characters.y + padding;
	var ctx = canvas.getContext('2d');
	var fontdata = [];
	ctx.drawImage(this, 0, 0);
	// read data from canvas
	for (var y = 0; y < characters.y; ++y) {
		for (var x = 0; x < characters.x; ++x) {
			var chardata = ctx.getImageData(x * (fontsize.x + padding) + padding, y * (fontsize.y + padding) + padding, fontsize.x, fontsize.y);
			fontdata.push(chardata.data);
		}
	}
	// simplify pixels to 1-bit
	for (var i = 0; i < fontdata.length; ++i) {
		var c = [];
		for (var j = 0; j < fontdata[i].length; j += 4) {
			c.push(fontdata[i][j] > 255 / 2 ? 1 : 0);
		}
		fontdata[i] = c;
	}
	// flatten characters into fontdata
	fontdata = [].concat.apply([], fontdata);
	//console.log(fontdata.toString());
	// display output
	//document.getElementById('fontdata').value = "[" + fontdata.toString() + "]";
	saveThisData($('#fontdata'), "[/*" + $('#fontfilename').val() + "*/" + fontdata.toString() + "]");

}

function readFontFile(eventOrFilename) {
	var src;
	if( typeof(eventOrFilename) === 'object' ){
		src = eventOrFilename.target.result;
	} else {
		src = 'fonts/' + eventOrFilename;
		changeFontFilename(eventOrFilename);
	}
	// load image
	var img = new Image();
	img.onload = onFontImageLoaded;
	img.src = src;
	// if possible, change preview
	changeFontPreview();
}

function loadFontImage(input) {
	if (!input.files || !input.files[0]) {
		// do nothing
		return;
	}
	// read image
	var reader = new FileReader();
	reader.onload = readFontFile;
	changeFontFilename(input.files[0].name);
	reader.readAsDataURL(input.files[0]);
}

function changeFontFilename(filename){
	var $field = $('#fontfilename');
	if( $field.val() !== filename ){
		$field.val(filename);
		saveThisData($field);
	}
}

function replaceElements(){
	$('[data-replace-element]').each(function(){
		replaceThisElement($(this));
	});
}

function replaceThisElement($elementToReplace){
	var functionName = $elementToReplace.data('replace-element');
	var $replacement = window[functionName]();
	$elementToReplace.replaceWith($replacement);
}

function createFontSelect(){
	var currentFontName = $('#fontfilename').val().slice(0, -4);
	var usingCustomFont = true;
	var $select = $('<select>',{
		id: 'fontSelect'
	});
	var $option1 = $('<option>',{
		text: "Select Font",
		value: 0
	});
	$option1.attr('disabled', true);
	$select.append($option1);
	$.each(fonts, function( name, description){
		var $newOption = $('<option>',{
			text: description,
			value: name
		}); 
		if( name === currentFontName ){
			$newOption.attr('selected', true);
			usingCustomFont = false;
		}
		$select.append($newOption);
	});
	if(usingCustomFont){
		$option1.attr('selected', true);
	}
	$select.change(selectFont);
	return $select;
}

function createFontPreview(){
	var $newElement;
	var fontFilename = $('#fontfilename').val();
	var nameNoExtension = fontFilename.slice(0, -4);
	if( typeof(fonts[nameNoExtension]) !== "undefined"){
		$newElement = $('<img>',{
			class: nameNoExtension + " font-preview",
			src: "fonts/previews/" + fontFilename
		});
	} else {
		$newElement = $('<label>',{text: "(Sorry, Preview Unavailable for Custom Fonts)"});
	}
	$newElement.attr('data-replace-element','createFontPreview');
	return $newElement;
}

function changeFontPreview(){
	replaceThisElement($('[data-replace-element=createFontPreview]'));
}

function selectFont(){
	var filename = this.value + ".png";
	readFontFile(filename);
}

function makeNewCollapsible(header){
	var $collapse = $('<div>',{
		class: "collapsible"
	});
	$collapse.data('collapse','');
	$collapse.data('header', header);
	activateThisCollapsible($collapse);
	return $collapse;
}

function activateCollapsibles(){
	$('[data-collapsible]').each( function(){
		var $thisCollapsible = $(this);
		activateThisCollapsible($thisCollapsible);
		if( $thisCollapsible.attr('id') === "hacks-section" ){
			console.log('HACK IT UP YO');
			createHackMenus($thisCollapsible);
		}
	});
}

function activateThisCollapsible($thisCollapsible){
	var $closer = $('<span>', {
		class: "collapsible_closer",
		click: function(){
			$thisCollapsible.toggleClass('open');
		}
	});
	var $header = $('<span>', {
		class: "collapsible_header",
		text: $thisCollapsible.data('header'),
		click: function(){
			$thisCollapsible.toggleClass('open');
		}
	});
	$thisCollapsible.prepend($closer);
	$thisCollapsible.prepend($header);
}

function createHackMenus($here){
	$.each(hacks,function(name,hackInfo){
		var $menu = createThisHackMenu(hackInfo);
		$here.append($menu);
	});
}

function createThisHackMenu(hackInfo){
	var $collapse = makeNewCollapsible(hackInfo.title + " (By " + hackInfo.author + ")");

	var pathToDir = "";
	var filename = "";
	if(hackInfo.type === "simple"){
		filename = hackInfo.name + '-min.js';
		pathToDir = "hacks/min/";
	} else {
		filename = hackInfo.name + '.js';
		pathToDir = "hacks/js/";
	}
	loadFileFromPath(filename,pathToDir);


	var $description = $('<p>',{
		text: hackInfo.description
	});
	$collapse.append($description);

	var $label = $('<label>',{
		text: "Include " + hackInfo.title
	});
	var $checkbox = $('<input>',{
		type: 'checkbox',
		name: hackInfo.name,
		id: hackInfo.name
	});
	$checkbox.attr({
		'data-save':true,
		'data-default':false,
		'data-default-type':"boolean",
		'data-requires-kitsy': hackInfo.requiresKitsy,
		'data-hack': hackInfo.name,
		'data-hack-type': hackInfo.type,
	});
	
	loadThisData($checkbox);
	setSaveTrigger($checkbox);
	$label.append($checkbox);
	$collapse.append($label);

	if(hackInfo.readme === true){
		var $readme = makeNewCollapsible(hackInfo.title + " README:");
		loadFileFromPath(hackInfo.name + '.txt','hacks/info/',function(responseText){
			var $pre = $('<pre>',{
				text: responseText
			});
			$readme.append($pre);
			$collapse.append($readme);
		});
	}

	return $collapse;
}
			
$(document).ready(function(){
	activateCollapsibles();
	loadAboutInfo();
	loadDefaults();
	replaceElements();
	loadTemplate();
	$('#download-button').click(assembleAndDownloadFile);
	$('#restore-button').click(restoreDefaults);
	$('#mascot').click(togglePartyMode);
});