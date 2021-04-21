import {getYear} from '../../lib.js';
import {getLengthTimeFormat, clipText} from '../../util.js';
import AbstractView from '../abstract-view.js';

const MAX_LENGTH_DESCRIPTION = 140;

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
    isFavorites = false,
    isWatched = false,
    isWatchList = false,
  } = film;

  return `<article class="film-card" data-id="${id}">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getYear(date)}</span>
            <span class="film-card__duration">${getLengthTimeFormat(runTime)}</span>
            <span class="film-card__genre">${genres}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${clipText(description, MAX_LENGTH_DESCRIPTION)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getActiveClassButton(isWatchList)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${getActiveClassButton(isWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${getActiveClassButton(isFavorites)}" type="button">Mark as favorite</button>
          </div>
       </article>`;
};

export default class Film extends AbstractView {
  constructor(film) {
    super();
    this._card = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.callback.click();
  }

  setClickHandler(callback) {
    this.callback.click = callback;

    const buttons = this._element.querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments');
    buttons.forEach((button) => {
      button.addEventListener('click', this._clickHandler);
    });
  }
}

