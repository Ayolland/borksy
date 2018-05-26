var loadedFiles ={};
var fonts = {
	"default" : "Default Bitsy Font by Adam LeDoux",
	"beeblebrox" : "Beeblebrox by AYolland",
	"blacksphinx" : "Blacksphinx by AYolland",
	"greengable" : "Greengable by AYolland",
	"hotcaps" : "Hotcaps by AYolland"
};

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
	loadFileFromPath('2.1.template.html','template/');
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
	return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

function removeExtraChars(string){
	return string.replace(/[^\w\s]/gi, '');
}

function arrayToSentenceFrag(arr){
	if (arr.length > 1){
		return arr.slice(0, arr.length - 1).join(', ') + ", and " + arr.slice(-1);
	} else {
		return arr[0];
	}
}

function cleanUsingRegEx($this,regExStr){
	var regex = new RegExp(regExStr,"g");
	$this.val($this.val().replace(regex,""));
};

function saveThisData($this, value){
	if ( $this.data('clean-regex') ){
		cleanUsingRegEx($this, $this.data('clean-regex'));
	}
	if ( $this.prop('type') === "checkbox"){
		value = $this.prop('checked');
	} else if (typeof(value) === "undefined"){
		value = $this.val();
	} else {
		$this.val(value);
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

function checkHacksRequiring($thisHack){
	var $hacksWithRequires = $('[data-requires]');
	var $includedHacksRequiringThis = $();
	$hacksWithRequires.each(function(index){
		var $currentHack = $(this);
		var hackIsIncluded = $currentHack.val() === 'true' || $currentHack.prop('checked') === true;
		var hackRequiresThis = $currentHack.data('requires') === $thisHack.attr('id') || false;
		if (hackIsIncluded && hackRequiresThis){
			$includedHacksRequiringThis = $includedHacksRequiringThis.add($currentHack)
		}
	});
	if( $includedHacksRequiringThis.length > 0 ){
		//no logic yet for hacks that can be both required AND user-selected
		//$thisHack.prop('checked', true);
		$thisHack.val(true);
	} else {
		//$thisHack.prop('checked', false);
		$thisHack.val(false);
	}
	saveThisHack($thisHack);
}

function removeConflictingHacks(conflictsArr){
	$.each(conflictsArr,function(index,hackName){
		var $conflictingHack = $('#' + hackName);
		var hiddenAndNotIncluded = $conflictingHack.prop('type') === 'hidden' && $conflictingHack.val() === false;
		var checkboxAndNotIncluded = $conflictingHack.prop('type') === 'checkbox' && $conflictingHack.prop('checked') === false;
		if( hiddenAndNotIncluded || checkboxAndNotIncluded ){
			return;
		}
		$conflictingHack.val(false);
		$conflictingHack.prop('checked',false);
		saveThisHack($conflictingHack, false);
	});
}

function checkAndToggleIncludedDisplay($thisField){
	var $collapsible = $('[data-associated-hack=' + $thisField.data('hack') + ']');
	if( $collapsible.length > 0 ){
		toggleIncludedDisplay($collapsible,$thisField);
	}
}

function toggleIncludedDisplay($collapsible,$thisHack){
	if ( $thisHack.prop('checked') === true ){
		$collapsible.addClass('included');
	} else {
		$collapsible.removeClass('included');
	}
}

function saveThisHack($thisHack,checkConflicts){
	if( typeof(checkConflicts) === 'undefined' ){
		checkConflicts = true;
	}
	saveThisData($thisHack);
	checkAndToggleIncludedDisplay($thisHack);
	var thisRequires = hacks[$thisHack.data('hack')].requires;

	if( thisRequires && !thisRequires.includes(',') ){
		var $requiredHack = $('#' + thisRequires);
		checkHacksRequiring($requiredHack);
	} else if ( thisRequires ) {
		$.each(thisRequires.split(','),function(index,requiredHackName){
			var $requiredHack = $('#' + requiredHackName);
			checkHacksRequiring($requiredHack);
		});
	}
	var thisConflicts = hacks[$thisHack.data('hack')].conflicts;
	if( thisConflicts && checkConflicts){
		removeConflictingHacks(thisConflicts.split(','));
	}
}

function hackIncludeTrigger($this){
	$this.change(function(){
		saveThisHack($this);
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

function reOrderHacks(){
	var hackArray = [];
	$.each(hacks,function(hackName, hackObj){
		hackArray.push(Object.assign({name: hackName},hackObj))
	});
	hackArray.sort(function(obj1,obj2){
		if(obj1.order > obj2.order){
			return 1
		} else if (obj1.order === obj2.order){
			return 0
		} else {
			return -1;
		}
	});
	return hackArray;
}

function assembleHacks(hackBundle){
	var orderedHacks = reOrderHacks();
	$.each(orderedHacks,function(index, hackObj){
		var hackName = hackObj.name;
		var filename = hackObj.type === "simple" && false ? hackName + "-min.js" : hackName + ".js";
		var $hackField = $('#' + hackName );
		var isIncluded = ( $hackField.prop('checked') || ($hackField.val() === 'true') );
		var hackFile = loadedFiles[filename];
		if (hackObj.type === "options"){
			var hackOptions = $('#' + hackName + '-options').val();
			hackFile = hackFile.replace('BORKSY-OPTIONS',hackOptions);
		}
		if (isIncluded){
			hackBundle += hackFile + escape('\n');
		}
	});
	return hackBundle;
}

function assembleAndDownloadFile(){
	$('[data-save]').each(function(){
		saveThisData($(this));
	});

	var modifiedTemplate = loadedFiles['2.1.template.html'].repeat(1);
	var hackBundle = "";

	modifiedTemplate = assembleSingles(modifiedTemplate);

	$('[data-borksy-replace-single]').promise().done(function(){
		hackBundle = assembleHacks(hackBundle);
	});

	$('[data-hack]').promise().done(function(){
		var filename = $('#filename').val();
		modifiedTemplate = modifiedTemplate.replace('BORKSY-HACKS', hackBundle);
		download( filename + '.html', modifiedTemplate);
	});
}

function togglePartyMode(){
	var $body = $('body');
	if( $body.hasClass('party') ){
		$body.removeClass('party');
		alert('😾 Party Mode Deactivated. Everyone out. 😾');
	} else {
		$body.addClass('party');
		alert('✨🌈 Party Mode Activated! 🌈✨');
	}
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

function loadDefaultHackOptions($thisField){
	$thisField.val(loadedFiles[$thisField.attr("name") + '.txt']);
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
				case "hackOptions":
					loadDefaultHackOptions($thisField);
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
		checkAndToggleIncludedDisplay($thisField);
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

function loadThisHack(hackName,hackInfo){
	var pathToDir = "";
	var filename = "";
	if(hackInfo.type === "simple" && false){
		filename = hackName + '-min.js';
		pathToDir = "hacks/min/";
	} else {
		filename = hackName + '.js';
		pathToDir = "hacks/js/";
	}
	loadFileFromPath(filename,pathToDir);
}

function bakeHackData($element,hackName,hackInfo){
	$element.attr({
		'data-save':true,
		'data-default':false,
		'data-default-type':"boolean",
		'data-hack': hackName,
		'data-hack-type': hackInfo.type
	});
	if (hackInfo.requires){
		$element.attr('data-requires',hackInfo.requires);
	}
}

function hackMenuConflicts(hackName,hackInfo,$parentCollapse){
	var conflictTitlesArr = []
	$.each(hackInfo.conflicts.split(','),function(index,conflictName){
		conflictTitlesArr.push( removeExtraChars(hacks[conflictName].title) );
	});
	var sentenceFrag = arrayToSentenceFrag(conflictTitlesArr);
	var $warning = $('<p>',{
		text: 'This hack conflicts with ' + sentenceFrag + '.',
		class: 'conflict-warning'
	});
	$parentCollapse.append($warning);
}

function hackMenuPython(hackName,hackInfo,$parentCollapse){
	var $friendliness = makeNewCollapsible( removeExtraChars(hackInfo.title) + " Bitspy Friendliness:");
	var sentenceStart = "Use of this Hack ";
	var sentenceEnd = "";
	var bitspyLink = "<a href='https://github.com/Ragzouken/bitspy'>the Python Player for Bitsy</a> ";
	bitspyLink += "(IE: <a href='https://candle.itch.io/bitsy-boutique'>The Bitsy Boutique</a>)";
	var fine = "The features in this hack will not be available, but your game should otherwise function normally."
	var notfine = "Your game will likely appear broken."
	switch (hackInfo.python){
		case "green":
			sentenceStart += "does not interfere with ";
			sentenceEnd = ". " + fine;
		break;
		case "yellow":
			sentenceStart += "is possible with ";
			sentenceEnd = " if and only if there is no script reference to it in dialog. " + fine;
		break;
		case "red":
		default:
			sentenceStart += "is not compatible with ";
			sentenceEnd += ". " + notfine;
		break;
	}
	var $text = $('<p>',{
		html: sentenceStart + bitspyLink + sentenceEnd
	});
	$friendliness.addClass('python').addClass(hackInfo.python).append($text);
	$parentCollapse.append($friendliness);
}

function hackMenuOptions(hackName,hackInfo,$parentCollapse){
	var $options = makeNewCollapsible( removeExtraChars(hackInfo.title) + " Options:");
	var $optionsLabel = $('<label>',{
		text: "var " + dashesToCamelCase(hackName) + "Options = {"
	});
	loadFileFromPath(hackName + '.options.txt','hacks/options/',function(responseText){
		var $optionsField = $('<textarea>',{
			rows: 5,
			cols: 50,
			text: responseText,
			name: hackName + '.options',
			id: hackName + '-options'
		});
		$optionsField.attr({
			'data-save':true,
			'data-default-type':"hackOptions",
			'data-default': hackName + '.options.txt'
		});
		loadThisData($optionsField);
		setSaveTrigger($optionsField);
		$optionsLabel.append($optionsField);
		$optionsLabel.append(document.createTextNode("};"));
		$options.append($optionsLabel);
		$parentCollapse.append($options);
	});
}

function hackMenuReadme(hackName,hackInfo,$parentCollapse){
	var $readme = makeNewCollapsible( removeExtraChars(hackInfo.title) + " README:");
	loadFileFromPath(hackName + '.readme.txt','hacks/info/',function(responseText){
		var $pre = $('<pre>',{
			text: responseText
		});
		$readme.append($pre);
		$parentCollapse.append($readme);
	});
}

function createThisHackMenu(hackName,hackInfo){
	var $collapse = makeNewCollapsible(hackInfo.title + " (By " + hackInfo.author + ")");
	$collapse.attr('data-associated-hack',hackName);

	var $description = $('<p>',{
		text: hackInfo.description
	});
	$collapse.append($description);

	if (hackInfo.conflicts){
		hackMenuConflicts(hackName,hackInfo,$collapse);
	}

	var $label = $('<label>',{
		text: "Include " + removeExtraChars(hackInfo.title)
	});
	var $checkbox = $('<input>',{
		type: 'checkbox',
		name: hackName,
		id: hackName
	});
	bakeHackData($checkbox,hackName,hackInfo);
	loadThisData($checkbox);
	toggleIncludedDisplay($collapse,$checkbox);
	hackIncludeTrigger($checkbox);
	$label.append($checkbox);
	$collapse.append($label);

	if(hackInfo.type === "options"){
		hackMenuOptions(hackName,hackInfo,$collapse);
	}

	if(hackInfo.readme === true){
		hackMenuReadme(hackName,hackInfo,$collapse);
	}

	hackMenuPython(hackName,hackInfo,$collapse);

	return $collapse;
}

function createHiddenHack(hackName,hackObj){
	var $hidden = $('<input>',{
		type: "hidden",
		name: hackName,
		id: hackName
	});
	bakeHackData($hidden,hackName,hackObj);
	loadThisData($hidden);

	return $hidden;
}

function createHackMenus($here){
	$.each(hacks,function(hackName,hackObj){
		loadThisHack(hackName,hackObj);
		if (hackObj.hidden === true){
			$here.append(createHiddenHack(hackName,hackObj));
		} else {
			$here.append(createThisHackMenu(hackName,hackObj));
		}
		
	});
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
	$collapsibles = $('[data-collapsible]');
	var counter = 0;
	$collapsibles.each( function(){
		var $thisCollapsible = $(this);
		activateThisCollapsible($thisCollapsible);
		if( $thisCollapsible.attr('id') === "hacks-section" ){
			console.log('HACK IT UP YO');
			createHackMenus($thisCollapsible);
		}
		counter++;
		if (counter === $collapsibles.length){
			$('#preloader').fadeOut();
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

function setHotKeys(){
	$(window).bind('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
			case 's':
				event.preventDefault();
				assembleAndDownloadFile();
			break;
			case 'd':
				event.preventDefault();
				restoreDefaults();
			break;
			case 'p':
				event.preventDefault();
				togglePartyMode();
			break;
			}
		}
	});
}
			
$(document).ready(function(){
	activateCollapsibles();
	loadAboutInfo();
	loadDefaults();
	replaceElements();
	loadTemplate();
	$('#download-button').click(assembleAndDownloadFile);
	$('#restore-button').click(restoreDefaults);
	setHotKeys();
	$('#mascot').click(togglePartyMode);
});