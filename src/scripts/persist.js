var inputs = {};

function cleanUsingRegEx($this, regExStr) {
	var regex = new RegExp(regExStr, "g");
	$this.val($this.val().replace(regex, ""));
};

function shortenString(value, length) {
	length = length || 10;
	var string = String(value);
	var ending = string.length > length ? "..." : "";
	return string.substring(0, length) + ending;
}

export default function persist($input, defaultValue) {
	var name = $input.attr('id');
	if (inputs[name]) {
		throw new Error('A persistent input with the id "' + name + '" already exists');
	}

	var isCheckbox = $input.prop('type') === 'checkbox';
	var savedValue = localStorage.getItem(name) || defaultValue;
	console.log(" Got key: " + name + " from localStorage: " + shortenString(savedValue));
	isCheckbox ? $input.prop('checked', savedValue === "true") : $input.val(savedValue);
	$input.on('change', function () {
		if ($input.data('clean-regex')) {
			cleanUsingRegEx($input, $input.data('clean-regex'));
		}
		var value = String(isCheckbox ? $input.prop('checked') : $input.val());
		localStorage.setItem(name, value);
		console.log("Key: '" + name + "' saved to localStorage: " + shortenString(value));
	});

	inputs[name] = {
		$input,
		name,
		defaultValue,
		isCheckbox
	};
}

export function clear() {
	Object.values(inputs).forEach(function (input) {
		localStorage.removeItem(input.name);
	});
}

export function restoreDefaults() {
	Object.values(inputs).forEach(function (input) {
		input.$input.val(input.defaultValue);
	});
}
