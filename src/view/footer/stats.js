import AbstractView from '../abstract-view.js';

export default class Statistics extends AbstractView {
  constructor(countFilms) {
    super();
    this.count = countFilms;
  }

  getTemplate() {
    return `<section class="footer__statistics">${this.count} movies inside</section>`;
  }
}
