import { saveAs } from 'file-saver';
import $ from 'jquery';
import { html as htmlChangelog } from '../../CHANGELOG.md';
import { htmlAbout, htmlFaqs, htmlHowto, htmlTips, htmlTools } from '../about';
import * as defaults from '../defaults';
import hacksRaw from '../hacks';
import templates from '../template';

const hacks = hacksRaw.map(hack => {
	const [header] = hack.match(/^(\/\*\*[\S\s]*?\*\/)$/gm);
	const headerLines = header.split('\n').slice(1, -1);
	const emoji = headerLines[0];
	const file = headerLines.find(i => i.startsWith('@file')).split('@file ')[1];
	const author = headerLines.find(i => i.startsWith('@author')).split('@author ')[1];
	const summary = headerLines.find(i => i.startsWith('@summary')).split('@summary ')[1];
	const description = headerLines
		.slice(headerLines.findIndex(i => i.startsWith('@description')) + 1)
		.join('\n')
		.replace(/Copy-paste .* after the bitsy source\.?/g, 'Include hack')
		.replace(/hackOptions below/g, 'hackOptions above');
	const [, options] = hack.match(/var hackOptions.*= {\n+([^]+?)\n+};$/m) || [];
	return {
		metadata: {
			emoji,
			id: file.replace(/\s/g, '-'),
			name: file,
			author,
			summary,
			description,
		},
		options,
		data: hack,
	};
});

function loadTemplates() {
	const templateSel = document.querySelector('select#template');
	templateSel.innerHTML = '';
	for (let i = templates.length - 1; i >= 0; i--) {
		const { id, description, isDefault } = templates[i];
		templateSel.innerHTML += `<option value="${id}" ${isDefault ? 'data-default-option' : ''}>${description}</option>`;
	}
}

function download(filename, text) {
	console.log(text);
	saveAs(new Blob([text], { type: 'text/html;charset=utf-8' }), filename);
	console.log(`File '${filename}' downloaded`);
}

function shortenString(value, length = 10) {
	const string = value.toString();
	const ending = string.length > length ? '...' : '';
	return string.substring(0, length) + ending;
}

function dashesToCamelCase(string) {
	return string.toLowerCase().replace(/-(.)/g, (_match, group1) => group1.toUpperCase());
}

function removeExtraChars(string) {
	return string.replace(/[^\w\s]/gi, '');
}

function cleanUsingRegEx($this, regExStr) {
	const regex = new RegExp(regExStr, 'g');
	$this.val($this.val().replace(regex, ''));
}

function saveThisData($this, override) {
	if ($this.data('clean-regex')) {
		cleanUsingRegEx($this, $this.data('clean-regex'));
	}
	let value;
	if ($this.prop('type') === 'checkbox') {
		value = $this.prop('checked');
	} else if (override === undefined) {
		value = $this.val();
	} else {
		value = override;
		$this.val(override);
	}
	const name = $this.attr('name');
	localStorage.setItem(name, value);
	console.log(`Key: '${name}' saved to localStorage: ${shortenString(value)}`);
}

function loadThisData($this) {
	const name = $this.attr('name');
	const value = localStorage.getItem(name);
	if (value === null) {
		console.log(` Attempted to get key: ${name} from localStorage, but nothing was found.`);
		return;
	}
	if ($this.prop('type') === 'checkbox') {
		const booleanVal = value === 'true';
		$this.prop('checked', booleanVal);
	} else {
		$this.val(value);
	}
	console.log(` Got key: ${name} from localStorage: ${shortenString(value)}`);
	if (name === 'template' && value.split('.')[0] === 'BitsyHD51') {
		$('#mascot').addClass('borksyHD');
		console.log('BitsyHD detected');
	}
}

function setSaveTrigger($this) {
	const name = $this.attr('name');
	let extraFunction;
	switch (name) {
		case 'template':
			extraFunction = saveTemplateExtras;
			break;
		default:
			break;
	}
	$this.change(() => {
		saveThisData($this);
		extraFunction?.($this);
	});
}

function saveTemplateExtras($this) {
	const isHD = $this.val().split('.')[0] === 'BitsyHD';
	const noSavedGameData = localStorage.getItem('gamedata') == null;
	const HDgamedata = defaults.gamedataHD;
	const HDgamedataExists = HDgamedata !== undefined;
	const $mascot = $('#mascot');
	if (isHD) {
		$mascot.addClass('borksyHD');
		if (noSavedGameData && HDgamedataExists) {
			const $gamedata = $('#gamedata');
			$gamedata.val(HDgamedata);
			saveThisData($gamedata);
		}
	} else {
		$mascot.removeClass('borksyHD');
	}
}

