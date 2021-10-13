import $ from 'jquery';
import './libs';

function loadFileFromPath(filename, pathToDir, doneCallback, failCallBack, filenameOverride) {
	const $ajax = $.ajax(pathToDir + filename);
	$ajax.done(() => {
		window.loadedFiles[filenameOverride || filename] = escape($ajax.responseText);
		console.log(`Loaded ${filenameOverride || filename} via AJAX`);
		doneCallback?.($ajax.responseText, filenameOverride);
	});
	$ajax.fail(() => {
		console.log(`Error loading ${filename} via AJAX`);
		failCallBack?.($ajax.responseText, filenameOverride);
	});
}

function loadTemplates() {
	const templateSel = document.querySelector('select#template');
	templateSel.innerHTML = '';
	for (let i = window.borksyInfo.templates.length - 1; i >= 0; i--) {
		const filename = `${window.borksyInfo.templates[i].filename}.html`;
		const { description } = window.borksyInfo.templates[i];
		const { isDefault } = window.borksyInfo.templates[i];
		templateSel.innerHTML += `<option value="${filename}" ${isDefault ? 'data-default-option' : ''}>${description}</option>`;
		loadFileFromPath(filename, 'template/');
	}
}

function download(filename, text) {
	const element = document.createElement('a');
	element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(unescape(text))}`);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
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
	const noSavedGameData = localStorage.getItem('gamedate') == null;
	const HDgamedata = window.loadedFiles['gamedata.HD.txt'];
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

	const thisConflicts = window.hacks[$thisHack.data('hack')].conflicts;
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
	const hackArray = [];
	$.each(window.hacks, function (hackName, hackObj) {
		hackArray.push({ name: hackName, ...hackObj });
	});
	hackArray.sort(function (obj1, obj2) {
		if (obj1.order > obj2.order) {
			return 1;
		}
		if (obj1.order === obj2.order) {
			return 0;
		}
		return -1;
	});
	return hackArray;
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

		let hackFile = window.loadedFiles[filename];
		if (hackObj.type === 'options') {
			hackFile = unescape(hackFile);
			const newHackOptionsContents = $(`#${hackName}-options`).val();
			hackFile = hackFile.replace(/(var hackOptions.*= ){[^]*?}(;$)/m, `$1 {\n${newHackOptionsContents}\n} $2`);
		}
		return `${acc}${hackFile}\n`;
	}, hackBundle);
}

function assembleAndDownloadFile() {
	$('[data-save]').each(function () {
		saveThisData($(this));
	});

	const templateName = $('#template').val();
	let modifiedTemplate = window.loadedFiles[templateName].repeat(1);
	let hackBundle = '';

	modifiedTemplate = assembleSingles(modifiedTemplate);

	$('[data-borksy-replace-single]')
		.promise()
		.done(function () {
			hackBundle = assembleHacks(hackBundle);
		});

	$('[data-hack]')
		.promise()
		.done(function () {
			const filename = $('#filename').val();
			modifiedTemplate = modifiedTemplate.replace('BORKSY-HACKS', hackBundle);
			download(`${filename}.html`, modifiedTemplate);
		});
}

function togglePartyMode() {
	const $body = $('body');
	if ($body.hasClass('party')) {
		$body.removeClass('party');
		alert('😾 Party Mode Deactivated. Everyone out. 😾');
	} else {
		$body.addClass('party');
		alert('✨🌈 Party Mode Activated! 🌈✨');
	}
}

function loadHDGameData() {
	const filename = 'gamedata.HD.txt';
	const $ajax = $.ajax(`defaults/${filename}`);
	$ajax.done(function () {
		const response = $ajax.responseText;
		window.loadedFiles[filename] = response;
	});
}

