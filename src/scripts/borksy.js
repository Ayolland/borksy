import pkgHacks from '@bitsy/hecks/package.json';
import dialogPolyfill from 'dialog-polyfill';
import { saveAs } from 'file-saver';
import { compile } from 'handlebars';
import { html as htmlChangelog } from '../../CHANGELOG.md';
import pkg from '../../package.json';

const html = Object.fromEntries(Object.entries(import.meta.globEager('../about/*.md')).map(([key, value]) => [key.match(/.*\/(.*?)\.md/)[1], value.html]));
const defaults = Object.fromEntries(Object.entries(import.meta.globEager('../defaults/*.txt', { as: 'raw' })).map(([key, value]) => [key.match(/.*\/(.*?)\.txt/)[1], value]));
const hacksRaw = Object.values(import.meta.globEager('../hacks/*.txt', { as: 'raw' }));
const templates = Object.entries(import.meta.glob('../template/*.hbs'))
	.sort(([a], [b]) => a.replace('HD', '_').localeCompare(b.replace('HD', '_'), 'en', { sensitivity: 'base', numeric: true }))
	.map(([file, data], idx, arr) => {
		const [bitsyVersion] = file.match(/(?:\d\.)+\d+(?=\.hbs)/);
		const isHd = file.includes('HD');
		return {
			data,
			bitsyVersion,
			isHd,
			description: isHd ? `Bitsy HD (Bitsy ${bitsyVersion})` : `Bitsy ${bitsyVersion}`,
			id: `Bitsy${isHd ? 'HD' : ''}${bitsyVersion.replace(/\./g, '')}`,
			isDefault: idx === arr.length - 1,
		};
	});

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
		const { id, description } = templates[i];
		const isLatest = i === templates.length - 1;
		templateSel.innerHTML += `<option value="${id}" ${isLatest ? 'data-default-option' : ''}>${description}${isLatest ? ' (latest)' : ''}</option>`;
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

function cleanUsingRegEx(el, regExStr) {
	const regex = new RegExp(regExStr, 'g');
	// eslint-disable-next-line no-param-reassign
	el.value = el.value.replace(regex, '');
}

function saveThisData(el, override) {
	if (el.dataset.cleanRegex) {
		cleanUsingRegEx(el, el.dataset.cleanRegex);
	}
	let value;
	if (el.type === 'checkbox') {
		value = el.checked;
	} else if (override === undefined) {
		value = el.value;
	} else {
		value = override;
		// eslint-disable-next-line no-param-reassign
		el.value = override;
	}
	const { name } = el;
	localStorage.setItem(name, value);
	console.log(`Key: '${name}' saved to localStorage: ${shortenString(value)}`);
}

function loadThisData(el) {
	const { name } = el;
	const value = localStorage.getItem(name);
	if (value === null) {
		console.log(` Attempted to get key: ${name} from localStorage, but nothing was found.`);
		return;
	}
	if (el.type === 'checkbox') {
		const booleanVal = value === 'true';
		// eslint-disable-next-line no-param-reassign
		el.checked = booleanVal;
	} else {
		// eslint-disable-next-line no-param-reassign
		el.value = value;
	}
	console.log(` Got key: ${name} from localStorage: ${shortenString(value)}`);
}

function onTemplateChanged(event) {
	const { value } = event.currentTarget;
	const template = templates.find(i => i.id === value);
	if (!template) {
		document.querySelector('#template').value = templates.find(i => i.isDefault).id;
		onTemplateChanged(event);
		return;
	}
	if (template.isHd) {
		document.querySelector('#mascot').classList.add('borksyHD');
	} else {
		document.querySelector('#mascot').classList.remove('borksyHD');
	}
	if (template.bitsyVersion === pkgHacks.bitsyVersion) {
		document.querySelector('#legacy-version-warning').style.display = 'none';
		document.querySelector('[data-header="Bitsy Version"] > summary').textContent = 'Bitsy Version';
	} else {
		document.querySelector('#legacy-version-warning').style.display = null;
		document.querySelector('[data-header="Bitsy Version"] > summary').textContent = '❗ Bitsy Version ❗';
	}
	// preload template
	template.data();
}

function setSaveTrigger(el) {
	const { name } = el;
	let extraFunction;
	switch (name) {
		case 'template':
			extraFunction = saveTemplateExtras;
			break;
		default:
			break;
	}
	el.addEventListener('change', () => {
		saveThisData(el);
		extraFunction?.(el);
	});
}

