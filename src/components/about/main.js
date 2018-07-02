import about from './about.md';
import howTo from './how-to-use-borksy.md';
import otherTools from './other-tools.md';

import $ from 'jquery';
import { makeNewCollapsible } from '../../collapsible';

var $about = $('<div>');
$about.html(about);

$about.append(makeNewCollapsible( "How To Use Borksy", howTo));
$about.append(makeNewCollapsible( "Other Bitsy Tools", otherTools));

export default $about.children();
