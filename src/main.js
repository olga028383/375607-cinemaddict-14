import RankUserView from './view/rank-user.js';
import StatsFooterView from './view/footer/stats.js';

import MenuView from './view/menu/menu.js';
import StatsItemView from './view/menu/stats-item.js';
import StatsView from './view/stats.js';

import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';

import FiltersPresenter from './presenter/filters.js';
import FilmListPresenter from './presenter/film-list.js';

import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

import {PeriodValues} from './constants.js';
import {render, ContentPosition, remove} from './utils/render.js';

const COUNT_CARD_All = 100;
const COUNT_COMMENTS_All = 250;

const comments = new Array(COUNT_COMMENTS_All).fill(null).map(() => generateComment());
const films = new Array(COUNT_CARD_All).fill(null).map(() => generateFilm(comments));

const filmsModel = new FilmsModel();
filmsModel.set(films);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const menuElement = new MenuView().getElement();
const statsItemComponent = new StatsItemView();
let statsViewComponent = null;

render(headerElement, new RankUserView(filmsModel.get().slice().filter((film) => film.isWatch)).getElement(), ContentPosition.BEFOREEND);
render(menuElement, statsItemComponent.getElement(), ContentPosition.BEFOREEND);
render(mainElement, menuElement, ContentPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(mainElement, filterModel, filmsModel, comments);
const filterPresenter = new FiltersPresenter(menuElement, filterModel, filmsModel);
filterPresenter.init();

filmListPresenter.init();

statsItemComponent.setClickHandler(() => {
  statsViewComponent = new StatsView(filmsModel.get().slice().filter((film) => film.isWatch), PeriodValues.ALL);
  render(mainElement, statsViewComponent.getElement(), ContentPosition.BEFOREEND);
  filmListPresenter.destroy();
  filterPresenter.removeActiveClass();

  filterPresenter.replaceWindow(()=>{
    filterPresenter.init();
    filmListPresenter.init();
    statsItemComponent.removeActiveClass();
    remove(statsViewComponent);
  });
});

render(footerElement, new StatsFooterView(films.length.toLocaleString()).getElement(), ContentPosition.BEFOREEND);
