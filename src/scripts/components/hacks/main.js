import $ from 'jquery';
import {
	hacks, borksyInfo
} from '../../libs';
import {
	makeNewCollapsible
} from '../../collapsible';
import persist from '../../persist';

import html from './.html';

var loadedFiles = {};

function loadFileFromPath(filename, pathToDir, doneCallback, failCallBack, filenameOverride) {
	doneCallback = doneCallback || function () {};
	failCallBack = failCallBack || function () {};
	var $ajax = $.ajax(pathToDir + filename);
	$ajax.done(function () {
		filename = filenameOverride || filename;
		loadedFiles[filename] = escape($ajax.responseText);
		console.log('Loaded ' + filename + ' via AJAX');
		doneCallback($ajax.responseText, filenameOverride);
	});
	$ajax.fail(function () {
		//loadedFiles[filename] = "";
		console.log('Error loading ' + filename + ' via AJAX');
		failCallBack($ajax.responseText, filenameOverride);
	});
}

function dashesToCamelCase(string) {
	return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
		return group1.toUpperCase();
	});
}

function removeExtraChars(string) {
	return string.replace(/[^\w\s]/gi, '');
}

function arrayToSentenceFrag(arr) {
	if (arr.length > 1) {
		return arr.slice(0, arr.length - 1).join(', ') + ", and " + arr.slice(-1);
	} else {
		return arr[0];
	}
}

function removeConflictingHacks(conflictsArr) {
	$.each(conflictsArr, function (index, hackName) {
		var $conflictingHack = $('#' + hackName);
		var hiddenAndNotIncluded = $conflictingHack.prop('type') === 'hidden' && $conflictingHack.val() === false;
		var checkboxAndNotIncluded = $conflictingHack.prop('type') === 'checkbox' && $conflictingHack.prop('checked') === false;
		if (hiddenAndNotIncluded || checkboxAndNotIncluded) {
			return;
		}
		$conflictingHack.val(false);
		$conflictingHack.prop('checked', false);
		saveThisHack($conflictingHack, false);
	});
}

