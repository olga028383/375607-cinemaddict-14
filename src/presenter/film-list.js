import SortView from '../view/sort.js';
import FilmsEmptyView from '../view/films/films-empty.js';
import LayoutFilmsView from '../view/layout-fillms.js';

import FilmsListContainerView from '../view/films/films-list-container.js';
import FilmsListView from '../view/films/films-list.js';
import FilmsListExtraView from '../view/films/films-list-extra.js';

import ButtonMoreView from '../view/button-more.js';

import FilmPresenter from '../presenter/film.js';

import {render, replace, ContentPosition, remove} from '../utils/render.js';
import {sortDate} from '../lib.js';
import {filter} from '../utils/filters.js';
import {SortType, UserAction, UpdateType} from '../constants.js';

const COUNT_FILM_LIST = 5;
const COUNT_CARD_TOP = 2;

export default class FilmList {
  constructor(mainContainer, filterModel, filmsModel, commentsModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;

    this._layoutFilmsComponent = new LayoutFilmsView();
    this._showedFilms = COUNT_FILM_LIST;
    this._filmListComponent = null;
    this._buttonMoreComponent = null;

    this._filmTopRatingComponent = null;
    this._filmTopCommentsComponent = null;

    this._filmPresenterList = {};
    this._filmPresenterListTopRating = {};
    this._filmPresenterListTopComments = {};

    this._isModal = false;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._setSortTypeChangeHandler = this._setSortTypeChangeHandler.bind(this);

    this._isOpenModal = this._isOpenModal.bind(this);
  }

  init() {
    this._renderSort();
    this._filmListComponent = this._renderList(ContentPosition.BEFOREEND);
    this._renderTopLists();

    render(this._mainContainer, this._layoutFilmsComponent.getElement(), ContentPosition.BEFOREEND);

    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

  }

  _initFilm(film, container, presentersFilm) {
    const filmPresenter = new FilmPresenter(container, this._viewActionHandler, this._isOpenModal, this._filterModel, this._filmsModel, this._commentsModel);
    filmPresenter.init(film);
    presentersFilm[film.id] = filmPresenter;
  }

  _initTopRatingFilmsComponent() {
    this._filmTopRatingComponent = this._initTopLists('Top rated', this._getElementsSortByRating().slice(0, COUNT_CARD_TOP), this._filmPresenterListTopRating);
  }

  _initTopCommentsFilmsComponent() {

    const mostCommentedCard = this._filmsModel.get().slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    }).slice(0, COUNT_CARD_TOP);

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
    const filmCount = films.length;

    const filmsListContainerComponent = new FilmsListContainerView();
    const filmsListComponent = new FilmsListView();

    if (filmCount === 0) {
      render(this._mainContainer, new FilmsEmptyView().getElement(), ContentPosition.BEFOREEND);
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

  _replaceTopCommentedComponent() {
    this._destroyFilms(this._filmPresenterListTopComments);
    const oldComponentTopComments = this._filmTopCommentsComponent;
    this._initTopCommentsFilmsComponent();
    replace(this._filmTopCommentsComponent, oldComponentTopComments);
  }

  _getElementsSortByRating() {
    return this._filmsModel.get().slice().sort((a, b) => {
      return b.rating - a.rating;
    });
  }

  _destroyFilms(presentersFilm) {
    Object
      .values(presentersFilm)
      .forEach((presenter) => {
        presenter.destroy();
      });
  }

  _isOpenModal(data) {
    this._isModal = data();
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
        this._filmsModel.updateFilm(updateType, update);
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
          console.log(this._isModal);

          //здесь нельзя перерисовывать список пока окно открыто
          //выше в методе _isOpenModal я получаю данные о том, открыто окно или нет, вот как совместить чтобы перерисовка происходила только по закрытию?
          //и ниже странный код связан именно с этим багом, нельзя переисовывать списоки после действий на открытом окне


          if (!this._isModal) {
            if (this._filterModel.get() === data) {
              this._clearList({resetRenderedFilmsCount: true, resetSortType: true});
            } else {
              this._clearList();
            }

            this._filmListComponent = this._renderList(ContentPosition.AFTERBEGIN);
          }

          break;
        case UpdateType.FILM_TOP_COMMENT:
          if (this._filmPresenterListTopComments[data.id]) {
            this._filmPresenterListTopComments[data.id].renderTopCommentsLists(() => {
              this._replaceTopCommentedComponent();
            });
          }

          if (this._filmPresenterList[data.id]) {
            this._filmPresenterList[data.id].renderTopCommentsLists(() => {
              this._replaceTopCommentedComponent();
            });
          }

          break;
      }
    });
  }
}
