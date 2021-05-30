import {createElement} from '../util.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw Error('Can\'t instantiate AbstractView, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw Error('Create method getTemplate');
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

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
