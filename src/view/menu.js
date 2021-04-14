import {createElement} from "../util";

const createFilterTemplate = (filters) => {
  return `<a href="#${filters.href}" class="main-navigation__item">${filters.name}<span class="main-navigation__item-count">${filters.count}</span></a>`;
};

const createFilterListTemplate = (filters) => {
  return filters.map((filter) => createFilterTemplate(filter)).join('');
};

const createMenuTemplate = (filters = {}) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createFilterListTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu {
  constructor(filters){
    this._element = null;
    this._filters = filters;
  }

  getTemplate(){
    return createMenuTemplate(this._filters);
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