function checkAndToggleIncludedDisplay($thisField) {
	const $collapsible = $(`[data-associated-hack="${$thisField.data('hack')}"]`);
	if ($collapsible.length > 0) {
		toggleIncludedDisplay($collapsible, $thisField);
	}
}

function toggleIncludedDisplay($collapsible, $thisHack) {
	if ($thisHack.prop('checked') === true) {
		$collapsible.addClass('included');
	} else {
		$collapsible.removeClass('included');
	}
}

function saveThisHack($thisHack) {
	saveThisData($thisHack);
	checkAndToggleIncludedDisplay($thisHack);
}

function hackIncludeTrigger($this) {
	$this.change(() => {
		saveThisHack($this);
	});
}

function assembleSingles(modifiedTemplate) {
	return Array.from(document.querySelectorAll('[data-borksy-replace-single]')).reduce((acc, i) => {
		const $this = $(i);
		const valueToReplace = `BORKSY-${$this.data('borksy-replace-single')}`;
		const formValue = $this.val();
		return acc.replace(valueToReplace, formValue);
	}, modifiedTemplate);
}

function assembleHacks(hackBundle) {
	return hacks.reduce((acc, hackObj) => {
		const $hackField = $(`#${hackObj.metadata.id}`);
		const isIncluded = $hackField.prop('checked') || $hackField.val() === 'true';
		if (!isIncluded) {
			return acc;
		}

		let hackFile = hackObj.data;
		if (hackObj.options) {
			const newHackOptionsContents = $(`#${hackObj.metadata.id}-options`).val();
			hackFile = hackFile.replace(/(var hackOptions.*= ){[^]*?}(;$)/m, `$1 {\n${newHackOptionsContents}\n} $2`);
		}
		return `${acc}${hackFile}\n`;
	}, hackBundle);
}

function assembleAndDownloadFile() {
	Array.from(document.querySelectorAll('[data-save]')).forEach(i => {
		saveThisData($(i));
	});

	const templateName = $('#template').val();
	let modifiedTemplate = templates.find(i => i.id === templateName).data;
	let hackBundle = '';

	modifiedTemplate = assembleSingles(modifiedTemplate);

	$('[data-borksy-replace-single]')
		.promise()
		.done(() => {
			hackBundle = assembleHacks(hackBundle);
		});

	$('[data-hack]')
		.promise()
		.done(() => {
			const filename = $('#filename').val();
			modifiedTemplate = modifiedTemplate.replace('BORKSY-HACKS', hackBundle);
			download(`${filename}.html`, modifiedTemplate);
		});
}

function togglePartyMode() {
	const $body = $('body');
	if ($body.hasClass('party')) {
		$body.removeClass('party');
		window.alert('😾 Party Mode Deactivated. Everyone out. 😾');
	} else {
		$body.addClass('party');
		window.alert('✨🌈 Party Mode Activated! 🌈✨');
	}
}

function loadAboutInfo() {
	const elAbout = document.querySelector('#about_content');
	elAbout.innerHTML = htmlAbout;

	const lastUpdate = document.createElement('p');
	lastUpdate.innerHTML = htmlChangelog.match(/(<h[12][^]+?)<h[12]/m)?.[1].replace(/<h[12]>([^]+?)<\/h[12]>/g, "<h2>What's new in v$1</h2>");
	elAbout.prepend(lastUpdate);

	const elHowto = makeNewCollapsible('How To Use Borksy');
	elHowto.append(htmlHowto);
	elAbout.appendChild(elHowto[0]);

	const elFaqs = makeNewCollapsible('Troubleshooting / FAQs');
	elFaqs.addClass('faq');
	elFaqs.append(htmlFaqs);
	elAbout.appendChild(elFaqs[0]);

	const elTools = makeNewCollapsible('Other Bitsy Tools');
	elTools.append(htmlTools);
	elAbout.appendChild(elTools[0]);

	const elTips = makeNewCollapsible("AYo's Special Tips");
	elTips.append(htmlTips);
	elAbout.appendChild(elTips[0]);

	const elChangelog = makeNewCollapsible('Changelog');
	elChangelog.append(htmlChangelog);
	elAbout.appendChild(elChangelog[0]);
}

function loadDefaultString($thisField) {
	$thisField.val($thisField.data('default'));
	setSaveTrigger($thisField);
}

