var loadedFiles ={};

function setCookieTrigger($this){
	$this.change(function(){
		setThisCookie($this);
	});
}

function loadDefaults(checkCookies = true){
	$('[data-cookie]').each(function(){
		var $thisField = $(this);
		var thisCookie = Cookies.get($thisField.attr('name'));
		var hasDefault = typeof($thisField.data('default')) == 'string';
		var hasCookie = typeof(thisCookie) == 'string';

		if( hasDefault && (!hasCookie || !checkCookies) ){

			var defaultType = $thisField.data('default-type');

			switch(defaultType){
				case "string":
					$thisField.val($thisField.data('default'));
					setCookieTrigger($thisField);
				break;
				case "file":
					var filename = $thisField.data('default');
					var path = 'defaults/' + filename;
					var $ajax = $.ajax(path);
					$ajax.done(function(){
						var response = $ajax.responseText;
						$thisField.val(response);
						loadedFiles[filename] = response;
						setCookieTrigger($thisField);
					});
					$ajax.fail(function(){
						$thisField.val('failed to load default!');
						console.log($ajax.error);
						setCookieTrigger($thisField);
					});
				break;
			}

		} else {
			if( hasCookie ){
				$thisField.val(thisCookie);
			} else {
				$thisField.val("");
			}
			setCookieTrigger($thisField);
		}
	});
	console.log("Defaults loaded. Forced? " + !checkCookies);
}

function restoreDefaults(){
	$fields = $('[data-cookie]');
	totalFields = $fields.length;
	if ( confirm('Are you sure you want to erase all data and restore defaults?') ){
		$fields.each(function(){
			Cookies.remove($(this).attr('name'));
			if(!--totalFields){
				console.log('Cookies removed');
				loadDefaults(false);
			}
		});
	}
}

function loadTemplate(){
	var $ajax = $.ajax('template/template.html');
	$ajax.done(function(){
		loadedFiles['template.html'] = $ajax.responseText;
	})
}

function assembleAndDownloadFile(){
	var modifiedTemplate = loadedFiles['template.html'].repeat(1);
	$('[data-borksy-replace-single]').each(function(){
		var $this = $(this);
		var valueToReplace = 'BORKSY-' + $this.data('borksy-replace-single');
		var formValue = $this.val();
		modifiedTemplate = modifiedTemplate.replace(valueToReplace, formValue)
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
}

function setThisCookie($this){
	var name = $this.attr('name');
	var value = $this.val();
	Cookies.set(name, value);
	console.log("Cookie '" + name + "' saved");
}
			
$(document).ready(function(){
	loadTemplate();
	loadDefaults();
	$('#download-button').click(assembleAndDownloadFile);
	$('#restore-button').click(restoreDefaults);
});