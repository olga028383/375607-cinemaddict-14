import {getDateFormat} from '../lib.js';
import {getLengthTimeFormat, createElement} from '../util.js';

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};

const createButtonTemplate = (slug, name, flag) => {
  return `<input type="checkbox" class="film-details__control-input visually-hidden" id="${slug}" name="${slug}" ${flag ? 'checked' : ''}>
    <label for="${slug}" class="film-details__control-label film-details__control-label--${slug}">${name}</label>`;
};

const createCardDetailTemplate = (card = {}) => {
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
    comments = [],
    ageRating = 0,
    isFavorites = false,
    isWatched = false,
    isWatchList = false,
  } = card;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
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
        ${createButtonTemplate('watched', 'Already watched', isWatched)}
        ${createButtonTemplate('favorite', 'Add to favorites', isFavorites)}
        
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      </section>
    </div>
  </form>
</section>`;
};

export default class CardDetail {
  constructor(card) {
    this._element = null;
    this._card = card;
  }

  getTemplate() {
    return createCardDetailTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element
  }

  removeElement() {
    this._element = null;
  }
}


