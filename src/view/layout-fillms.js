import AbstractView from './abstract-view.js';

const createLayoutFilmsTemplate = (content = '') => {
  return `<section class="films">${content}</section>`;
};

export default class LayoutFilms extends AbstractView{
  constructor(content){
    super();
    this._content = content;
  }

  getTemplate(){
    return createLayoutFilmsTemplate(this._content);
  }
}


