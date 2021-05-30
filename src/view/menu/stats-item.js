import AbstractView from '../abstract-view.js';

export default class StatsItem extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return '<a href="#stats" class="main-navigation__additional">Stats</a>';
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  removeActiveClass() {
    this.getElement().classList.remove('main-navigation__additional--active');
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('main-navigation__additional--active')) {
      return;
    }

    this.getElement().classList.add('main-navigation__additional--active');
    this._callback.click();
  }

}
