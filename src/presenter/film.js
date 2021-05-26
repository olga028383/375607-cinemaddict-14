import FilmView from '../view/films/film.js';
import FilmDetailsContainerView from '../view/film-details/film-details-container.js';
import FilmDetailsFormWrapperView from '../view/film-details/fillm-details-form-wrapper.js';
import FilmDetailsTopView from '../view/film-details/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom.js';
import FilmDetailsView from '../view/film-details/film-details.js';

import CommentsPresenter from '../presenter/comments.js';

import {render, replace, ContentPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType, ENTER_CODE} from '../constants.js';
import {isEscEvent} from '../util.js';

export default class Film {
  constructor(container, updateFilmHandler, replaceList, filmModel) {
    this._container = container;
    this._updateFilmHandler = updateFilmHandler;
    this._replaceList = replaceList;
    this._filmModel = filmModel;
    this._bodyElement = document.body;

    this._film = null;
    this._filmComponent = null;

    this._filmDetailContainerComponent = null;
    this._commentsPresenter = null;

    this._isDetailModal = false;

    this._openModalHandler = this._openModalHandler.bind(this);
    this._closeModalHandler = this._closeModalHandler.bind(this);
    this._closeModalEscKeydownHandler = this._closeModalEscKeydownHandler.bind(this);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchClickHandler = this._watchClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._submitFormCommentsHandler = this._submitFormCommentsHandler.bind(this);
  }

  init(film) {

    if (!this._film) {
      this._initFilmComponent(film);

      render(this._container.getElement(), this._filmComponent.getElement(), ContentPosition.BEFOREEND);
    } else {

      this._replaceFilmElement(film);

      if (this._filmDetailContainerComponent) {
        this._replaceFilmDetailElement();
      }
    }

    return this._filmComponent.getElement();
  }

  destroy() {
    remove(this._filmComponent);
  }


  _initFilmComponent(film) {
    this._film = film;
    this._filmComponent = new FilmView(this._film);

    this._setFilmComponentClickHandlers();
  }

  _replaceFilmElement(film) {
    const oldElement = this._filmComponent.getElement();
    this._initFilmComponent(film);

    replace(this._filmComponent.getElement(), oldElement);
  }

  _renderFilmDetail() {
    const detailsComponent = new FilmDetailsView(this._film);
    const filmDetailContainerComponent = new FilmDetailsContainerView();
    const filmDetailFormWrapperComponent = new FilmDetailsFormWrapperView();
    const filmDetailTopComponent = new FilmDetailsTopView();
    const filmDetailBottomComponent = new FilmDetailsBottomView();

    render(filmDetailContainerComponent.getElement(), filmDetailFormWrapperComponent.getElement(), ContentPosition.BEFOREEND);
    render(filmDetailFormWrapperComponent.getElement(), filmDetailTopComponent.getElement(), ContentPosition.BEFOREEND);
    render(filmDetailTopComponent.getElement(), detailsComponent.getElement(), ContentPosition.BEFOREEND);
    render(filmDetailFormWrapperComponent.getElement(), filmDetailBottomComponent.getElement(), ContentPosition.BEFOREEND);

    this._initComments(filmDetailBottomComponent);

    detailsComponent.setWatchListClickHandler(this._watchListClickHandler);
    detailsComponent.setWatchClickHandler(this._watchClickHandler);
    detailsComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    filmDetailTopComponent.setClickHandler(this._closeModalHandler);

    return filmDetailContainerComponent;
  }

  _replaceFilmDetailElement() {
    const oldElementDetail = this._filmDetailContainerComponent.getElement();
    const scrollPosition = oldElementDetail.scrollTop;

    this._filmDetailContainerComponent = this._renderFilmDetail();
    replace(this._filmDetailContainerComponent, oldElementDetail);
    this._filmDetailContainerComponent.getElement().scrollTop = scrollPosition;
  }

  _initComments(container) {
    this._commentsPresenter = new CommentsPresenter(container, this._updateFilmHandler, this._closeModalEscKeydownHandler, this._submitFormCommentsHandler, this._filmModel);
    this._commentsPresenter.init(this._film);
  }

  _openModal() {
    this._isDetailModal = true;

    this._bodyElement.classList.add('hide-overflow');
    this._filmDetailContainerComponent = this._renderFilmDetail();
    render(this._bodyElement, this._filmDetailContainerComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _closeModal() {

    this._isDetailModal = false;
    this._bodyElement.classList.remove('hide-overflow');
    remove(this._filmDetailContainerComponent);

    this._replaceList();
  }

  _setAction() {
    const actions = [UpdateType.FILM];
    if (!this._isDetailModal) {
      actions.push(UpdateType.FILM_LIST);
    }

    return actions;
  }

  _setFilmComponentClickHandlers() {
    this._filmComponent.setOpenModalClickHandler(this._openModalHandler);
    this._filmComponent.setWatchListClickHandler(this._watchListClickHandler);
    this._filmComponent.setWatchClickHandler(this._watchClickHandler);
    this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  _watchListClickHandler() {
    this._updateFilmHandler(
      UserAction.UPDATE_FILM,
      this._setAction(),
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
    this._updateFilmHandler(
      UserAction.UPDATE_FILM,
      this._setAction(),
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
    this._updateFilmHandler(
      UserAction.UPDATE_FILM,
      this._setAction(),
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _submitFormCommentsHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_CODE) {
      this._commentsPresenter.submitForm();
    }
  }

  _closeModalEscKeydownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closeModal();
    }
  }

  _closeModalHandler() {
    this._closeModal();

    document.removeEventListener('keydown', this._closeModalEscKeydownHandler);
    document.removeEventListener('keydown', this._submitFormCommentsHandler);
  }

  _openModalHandler() {
    this._openModal();

    document.addEventListener('keydown', this._closeModalEscKeydownHandler);
    document.addEventListener('keydown', this._submitFormCommentsHandler);
  }
}
