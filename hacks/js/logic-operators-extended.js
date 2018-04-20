/**
🔀
@file logic-operators-extended
@summary adds conditional logic operators
@version 1.0.1
@author @mildmojo
*/

inject('operatorMap.set("-", subExp);',
	'operatorMap.set("&&", andExp);',
	'operatorMap.set("||", orExp);',
	'operatorMap.set("&&!", andNotExp);',
	'operatorMap.set("||!", orNotExp);',
	'operatorMap.set("!==", notEqExp);');
inject('var operatorSymbols = ["-", "+", "/", "*", "<=", ">=", "<", ">", "=="];',
	'operatorSymbols.unshift("!==", "&&", "||", "&&!", "||!");');

bitsy.andExp = function andExp(environment, left, right, onReturn) {
	right.Eval(environment, function (rVal) {
		left.Eval(environment, function (lVal) {
			onReturn(lVal && rVal);
		});
	});
};

bitsy.orExp = function orExp(environment, left, right, onReturn) {
	right.Eval(environment, function (rVal) {
		left.Eval(environment, function (lVal) {
			onReturn(lVal || rVal);
		});
	});
};

bitsy.notEqExp = function notEqExp(environment, left, right, onReturn) {
	right.Eval(environment, function (rVal) {
		left.Eval(environment, function (lVal) {
			onReturn(lVal !== rVal);
		});
	});
};

bitsy.andNotExp = function andNotExp(environment, left, right, onReturn) {
	right.Eval(environment, function (rVal) {
		left.Eval(environment, function (lVal) {
			onReturn(lVal && !rVal);
		});
	});
};

bitsy.orNotExp = function orNotExp(environment, left, right, onReturn) {
	right.Eval(environment, function (rVal) {
		left.Eval(environment, function (lVal) {
			onReturn(lVal || !rVal);
		});
	});
};
// End of logic operators mod