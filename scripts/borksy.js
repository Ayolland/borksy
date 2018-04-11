var loadedFiles ={};

function loadCookies(){
	$('[data-cookie]').each(function(){
		
	});
}

function loadDefaults(){
	$('[data-default]').each(function(){
		var $this = $(this);
		var filename = $this.data('default');
		var path = 'defaults/' + filename;
		var $ajax = $.ajax(path)
		$ajax.done(function(){
			var response = $ajax.responseText
			$this.val(response);
			loadedFiles[filename] = response;
		});
		$ajax.fail(function(){
			$this.val('failed to load default!');
			console.log($ajax.error);
		})
	});
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

function setThisCookie(){

}
			
$(document).ready(function(){
	loadTemplate();
	loadDefaults();
	$('#download-button').click(assembleAndDownloadFile);
});