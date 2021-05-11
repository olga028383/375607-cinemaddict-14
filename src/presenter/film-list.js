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
  constructor(mainContainer, filmsModel, commentsModel, filterModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._showedFilms = COUNT_FILM_LIST;

    this._filmPresenterList = {};
    this._filmPresenterListTopRating = {};
    this._filmPresenterListTopComments = {};

    this._buttonMoreComponent = null;

    this._sortComponent = null;
    this._currentSortType = SortType.DEFAULT;

    this._filmTopRatingComponent = null;
    this._filmTopCommentsComponent = null;

    this._layoutFilmsComponent = new LayoutFilmsView();
    this._filmsEmptyComponent = new FilmsEmptyView();

    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListElement = this._filmsListComponent.getElement();

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    //this._commentModelEventHandler = this._commentModelEventHandler.bind(this);
    this._setSortTypeChangeHandler = this._setSortTypeChangeHandler.bind(this);
  }

  init() {
    this._sortComponent = new SortView();
    this._renderSort(ContentPosition.BEFOREEND);
    this._renderList(ContentPosition.BEFOREEND);

    this._renderTopLists();

    this._renderMainContainer(this._layoutFilmsComponent.getElement());

    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

  }

  _renderList(position) {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderMainContainer(this._filmsEmptyComponent.getElement());
      return;
    }

    this._renderFilmsList(films, position);
    this._renderButtonMore(ContentPosition.BEFOREEND);
  }

  _getFilms() {
    const filterActive = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
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

  _initFilm(film, container, presentersFilm) {
    const filmPresenter = new FilmPresenter(this._viewActionHandler, this._filterModel, this._commentsModel, this._filmsModel);
    filmPresenter.init(film, container);
    presentersFilm[filmPresenter.getId()] = filmPresenter;
  }


  _renderMainContainer(element) {
    render(this._mainContainer, element, ContentPosition.BEFOREEND);
  }

  _renderSort(position) {
    render(this._mainContainer, this._sortComponent.getElement(), position);
    this._sortComponent.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
  }

  _renderFilmsList(films, position) {
    films.slice(0, this._showedFilms).forEach((film) => {
      this._initFilm(film, this._filmsListContainerComponent, this._filmPresenterList);
    });

    render(this._filmsListElement, this._filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._layoutFilmsComponent.getElement(), this._filmsListElement, position);

  }

  _renderButtonMore() {
    this._getButtonMoreComponent();

    if (this._buttonMoreComponent) {
      render(this._filmsListElement, this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

      this._buttonMoreComponent.setClickHandler(() => {

        const loadedCards = this._getFilms().slice(this._showedFilms, this._showedFilms + COUNT_FILM_LIST);
        this._showedFilms = this._showedFilms + loadedCards.length;

        loadedCards.forEach((film) => {
          this._initFilm(film, this._filmsListContainerComponent, this._filmPresenterList);
        });

        render(this._filmsListElement, this._filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
        render(this._filmsListElement, this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

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

  _initTopRatingFilmsComponent() {
    this._filmTopRatingComponent = this._filmsListExtra('Top rated', this._getElementsSortByRating().slice(0, COUNT_CARD_TOP), this._filmPresenterListTopRating);
  }

  _initTopCommentsFilmsComponent() {

    const mostCommentedCard = this._filmsModel.getFilms().slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    }).slice(0, COUNT_CARD_TOP);

    this._filmTopCommentsComponent = this._filmsListExtra('Most commented', mostCommentedCard, this._filmPresenterListTopComments);
  }

  _getElementsSortByRating() {
    return this._filmsModel.getFilms().slice().sort((a, b) => {
      return b.rating - a.rating;
    });
  }

  _filmsListExtra(title, films, presenterList) {
    const filmsListExtraComponent = new FilmsListExtraView(title);
    const filmsListContainerComponent = new FilmsListContainerView();

    films.forEach((film) => {
      this._initFilm(film, filmsListContainerComponent, presenterList);
    });

    render(filmsListExtraComponent.getElement(), filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);

    return filmsListExtraComponent;
  }

  _getButtonMoreComponent() {
    this._buttonMoreComponent = (this._showedFilms < this._getFilms().length) ? new ButtonMoreView() : '';
  }

  _clearListFilms({resetRenderedFilmsCount = false, resetSortType = false} = {}) {

    const filmsCount = this._getFilms().length;

    this._destroyFilms(this._filmPresenterList);

    this._filmPresenterList = {};
    remove(this._buttonMoreComponent);

    if (resetRenderedFilmsCount) {
      this._showedFilms = COUNT_FILM_LIST;
    } else {
      this._showedFilms = Math.min(filmsCount, this._showedFilms);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;

      const oldComponentSort = this._sortComponent;
      this._sortComponent = new SortView();
      this._sortComponent.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
      replace(this._sortComponent, oldComponentSort);
    }
  }

  _destroyFilms(presentersFilm) {
    Object
      .values(presentersFilm)
      .forEach((presenter) => {
        presenter.destroy();
      });
  }

  _setSortTypeChangeHandler(sort) {
    if (this._currentSortType === sort) {
      return;
    }

    this._currentSortType = sort;
    this._clearListFilms({resetRenderedFilmsCount: true});
    this._renderList();
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
        case UpdateType.FILM_PREVIEW:
          this._updateFilmPresenter(data);
          break;
        case UpdateType.FILM_LIST:

          if (this._filterModel.getFilter() === data) {
            this._clearListFilms({resetRenderedFilmsCount: true, resetSortType: true});
          } else {
            this._clearListFilms();
          }

          this._renderList(ContentPosition.AFTERBEGIN);
          break;
        case UpdateType.FILM_TOP_COMMENT:
          if (this._filmPresenterListTopComments[data.id]) {
            this._filmPresenterListTopComments[data.id].renderTopHandler(() => {
              this._replaceTopCommentedComponent();
            });
          }

          if (this._filmPresenterList[data.id]) {
            this._filmPresenterList[data.id].renderTopHandler(() => {
              this._replaceTopCommentedComponent();
            });
          }
          break;
      }
    });
  }

  _replaceTopCommentedComponent() {
    this._destroyFilms(this._filmPresenterListTopComments);
    const oldComponentTopComments = this._filmTopCommentsComponent;
    this._initTopCommentsFilmsComponent();
    replace(this._filmTopCommentsComponent, oldComponentTopComments);
  }

  _updateFilmPresenter(updatedFilm) {

    if (this._filmPresenterList[updatedFilm.id]) {
      this._filmPresenterList[updatedFilm.id].init(updatedFilm);
    }

    if (this._filmPresenterListTopRating[updatedFilm.id]) {
      this._filmPresenterListTopRating[updatedFilm.id].init(updatedFilm);
    }

    if (this._filmPresenterListTopComments[updatedFilm.id]) {
      this._filmPresenterListTopComments[updatedFilm.id].init(updatedFilm);
    }
  }
}
