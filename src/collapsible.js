import $ from 'jquery';

export function makeNewCollapsible(header, content){
	var $collapse = $('<div>',{
		class: "collapsible"
	});
	$collapse.html(content);
	$collapse.data('collapse','');
	$collapse.data('header', header);
	activateThisCollapsible($collapse);
	return $collapse;
}

export function activateThisCollapsible($thisCollapsible){
	var $main = $('<main>');
	$main.html($thisCollapsible.children());
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
	$thisCollapsible.append($header);
	$thisCollapsible.append($closer);
	$thisCollapsible.append($main);
}
