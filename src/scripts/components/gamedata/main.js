import $ from 'jquery';
import persist from '../../persist';

import html from './.html';
import gamedata from './gamedata.txt';

var $html = $(html);

persist($html.find('#gamedata'), gamedata);

export default $html;