function loadDefaultHackOptions($thisField) {
	const id = $thisField.attr('id').replace(/-options$/, '');
	const { options } = hacks.find(i => i.metadata.id === id);
	$thisField.val(options);
	setSaveTrigger($thisField);
}

function loadDefaultBoolean($thisField) {
	let defaultVal = $thisField.data('default');
	defaultVal = defaultVal === 'true';
	if ($thisField.prop('type') === 'checkbox') {
		$thisField.prop('checked', defaultVal);
	} else {
		$thisField.val(defaultVal);
	}
	setSaveTrigger($thisField);
}

function loadDefaultTextfile($thisField) {
	const filename = $thisField.data('default');
	const fileContents = defaults[filename];
	if (!fileContents) {
		throw new Error(`Could not find file ${filename}`);
	}
	$thisField.val(fileContents);
	setSaveTrigger($thisField);
}

function loadDefaultFont($thisField) {
	readFontFile($thisField.data('default'));
}

function loadDefaultOption($thisField) {
	const { options } = $thisField[0];
	for (let i = options.length - 1; i >= 0; i--) {
		const $option = $(options[i]);
		if ($option.data('default-option') !== undefined) {
			// eslint-disable-next-line no-param-reassign
			$thisField[0].selectedIndex = i;
			break;
		}
	}
	setSaveTrigger($thisField);
}

function loadDefaults(checkSaveData = true) {
	Array.from(document.querySelectorAll('[data-save]')).forEach(i => {
		const $thisField = $(i);
		const thisSaveData = localStorage.getItem($thisField.attr('name'));
		const hasDefault = typeof $thisField.data('default') !== 'undefined';
		const hasSaveData = thisSaveData !== null;

		if (hasDefault && (!hasSaveData || !checkSaveData)) {
			const defaultType = $thisField.data('default-type');

			switch (defaultType) {
				case 'string':
					loadDefaultString($thisField);
					break;
				case 'boolean':
					loadDefaultBoolean($thisField);
					break;
				case 'textfile':
					loadDefaultTextfile($thisField);
					break;
				case 'font':
					loadDefaultFont($thisField);
					break;
				case 'option':
					loadDefaultOption($thisField);
					break;
				case 'hackOptions':
					loadDefaultHackOptions($thisField);
					break;
				default:
					throw new Error('Unknown type');
			}
		} else {
			if (hasSaveData) {
				loadThisData($thisField);
			} else {
				$thisField.val('');
			}
			setSaveTrigger($thisField);
		}
		checkAndToggleIncludedDisplay($thisField);
	});
	console.log(`Defaults loaded. Forced? ${!checkSaveData}`);
}

function restoreDefaults() {
	if (window.confirm('Are you sure you want to erase all data and restore defaults?')) {
		Array.from(document.querySelectorAll('[data-save]')).forEach(i => {
			localStorage.removeItem($(i).attr('name'));
		});
		console.log('Cookies removed');
		loadDefaults(false);
		$('#mascot').removeClass('borksyHD');
	}
}

function onFontImageLoaded() {
	const fontsize = {
		x: 6,
		y: 8,
	}; // bitsy font size
	const characters = {
		x: 16,
		y: 16,
	}; // x * y must equal 256
	const padding = 1;
	// canvas context
	const canvas = document.createElement('canvas');
	canvas.width = (fontsize.x + padding) * characters.x + padding;
	canvas.height = (fontsize.y + padding) * characters.y + padding;
	const ctx = canvas.getContext('2d');
	let fontdata = [];
	ctx.drawImage(this, 0, 0);
	// read data from canvas
	for (let y = 0; y < characters.y; ++y) {
		for (let x = 0; x < characters.x; ++x) {
			const chardata = ctx.getImageData(x * (fontsize.x + padding) + padding, y * (fontsize.y + padding) + padding, fontsize.x, fontsize.y);
			fontdata.push(chardata.data);
		}
	}
	// simplify pixels to 1-bit
	for (let i = 0; i < fontdata.length; ++i) {
		const c = [];
		for (let j = 0; j < fontdata[i].length; j += 4) {
			c.push(fontdata[i][j] > 255 / 2 ? 1 : 0);
		}
		fontdata[i] = c;
	}
	// flatten characters into fontdata
	fontdata = fontdata.flat();
	// display output
	saveThisData($('#fontdata'), `[/*${$('#fontfilename').val()}*/${fontdata.toString()}]`);
}

