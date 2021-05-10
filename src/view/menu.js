import AbstractView from './abstract-view.js';
import {FilterType} from '../constants.js';

const createFilterTemplate = (filter, isActive = false) => {
  const countFilms = (filter.type !== FilterType.ALL) ? `<span class="main-navigation__item-count">${filter.count}</span>` : '';
  return `<a href="#${filter.href}" data-filter="${filter.type}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">${filter.name}${countFilms}</a>`;
};

const createFilterListTemplate = (filters, activeFilter) => {
  return filters.map((filter) => createFilterTemplate(filter, filter.type === activeFilter)).join('');
};

const createMenuTemplate = (filters = {}, activeFilter) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${createFilterListTemplate(filters, activeFilter)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._activeFilter);
  }

  setFiltersClickHandler(callback) {
    this.callback.clickFilter = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => item.addEventListener('click', this._filterClickHandler));
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this.callback.clickFilter(evt.target.dataset.filter);
  }
}
