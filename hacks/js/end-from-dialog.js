//end-from-dialog

// Implement the {end} dialog function. It schedules the game to end after the current dialog finishes.
addDeferredDialogTag('end', function (environment, parameters) {
	bitsy.startNarrating(parameters[0] || null, true);
});

// Implement the {endNow} dialog function. It starts ending narration, if any,
// and restarts the game right damn now.
addDialogTag('endNow', function (environment, parameters, onReturn) {
	onReturn(null);
	bitsy.startNarrating(parameters[0] || null, true);
});
// End of (end) dialog function mod