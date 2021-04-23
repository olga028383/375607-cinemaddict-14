import AbstractView from '../abstract-view.js';

const createFilmDetailsBottomTemplate = () => {
  return '<div class="film-details__bottom-container"></div>';
};

export default class FilmDetailsBottom extends AbstractView{
  getTemplate() {
    return createFilmDetailsBottomTemplate();
  }
}
