import SortView from '../view/sort.js';
import FilmsEmptyView from '../view/films/films-empty.js';
import LayoutFilmsView from '../view/layout-fillms.js';

import FilmsListContainerView from '../view/films/films-list-container.js';
import FilmsListView from '../view/films/films-list.js';
import FilmsListExtraView from '../view/films/films-list-extra.js';

import ButtonMoreView from '../view/button-more.js';
import LoadingView from '../view/loading.js';
import StatsFooterView from '../view/footer/stats.js';

import FilmPresenter from '../presenter/film.js';

import {render, replace, ContentPosition, remove} from '../utils/render.js';
import {sortDate} from '../lib.js';
import {filter} from '../utils/filters.js';
import {SortType, UserAction, UpdateType, COUNT_FILM_LIST, COUNT_CARD_TOP} from '../constants.js';

import {getConnect} from '../utils/api.js';

export default class FilmList {
  constructor(mainContainer, filterModel, filmsModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._isLoading = true;
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;

    this._filmsEmptyComponent = null;
    this._layoutFilmsComponent = new LayoutFilmsView();
    this._showedFilms = COUNT_FILM_LIST;
    this._filmListComponent = null;
    this._buttonMoreComponent = null;

    this._filmTopRatingComponent = null;
    this._filmTopCommentsComponent = null;

    this._filmPresenterList = {};
    this._filmPresenterListTopRating = {};
    this._filmPresenterListTopComments = {};

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._setSortTypeChangeHandler = this._setSortTypeChangeHandler.bind(this);

    this.replaceList = this.replaceList.bind(this);
  }

  init() {

    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();
    this._filmListComponent = this._renderList(ContentPosition.BEFOREEND);
    this._renderTopLists();

    render(this._mainContainer, this._layoutFilmsComponent.getElement(), ContentPosition.BEFOREEND);

    this._renderFooter();
  }

  destroy() {
    this._clearList({resetRenderedTaskCount: true, resetSortType: true});

    if (this._filmsEmptyComponent) {
      remove(this._filmsEmptyComponent);
    }

    remove(this._sortComponent);
    remove(this._layoutFilmsComponent);

    this._filmsModel.removeObserver(this._modelEventHandler);
    this._filterModel.removeObserver(this._modelEventHandler);
  }

  replaceList() {
    this._clearList();
    this._filmListComponent = this._renderList(ContentPosition.AFTERBEGIN);

    this._replaceTopCommentedComponent();
  }

  _initFilm(film, container, presentersFilm) {
    const filmPresenter = new FilmPresenter(container, this._viewActionHandler, this.replaceList, this._filterModel, this._filmsModel);
    filmPresenter.init(film);
    presentersFilm[film.id] = filmPresenter;
  }

  _initTopRatingFilmsComponent() {
    this._filmTopRatingComponent = this._initTopLists('Top rated', this._filmsModel.sortRating().slice(0, COUNT_CARD_TOP), this._filmPresenterListTopRating);
  }

  _initTopCommentsFilmsComponent() {
    const mostCommentedCard = this._filmsModel.sortComment().slice(0, COUNT_CARD_TOP);
    this._filmTopCommentsComponent = this._initTopLists('Most commented', mostCommentedCard, this._filmPresenterListTopComments);
  }

  _initTopLists(title, films, presenterList) {
    const filmsListTopComponent = new FilmsListExtraView(title);
    const filmsListContainerComponent = new FilmsListContainerView();

    films.forEach((film) => {
      this._initFilm(film, filmsListContainerComponent, presenterList);
    });

    render(filmsListTopComponent.getElement(), filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);

    return filmsListTopComponent;
  }

  _getFilms() {
    const filterActive = this._filterModel.get();
    const films = this._filmsModel.get();
    const filteredFilms = filter[filterActive](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortDate);
      case SortType.RATING:
        return filteredFilms.slice().sort((a, b) => {
          return b.rating - a.rating;
        });
    }

