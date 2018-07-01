var inputs = {};

export default function persist($input, defaultValue) {
	var name = $input.attr('id');
	var savedValue = localStorage.getItem(name) || defaultValue;
	$input.val(savedValue);
	$input.on('change', function () {
		localStorage.setItem(name, $input.val());
	});
	inputs[name] = {
		$input,
		name,
		defaultValue
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
