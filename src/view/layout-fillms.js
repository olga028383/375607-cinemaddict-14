import {createElement} from "../util";

const createLayoutFilmsTemplate = (content = '') => {
  return `<section class="films">${content}</section>`;
};

export default class LayoutFilms {
  constructor(content){
    this._content = content;
    this._element = null;
  }

  getTemplate(){
    return createLayoutFilmsTemplate(this._content);
  }

  getElement(){
    if(!this._element){
      this._element = createElement(this.getTemplate());
    }

    return this._element
  }

  removeElement(){
    this._element = null;
  }
}


