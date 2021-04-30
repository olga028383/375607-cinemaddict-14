import SortView from '../view/sort.js';
import FilmsEmptyView from '../view/films/films-empty.js';
import LayoutFilmsView from '../view/layout-fillms.js';

import FilmsListContainerView from '../view/films/films-list-container.js';
import FilmsListView from '../view/films/films-list.js';
import FilmsListExtraView from '../view/films/films-list-extra.js';

import ButtonMoreView from '../view/button-more.js';

import FilmPresenter from '../presenter/film.js';

import {render, ContentPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sortDate} from '../lib.js';
import {SortType} from '../constants.js';

const COUNT_FILM_LIST = 5;
const COUNT_CARD_TOP = 2;

export default class FilmList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._showedFilms = COUNT_FILM_LIST;
    this._films = [];
    this._filmPresenterList = {};
    this._filmPresenterListTopRating = {};
    this._filmPresenterListTopComments = {};
    this._buttonMoreComponent = null;

    this._sortComponent = new SortView();
    this._currentSortType = SortType.DEFAULT;
    this._filmLists = null;

    this._layoutFilmsComponent = new LayoutFilmsView();
    this._filmsEmptyComponent = new FilmsEmptyView();

    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListElement = this._filmsListComponent.getElement();

    this._filmChangeHandler = this._filmChangeHandler.bind(this);
    this._setSortTypeChangeHandler = this._setSortTypeChangeHandler.bind(this);
  }

  init(films) {
    if (films.length === 0) {
      this._renderMainContainer(this._filmsEmptyComponent.getElement());
      return;
    }
    this._filmLists = films.slice();
    this._films = films;
    this._renderSort();
    this._renderFilmsList(ContentPosition.BEFOREEND);
    this._renderButtonMore(ContentPosition.BEFOREEND);
    this._renderTopFilms();
    this._renderMainContainer(this._layoutFilmsComponent.getElement());
  }

  _initFilm(film, container, presenterList) {
    const filmPresenter = new FilmPresenter(this._filmChangeHandler);
    filmPresenter.init(film, container);
    presenterList[filmPresenter.getId()] = filmPresenter;
  }

  _renderMainContainer(element) {
    render(this._mainContainer, element, ContentPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent.getElement(), ContentPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
  }

  _renderFilmsList(position) {

    this._films.slice(0, this._showedFilms).forEach((film) => {
      this._initFilm(film, this._filmsListContainerComponent, this._filmPresenterList);
    });

    render(this._filmsListElement, this._filmsListContainerComponent.getElement(), position);
    render(this._layoutFilmsComponent.getElement(), this._filmsListElement, position);

  }

  _renderButtonMore() {
    this._getButtonMoreComponent();

    if (this._buttonMoreComponent) {
      render(this._filmsListElement, this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

      this._buttonMoreComponent.setClickHandler(() => {

        const loadedCards = this._films.slice(this._showedFilms, this._showedFilms + COUNT_FILM_LIST);
        this._showedFilms = this._showedFilms + loadedCards.length;

        loadedCards.forEach((film) => {
          this._initFilm(film, this._filmsListContainerComponent, this._filmPresenterList);
        });

        render(this._filmsListElement, this._filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
        render(this._filmsListElement, this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

        if (this._films.length - this._showedFilms === 0) {
          this._buttonMoreComponent.getElement().style.display = 'none';
        }
      });
    }
  }

  _renderTopFilms() {

    render(this._layoutFilmsComponent.getElement(), this._filmsListExtra('Top rated', this._getElementsSortByRating().slice(0, COUNT_CARD_TOP), this._filmPresenterListTopRating), ContentPosition.BEFOREEND);

    const mostCommentedCard = this._films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    }).slice(0, COUNT_CARD_TOP);
    render(this._layoutFilmsComponent.getElement(), this._filmsListExtra('Most commented', mostCommentedCard, this._filmPresenterListTopComments), ContentPosition.BEFOREEND);

  }

  _getElementsSortByRating() {
    return this._films.slice().sort((a, b) => {
      return b.rating - a.rating;
    });
  }

  _getElementsSortByDate() {
    return this._films.slice().sort(sortDate);
  }

  _filmsListExtra(title, films, presenterList) {
    const FilmsListExtraElement = new FilmsListExtraView(title);
    const filmsListContainerComponent = new FilmsListContainerView();

    films.forEach((film) => {
      this._initFilm(film, filmsListContainerComponent, presenterList);
    });

    render(FilmsListExtraElement.getElement(), filmsListContainerComponent.getElement(), 'beforeend');

    return FilmsListExtraElement.getElement();
  }

  _getButtonMoreComponent() {
    this._buttonMoreComponent = (this._showedFilms < this._films.length) ? new ButtonMoreView() : '';
  }

  _filmChangeHandler(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmLists = updateItem(this._filmLists, updatedFilm);

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

  _clearListFilms() {
    Object
      .values(this._filmPresenterList)
      .forEach((presenter) => {
        presenter.destroy();
      });

    this._filmPresenterList = {};
    this._showedFilms = COUNT_FILM_LIST;
    remove(this._buttonMoreComponent);
  }

  _setSortTypeChangeHandler(sort) {
    if (this._currentSortType == sort) {
      return;
    }

    this._sortFilms(sort);
    this._clearListFilms();
    this._renderFilmsList(ContentPosition.AFTERBEGIN);
    this._renderButtonMore();
  }

  _sortFilms(sort) {

    switch (sort) {
      case SortType.DATE:
        this._films = this._getElementsSortByDate();
        break;
      case SortType.RATING:
        this._films = this._getElementsSortByRating();
        break;
      default:
        this._films = this._filmLists;
    }

    this._currentSortType = sort;
  }
}
