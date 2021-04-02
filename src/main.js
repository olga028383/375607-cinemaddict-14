import {createRankUserTemplate} from './view/rank-user.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortTemplate} from './view/sort.js';
import {createLayoutFilmsTemplate} from './view/layout-fillms.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createCardTemplate} from './view/card.js';

const COUNT_CARD_LIST = 5;
const COUNT_CARD_TOP = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const drawCardsList = (card, count) => {
  let list = card;

  for (let i = 1; i < count; i++) {
    list += card;
  }

  return list;
};

const header = document.querySelector('.header');
render(header, createRankUserTemplate(), 'beforeend');

const main = document.querySelector('.main');
render(main, createMenuTemplate(), 'afterbegin');
render(main, createSortTemplate(), 'beforeend');

let list = createFilmsListTemplate(drawCardsList(createCardTemplate(), COUNT_CARD_LIST));
list += createFilmsListExtraTemplate('Top rated', drawCardsList(createCardTemplate(), COUNT_CARD_TOP));
list += createFilmsListExtraTemplate('Most commented', drawCardsList(createCardTemplate(), COUNT_CARD_TOP));

render(main, createLayoutFilmsTemplate(list), 'beforeend');