function readFontFile(eventOrFilename) {
	let src;
	if (typeof eventOrFilename === 'object') {
		src = eventOrFilename.target.result;
	} else {
		src = `fonts/${eventOrFilename}`;
		changeFontFilename(eventOrFilename);
	}
	// load image
	const img = new Image();
	img.onload = onFontImageLoaded;
	img.src = src;
	// if possible, change preview
	changeFontPreview();
}

function changeFontFilename(filename) {
	const $field = $('#fontfilename');
	if ($field.val() !== filename) {
		$field.val(filename);
		saveThisData($field);
	}
}

function replaceElements() {
	Array.from(document.querySelectorAll('[data-replace-element]')).forEach(i => {
		replaceThisElement($(i));
	});
}

function replaceThisElement($elementToReplace) {
	const functionName = $elementToReplace.data('replace-element');
	const $replacement = window[functionName]();
	$elementToReplace.replaceWith($replacement);
}

function changeFontPreview() {
	replaceThisElement($('[data-replace-element=createFontPreview]'));
}

function bakeHackData($element, hackName) {
	$element.attr({
		'data-save': true,
		'data-default': false,
		'data-default-type': 'boolean',
		'data-hack': hackName,
	});
}

function createThisHackMenu(hack) {
	const $collapse = makeNewCollapsible(`${hack.metadata.emoji} ${hack.metadata.name} (by ${hack.metadata.author})`);
	$collapse.attr('data-associated-hack', hack.metadata.id);

	const $description = $('<p>', {
		text: hack.metadata.summary,
	});
	$collapse.append($description);

	const $label = $('<label>', {
		class: 'horizontal',
	});
	const $checkbox = $('<input>', {
		type: 'checkbox',
		name: hack.metadata.name,
		id: hack.metadata.id,
	});
	bakeHackData($checkbox, hack.metadata.id);
	loadThisData($checkbox);
	toggleIncludedDisplay($collapse, $checkbox);
	hackIncludeTrigger($checkbox);
	$label.append($checkbox);
	$label.append(`Include "${removeExtraChars(hack.metadata.name)}" hack`);
	$collapse.append($label);

	if (hack.options) {
		const $options = makeNewCollapsible('Options');
		const $optionsLabel = $(`<label data-pre="var ${dashesToCamelCase(hack.metadata.id)}Options = {" data-post="};">`);
		const $optionsField = $('<textarea>', {
			rows: 5,
			cols: 50,
			text: hack.options,
			name: `${hack.metadata.name}.options`,
			id: `${hack.metadata.id}-options`,
		});
		$optionsField.attr({
			'data-save': true,
			'data-default-type': 'hackOptions',
			'data-default': hack.metadata.id,
		});
		loadThisData($optionsField);
		setSaveTrigger($optionsField);
		$optionsLabel.append($optionsField);
		$options.append($optionsLabel);
		$collapse.append($options);
	}

	if (hack.metadata.description) {
		const $readme = makeNewCollapsible('README');
		$readme.append($('<pre>', { text: hack.metadata.description }));
		$collapse.append($readme);
	}

	return $collapse;
}

function createHackMenus() {
	const elHackSection = document.querySelector('#hacks-section');
	hacks.forEach(hack => {
		elHackSection.appendChild(createThisHackMenu(hack)[0]);
	});
}

function makeNewCollapsible(header) {
	const elDetails = document.createElement('details');
	const $collapse = $(elDetails);
	elDetails.className = 'collapsible';
	$collapse.data('collapse', '');
	$collapse.data('header', header);
	activateThisCollapsible($collapse);
	return $collapse;
}

function activateCollapsibles() {
	Array.from(document.querySelectorAll('[data-collapsible]')).forEach(i => {
		const $thisCollapsible = $(i);
		activateThisCollapsible($thisCollapsible);
	});
	console.log('HACK IT UP YO');
	createHackMenus($('#hacks-section'));
	$('#preloader').fadeOut();
}

function activateThisCollapsible($thisCollapsible) {
	const elSummary = document.createElement('summary');
	elSummary.textContent = $thisCollapsible.data('header');
	elSummary.className = 'collapsible_header';
	$thisCollapsible.prepend(elSummary);
}

function setHotKeys() {
	$(window).bind('keydown', event => {
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
				default:
					break;
			}
		}
	});
}

activateCollapsibles();
loadAboutInfo();
loadTemplates();
loadDefaults();
replaceElements();
$('#download-button').on('click', assembleAndDownloadFile);
$('#restore-button').on('click', restoreDefaults);
setHotKeys();
$('#mascot').on('click', togglePartyMode);
