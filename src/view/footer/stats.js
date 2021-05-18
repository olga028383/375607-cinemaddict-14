import AbstractView from '../abstract-view.js';

const createStatisticsTemplate = (count) => {
  return `<section class="footer__statistics">${count} movies inside</section>`;
};

export default class Statistics extends AbstractView{
  constructor(countFilms) {
    super();
    this.count = countFilms;
  }

  getTemplate() {
    return createStatisticsTemplate(this.count);
  }
}
