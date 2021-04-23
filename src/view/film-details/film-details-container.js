import AbstractView from '../abstract-view.js';

const createFilmDetailsContainerTemplate = () => {
  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get"></form>
            <div class="film-details__top-container">
                <div class="film-details__close">
                   <button class="film-details__close-btn" type="button">close</button>
                 </div>
            </div>
           </section>`;
};

export default class FilmDetailsContainer extends AbstractView {
  constructor() {
    super();
    this._close = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsContainerTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.callback.click();
  }

  setClickHandler(callback) {
    this.callback.click = callback;

    this._close = this._element.querySelector('.film-details__close-btn');
    this._close.addEventListener('click', this._clickHandler);
  }
}
