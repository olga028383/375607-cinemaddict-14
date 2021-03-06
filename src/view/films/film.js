import {getYear, getTime} from '../../lib.js';
import {clipText} from '../../util.js';
import AbstractView from '../abstract-view.js';


const getActiveClassButton = (flag) => {
  return flag ? 'film-card__controls-item--active' : '';
};

const createCardTemplate = (film = {}) => {
  const {
    id = 0,
    name = '',
    rating = '',
    date = new Date(),
    runTime = '',
    genres = [],
    poster = 'made-for-each-other.png',
    description = '',
    comments = [],
    isFavorite = false,
    isWatch = false,
    isWatchList = false,
  } = film;

  return `<article class="film-card" data-id="${id}">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getYear(date)}</span>
            <span class="film-card__duration">${getTime(runTime, 'H[h] mm[m]')}</span>
            <span class="film-card__genre">${genres.join(', ')}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${clipText(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getActiveClassButton(isWatchList)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${getActiveClassButton(isWatch)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${getActiveClassButton(isFavorite)}" type="button">Mark as favorite</button>
          </div>
       </article>`;
};

export default class Film extends AbstractView {
  constructor(film) {
    super();
    this._card = film;
    this._openModalClickHandler = this._openModalClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchClickHandler = this._watchClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  setOpenModalClickHandler(callback) {
    this._callback.openModalClick = callback;

    const buttons = this.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments');
    buttons.forEach((button) => {
      button.addEventListener('click', this._openModalClickHandler);
    });
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setWatchClickHandler(callback) {
    this._callback.watchClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  _openModalClickHandler(evt) {
    evt.preventDefault();
    this._callback.openModalClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _watchClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}