function saveTemplateExtras(el) {
	const isHD = el.value.split('.')[0] === 'BitsyHD';
	const noSavedGameData = localStorage.getItem('gamedata') == null;
	const HDgamedata = defaults.gamedataHD;
	const HDgamedataExists = HDgamedata !== undefined;
	if (isHD) {
		if (noSavedGameData && HDgamedataExists) {
			const elGamedata = document.querySelector('#gamedata');
			elGamedata.value = HDgamedata;
			saveThisData(elGamedata);
		}
	}
}

function checkAndToggleIncludedDisplay(elHack) {
	const elCollapsible = document.querySelector(`[data-associated-hack="${elHack.dataset.hack}"]`);
	if (elCollapsible) {
		toggleIncludedDisplay(elCollapsible, elHack);
	}
}

function toggleIncludedDisplay(elCollapsible, elHack) {
	if (elHack.checked === true) {
		elCollapsible.classList.add('included');
	} else {
		elCollapsible.classList.remove('included');
	}
}

function saveThisHack(elHack) {
	saveThisData(elHack);
	checkAndToggleIncludedDisplay(elHack);
}

function hackIncludeTrigger(elHack) {
	elHack.addEventListener('change', () => {
		saveThisHack(elHack);
	});
}

function assembleSingles() {
	return Array.from(document.querySelectorAll('[data-borksy-replace-single]')).reduce((acc, i) => {
		acc[i.dataset.borksyReplaceSingle] = i.value;
		return acc;
	}, {});
}

function assembleHacks() {
	return hacks.reduce((acc, hackObj) => {
		const elHack = document.querySelector(`#${hackObj.metadata.id}`);
		const isIncluded = elHack.checked || elHack.value === 'true';
		if (!isIncluded) {
			return acc;
		}

		let hackFile = hackObj.data;
		if (hackObj.options) {
			const newHackOptionsContents = document.querySelector(`#${hackObj.metadata.id}-options`).value;
			hackFile = hackFile.replace(/(var hackOptions.*= ){[^]*?^}(;$)/m, `$1 {\n${newHackOptionsContents}\n}$2`);
		}
		return `${acc}${hackFile}\n`;
	}, '');
}

let saving = false;
async function assembleAndDownloadFile() {
	if (saving) return;
	saving = true;
	try {
		Array.from(document.querySelectorAll('[data-save]')).forEach(i => saveThisData(i));

		const templateName = document.querySelector('#template').value;
		const context = {
			'BORKSY-VERSION': pkg.version,
			'HACKS-VERSION': pkgHacks.version,
			HACKS: assembleHacks(),
			...assembleSingles(),
		};
		console.log(context);
		const filename = document.querySelector('#filename').value;
		const template = compile((await templates.find(i => i.id === templateName).data()).default);
		const file = template(context);
		download(`${filename}.html`, file);
	} finally {
		saving = false;
	}
}

function togglePartyMode() {
	const { body } = document;
	if (body.classList.contains('party')) {
		body.classList.remove('party');
		window.alert('😾 Party Mode Deactivated. Everyone out. 😾');
	} else {
		body.classList.add('party');
		window.alert('✨🌈 Party Mode Activated! 🌈✨');
	}
}

function toHtml(string) {
	const el = document.createElement('div');
	el.innerHTML = string;
	return el.children;
}

function loadAboutInfo() {
	const elAbout = document.querySelector('#about_content');
	elAbout.innerHTML = html.about.replace('HACKS_BITSY_VERSION', pkgHacks.bitsyVersion);

	const lastUpdate = document.createElement('section');
	lastUpdate.id = 'last-update';
	lastUpdate.innerHTML = htmlChangelog.match(/(<h[12][^]+?)<h[12]/m)?.[1].replace(/<h[12]>([^]+?)<\/h[12]>/g, "<h2>What's new in v$1</h2>");
	elAbout.prepend(lastUpdate);

	const elHowto = makeNewCollapsible('How To Use Borksy');
	elHowto.append(...toHtml(html['how-to-use-borksy']));
	elAbout.appendChild(elHowto);

	const elFaqs = makeNewCollapsible('Troubleshooting / FAQs');
	elFaqs.classList.add('faq');
	elFaqs.append(...toHtml(html['troubleshooting-faqs']));
	elAbout.appendChild(elFaqs);

	const elTools = makeNewCollapsible('Other Bitsy Tools');
	elTools.append(...toHtml(html['other-tools']));
	elAbout.appendChild(elTools);

	const elTips = makeNewCollapsible("AYo's Special Tips");
	elTips.append(...toHtml(html['ayos-special-tips']));
	elAbout.appendChild(elTips);

	const elChangelog = makeNewCollapsible('Changelog');
	elChangelog.append(...toHtml(htmlChangelog));
	elAbout.appendChild(elChangelog);
}

