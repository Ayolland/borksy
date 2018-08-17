import template10 from './template/1.0.template.html';
import template21 from './template/2.1.template.html';
import template24 from './template/2.4.template.html';
import template30 from './template/3.0.template.html';
import template32 from './template/3.2.template.html';
import {
	borksyInfo
} from '../libs';

var templates = {
	'1.0': template10,
	'2.1': template21,
	'2.4': template24,
	'3.0': template30,
	'3.2': template32,
};

/**
 * Replaces placeholder values in the template file
 * with values from the provided object.
 * Object keys are case-insensitive.
 * 
 * Valid options include:
 * - title
 * - gamedata
 * - css
 * - fontdata
 * - hacks
 * - additionaljs
 * - markup
 *
 * @param {Object} options Key->value pairs to replace in the template
 * @returns {String} Assembled game
 */
export default function assemble(options) {
	return Object.entries(options).reduce(function (result, entry) {
		var key = entry[0];
		var value = entry[1];
		return result.replace('BORKSY-' + key.toUpperCase(), value);
	}, templates[borksyInfo.templateVersion]);
}
