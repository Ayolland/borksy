var loadedFiles ={};

function loadTemplate(){
	var $ajax = $.ajax('template/template.html');
	$ajax.done(function(){
		loadedFiles['template.html'] = $ajax.responseText;
	});
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    console.log("File '" + filename + "' downloaded");
}

function saveThisData($this, value){
	if (typeof(value) === "undefined"){
		value = $this.val();
	} else {
		$this.val(value);
	}
	var name = $this.attr('name');
	localStorage.setItem(name, value);
	console.log("Key: '" + name + "' saved to localStorage");
}

function loadThisData($this){
	var name = $this.attr('name');
	var value = localStorage.getItem(name);
	$this.val(value);
	console.log(" Got key: " + name + " from localStorage");
}

function setSaveTrigger($this){
	$this.change(function(){
		saveThisData($this);
	});
}

function assembleAndDownloadFile(){
	$('[data-save]').each(function(){
		saveThisData($(this));
	});

	var modifiedTemplate = loadedFiles['template.html'].repeat(1);
	$('[data-borksy-replace-single]').each(function(){
		var $this = $(this);
		var valueToReplace = 'BORKSY-' + $this.data('borksy-replace-single');
		var formValue = $this.val();
		modifiedTemplate = modifiedTemplate.replace(valueToReplace, formValue);
	});
	$('[data-borksy-replace-single]').promise().done(function(){
		download('myBORKSYgame.html', modifiedTemplate);
	});
}

function togglePartyMode(){
	$('body').toggleClass('party');
}

function loadDefaultString($thisField){
	$thisField.val($thisField.data('default'));
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
		var hasDefault = typeof($thisField.data('default')) === 'string';
		var hasSaveData = thisSaveData !== null;

		if( hasDefault && (!hasSaveData || !checkSaveData) ){

			var defaultType = $thisField.data('default-type');

			switch(defaultType){
				case "string":
					loadDefaultString($thisField);
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

var hoistedFontFileName = "";

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
	saveThisData($('#fontdata'), "[/*" + hoistedFontFileName + "*/" + fontdata.toString() + "]");

}
function readFontFile(eventOrFilePath) {
	var src;
	if( typeof(eventOrFilePath) === 'object' ){
		src = eventOrFilePath.target.result;
	} else {
		src = '/fonts/' + eventOrFilePath;
		hoistedFontFileName = eventOrFilePath;
	}
	// load image
	var img = new Image();
	img.onload = onFontImageLoaded;
	img.src = src;
}
function loadFontImage(input) {
	if (!input.files || !input.files[0]) {
		// do nothing
		return;
	}
	// read image
	var reader = new FileReader();
	reader.onload = readFontFile;
	hoistedFontFileName = input.files[0].name;
	reader.readAsDataURL(input.files[0]);
}

function activateCollapsibles(){
	$('[data-collapsible]').each( function(){
		var $thisCollapsible = $(this);
		var $closer = $('<span>', {
			class: "collapsible_closer",
			click: function(){
				$thisCollapsible.toggleClass('open');
			}
		});
		var $header = $('<span>', {
			class: "collapsible_header",
			text: $thisCollapsible.data('header')
		});
		$thisCollapsible.prepend($closer);
		$thisCollapsible.prepend($header);
	});
}
			
$(document).ready(function(){
	activateCollapsibles();
	loadTemplate();
	loadDefaults();
	$('#download-button').click(assembleAndDownloadFile);
	$('#restore-button').click(restoreDefaults);
	$('#mascot').click(togglePartyMode);
});