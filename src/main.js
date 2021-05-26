import RankUserView from './view/rank-user.js';
import NetworkView from './view/network.js';

import MenuView from './view/menu/menu.js';
import StatsItemView from './view/menu/stats-item.js';
import StatsView from './view/stats.js';

import FiltersPresenter from './presenter/filters.js';
import FilmListPresenter from './presenter/film-list.js';

import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

import {PeriodValues, UpdateType} from './constants.js';
import {render, ContentPosition, remove} from './utils/render.js';
import {getRankUser} from './utils/stats.js';

import {getConnect} from './utils/api.js';
import {isOnline} from './util.js';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const logoElement = document.querySelector('.logo');
const mainElement = document.querySelector('.main');

const menuElement = new MenuView().getElement();
const statsItemComponent = new StatsItemView();
let statsViewComponent = null;

render(menuElement, statsItemComponent.getElement(), ContentPosition.BEFOREEND);
render(mainElement, menuElement, ContentPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(mainElement, filterModel, filmsModel);
const filterPresenter = new FiltersPresenter(menuElement, filterModel, filmsModel);
filterPresenter.init();

filmListPresenter.init();

statsItemComponent.setClickHandler(() => {
  statsViewComponent = new StatsView(filmsModel.get().slice().filter((film) => film.isWatch), PeriodValues.ALL);
  render(mainElement, statsViewComponent.getElement(), ContentPosition.BEFOREEND);
  filmListPresenter.destroy();
  filterPresenter.removeActiveClass();

  filterPresenter.replaceWindow(() => {
    filterPresenter.init();
    filmListPresenter.init();
    statsItemComponent.removeActiveClass();
    remove(statsViewComponent);
  });
});

getConnect().getFilms()
  .then((films) => {
    filmsModel.set([UpdateType.INIT], films);
    render(headerElement, new RankUserView(getRankUser(filmsModel.get().slice().filter((film) => film.isWatch))).getElement(), ContentPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.set([UpdateType.INIT], []);
  });

// window.addEventListener('load', () => {
//   navigator.serviceWorker.register('/sw.js');
// });

const networkComponent = isOnline() ? new NetworkView(true) : new NetworkView(false);
render(logoElement, networkComponent.getElement(), ContentPosition.BEFOREEND);

window.addEventListener('online', () => {
  networkComponent.updateData({
    isOnline: true,
  });

  getConnect().sync();
});

window.addEventListener('offline', () => {
  networkComponent.updateData({
    isOnline: false,
  });
});
