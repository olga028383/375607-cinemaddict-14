import RankUserView from './view/rank-user.js';
import StatisticsView from './view/statistics.js';

import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';

import FiltersPresenter from './presenter/filters.js';
import FilmListPresenter from './presenter/film-list.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import {render, ContentPosition} from './utils/render.js';


const COUNT_CARD_All = 30;
const COUNT_COMMENTS_All = 250;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const comments = new Array(COUNT_COMMENTS_All).fill(null).map(() => generateComment());
const films = new Array(COUNT_CARD_All).fill(null).map(() => generateFilm(comments));

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

render(headerElement, new RankUserView().getElement(), ContentPosition.BEFOREEND);

new FiltersPresenter(mainElement, filterModel, filmsModel).init();
new FilmListPresenter(mainElement, filmsModel, commentsModel, filterModel).init();

render(footerElement, new StatisticsView(films.length.toLocaleString()).getElement(), ContentPosition.BEFOREEND);
