import {render, replace, ContentPosition} from '../utils/render.js';

import CommentsContainerView from '../view/comments/comments-container.js';
import CommentsFormView from '../view/comments/comments-form.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';

import CommentsModel from '../model/comments.js';

import {UserAction, UpdateType} from '../constants.js';

import {getConnect} from '../utils/api.js';

export default class Comments {
  constructor(container, updateFilmHandler, closeModalEscKeydownHandler, submitFormHandler, filmModel) {
    this._container = container;
    this._updateFilmHandler = updateFilmHandler;
    this._closeModalEscKeydownHandler = closeModalEscKeydownHandler;
    this._submitFormHandler = submitFormHandler;
    this._filmModel = filmModel;
    this._commentsModel = new CommentsModel();

    this._film = null;
    this._commentsContainerComponent = null;
    this._commentsFormComponent = null;
    this._commentsListComponent = null;
    this._commentPresenterList = {};

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._submitFormHandler = this._submitFormHandler.bind(this);
  }

  init(film) {

    if (!this._film) {
      this._film = film;
      this._initCommentsModel();
      this._renderComments();

      render(this._container.getElement(), this._commentsContainerComponent.getElement(), ContentPosition.BEFOREEND);

    } else {

      this._replaceComponent(film);
    }

    this._commentsModel.addObserver(this._modelEventHandler);

    this._setFocusCommentFormFieldHandler();
    this._setBlurCommentFormFieldHandler();
  }

  submitForm() {
    const comment = this._commentsFormComponent.getDescriptionValue();
    const emotion = this._commentsFormComponent.getEmotionValue();

    const data = {comment: comment, emotion: emotion, movie: this._film.id};
    this._viewActionHandler(UserAction.ADD_COMMENT, data);
  }

  _initCommentsModel() {
    getConnect().getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.set(UpdateType.INIT, comments);
      })
      .catch(() => {
        this._commentsModel.set(UpdateType.INIT, []);
      });
  }

  _replaceComponent(film) {
    const oldElement = this._commentsContainerComponent.getElement();
    this._film = film;
    this._renderComments();
    replace(this._commentsContainerComponent.getElement(), oldElement);
  }

  _renderComments() {
    this._commentsContainerComponent = new CommentsContainerView(this._film.comments.length);
    this._commentsFormComponent = new CommentsFormView();
    this._commentsListComponent = new CommentsListView();

    this._renderCommentsList();

    render(this._commentsContainerComponent.getElement(), this._commentsListComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._commentsContainerComponent.getElement(), this._commentsFormComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderCommentsList() {
    this._commentsModel.get().forEach((comment) => {
      this._commentPresenterList[comment.id] = new CommentView(comment);
      this._commentPresenterList[comment.id].setDeleteHandler(this._viewActionHandler);
      render(this._commentsListComponent.getElement(), this._commentPresenterList[comment.id].getElement(), ContentPosition.BEFOREEND);
    });
  }

  _setFocusCommentFormFieldHandler() {
    this._commentsFormComponent.setFocusHandler(() => {
      document.removeEventListener('keydown', this._closeModalEscKeydownHandler);
    });
  }

  _setBlurCommentFormFieldHandler() {
    this._commentsFormComponent.setBlurHandler(() => {
      document.addEventListener('keydown', this._closeModalEscKeydownHandler);
    });
  }

  _viewActionHandler(actionType, data) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        getConnect().deleteComment(data.id).then(() => {

          this._commentsModel.delete(data.id, actionType);

        }).catch(() => {

          this._commentPresenterList[data.id].shake(() => {
            this._commentPresenterList[data.id].updateData({
              isDeleting: false,
              isDisabled: false,
            });
            this._commentPresenterList[data.id].setDeleteHandler(this._viewActionHandler);
          });

        });

        break;
      case UserAction.ADD_COMMENT:
        document.removeEventListener('keydown', this._submitFormHandler);

        getConnect().addComment(data).then((response) => {

          this._commentsModel.add(actionType, response.comments, response.film);

        }).catch(() => {

          this._commentsFormComponent.shake(() => document.addEventListener('keydown', this._submitFormHandler));
        });

        break;
    }
  }

  _modelEventHandler(actionType, data) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:

        this._filmModel.updateFilm([UpdateType.FILM], Object.assign(
          {},
          this._film,
          {
            comments: this._film.comments.filter((comment) => comment !== data),
          },
        ));
        break;
      case UserAction.ADD_COMMENT: {
        this._filmModel.updateFilm([UpdateType.FILM], data);
        break;
      }
      case UpdateType.INIT:
        this._renderCommentsList();
        break;
    }
  }
}
