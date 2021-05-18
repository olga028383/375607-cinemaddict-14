import {createElement} from '../util.js';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw Error('Can\'t instantiate AbstractView, only concrete one.');
    }

    this._element = null;
    this.callback = {};
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

  show() {

  }

  hide(){

  }
}
