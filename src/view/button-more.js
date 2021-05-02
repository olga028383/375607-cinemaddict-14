import AbstractView from './abstract-view.js';

const createButtonMoreTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ButtonMore extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createButtonMoreTemplate();
  }

  setClickHandler(callback) {
    this.callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.callback.click();
  }
}
