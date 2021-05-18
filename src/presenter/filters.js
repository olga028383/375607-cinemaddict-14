import FiltersView from '../view/menu/filters.js';

import {render, ContentPosition} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType} from '../constants.js';

export default class Filters {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._replaceWindow = null;
    this._filmListWindow = false;

    this._filterComponents = null;
    this._filters = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._setFiltersClickHandler = this._setFiltersClickHandler.bind(this);

    this._filterModel.addObserver(this._modelEventHandler);
    this._filmsModel.addObserver(this._modelEventHandler);
  }

  init() {

    if (!this._filters) {
      this._filters = this._getFilters();
      this._filterComponents = new FiltersView(this._filters, this._filterModel.get());
    } else {
      this._updateFilter();
    }

    this._filterComponents.setFiltersClickHandler(this._setFiltersClickHandler);
    render(this._container, this._filterComponents.getElement(), ContentPosition.AFTERBEGIN);
  }

  removeActiveClass() {
    this._filterComponents.removeActiveClass();
  }

  replaceWindow(callback) {
    this._filmListWindow = false;
    this._replaceWindow = callback;
  }

  _updateFilter() {
    this._filters = this._getFilters();
    this._filterComponents.updateData({
      filters: this._filters,
      activeFilter: this._filterModel.get(),
    });
  }

  _modelEventHandler() {
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.get();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
        href: FilterType.ALL.toLowerCase(),
      },
      this._generateFilter(FilterType.WATCHLIST, films),
      this._generateFilter(FilterType.HISTORY, films),
      this._generateFilter(FilterType.FAVORITES, films),
    ];
  }

  _generateFilter(type, films) {
    return {
      type: type,
      name: type,
      count: filter[type](films).length,
      href: type.toLowerCase(),
    };
  }

  _setFiltersClickHandler(filterType) {
    if (!this._filmListWindow && this._replaceWindow) {
      this._replaceWindow();
      this._filmListWindow = true;
    }

    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set([UpdateType.FILM_LIST], filterType);
  }

}
