import $ from 'jquery';

export function makeNewCollapsible(header){
	var $collapse = $('<div>',{
		class: "collapsible"
	});
	$collapse.data('collapse','');
	$collapse.data('header', header);
	activateThisCollapsible($collapse);
	return $collapse;
}

export function activateThisCollapsible($thisCollapsible){
	var $closer = $('<span>', {
		class: "collapsible_closer",
		click: function(){
			$thisCollapsible.toggleClass('open');
		}
	});
	var $header = $('<span>', {
		class: "collapsible_header",
		text: $thisCollapsible.data('header'),
		click: function(){
			$thisCollapsible.toggleClass('open');
		}
	});
	$thisCollapsible.prepend($closer);
	$thisCollapsible.prepend($header);
}
