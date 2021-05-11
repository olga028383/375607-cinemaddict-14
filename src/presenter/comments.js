import {render, replace, ContentPosition} from '../utils/render.js';

import CommentsContainerView from '../view/comments/comments-container.js';
import CommentsFormView from '../view/comments/comments-form.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';

import {UserAction, UpdateType} from '../constants.js';

export default class Comments {
  constructor(commentsModel, filmModel, filmChangeHandler) {
    this._commentsModel = commentsModel;
    this._filmModel = filmModel;
    this._filmChangeHandler = filmChangeHandler;

    this._film = null;
    this._closeModalEscKeydownHandler = null;
    this._commentsContainerComponent = null;
    this._commentsListComponent = null;
    this._commentsFormComponent = null;

    this._viewActionHandel = this._viewActionHandel.bind(this);
    this._commentModelEventHandler = this._commentModelEventHandler.bind(this);
  }

  init(film, filmComments, closeModalEscKeydownHandler, container) {

    if (!this._film) {
      this._film = film;
      this._filmComments = filmComments;
      this._closeModalEscKeydownHandler = closeModalEscKeydownHandler;
      this._commentsContainerComponent = new CommentsContainerView(this._filmComments.length);
      this._commentsListComponent = new CommentsListView();
      this._commentsFormComponent = new CommentsFormView();
      this._renderCommentsForm();

      render(container.getElement(), this._commentsContainerComponent.getElement(), ContentPosition.BEFOREEND);

    } else {

      const oldElement = this._commentsContainerComponent.getElement();
      this._film = film;
      this._filmComments = filmComments;
      this._closeModalEscKeydownHandler = closeModalEscKeydownHandler;
      this._commentsContainerComponent = new CommentsContainerView(this._filmComments.length);
      this._commentsListComponent = new CommentsListView();
      this._commentsFormComponent = new CommentsFormView();
      this._renderCommentsForm();
      replace(this._commentsContainerComponent.getElement(), oldElement);
    }


    this._setFocusCommentFormFieldHandler();
    this._setBlurCommentFormFieldHandler();
  }

  _renderComments() {
    this._filmComments.forEach((filmCommentId) => {
      const filmComment = this._commentsModel.getComments().find((comment) => filmCommentId === comment.id);
      const commentComponent = new CommentView(filmComment);
      commentComponent.setDeleteHandler(this._viewActionHandel);

      render(this._commentsListComponent.getElement(), commentComponent.getElement(), ContentPosition.BEFOREEND);
    });

    this._commentsModel.addObserver(this._commentModelEventHandler);
  }

  addCommentHandler() {
    const comment = this._commentsFormComponent.getFieldValueDescription();
    const emotion = this._commentsFormComponent.getFieldValueEmotion();

    if (comment) {
      const data = {comment: comment, emotion: emotion};
      this._viewActionHandel(UserAction.ADD_COMMENT, data);
    }
  }

  _renderCommentsForm() {
    this._renderComments();
    render(this._commentsContainerComponent.getElement(), this._commentsListComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._commentsContainerComponent.getElement(), this._commentsFormComponent.getElement(), ContentPosition.BEFOREEND);
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

  _viewActionHandel(actionType, data) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(data, actionType);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(data, actionType);
        break;
    }
  }

  _commentModelEventHandler(id, actionType) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._filmChangeHandler(
          UserAction.UPDATE_FILM,
          [UpdateType.FILM_PREVIEW, UpdateType.FILM_TOP_COMMENT],
          Object.assign(
            {},
            this._film,
            {
              comments: this._film.comments.filter((comment) => comment !== id),
            },
          ),
        );
        break;
      case UserAction.ADD_COMMENT: {
        const comments = this._film.comments.slice();
        comments.push(id);

        this._filmChangeHandler(
          UserAction.UPDATE_FILM,
          [UpdateType.FILM_PREVIEW],
          Object.assign(
            {},
            this._film,
            {
              comments: comments,
            },
          ),
        );
        break;
      }
    }
  }
}
