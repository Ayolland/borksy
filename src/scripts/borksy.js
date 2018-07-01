import $ from 'jquery';
import {
	activateThisCollapsible
} from './collapsible';

var $collapsibles;

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(unescape(text)));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
	console.log("File '" + filename + "' downloaded");
}

function assembleAndDownloadFile() {
	saveAll();

	var assemblerOptions = {
		title: $('#title').val(),
		gamedata: $('#gamedata').val(),
		css: $('#css').val(),
		fontdata: $('#fontdata').val(),
		hacks: assembleHacks(),
		additionaljs: $('#additionaljs').val(),
		markup: $('#markup').val(),
	};

	var game = assemble(assemblerOptions);

	var filename = $('#filename').val();
	download(filename + '.html', game);
}

function togglePartyMode() {
	var $body = $('body');
	if ($body.hasClass('party')) {
		$body.removeClass('party');
		alert('😾 Party Mode Deactivated. Everyone out. 😾');
	} else {
		$body.addClass('party');
		alert('✨🌈 Party Mode Activated! 🌈✨');
	}
}

function onClickRestore() {
	if (confirm('Are you sure you want to erase all data and restore defaults?')) {
		clear();
		restoreDefaults();
	}
}

function activateCollapsibles() {
	$collapsibles = $('[data-collapsible]');
	var counter = 0;
	$collapsibles.each(function () {
		var $thisCollapsible = $(this);
		activateThisCollapsible($thisCollapsible);
		counter++;
		if (counter === $collapsibles.length) {
			$('#preloader').fadeOut();
		}
	});
}

function setHotKeys() {
	$(window).bind('keydown', function (event) {
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

import {
	restoreDefaults,
	clear,
	saveAll
} from './persist';

import $about from './components/about/main';
import $theme from './components/theme/main';
import $title from './components/title/main';
import $gamedata from './components/gamedata/main';
import $fontdata from './components/fontdata/main';
import $hacks, { assembleHacks } from './components/hacks/main';
import $additionalJS from './components/additionalJS/main';
import assemble from './assembler/assembler';

$('#about-section').append($about);
$('#title-section').append($title);
$('#gamedata-section').append($gamedata);
$('#fontdata-section').append($fontdata);
$('#theme-section').append($theme);
$('#hacks-section').append($hacks);
$('#additionalJS-section').append($additionalJS);

activateCollapsibles();

$('#download-button').click(assembleAndDownloadFile);
$('#restore-button').click(onClickRestore);
$('#mascot').click(togglePartyMode);

setHotKeys();
