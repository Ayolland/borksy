import $ from 'jquery';
import {
	activateThisCollapsible
} from '../../collapsible';

import html from './.html';

var $html = $('<div>', {
	id: 'wrapper'
});
$html.html(html);
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
	$collapsibles = $html.find('[data-collapsible]');
	$collapsibles.each(function () {
		var $thisCollapsible = $(this);
		activateThisCollapsible($thisCollapsible);
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
} from '../../persist';

import $about from '../about/main';
import $theme from '../theme/main';
import $title from '../title/main';
import $gamedata from '../gamedata/main';
// import $fontdata from '../fontdata/main';
import $hacks, {
	assembleHacks
} from '../hacks/main';
import $additionalJS from '../additionalJS/main';
import assemble from '../../assembler/assembler';

var $form = $html.find('#form');
[
	["About Borksy", $about],
	["Page Title / Filename", $title],
	["Game Data", $gamedata],
	// ["Font Data", $fontdata],
	["HTML / CSS Theme", $theme],
	["Hacks", $hacks],
	["Additional JavaScript", $additionalJS],
].map(function (options) {
	var name = options[0];
	var $content = options[1];
	var $section = $('<section id="' + name.toLowerCase().replace(/\s/g, '-') + '-section" data-collapsible data-header="' + name + '" class="collapsible"></section>');
	$section.append($content);
	return $section;
}).forEach(function ($section) {
	$form.append($section);
});

$form.find('#about-borksy-section').addClass('open');

activateCollapsibles();

$html.find('#download-button').click(assembleAndDownloadFile);
$html.find('#restore-button').click(onClickRestore);
$html.find('#mascot').click(togglePartyMode);

setHotKeys();

export default $html;
