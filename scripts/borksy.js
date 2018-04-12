var loadedFiles ={};

function setSaveTrigger($this){
	$this.change(function(){
		saveThisData($this);
	});
}

function loadTemplate(){
	var $ajax = $.ajax('template/template.html');
	$ajax.done(function(){
		loadedFiles['template.html'] = $ajax.responseText;
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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    console.log("File '" + filename + "' downloaded")
}

function saveThisData($this){
	var name = $this.attr('name');
	var value = $this.val();
	localStorage.setItem(name, value);
	console.log("Key: '" + name + "' saved to localStorage");
}

function loadThisData($this){
	var name = $this.attr('name');
	var value = localStorage.getItem(name);
	$this.val(value);
	console.log(" Got key: " + name + " from localStorage");
}

function togglePartyMode(){
	$('body').toggleClass('party');
}

function loadDefaults(checkSaveData = true){
	$('[data-save]').each(function(){
		var $thisField = $(this);
		var thisSaveData = localStorage.getItem($thisField.attr('name'));
		var hasDefault = typeof($thisField.data('default')) == 'string';
		var hasSaveData = thisSaveData != null;

		if( hasDefault && (!hasSaveData || !checkSaveData) ){

			var defaultType = $thisField.data('default-type');

			switch(defaultType){
				case "string":
					$thisField.val($thisField.data('default'));
					setSaveTrigger($thisField);
				break;
				case "file":
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