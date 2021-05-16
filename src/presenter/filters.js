import MenuView from '../view/menu.js';
import {render, ContentPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType} from '../constants.js';

export default class Filters {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._menuComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._setFiltersClickHandler = this._setFiltersClickHandler.bind(this);

    this._filterModel.addObserver(this._modelEventHandler);
    this._filmsModel.addObserver(this._modelEventHandler);
  }

  init() {
    const prevFilterComponent = this._menuComponent;
    this._menuComponent = new MenuView(this._getFilters(), this._filterModel.get());
    this._menuComponent.setFiltersClickHandler(this._setFiltersClickHandler);

    if (prevFilterComponent === null) {
      render(this._container, this._menuComponent.getElement(), ContentPosition.AFTERBEGIN);
      return;
    }

    replace(this._menuComponent, prevFilterComponent);
    remove(prevFilterComponent);
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
    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set([UpdateType.FILM_LIST], filterType);
  }
}
