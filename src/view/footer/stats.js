import AbstractView from '../abstract-view.js';

export default class Statistics extends AbstractView {
  constructor(countFilms) {
    super();
    this._count = countFilms;
  }

  getTemplate() {
    return `<section class="footer__statistics">${this._count} movies inside</section>`;
  }
}
