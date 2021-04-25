import AbstractView from '../abstract-view.js';

const createFilmDetailsTopTemplate = () => {
  return `<div class="film-details__top-container">
                <div class="film-details__close">
                   <button class="film-details__close-btn" type="button">close</button>
                 </div>
            </div>`;
};

export default class FilmDetailsTop extends AbstractView {
  constructor() {
    super();
    this._close = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTopTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.callback.click();
  }

  setClickHandler(callback) {
    this.callback.click = callback;

    this._close = this.getElement().querySelector('.film-details__close-btn');
    this._close.addEventListener('click', this._clickHandler);
  }
}