function checkAndToggleIncludedDisplay($thisField) {
	var $collapsible = $('[data-associated-hack=' + $thisField.data('hack') + ']');
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

function saveThisHack($thisHack, checkConflicts) {
	if (typeof (checkConflicts) === 'undefined') {
		checkConflicts = true;
	}
	checkAndToggleIncludedDisplay($thisHack);

	var thisConflicts = hacks[$thisHack.data('hack')].conflicts;
	if (thisConflicts && checkConflicts) {
		removeConflictingHacks(thisConflicts.split(','));
	}
}

function hackIncludeTrigger($this) {
	$this.change(function () {
		saveThisHack($this);
	});
}

function reOrderHacks() {
	var hackArray = [];
	$.each(hacks, function (hackName, hackObj) {
		hackArray.push(Object.assign({
			name: hackName
		}, hackObj));
	});
	hackArray.sort(function (obj1, obj2) {
		if (obj1.order > obj2.order) {
			return 1;
		} else if (obj1.order === obj2.order) {
			return 0;
		} else {
			return -1;
		}
	});
	return hackArray;
}

export function assembleHacks() {
	var hackBundle = '';
	var orderedHacks = reOrderHacks();
	$.each(orderedHacks, function (index, hackObj) {

		var hackName = hackObj.name;
		var filename = hackObj.type === "simple" && false ? hackName + "-min.js" : hackName + ".js";
		var $hackField = $('#' + hackName);
		var isIncluded = ($hackField.prop('checked') || ($hackField.val() === 'true'));
		if (!isIncluded) {
			return;
		}

		var hackFile = loadedFiles[filename];
		if (hackObj.type === "options") {
			var hackOptions = $('#' + hackName + '-options').val();
			hackOptions = "var hackOptions = {\n" + hackOptions + "\n};"
			hackFile = unescape(hackFile).replace(new RegExp(/^var\s+hackOptions\s?=\s?{[\s\S]*?^};$/, 'gm'), hackOptions);
		}
		hackBundle += hackFile + '\n';
	});
	return hackBundle;
}

function localHackSuccess(response, filename) {
	var hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	//var hackName = filename.substring(0,filename.length - 3);
	$("#hacks-section").append(createThisHackMenu(hackName, hacks[hackName]));
}

function localHackFail(response, filename) {
	console.error(response, filename);
}

function loadThisHackLocally(hackName) {
	hackName = hackName.substr(0, hackName.lastIndexOf('.')) || hackName;
	var filename = hackName + ".js"
	var pathToDir = "hacks/dist/";
	loadFileFromPath(filename, pathToDir, localHackSuccess, localHackFail, filename)
}

function githubHackSuccess(response, filename) {
	var hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	hacks[hackName].usingGithub = true;
	$("#hacks-section").append(createThisHackMenu(hackName, hacks[hackName]));
}

function githubHackFail(response, filename) {
	var hackName = filename.substr(0, filename.lastIndexOf('.')) || filename;
	hacks[hackName].usingGithub = false;
	loadThisHackLocally(filename, hacks[hackName]);
}

function loadThisHackFromGithub(hackName, hackInfo) {
	var filenameOverride = hackName + '.js';
	var filename = hackInfo.github;
	var pathToDir = "https://raw.githubusercontent.com/seleb/bitsy-hacks/master/dist/";
	loadFileFromPath(filename, pathToDir, githubHackSuccess, githubHackFail, filenameOverride);
}

function bakeHackData($element, hackName, hackInfo) {
	$element.attr({
		'data-save': true,
		'data-default': false,
		'data-default-type': "boolean",
		'data-hack': hackName,
		'data-hack-type': hackInfo.type
	});
	if (hackInfo.requires) {
		$element.attr('data-requires', hackInfo.requires);
	}
}

function hackMenuConflicts(hackName, hackInfo, $parentCollapse) {
	var conflictTitlesArr = []
	$.each(hackInfo.conflicts.split(','), function (index, conflictName) {
		conflictTitlesArr.push(removeExtraChars(hacks[conflictName].title));
	});
	var sentenceFrag = arrayToSentenceFrag(conflictTitlesArr);
	var $warning = $('<p>', {
		text: 'This hack conflicts with ' + sentenceFrag + '.',
		class: 'conflict-warning'
	});
	$parentCollapse.append($warning);
}

function hackGitHubMessage(hackName, hackInfo, $parentCollapse) {
	var className = "github-message";
	var msg = "";
	var hackTitle = removeExtraChars(hackInfo.title);
	if (hackInfo.forceLocal !== false) {
		msg = 'Borksy is opting to use a local version of ' + hackTitle + ' from ' + hackInfo.forceLocal + '.';
	} else if (hacks[hackName].usingGithub === true) {
		msg = hackTitle + ' is using the most recent version from Github.';
	} else {
		msg = hackTitle + ' could not be loaded from Github, local version retrieved on ' + borksyInfo.lastUpdated + ' is being used.';
		className += " warning";
	}
	var $message = $('<p>', {
		text: msg,
		class: className
	});
	$parentCollapse.append($message);
}

function hackMenuPython(hackName, hackInfo, $parentCollapse) {
	var $friendliness = makeNewCollapsible(removeExtraChars(hackInfo.title) + " Bitspy Friendliness:");
	var sentenceStart = "Use of this Hack ";
	var sentenceEnd = "";
	var bitspyLink = "<a href='https://github.com/Ragzouken/bitspy'>the Python Player for Bitsy</a> ";
	bitspyLink += "(IE: <a href='https://candle.itch.io/bitsy-boutique'>The Bitsy Boutique</a>)";
	var fine = "The features in this hack will not be available, but your game should otherwise function normally."
	var notfine = "Your game will likely appear broken."
	switch (hackInfo.python) {
		case "green":
			sentenceStart += "does not interfere with ";
			sentenceEnd = ". " + fine;
			break;
		case "yellow":
			sentenceStart += "is possible with ";
			sentenceEnd = " if and only if there is no script reference to it in dialog. " + fine;
			break;
		case "red":
		default:
			sentenceStart += "is not compatible with ";
			sentenceEnd += ". " + notfine;
			break;
	}
	var $text = $('<p>', {
		html: sentenceStart + bitspyLink + sentenceEnd
	});
	$friendliness.addClass('python').addClass(hackInfo.python).append($text);
	$parentCollapse.append($friendliness);
}

function hackMenuOptions(hackName, hackInfo, $parentCollapse) {
	var $options = makeNewCollapsible(removeExtraChars(hackInfo.title) + " Options:");
	var $optionsLabel = $('<label>', {
		text: "var " + dashesToCamelCase(hackName) + "Options = {"
	});
	loadFileFromPath(hackName + '.options.txt', 'hacks/options/', function (responseText) {
		var $optionsField = $('<textarea>', {
			rows: 5,
			cols: 50,
			text: responseText,
			name: hackName + '.options',
			id: hackName + '-options'
		});
		$optionsField.attr({
			'data-save': true,
			'data-default-type': "hackOptions",
			'data-default': hackName + '.options.txt'
		});
		persist($optionsField);
		$optionsLabel.append($optionsField);
		$optionsLabel.append(document.createTextNode("};"));
		$options.append($optionsLabel);
		$parentCollapse.append($options);
	});
}

function hackMenuReadme(hackName, hackInfo, $parentCollapse) {
	var $readme = makeNewCollapsible(removeExtraChars(hackInfo.title) + " README:");
	loadFileFromPath(hackName + '.readme.txt', 'hacks/info/', function (responseText) {
		var $pre = $('<pre>', {
			text: responseText
		});
		$readme.append($pre);
		$parentCollapse.append($readme);
	});
}

function createThisHackMenu(hackName, hackInfo) {
	var $collapse = makeNewCollapsible(hackInfo.title + " (By " + hackInfo.author + ")");
	$collapse.attr('data-associated-hack', hackName);

	var $description = $('<p>', {
		text: hackInfo.description
	});
	$collapse.append($description);

	if (hackInfo.conflicts) {
		hackMenuConflicts(hackName, hackInfo, $collapse);
	}

	hackGitHubMessage(hackName, hackInfo, $collapse);

	var $label = $('<label>', {
		text: "Include " + removeExtraChars(hackInfo.title)
	});
	var $checkbox = $('<input>', {
		type: 'checkbox',
		name: hackName,
		id: hackName
	});
	bakeHackData($checkbox, hackName, hackInfo);
	persist($checkbox);
	toggleIncludedDisplay($collapse, $checkbox);
	hackIncludeTrigger($checkbox);
	$label.append($checkbox);
	$collapse.append($label);

	if (hackInfo.type === "options") {
		hackMenuOptions(hackName, hackInfo, $collapse);
	}

	if (hackInfo.readme === true) {
		hackMenuReadme(hackName, hackInfo, $collapse);
	}

	hackMenuPython(hackName, hackInfo, $collapse);

	return $collapse;
}

function loadThisHack(hackName, hackInfo) {
	if (hackInfo.forceLocal !== false) {
		loadThisHackLocally(hackName, hackInfo)
	} else if (hackInfo.github !== false) {
		loadThisHackFromGithub(hackName, hackInfo)
	} else {
		// there's no dist version of kitsy/utils rn
	}
}

function createHackMenus() {
	$.each(hacks, function (hackName, hackObj) {
		loadThisHack(hackName, hackObj);
	});
}

var $html = $(html);

createHackMenus();

export default $html;
