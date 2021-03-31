import {createRankUserTemplate} from './view/rank-user.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createCardDetailTemplate} from './view/card-detail.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');
render(header, createRankUserTemplate(), 'beforeend');

const main = document.querySelector('.main');
render(main, createMenuTemplate(), 'afterbegin');
render(main, createSortTemplate(), 'beforeend');

const list = document.createElement('section');
list.classList.add('films');
render(list, createFilmsListTemplate(), 'beforeend');
render(list, createFilmsListExtraTemplate('Top rated'), 'beforeend');
render(list, createFilmsListExtraTemplate('Most commented'), 'beforeend');

main.appendChild(list);
