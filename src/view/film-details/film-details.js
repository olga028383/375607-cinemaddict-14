import {getDateFormat} from '../../lib.js';
import {getLengthTimeFormat} from '../../util.js';
import AbstractView from '../abstract-view.js';

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};

const createButtonTemplate = (slug, name, flag) => {
  return `<input type="checkbox" class="film-details__control-input visually-hidden" id="${slug}" name="${slug}" ${flag ? 'checked' : ''}>
    <label for="${slug}" class="film-details__control-label film-details__control-label--${slug}">${name}</label>`;
};

const createCardDetailTemplate = (film = {}) => {
  const {
    name = '',
    originalName = '',
    producer = '',
    rating = '',
    date = new Date(),
    runTime = '',
    genres = [],
    actors = [],
    scenarists = [],
    poster = 'made-for-each-other.png',
    description = '',
    country = '',
    ageRating = 0,
    isFavorite = false,
    isWatch = false,
    isWatchList = false,
  } = film;

  return `
      <div><div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${producer}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${scenarists.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getDateFormat(date, 'DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getLengthTimeFormat(runTime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
              ${createGenresTemplate(genres)}
               </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
       
        ${createButtonTemplate('watchlist', 'Add to watchlist', isWatchList)}
        ${createButtonTemplate('watched', 'Already watched', isWatch)}
        ${createButtonTemplate('favorite', 'Add to favorites', isFavorite)}
        
      </section></div>`;
};

export default class FilmDetails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchClickHandler = this._watchClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createCardDetailTemplate(this._film);
  }

  setWatchListClickHandler(callback) {
    this.callback.watchListClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setWatchClickHandler(callback) {
    this.callback.watchClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._watchClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this.callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this.callback.watchListClick();
  }

  _watchClickHandler(evt) {
    evt.preventDefault();
    this.callback.watchClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.callback.favoriteClick();
  }
}


