import { saveAs } from 'file-saver';
import $ from 'jquery';
import { html as htmlChangelog } from '../../CHANGELOG.md';
import { htmlAbout, htmlFaqs, htmlHowto, htmlTips, htmlTools } from '../about';
import { borksyInfo, hacks } from './libs';

const loadedFiles = {};

async function loadFileFromPath(filename, pathToDir, doneCallback, failCallBack, filenameOverride) {
	try {
		const response = await fetch(pathToDir + filename);
		const text = await response.text();
		loadedFiles[filenameOverride || filename] = text;
		doneCallback?.(text, filenameOverride);
	} catch (err) {
		console.error(`Error loading ${filename}`, err);
		failCallBack?.(err, filenameOverride);
	}
}

function loadTemplates() {
	const templateSel = document.querySelector('select#template');
	templateSel.innerHTML = '';
	for (let i = borksyInfo.templates.length - 1; i >= 0; i--) {
		const filename = `${borksyInfo.templates[i].filename}.html`;
		const { description } = borksyInfo.templates[i];
		const { isDefault } = borksyInfo.templates[i];
		templateSel.innerHTML += `<option value="${filename}" ${isDefault ? 'data-default-option' : ''}>${description}</option>`;
		loadFileFromPath(filename, 'template/');
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

function arrayToSentenceFrag(arr) {
	if (arr.length > 1) {
		return `${arr.slice(0, arr.length - 1).join(', ')}, and ${arr.slice(-1)}`;
	}
	return arr[0];
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
	if (name === 'template' && value.split('.')[0] === 'BitsyHD') {
		$('#mascot').addClass('borksyHD');
		console.log('BitsyHD detected');
	}
}

function setSaveTrigger($this) {
	const name = $this.attr('name');
	let extraFunction;
	switch (name) {
		case 'template':
			loadHDGameData();
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
	const HDgamedata = loadedFiles['gamedata.HD.txt'];
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

function removeConflictingHacks(conflictsArr) {
	$.each(conflictsArr, (_index, hackName) => {
		const $conflictingHack = $(`#${hackName}`);
		const hiddenAndNotIncluded = $conflictingHack.prop('type') === 'hidden' && $conflictingHack.val() === false;
		const checkboxAndNotIncluded = $conflictingHack.prop('type') === 'checkbox' && $conflictingHack.prop('checked') === false;
		if (hiddenAndNotIncluded || checkboxAndNotIncluded) {
			return;
		}
		$conflictingHack.val(false);
		$conflictingHack.prop('checked', false);
		saveThisHack($conflictingHack, false);
	});
}

function checkAndToggleIncludedDisplay($thisField) {
	const $collapsible = $(`[data-associated-hack=${$thisField.data('hack')}]`);
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

function saveThisHack($thisHack, checkConflicts = true) {
	saveThisData($thisHack);
	checkAndToggleIncludedDisplay($thisHack);

	const thisConflicts = hacks[$thisHack.data('hack')].conflicts;
	if (thisConflicts && checkConflicts) {
		removeConflictingHacks(thisConflicts.split(','));
	}
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

function reOrderHacks() {
	return Object.entries(hacks)
		.map(([hackName, hackObj]) => ({ name: hackName, ...hackObj }))
		.sort(({ order: a }, { order: b }) => a - b);
}

function assembleHacks(hackBundle) {
	const orderedHacks = reOrderHacks();
	return orderedHacks.reduce((acc, hackObj) => {
		const hackName = hackObj.name;
		const filename = `${hackName}.js`;
		const $hackField = $(`#${hackName}`);
		const isIncluded = $hackField.prop('checked') || $hackField.val() === 'true';
		if (!isIncluded) {
			return acc;
		}

		let hackFile = loadedFiles[filename];
		if (hackObj.type === 'options') {
			hackFile = unescape(hackFile);
			const newHackOptionsContents = $(`#${hackName}-options`).val();
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
	let modifiedTemplate = loadedFiles[templateName].repeat(1);
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

function loadHDGameData() {
	const filename = 'gamedata.HD.txt';
	const $ajax = $.ajax(`defaults/${filename}`);
	$ajax.done(() => {
		const response = $ajax.responseText;
		loadedFiles[filename] = response;
	});
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
	const options = unescape(loadedFiles[`${$thisField.attr('name')}.txt`]);
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
	const path = `defaults/${filename}`;
	const $ajax = $.ajax(path);
	$ajax.done(() => {
		const response = $ajax.responseText;
		$thisField.val(response);
		loadedFiles[filename] = response;
		setSaveTrigger($thisField);
	});
	$ajax.fail(() => {
		$thisField.val('failed to load default!');
		console.log($ajax.error);
		setSaveTrigger($thisField);
	});
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

function localHackSuccess(response, filename) {
	const elHackSection = document.querySelector('#hacks-section');
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	const loadedHacks = Array.from(elHackSection.querySelectorAll(':scope > .collapsible')).map(i => i.dataset.associatedHack);
	loadedHacks.push(hackName);
	loadedHacks.sort();
	const prev = elHackSection.querySelector(`:scope > .collapsible[data-associated-hack="${loadedHacks[loadedHacks.indexOf(hackName) + 1]}"]`);
	const elHack = createThisHackMenu(hackName, hacks[hackName])[0];
	if (prev) {
		elHackSection.insertBefore(elHack, prev);
	} else {
		elHackSection.appendChild(elHack);
	}
}

function localHackFail() {}

function loadThisHackLocally(hackName) {
	const filename = `${hackName.substr(0, hackName.lastIndexOf('.')) || hackName}.js`;
	const pathToDir = 'hacks/dist/';
	loadFileFromPath(filename, pathToDir, localHackSuccess, localHackFail, filename);
}

function githubHackSuccess(response, filename) {
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	hacks[hackName].usingGithub = true;
	localHackSuccess(response, filename);
}

function githubHackFail(response, filename) {
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	hacks[hackName].usingGithub = false;
	loadThisHackLocally(filename, hacks[hackName]);
}

function loadThisHackFromGithub(hackName, hackInfo) {
	const filenameOverride = `${hackName}.js`;
	const filename = hackInfo.github;
	const pathToDir = 'https://raw.githubusercontent.com/seleb/bitsy-hacks/main/dist/';
	loadFileFromPath(filename, pathToDir, githubHackSuccess, githubHackFail, filenameOverride);
}

function loadThisHack(hackName, hackInfo) {
	if (hackInfo.forceLocal !== false) {
		loadThisHackLocally(hackName, hackInfo);
	} else if (hackInfo.github !== false) {
		loadThisHackFromGithub(hackName, hackInfo);
	} else {
		// there's no dist version of kitsy/utils rn
	}
}

function bakeHackData($element, hackName, hackInfo) {
	$element.attr({
		'data-save': true,
		'data-default': false,
		'data-default-type': 'boolean',
		'data-hack': hackName,
		'data-hack-type': hackInfo.type,
	});
	if (hackInfo.requires) {
		$element.attr('data-requires', hackInfo.requires);
	}
}

function hackMenuConflicts(hackName, hackInfo, $parentCollapse) {
	const conflictTitlesArr = [];
	$.each(hackInfo.conflicts.split(','), (index, conflictName) => {
		conflictTitlesArr.push(removeExtraChars(hacks[conflictName].title));
	});
	const sentenceFrag = arrayToSentenceFrag(conflictTitlesArr);
	const $warning = $('<p>', {
		text: `This hack conflicts with ${sentenceFrag}.`,
		class: 'conflict-warning',
	});
	$parentCollapse.append($warning);
}

function hackGitHubMessage(hackName, hackInfo, $parentCollapse) {
	let className = 'github-message';
	let msg = '';
	const hackTitle = removeExtraChars(hackInfo.title);
	if (hackInfo.forceLocal !== false) {
		msg = `Borksy is opting to use a local version of ${hackTitle} from ${borksyInfo.lastUpdated}.`;
	} else if (hacks[hackName].usingGithub === true) {
		msg = `${hackTitle} is using the most recent version from Github.`;
	} else {
		msg = `${hackTitle} could not be loaded from Github, local version retrieved on ${borksyInfo.lastUpdated} is being used.`;
		className += ' warning';
	}
	const $message = $('<p>', {
		text: msg,
		class: className,
	});
	$parentCollapse.append($message);
}

function hackMenuOptions(hackName, hackInfo, $parentCollapse) {
	const $options = makeNewCollapsible(`${removeExtraChars(hackInfo.title)} Options:`);
	const $optionsLabel = $('<label>', {
		text: `var ${dashesToCamelCase(hackName)}Options = {`,
	});
	loadFileFromPath(`${hackName}.options.txt`, 'hacks/options/', responseText => {
		const $optionsField = $('<textarea>', {
			rows: 5,
			cols: 50,
			text: responseText,
			name: `${hackName}.options`,
			id: `${hackName}-options`,
		});
		$optionsField.attr({
			'data-save': true,
			'data-default-type': 'hackOptions',
			'data-default': `${hackName}.options.txt`,
		});
		loadThisData($optionsField);
		setSaveTrigger($optionsField);
		$optionsLabel.append($optionsField);
		$optionsLabel.append(document.createTextNode('};'));
		$options.append($optionsLabel);
		$parentCollapse.append($options);
	});
}

function hackMenuReadme(hackName, hackInfo, $parentCollapse) {
	const $readme = makeNewCollapsible(`${removeExtraChars(hackInfo.title)} README:`);
	loadFileFromPath(`${hackName}.readme.txt`, 'hacks/info/', responseText => {
		const $pre = $('<pre>', {
			text: responseText,
		});
		$readme.append($pre);
		$parentCollapse.append($readme);
	});
}

function createThisHackMenu(hackName, hackInfo) {
	const $collapse = makeNewCollapsible(`${hackInfo.title} (By ${hackInfo.author})`);
	$collapse.attr('data-associated-hack', hackName);

	const $description = $('<p>', {
		text: hackInfo.description,
	});
	$collapse.append($description);

	if (hackInfo.conflicts) {
		hackMenuConflicts(hackName, hackInfo, $collapse);
	}

	hackGitHubMessage(hackName, hackInfo, $collapse);

	const $label = $('<label>', {
		text: `Include ${removeExtraChars(hackInfo.title)}`,
	});
	const $checkbox = $('<input>', {
		type: 'checkbox',
		name: hackName,
		id: hackName,
	});
	bakeHackData($checkbox, hackName, hackInfo);
	loadThisData($checkbox);
	toggleIncludedDisplay($collapse, $checkbox);
	hackIncludeTrigger($checkbox);
	$label.append($checkbox);
	$collapse.append($label);

	if (hackInfo.type === 'options') {
		hackMenuOptions(hackName, hackInfo, $collapse);
	}

	if (hackInfo.readme === true) {
		hackMenuReadme(hackName, hackInfo, $collapse);
	}

	return $collapse;
}

function createHackMenus() {
	$.each(Object.keys(hacks), (index, hackName) => {
		loadThisHack(hackName, hacks[hackName]);
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
		if ($thisCollapsible.attr('id') === 'hacks-section') {
			console.log('HACK IT UP YO');
			createHackMenus($thisCollapsible);
		}
	});
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

$(() => {
	activateCollapsibles();
	loadAboutInfo();
	loadTemplates();
	loadDefaults();
	replaceElements();
	$('#download-button').on('click', assembleAndDownloadFile);
	$('#restore-button').on('click', restoreDefaults);
	setHotKeys();
	$('#mascot').on('click', togglePartyMode);
});
