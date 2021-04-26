import SortView from '../view/sort.js';
import FilmsEmptyView from '../view/films/films-empty.js';
import LayoutFilmsView from '../view/layout-fillms.js';

import FilmsListContainerView from '../view/films/films-list-container.js';
import FilmsListView from '../view/films/films-list.js';
import FilmsListExtraView from '../view/films/films-list-extra.js';

import ButtonMoreView from '../view/button-more.js';

import FilmPresenter from '../presenter/film.js';

import {render, ContentPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const COUNT_FILM_LIST = 5;
const COUNT_CARD_TOP = 2;

export default class FilmList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._showedFilms = COUNT_FILM_LIST;
    this._films = [];
    this._filmPresenter = [];
    this._buttonMoreComponent = '';

    this._sortComponent = new SortView();
    this._layoutFilmsComponent = new LayoutFilmsView();
    this._filmsEmptyComponent = new FilmsEmptyView();

    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListElement = this._filmsListComponent.getElement();

    this._filmChangeHandler = this._filmChangeHandler.bind(this);
  }

  init(films) {
    if (films.length === 0) {
      this._renderMainContainer(this._filmsEmptyComponent.getElement());
      return;
    }

    this._films = films;
    this._renderSort();
    this._renderFilmsList();
    this._renderButtonMore();
    this._renderTopFilms();
    this._renderMainContainer(this._layoutFilmsComponent.getElement());
  }

  _initFilm(film, container) {
    const filmPresenter = new FilmPresenter(this._filmChangeHandler);
    filmPresenter.init(film, container);
    this._filmPresenter.push(filmPresenter);
  }

  _renderMainContainer(element) {
    render(this._mainContainer, element, ContentPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderFilmsList() {

    this._films.slice(0, this._showedFilms).forEach((film) => {
      this._initFilm(film, this._filmsListContainerComponent);
    });

    render(this._filmsListElement, this._filmsListContainerComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._layoutFilmsComponent.getElement(), this._filmsListElement, ContentPosition.BEFOREEND);
  }

  _renderButtonMore() {
    this._getButtonMoreComponent();

    if (this._buttonMoreComponent) {
      render(this._filmsListElement, this._buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

      this._buttonMoreComponent.setClickHandler(() => {

        const loadedCards = this._films.slice(this._showedFilms, this._showedFilms + COUNT_FILM_LIST);
        this._showedFilms = this._showedFilms + loadedCards.length;

        loadedCards.forEach((film) => {
          this._initFilm(film, this._filmsListContainerComponent);
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
    const topRatedCard = this._films.slice().sort((a, b) => {
      return b.rating - a.rating;
    }).slice(0, COUNT_CARD_TOP);
    render(this._layoutFilmsComponent.getElement(), this._filmsListExtra('Top rated', topRatedCard), ContentPosition.BEFOREEND);

    const mostCommentedCard = this._films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    }).slice(0, COUNT_CARD_TOP);
    render(this._layoutFilmsComponent.getElement(), this._filmsListExtra('Most commented', mostCommentedCard), ContentPosition.BEFOREEND);

  }

  _filmsListExtra(title, films) {
    const FilmsListExtraElement = new FilmsListExtraView(title);
    const filmsListContainerComponent = new FilmsListContainerView();

    films.forEach((film) => {
      this._initFilm(film, filmsListContainerComponent);
    });

    render(FilmsListExtraElement.getElement(), filmsListContainerComponent.getElement(), 'beforeend');

    return FilmsListExtraElement.getElement();
  }

  _getButtonMoreComponent() {
    this._buttonMoreComponent = (this._showedFilms < this._films.length) ? new ButtonMoreView() : '';
  }

  _filmChangeHandler(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter.forEach((presenter, idx) => {
      if (presenter._film.id === updatedFilm.id) {
        this._filmPresenter[idx].init(updatedFilm);
      }
    });
  }
}