function loadAboutInfo() {
	const $aboutContent = $('#about_content');
	const $ajax = $.ajax('about/about.html');
	const error = '<p>Whoa, Something went wrong!</p>';
	$ajax.done(function () {
		const response = $ajax.responseText;
		$aboutContent.html(response);

		const $ajax3 = $.ajax('about/how-to-use-borksy.html');
		$ajax3.done(function () {
			const $howto = makeNewCollapsible('How To Use Borksy');
			$howto.append($ajax3.responseText);
			$aboutContent.append($howto);
		});

		const $ajax5 = $.ajax('about/troubleshooting-faqs.html');
		$ajax5.done(function () {
			const $faqs = makeNewCollapsible('Troubleshooting / FAQs');
			$faqs.append($ajax5.responseText);
			$aboutContent.append($faqs);
		});

		const $ajax2 = $.ajax('about/other-tools.html');
		$ajax2.done(function () {
			const $tools = makeNewCollapsible('Other Bitsy Tools');
			$tools.append($ajax2.responseText);
			$aboutContent.append($tools);
		});

		const $ajax4 = $.ajax('about/ayos-special-tips.html');
		$ajax4.done(function () {
			const $tips = makeNewCollapsible("AYo's Special Tips");
			$tips.append($ajax4.responseText);
			$aboutContent.append($tips);
		});
	});
	$ajax.fail(function () {
		$aboutContent.html(error);
	});
}

function loadDefaultString($thisField) {
	$thisField.val($thisField.data('default'));
	setSaveTrigger($thisField);
}

