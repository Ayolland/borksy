import $ from 'jquery';
import persist from '../../persist';

import html from './.html';
import fontdata from './fontdata.txt';

import $fontSelect from './fontselect';
import {
	fonts
} from '../../libs';

function loadFontImage(event) {
	var input = event.target;
	if (!input.files || !input.files[0]) {
		// do nothing
		return;
	}
	// read image
	var reader = new FileReader();
	reader.onload = readFontFile;
	changeFontFilename(input.files[0].name);
	reader.readAsDataURL(input.files[0]);
	$('.font-preview').attr('src', null); // update preview
}

function readFontFile(eventOrFilename) {
	var src;
	if (typeof (eventOrFilename) === 'object') {
		src = eventOrFilename.target.result;
	} else {
		src = eventOrFilename;
	}
	// load image
	var img = new Image();
	img.onload = onFontImageLoaded;
	img.src = src;
}

function onFontImageLoaded() {
	var fontsize = {
		x: 6,
		y: 8
	}; // bitsy font size
	var characters = {
		x: 16,
		y: 16
	}; // x * y must equal 256
	var padding = 1;
	// canvas context
	var canvas = document.createElement('canvas');
	canvas.width = (fontsize.x + padding) * characters.x + padding;
	canvas.height = (fontsize.y + padding) * characters.y + padding;
	var ctx = canvas.getContext('2d');
	var fontdata = [];
	ctx.drawImage(this, 0, 0);
	// read data from canvas
	for (var y = 0; y < characters.y; ++y) {
		for (var x = 0; x < characters.x; ++x) {
			var chardata = ctx.getImageData(x * (fontsize.x + padding) + padding, y * (fontsize.y + padding) + padding, fontsize.x, fontsize.y);
			fontdata.push(chardata.data);
		}
	}
	// simplify pixels to 1-bit
	for (var i = 0; i < fontdata.length; ++i) {
		var c = [];
		for (var j = 0; j < fontdata[i].length; j += 4) {
			c.push(fontdata[i][j] > 255 / 2 ? 1 : 0);
		}
		fontdata[i] = c;
	}
	// flatten characters into fontdata
	fontdata = [].concat.apply([], fontdata);
	// display output
	//document.getElementById('fontdata').value = "[" + fontdata.toString() + "]";
	$fontdata.val("[/*" + $fileInput.val() + "*/" + fontdata.toString() + "]");
	$fontdata.change();
}

function changeFontFilename(filename) {
	if ($fileInput.val() !== filename) {
		$fileInput.val(filename);
		$fileInput.change();
	}
}

function selectFont() {
	var font = fonts.find(function (font) {
		return font.name === $fontSelect.val();
	});
	changeFontFilename(font.name);
	readFontFile(font.data);
	$('.font-preview').attr('src', font.preview); // update preview
}

var $html = $(html);
var $fileInput = $html.find('#fontfilename');
var $fontdata = $html.find('#fontdata');

persist($fontdata, fontdata);
persist($fileInput);

$html.find('#font-file-input').on('change', loadFontImage);
$html.find('#font-select').replaceWith($fontSelect);
$fontSelect.change(selectFont);

export default $html;
