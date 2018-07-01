import $ from 'jquery';
import {
	hacks,
	borksyInfo
} from '../../libs';
import {
	makeNewCollapsible
} from '../../collapsible';
import persist from '../../persist';

import html from './.html';
import loadHack from './loadHack';
import parseHack from './parseHack';

function toCamelCase(string) {
	return string.toLowerCase().replace(/(?:-|\s)(.)/g, function (match, group1) {
		return group1.toUpperCase();
	});
}

function toTitleCase(string) {
	return string
		.replace(/-/g, ' ')
		.split(' ')
		.map(function (str) {
			return str.substr(0, 1).toUpperCase() + str.substr(1);
		})
		.join(' ');
}

function toSentenceCase(string) {
	return (string.substr(0, 1).toUpperCase() + string.substr(1)).replace(/\.?$/, '.');
}

function toggleIncludedDisplay($collapsible, $thisHack) {
	if ($thisHack.prop('checked') === true) {
		$collapsible.addClass('included');
	} else {
		$collapsible.removeClass('included');
	}
}

function reOrderHacks(obj1, obj2) {
	return obj1.order - obj2.order;
}

export function assembleHacks() {
	var hackBundle = '';
	var orderedHacks = hacksToAssemble.slice().sort(reOrderHacks);
	$.each(orderedHacks, function (index, hackObj) {

		var hackName = toCamelCase(hackObj.file);
		var $hackField = $('#' + hackName);
		var isIncluded = ($hackField.prop('checked') || ($hackField.val() === 'true'));
		if (!isIncluded) {
			return;
		}

		var hackFile = hackObj.hackFile;
		if (hackObj.type === "options") {
			var hackOptions = $('#' + hackName + '-options').val();
			hackOptions = "var hackOptions = {\n" + hackOptions + "\n};"
			hackFile = unescape(hackFile).replace(new RegExp(/^var\s+hackOptions\s?=\s?{[\s\S]*?^};$/, 'm'), hackOptions);
		}
		hackBundle += hackFile + '\n';
	});
	return hackBundle;
}

function createThisHackMenu(options) {
	var title = toTitleCase(options.file);
	var $collapse = makeNewCollapsible(options.emoji + ' ' + title + ' (By ' + options.author + ')');
	$collapse.attr('data-associated-hack', options.file);

	var $summary = $('<p>', {
		text: toSentenceCase(options.summary)
	});
	$collapse.append($summary);

	// TODO: conflicts

	// from github/local message
	var $sourceMessage = $('<p class="github-message">');
	if (options.forceLocal) {
		$sourceMessage.text('Borksy is opting to use a local version of ' + title + '.');
	} else if (!options.isLocal) {
		$sourceMessage.text(title + ' is using the most recent version from Github.');
	} else {
		$sourceMessage.text(title + ' could not be loaded from Github, local version retrieved on ' + borksyInfo.lastUpdated + ' is being used.');
		$sourceMessage.addClass('warning');
	}
	$collapse.append($sourceMessage);

	// checkbox
	var $label = $('<label>', {
		text: "Include " + title
	});
	var $checkbox = $('<input>', {
		type: 'checkbox',
		name: options.file,
		id: toCamelCase(options.file),
	});
	persist($checkbox, false);
	toggleIncludedDisplay($collapse, $checkbox);
	$checkbox.change(function () {
		toggleIncludedDisplay($collapse, $checkbox);
	});
	$label.append($checkbox);
	$collapse.append($label);

	// bitspy friendliness
	var $friendliness = makeNewCollapsible(title + " Bitspy Friendliness:");
	var fine = 'The features in this hack will not be available, but your game should otherwise function normally.';
	var sentence = 'Use of this Hack ' +
		({
			green: 'does not interfere with ',
			yellow: 'is possible with ',
			red: 'is not compatible with '
		}[options.python]) +
		"<a href='https://github.com/Ragzouken/bitspy'>the Python Player for Bitsy</a> (IE: <a href='https://candle.itch.io/bitsy-boutique'>The Bitsy Boutique</a>)" +
		({
			green: '. ' + fine,
			yellow: ' if and only if there is no script reference to it in dialog. ' + fine,
			red: '. Your game will likely appear broken.'
		}[options.python]);
	var $text = $('<p>', {
		html: sentence
	});
	$friendliness.addClass('python').addClass(options.python).append($text);
	$collapse.append($friendliness);

	// options
	if (options.options) {
		var $options = makeNewCollapsible(title + " Options:");
		var $optionsLabel = $('<label>', {
			text: "var " + toCamelCase(options.file) + "Options = {"
		});
		var $optionsField = $('<textarea>', {
			rows: 5,
			text: options.options,
			name: toCamelCase(options.file) + '.options',
			id: toCamelCase(options.file) + '-options'
		});
		$optionsField.prop('wrap', 'off');
		persist($optionsField, options.options);
		$optionsLabel.append($optionsField);
		$optionsLabel.append(document.createTextNode("};"));
		$options.append($optionsLabel);
		$collapse.append($options);
	}

	// readme
	if (options.readme) {
		var $readme = makeNewCollapsible(title + " README:");
		var $pre = $('<pre>', {
			text: options.description
		});
		$readme.append($pre);
		$collapse.append($readme);
	}

	return $collapse;
}


var $html = $(html);

var hacksToAssemble = [];
Promise.all(
		Object.values(hacks)
		.map(async function (hack) {
			try {
				var loaded = await loadHack(hack);
				var hackInfo = parseHack(loaded.hackFile);
				var hackObj = Object.assign({}, loaded, hack, hackInfo);
				hacksToAssemble.push(hackObj);
				var $hackMenu = createThisHackMenu(hackObj);
				return $hackMenu;
			} catch (error) {
				console.error(error);
			}
		}))
	.then(function (hackMenus) {
		hackMenus
			.filter(function ($hackMenu) {
				return $hackMenu;
			}).forEach(function ($hackMenu) {
				$html.append($hackMenu);
			});
	});

export default $html;
