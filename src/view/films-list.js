import {createElement} from "../util";

const createFilmsListTemplate = (card, button = '') => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
        ${card}
      </div>
        
        ${button}
    </section>`;
};

export default class FilmsList {
  constructor(card, button) {
    this._button = button;
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._card, this._button);
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
