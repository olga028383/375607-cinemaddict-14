import RankUserView from './view/rank-user.js';
import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';

import {generateFilter} from './mock/filter.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';

import FilmListPresenter from './presenter/film-list.js';

import {render, ContentPosition} from './utils/render.js';


const COUNT_CARD_All = 30;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const comments = new Array(COUNT_CARD_All).fill(null).map(() => generateComment());
const films = new Array(COUNT_CARD_All).fill(null).map(() => generateFilm(comments));
const filters = generateFilter(films);
render(headerElement, new RankUserView().getElement(), ContentPosition.BEFOREEND);
render(mainElement, new MenuView(filters).getElement(), ContentPosition.AFTERBEGIN);

new FilmListPresenter(mainElement).init(films, comments);

render(footerElement, new StatisticsView(films.length.toLocaleString()).getElement(), ContentPosition.BEFOREEND);
