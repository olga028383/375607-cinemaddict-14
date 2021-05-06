import AbstractView from '../abstract-view.js';

const createFilmDetailsFormWrapperTemplate = () => {
  return '<form class="film-details__inner" action="" method="get"></form>';
};

export default class FilmDetailsFormWrapper extends AbstractView {
  constructor(){
    super();

    this._submitFormHandler = this._submitFormHandler.bind(this);
  }
  getTemplate() {
    return createFilmDetailsFormWrapperTemplate();
  }

  setSubmitFormHandler(callback){
    this._callback.submitForm = callback;
    this.getElement().addEventListener('submit', this._submitFormHandler);
  }

  _submitFormHandler(evt){
    evt.preventDefault();
    this._callback.submitForm();
  }
}
