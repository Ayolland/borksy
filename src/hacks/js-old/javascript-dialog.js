// javascript-dialog

var indirectEval = eval;
addDialogTag('js', function (environment, parameters, onReturn) {
	indirectEval(parameters[0]);
	onReturn(null);
});