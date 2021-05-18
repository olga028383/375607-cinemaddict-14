import {FilterType} from '../../constants.js';
import Smart from '../smart.js';

const createFilterTemplate = (filter, isActive = false) => {
  const countFilms = (filter.type !== FilterType.ALL) ? `<span class="main-navigation__item-count">${filter.count}</span>` : '';
  return `<a href="#${filter.href}" data-filter="${filter.type}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">${filter.name}${countFilms}</a>`;
};

const createFilterListTemplate = (filters, activeFilter) => {
  return filters.map((filter) => createFilterTemplate(filter, filter.type === activeFilter)).join('');
};

const createFiltersTemplate = (data = {}) => {
  const {filters = [], activeFilter} = data;
  return `<div class="main-navigation__items">
      ${createFilterListTemplate(filters, activeFilter)}
    </div>`;
};

export default class Filters extends Smart {
  constructor(filters, activeFilter) {
    super();

    this._data = {
      filters: filters,
      activeFilter: activeFilter,
    };

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._data);
  }

  setFiltersClickHandler(callback) {
    this.callback.clickFilter = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => item.addEventListener('click', this._filterClickHandler));
  }

  removeActiveClass() {

    const activeItem = this.getElement().querySelector('.main-navigation__item--active');
    if (activeItem) {
      activeItem.classList.remove('main-navigation__item--active');
    }

  }

  _filterClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      activeFilter: evt.target.dataset.filter,
    });

    this.callback.clickFilter(evt.target.dataset.filter);

  }
}
