import FilmView from '../view/films/film.js';
import FilmDetailsContainerView from '../view/film-details/film-details-container.js';
import FilmDetailsFormWrapperView from '../view/film-details/fillm-details-form-wrapper.js';
import FilmDetailsTopView from '../view/film-details/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom.js';
import FilmDetailsView from '../view/film-details/film-details.js';

import CommentsPresenter from '../presenter/comments.js';

import {render, replace, ContentPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType, FilterType, CODES} from '../constants.js';
import {isEscEvent} from '../util.js';

export default class Film {
  constructor(filmChangeHandler, filterModel, commentsModel, filmModel) {
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._filmModel = filmModel;
    this._film = null;
    this._container = null;
    this._filmComponent = null;
    this._setRenderTopHandler = null;

    this._filmChangeHandler = filmChangeHandler;
    this._filmDetailContainerComponent = null;
    this._filmCommentsPresenter = null;
    this._bodyElement = document.body;


    this._openModalHandler = this._openModalHandler.bind(this);
    this._closeModalHandler = this._closeModalHandler.bind(this);
    this._closeModalEscKeydownHandler = this._closeModalEscKeydownHandler.bind(this);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchClickHandler = this._watchClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._press = new Set();
    this._setKeysHandler = this._setKeysHandler.bind(this);
    this._deleteKeysHandler = this._deleteKeysHandler.bind(this);
  }

  init(film, container) {

    if (!this._film) {
      this._film = film;
      this._container = container;
      this._filmComponent = new FilmView(this._film);
      render(this._container.getElement(), this._filmComponent.getElement(), ContentPosition.BEFOREEND);

    } else {

      const oldElement = this._filmComponent.getElement();
      this._film = film;
      this._filmComponent = new FilmView(this._film);
      replace(this._filmComponent.getElement(), oldElement);

      if (this._filmDetailContainerComponent) {
        const oldElementDetail = this._filmDetailContainerComponent.getElement();
        const scrollPosition = oldElementDetail.scrollTop;
        this._filmDetailContainerComponent = this._renderFilmDetail();
        replace(this._filmDetailContainerComponent, oldElementDetail);
        this._filmDetailContainerComponent.getElement().scrollTop = scrollPosition;
      }
    }

    this._renderFilm();
    return this._filmComponent.getElement();
  }

  renderTopHandler(callback) {
    this._setRenderTopHandler = callback;
  }

  getId() {
    return this._film.id;
  }

  getCloseModalEscKeydownHandler() {
    return this._closeModalEscKeydownHandler;
  }

  destroy() {
    remove(this._filmComponent);
  }

  _renderFilm() {
    this._filmComponent.setOpenModalClickHandler(this._openModalHandler);
    this._filmComponent.setWatchListClickHandler(this._watchListClickHandler);
    this._filmComponent.setWatchClickHandler(this._watchClickHandler);
    this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);
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

  _initComments(container) {
    this._filmCommentsPresenter = new CommentsPresenter(this._commentsModel, this._filmModel, this._filmChangeHandler);
    this._filmCommentsPresenter.init(this._film, this._film.comments, this.getCloseModalEscKeydownHandler(this._film.comments.length), container);
  }

  _openModal() {
    this._bodyElement.classList.add('hide-overflow');
    this._filmDetailContainerComponent = this._renderFilmDetail();
    render(this._bodyElement, this._filmDetailContainerComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _closeModal() {
    this._bodyElement.classList.remove('hide-overflow');
    this._filmDetailsComponent = null;
    remove(this._filmDetailContainerComponent);

    if (this._setRenderTopHandler) {
      this._setRenderTopHandler();
    }

    document.removeEventListener('keydown', this._closeModalEscKeydownHandler);
    document.removeEventListener('keydown', this._setKeysHandler);
    document.removeEventListener('keyup', this._deleteKeysHandler);
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

  _setKeysHandler(evt) {
    this._press.add(evt.keyCode);

    for (const code of CODES) {
      if (!this._press.has(code)) {
        return;
      }
    }

    this._press.clear();

    this._filmCommentsPresenter.addCommentHandler();
  }

  _deleteKeysHandler(evt) {
    this._press.delete(evt.keyCode);
  }

  _openModalHandler() {
    this._openModal();

    document.addEventListener('keydown', this._closeModalEscKeydownHandler);
    document.addEventListener('keydown', this._setKeysHandler);
    document.addEventListener('keyup', this._deleteKeysHandler);
  }

  _getUpdateType(filterType) {
    return (this._filterModel.getFilter() !== filterType || this._filterModel.getFilter() === FilterType.ALL) ? [UpdateType.FILM_PREVIEW] : [UpdateType.FILM_LIST, UpdateType.FILM_PREVIEW];
  }

  _watchListClickHandler() {
    this._filmChangeHandler(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.WATCHLIST),
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
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.HISTORY),
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
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.FAVORITES),
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

}
