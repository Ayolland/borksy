// dynamic-background

// helper function which detects when the palette has changed,
// and updates the background to match
function palWrap(f) {
	// get the original function
	var _f = bitsy[f];

	// create the wrapper function
	bitsy[f] = function () {
		var p1, p2;

		// get current palette
		try {
			p1 = bitsy.curPal();
		} catch (e) {
			p1 = null;
		}

		if (_f) {
			// call the original function
			_f.apply(undefined, arguments);

			// get the new palette
			p2 = bitsy.curPal();

			// if the palette changed, update background
			if (p1 !== p2) {
				document.body.style.background = "rgb(" + bitsy.getPal(bitsy.curPal())[0].toString() + ")";
			}
		}
	};
}

// wrap every function which involves changing the palette
palWrap('moveSprites');
palWrap('movePlayer');
palWrap('parseWorld');