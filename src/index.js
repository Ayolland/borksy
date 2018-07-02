import './style/style.scss';
Promise.all([
	import('jquery'),
	import('./components/app/main')
]).then(function (modules) {
	var $ = modules[0].default;
	var $borksy = modules[1].default;
	$('body').prepend($borksy);
	$('#preloader').fadeOut({
		complete: function() {
			$('#preloader').remove();
		}
	});
});
