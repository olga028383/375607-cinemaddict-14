import AbstractView from '../abstract-view.js';

const createFilmDetailsFormWrapperTemplate = () => {
  return '<form class="film-details__inner" action="" method="get"></form>';
};

export default class FilmDetailsFormWrapper extends AbstractView {
  constructor() {
    super();

    this._submitFormHandler = this._submitFormHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsFormWrapperTemplate();
  }

  _submitFormHandler(evt) {
    evt.preventDefault();
    this._callback.submitForm();
  }
}
