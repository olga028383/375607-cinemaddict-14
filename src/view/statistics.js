import {createElement} from '../util.js';

const createStatisticsTemplate = (count) => {
  return `<section class="footer__statistics">${count} movies inside</section>`;
};

export default class Statistics {
  constructor(countFilms) {
    this.count = countFilms;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this.count);
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
