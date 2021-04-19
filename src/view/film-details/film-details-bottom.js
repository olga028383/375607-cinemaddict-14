import {createElement} from '../../util';

const createFilmDetailsBottomTemplate = () => {
  return '<div class="film-details__bottom-container"></div>';
};

export default class FilmDetailsBottom {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmDetailsBottomTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
