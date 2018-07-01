import $ from 'jquery';
import {
	fonts
} from '../../libs';

var currentFontName = '';//$('#fontfilename').val().slice(0, -4);
var usingCustomFont = true;
var $select = $('<select>', {
	id: 'fontSelect'
});
var $option1 = $('<option>', {
	text: "Select Font",
	value: 0
});
$option1.attr('disabled', true);
$select.append($option1);
fonts.forEach(function (font) {
	var $newOption = $('<option>', {
		text: font.name + ' by ' + font.author,
		value: font.name
	});
	if (font.name === currentFontName) {
		$newOption.attr('selected', true);
		usingCustomFont = false;
	}
	$select.append($newOption);
});

if (usingCustomFont) {
	$option1.attr('selected', true);
}

export default $select;
