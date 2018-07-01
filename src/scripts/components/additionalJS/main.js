import $ from 'jquery';
import persist from '../../persist';

import html from './.html';

var $html = $(html);

persist($html.find('#additionalJS'), '');

export default $html;
