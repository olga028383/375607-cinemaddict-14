import AbstractView from '../abstract-view.js';

const createFilmDetailsContainerTemplate = () => {
  return '<section class="film-details"></section>';
};

export default class FilmDetailsContainer extends AbstractView {
  getTemplate() {
    return createFilmDetailsContainerTemplate();
  }
}