function loadDefaultString(elField) {
	// eslint-disable-next-line no-param-reassign
	elField.value = elField.dataset.default;
	setSaveTrigger(elField);
}

function loadDefaultHackOptions(elField) {
	const id = elField.id.replace(/-options$/, '');
	const { options } = hacks.find(i => i.metadata.id === id);
	// eslint-disable-next-line no-param-reassign
	elField.value = options;
	setSaveTrigger(elField);
}

function loadDefaultBoolean(elField) {
	let defaultVal = elField.dataset.default;
	defaultVal = defaultVal === 'true';
	if (elField.type === 'checkbox') {
		// eslint-disable-next-line no-param-reassign
		elField.checked = defaultVal;
	} else {
		// eslint-disable-next-line no-param-reassign
		elField.value = defaultVal;
	}
	setSaveTrigger(elField);
}

function loadDefaultTextfile(elField) {
	const filename = elField.dataset.default;
	const fileContents = defaults[filename];
	if (!fileContents) {
		throw new Error(`Could not find file ${filename}`);
	}
	// eslint-disable-next-line no-param-reassign
	elField.value = fileContents;
	setSaveTrigger(elField);
}

function loadDefaultFont(elField) {
	readFontFile(elField.dataset.default);
}

function loadDefaultOption(elField) {
	const { options } = elField;
	for (let i = options.length - 1; i >= 0; i--) {
		const elOption = options[i];
		if (elOption.dataset.defaultOption !== undefined) {
			// eslint-disable-next-line no-param-reassign
			elField.selectedIndex = i;
			break;
		}
	}
	setSaveTrigger(elField);
}

function loadDefaults(checkSaveData = true) {
	Array.from(document.querySelectorAll('[data-save]')).forEach(elField => {
		const thisSaveData = localStorage.getItem(elField.name);
		const hasDefault = typeof elField.dataset.default !== 'undefined';
		const hasSaveData = thisSaveData !== null;

		if (hasDefault && (!hasSaveData || !checkSaveData)) {
			const { defaultType } = elField.dataset;

			switch (defaultType) {
				case 'string':
					loadDefaultString(elField);
					break;
				case 'boolean':
					loadDefaultBoolean(elField);
					break;
				case 'textfile':
					loadDefaultTextfile(elField);
					break;
				case 'font':
					loadDefaultFont(elField);
					break;
				case 'option':
					loadDefaultOption(elField);
					break;
				case 'hackOptions':
					loadDefaultHackOptions(elField);
					break;
				default:
					throw new Error('Unknown type');
			}
		} else {
			if (hasSaveData) {
				loadThisData(elField);
			} else {
				// eslint-disable-next-line no-param-reassign
				elField.value = '';
			}
			setSaveTrigger(elField);
		}
		checkAndToggleIncludedDisplay(elField);
	});
	console.log(`Defaults loaded. Forced? ${!checkSaveData}`);
}

const elDialog = document.querySelector('#restore-defaults');
dialogPolyfill.registerDialog(elDialog);
if (!elDialog) throw new Error('Could not find modal');
elDialog.querySelector('button[value="yes"]').addEventListener('click', () => {
	Array.from(document.querySelectorAll('[data-save]')).forEach(i => {
		localStorage.removeItem(i.name);
	});
	console.log('Cookies removed');
	loadDefaults(false);
	document.querySelector('#mascot').classList.remove('borksyHD');
	elDialog.close();
});
elDialog.querySelector('button[value="cancel"]').addEventListener('click', () => {
	elDialog.close();
});
function restoreDefaults() {
	elDialog.showModal();
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
	saveThisData(document.querySelector('#fontdata'), `[/*${document.querySelector('#fontfilename').value}*/${fontdata.toString()}]`);
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
}