function loadDefaultHackOptions($thisField) {
	const options = unescape(window.loadedFiles[`${$thisField.attr('name')}.txt`]);
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
	$ajax.done(function () {
		const response = $ajax.responseText;
		$thisField.val(response);
		window.loadedFiles[filename] = response;
		setSaveTrigger($thisField);
	});
	$ajax.fail(function () {
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
	$('[data-save]').each(function () {
		const $thisField = $(this);
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
	const $fields = $('[data-save]');
	let totalFields = $fields.length;
	if (confirm('Are you sure you want to erase all data and restore defaults?')) {
		$fields.each(function () {
			localStorage.removeItem($(this).attr('name'));
			if (!--totalFields) {
				console.log('Cookies removed');
				loadDefaults(false);
			}
		});
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
	fontdata = [].concat.apply([], fontdata);
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
	$('[data-replace-element]').each(function () {
		replaceThisElement($(this));
	});
}

function replaceThisElement($elementToReplace) {
	const functionName = $elementToReplace.data('replace-element');
	const $replacement = window[functionName]();
	$elementToReplace.replaceWith($replacement);
}

function createFontSelect() {
	const currentFontName = $('#fontfilename').val().slice(0, -4);
	let usingCustomFont = true;
	const $select = $('<select>', {
		id: 'fontSelect',
	});
	const $option1 = $('<option>', {
		text: 'Select Font',
		value: 0,
	});
	$option1.attr('disabled', true);
	$select.append($option1);
	$.each(fonts, function (name, description) {
		const $newOption = $('<option>', {
			text: description,
			value: name,
		});
		if (name === currentFontName) {
			$newOption.attr('selected', true);
			usingCustomFont = false;
		}
		$select.append($newOption);
	});
	if (usingCustomFont) {
		$option1.attr('selected', true);
	}
	$select.change(selectFont);
	return $select;
}

function createFontPreview() {
	let $newElement;
	const fontFilename = $('#fontfilename').val();
	const nameNoExtension = fontFilename.slice(0, -4);
	if (typeof fonts[nameNoExtension] !== 'undefined') {
		$newElement = $('<img>', {
			class: `${nameNoExtension} font-preview`,
			src: `fonts/previews/${fontFilename}`,
		});
	} else {
		$newElement = $('<label>', { text: '(Sorry, Preview Unavailable for Custom Fonts)' });
	}
	$newElement.attr('data-replace-element', 'createFontPreview');
	return $newElement;
}

function changeFontPreview() {
	replaceThisElement($('[data-replace-element=createFontPreview]'));
}

function selectFont() {
	const filename = `${this.value}.png`;
	readFontFile(filename);
}

function localHackSuccess(response, filename) {
	const elHackSection = document.querySelector('#hacks-section');
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	const hacks = Array.from(elHackSection.querySelectorAll(':scope > .collapsible')).map(i => i.dataset.associatedHack);
	hacks.push(hackName);
	hacks.sort();
	const prev = elHackSection.querySelector(`:scope > .collapsible[data-associated-hack=\"${hacks[hacks.indexOf(hackName) + 1]}\"]`);
	const elHack = createThisHackMenu(hackName, window.hacks[hackName])[0];
	if (prev) {
		elHackSection.insertBefore(elHack, prev);
	} else {
		elHackSection.appendChild(elHack);
	}
}

function localHackFail(response, filename) {}

function loadThisHackLocally(hackName, hackInfo) {
	var hackName = hackName.substr(0, hackName.lastIndexOf('.')) || hackName;
	const filename = `${hackName}.js`;
	const pathToDir = 'hacks/dist/';
	loadFileFromPath(filename, pathToDir, localHackSuccess, localHackFail, filename);
}

function githubHackSuccess(response, filename) {
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	window.hacks[hackName].usingGithub = true;
	localHackSuccess(response, filename);
}

function githubHackFail(response, filename) {
	const hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	window.hacks[hackName].usingGithub = false;
	loadThisHackLocally(filename, window.hacks[hackName]);
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
	$.each(hackInfo.conflicts.split(','), function (index, conflictName) {
		conflictTitlesArr.push(removeExtraChars(window.hacks[conflictName].title));
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
		msg = `Borksy is opting to use a local version of ${hackTitle} from ${window.borksyInfo.lastUpdated}.`;
	} else if (window.hacks[hackName].usingGithub === true) {
		msg = `${hackTitle} is using the most recent version from Github.`;
	} else {
		msg = `${hackTitle} could not be loaded from Github, local version retrieved on ${window.borksyInfo.lastUpdated} is being used.`;
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
	loadFileFromPath(`${hackName}.options.txt`, 'hacks/options/', function (responseText) {
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
	loadFileFromPath(`${hackName}.readme.txt`, 'hacks/info/', function (responseText) {
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

function createHiddenHack(hackName, hackObj) {
	const $hidden = $('<input>', {
		type: 'hidden',
		name: hackName,
		id: hackName,
	});
	bakeHackData($hidden, hackName, hackObj);
	loadThisData($hidden);

	return $hidden;
}

function createHackMenus($here) {
	$.each(Object.keys(window.hacks), function (index, hackName) {
		loadThisHack(hackName, window.hacks[hackName]);
	});
}

function makeNewCollapsible(header) {
	const $collapse = $('<div>', {
		class: 'collapsible',
	});
	$collapse.data('collapse', '');
	$collapse.data('header', header);
	activateThisCollapsible($collapse);
	return $collapse;
}

function activateCollapsibles() {
	const $collapsibles = $('[data-collapsible]');
	let counter = 0;
	$collapsibles.each(function () {
		const $thisCollapsible = $(this);
		activateThisCollapsible($thisCollapsible);
		if ($thisCollapsible.attr('id') === 'hacks-section') {
			console.log('HACK IT UP YO');
			createHackMenus($thisCollapsible);
		}
		counter++;
		if (counter === $collapsibles.length) {
			$('#preloader').fadeOut();
		}
	});
}

function activateThisCollapsible($thisCollapsible) {
	const $closer = $('<span>', {
		class: 'collapsible_closer',
		click() {
			$thisCollapsible.toggleClass('open');
		},
	});
	const $header = $('<span>', {
		class: 'collapsible_header',
		text: $thisCollapsible.data('header'),
		click() {
			$thisCollapsible.toggleClass('open');
		},
	});
	$thisCollapsible.prepend($closer);
	$thisCollapsible.prepend($header);
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

$(document).ready(function () {
	activateCollapsibles();
	loadAboutInfo();
	loadTemplates();
	loadDefaults();
	replaceElements();
	$('#download-button').click(assembleAndDownloadFile);
	$('#restore-button').click(restoreDefaults);
	setHotKeys();
	$('#mascot').click(togglePartyMode);
});
