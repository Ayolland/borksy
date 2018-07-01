import $ from 'jquery';
import persist from '../../persist';

import html from './.html';

var $html = $(html);

persist($html.find('#title'), "My Bitsy Game By Me");
persist($html.find('#filename'), "myBORKSYgame");

export default $html;