function changeFontFilename(filename) {
	const el = document.querySelector('#fontfilename');
	if (el.value !== filename) {
		el.value = filename;
		saveThisData(el);
	}
}

function bakeHackData(el, hackName) {
	/* eslint-disable no-param-reassign */
	el.dataset.save = true;
	el.dataset.default = false;
	el.dataset.defaultType = 'boolean';
	el.dataset.hack = hackName;
	/* eslint-enable no-param-reassign */
}

function createThisHackMenu(hack) {
	const elCollapse = makeNewCollapsible(`${hack.metadata.emoji} ${hack.metadata.name} (by ${hack.metadata.author})`);
	elCollapse.dataset.associatedHack = hack.metadata.id;

	const elDescription = document.createElement('p');
	elDescription.textContent = hack.metadata.summary;
	elCollapse.append(elDescription);

	const elLabel = document.createElement('label');
	elLabel.className = 'horizontal';

	const elCheckbox = document.createElement('input');
	elCheckbox.type = 'checkbox';
	elCheckbox.name = hack.metadata.name;
	elCheckbox.id = hack.metadata.id;

	bakeHackData(elCheckbox, hack.metadata.id);
	loadThisData(elCheckbox);
	toggleIncludedDisplay(elCollapse, elCheckbox);
	hackIncludeTrigger(elCheckbox);
	elLabel.append(elCheckbox);
	elLabel.append(`Include "${removeExtraChars(hack.metadata.name)}" hack`);
	elCollapse.append(elLabel);

	if (hack.options) {
		const elOptions = makeNewCollapsible('Options');
		const elOptionsLabel = document.createElement('label');
		elOptionsLabel.dataset.pre = `var ${dashesToCamelCase(hack.metadata.id)}Options = {`;
		elOptionsLabel.dataset.post = '};';
		const elOptionsField = document.createElement('textarea');
		elOptionsField.rows = 5;
		elOptionsField.cols = 50;
		elOptionsField.textContent = hack.options;
		elOptionsField.name = `${hack.metadata.name}.options`;
		elOptionsField.id = `${hack.metadata.id}-options`;
		elOptionsField.dataset.save = true;
		elOptionsField.dataset.default = hack.metadata.id;
		elOptionsField.dataset.defaultType = 'hackOptions';
		loadThisData(elOptionsField);
		setSaveTrigger(elOptionsField);
		elOptionsLabel.append(elOptionsField);
		elOptions.append(elOptionsLabel);
		elCollapse.append(elOptions);
	}

	if (hack.metadata.description) {
		const elReadme = makeNewCollapsible('README');
		const elPre = document.createElement('pre');
		elPre.textContent = hack.metadata.description;
		elReadme.append(elPre);
		elCollapse.append(elReadme);
	}

	return elCollapse;
}

function createHackMenus() {
	const elHackSection = document.querySelector('#hacks-section');
	hacks.forEach(hack => {
		elHackSection.appendChild(createThisHackMenu(hack));
	});
}

function makeNewCollapsible(header) {
	const elDetails = document.createElement('details');
	elDetails.className = 'collapsible';
	elDetails.dataset.collapse = '';
	elDetails.dataset.header = header;
	activateThisCollapsible(elDetails);
	return elDetails;
}

function activateCollapsibles() {
	Array.from(document.querySelectorAll('[data-collapsible]')).forEach(activateThisCollapsible);
	console.log('HACK IT UP YO');
	createHackMenus();
	document.querySelector('#preloader').remove();
}

function activateThisCollapsible(elCollapsible) {
	const elSummary = document.createElement('summary');
	elSummary.textContent = elCollapsible.dataset.header;
	elSummary.className = 'collapsible_header';
	elCollapsible.prepend(elSummary);
}

function setHotKeys() {
	window.addEventListener('keydown', event => {
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

document.querySelector('#download-button').addEventListener('click', assembleAndDownloadFile);
document.querySelector('#restore-button').addEventListener('click', restoreDefaults);
document.querySelector('#mascot').addEventListener('click', togglePartyMode);
document.querySelector('#template').addEventListener('change', onTemplateChanged);
activateCollapsibles();
loadAboutInfo();
loadTemplates();
loadDefaults();
setHotKeys();
onTemplateChanged({ currentTarget: document.querySelector('#template') });
