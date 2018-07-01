import about from './about.md';
import howTo from './how-to-use-borksy.md';
import otherTools from './other-tools.md';

import $ from 'jquery';
import { makeNewCollapsible } from '../../collapsible';

var $about = $('<div></div>');
$about.html(about);

var $howto = makeNewCollapsible( "How To Use Borksy" );
$howto.append(howTo);
$about.append($howto);

var $tools = makeNewCollapsible( "Other Bitsy Tools" );
$tools.append(otherTools);
$about.append($tools);

export default $about.children();
