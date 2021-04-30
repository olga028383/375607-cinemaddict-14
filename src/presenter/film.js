import FilmView from '../view/films/film.js';
import FilmDetailsContainerView from '../view/film-details/film-details-container.js';
import FilmDetailsTopView from '../view/film-details/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom.js';
import FilmDetailsView from '../view/film-details/film-details.js';

import {render, replace, ContentPosition, remove} from '../utils/render.js';
import {isEscEvent} from '../util.js';

export default class Film {
  constructor(filmChangeHandler) {
    this._film = null;
    this._container = null;
    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._filmChangeHandler = filmChangeHandler;
    this._filmDetailContainerComponent = new FilmDetailsContainerView();
    this._filmDetailTopComponent = new FilmDetailsTopView();
    this._filmDetailBottomComponent = new FilmDetailsBottomView();

    this._bodyElement = document.body;

    this._openModalHandler = this._openModalHandler.bind(this);
    this._closeModalHandler = this._closeModalHandler.bind(this);
    this._closeModalEscKeydownHandler = this._closeModalEscKeydownHandler.bind(this);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchClickHandler = this._watchClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(film, container) {

    if (!this._film) {
      this._film = film;
      this._container = container;
      this._filmComponent = new FilmView(this._film);
      this._filmDetailsComponent = new FilmDetailsView(this._film);
      render(this._container.getElement(), this._filmComponent.getElement(), 'beforeend');

    } else {

      const oldElement = this._filmComponent.getElement();
      const oldElementDetail = this._filmDetailsComponent.getElement();

      this._film = film;
      this._filmComponent = new FilmView(this._film);
      this._filmDetailsComponent = new FilmDetailsView(this._film);

      replace(this._filmComponent.getElement(), oldElement);
      replace(this._filmDetailsComponent.getElement(), oldElementDetail);
    }

    this._renderFilm();
    return this._filmComponent.getElement();
  }

  _renderFilm() {
    this._renderFilmDetail();
    this._filmComponent.setOpenModalClickHandler(this._openModalHandler);

    this._filmComponent.setWatchListClickHandler(this._watchListClickHandler);
    this._filmComponent.setWatchClickHandler(this._watchClickHandler);
    this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._filmDetailsComponent.setWatchListClickHandler(this._watchListClickHandler);
    this._filmDetailsComponent.setWatchClickHandler(this._watchClickHandler);
    this._filmDetailsComponent.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  _renderFilmDetail() {
    render(this._filmDetailContainerComponent.getElement(), this._filmDetailTopComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._filmDetailTopComponent.getElement(), this._filmDetailsComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._filmDetailContainerComponent.getElement(), this._filmDetailBottomComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _openModal() {
    this._bodyElement.classList.add('hide-overflow');
    render(this._bodyElement, this._filmDetailContainerComponent.getElement(), 'beforeend');
  }

  _closeModal() {
    this._bodyElement.classList.remove('hide-overflow');
    this._filmDetailContainerComponent.getElement().remove();
    document.removeEventListener('keydown', this._closeModalEscKeydownHandler);
  }

  _closeModalEscKeydownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closeModal();
    }
  }

  _closeModalHandler() {
    this._closeModal();
  }

  _openModalHandler() {
    this._openModal();
    this._filmDetailTopComponent.setClickHandler(this._closeModalHandler);

    document.addEventListener('keydown', this._closeModalEscKeydownHandler);
  }

  _watchListClickHandler() {
    this._filmChangeHandler(
      Object.assign(
        {},
        this._film,
        {
          isWatchList: !this._film.isWatchList,
        },
      ),
    );
  }

  _watchClickHandler() {
    this._filmChangeHandler(
      Object.assign(
        {},
        this._film,
        {
          isWatch: !this._film.isWatch,
        },
      ),
    );
  }

  _favoriteClickHandler() {
    this._filmChangeHandler(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  getId() {
    return this._film.id;
  }

  getComments() {
    return this._film.comments;
  }

  getCloseModalEscKeydownHandler(){
    return this._closeModalEscKeydownHandler;
  }

  getCommentsContainer(){
    return this._filmDetailBottomComponent;
  }
  destroy() {
    remove(this._filmComponent);
  }
}