    return filteredFilms;
  }

  _renderLoading() {
    render(this._mainContainer, this._loadingComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent = new SortView();
    render(this._mainContainer, this._sortComponent.getElement(), ContentPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
  }

  _replaceSort() {
    const oldComponentSort = this._sortComponent;
    this._sortComponent = new SortView();
    this._sortComponent.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
    replace(this._sortComponent, oldComponentSort);
  }

  _renderList(position) {
    const films = this._getFilms();

    const filmsListContainerComponent = new FilmsListContainerView();
    const filmsListComponent = new FilmsListView();

    this._filmsEmptyComponent = new FilmsEmptyView();
    if (this._filterModel.get().length === 0) {
      render(this._mainContainer, this._filmsEmptyComponent.getElement(), ContentPosition.BEFOREEND);
      return;
    }

    this._renderFilmsList(films, position, filmsListContainerComponent, filmsListComponent);
    this._renderButtonMore(filmsListContainerComponent, filmsListComponent);

    return filmsListComponent;
  }

  _clearList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {

    const filmsCount = this._getFilms().length;

    this._destroyFilms(this._filmPresenterList);

    this._filmPresenterList = {};
    remove(this._filmListComponent);
    remove(this._buttonMoreComponent);

    if (resetRenderedFilmsCount) {
      this._showedFilms = COUNT_FILM_LIST;
    } else {
      this._showedFilms = Math.min(filmsCount, this._showedFilms);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
      this._replaceSort();
    }
  }

  _renderFilmsList(films, position, filmsListContainerComponent, filmsListComponent) {
    films.slice(0, this._showedFilms).forEach((film) => {
      this._initFilm(film, filmsListContainerComponent, this._filmPresenterList);
    });

    render(filmsListComponent.getElement(), filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._layoutFilmsComponent.getElement(), filmsListComponent.getElement(), position);
  }

  _renderButtonMore(filmsListContainerComponent, filmsListComponent) {
    this._buttonMoreComponent = (this._showedFilms < this._getFilms().length) ? new ButtonMoreView() : '';

    if (this._buttonMoreComponent) {
      render(filmsListComponent.getElement(), this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

      this._buttonMoreComponent.setClickHandler(() => {

        const loadedCards = this._getFilms().slice(this._showedFilms, this._showedFilms + COUNT_FILM_LIST);
        this._showedFilms = this._showedFilms + loadedCards.length;

        loadedCards.forEach((film) => {
          this._initFilm(film, filmsListContainerComponent, this._filmPresenterList);
        });

        render(filmsListComponent.getElement(), filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
        render(filmsListComponent.getElement(), this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

        if (this._getFilms().length - this._showedFilms === 0) {
          remove(this._buttonMoreComponent);
        }
      });
    }
  }

  _renderTopLists() {
    this._initTopRatingFilmsComponent();
    this._initTopCommentsFilmsComponent();
    render(this._layoutFilmsComponent.getElement(), this._filmTopRatingComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._layoutFilmsComponent.getElement(), this._filmTopCommentsComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderFooter() {
    const footerElement = document.querySelector('.footer');
    render(footerElement, new StatsFooterView(this._filmsModel.get().length.toLocaleString()).getElement(), ContentPosition.BEFOREEND);
  }

  _replaceTopCommentedComponent() {
    this._destroyFilms(this._filmPresenterListTopComments);
    const oldComponentTopComments = this._filmTopCommentsComponent;
    this._initTopCommentsFilmsComponent();
    replace(this._filmTopCommentsComponent, oldComponentTopComments);
  }

  _destroyFilms(presentersFilm) {
    Object
      .values(presentersFilm)
      .forEach((presenter) => {
        presenter.destroy();
      });
  }

  _updateFilmListPresenter(updatedFilm, filmListPresenter) {

    if (filmListPresenter[updatedFilm.id]) {
      filmListPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _setSortTypeChangeHandler(sort) {
    if (this._currentSortType === sort) {
      return;
    }

    this._currentSortType = sort;
    this._clearList({resetRenderedFilmsCount: true});
    this._filmListComponent = this._renderList(ContentPosition.AFTERBEGIN);
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        getConnect().updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _modelEventHandler(updateType, data) {
    updateType.forEach((type) => {
      switch (type) {
        case UpdateType.FILM:

          this._updateFilmListPresenter(data, this._filmPresenterList);
          this._updateFilmListPresenter(data, this._filmPresenterListTopRating);
          this._updateFilmListPresenter(data, this._filmPresenterListTopComments);

          break;
        case UpdateType.FILM_LIST:

          if (this._filterModel.get() === data) {
            this._clearList({resetRenderedFilmsCount: true, resetSortType: true});
          } else {
            this._clearList();
          }
          this._filmListComponent = this._renderList(ContentPosition.AFTERBEGIN);

          break;

        case UpdateType.INIT:

          this._isLoading = false;
          remove(this._loadingComponent);
          this.init();

          break;
      }
    });
  }
}
