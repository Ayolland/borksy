import $ from 'jquery';
import persist from '../../persist';

import html from './.html';
import markup from './body.txt';
import css from './style.txt';

var $html = $(html);

persist($html.find('#markup'), markup);
persist($html.find('#css'), css);

export default $html;
