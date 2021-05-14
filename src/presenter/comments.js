import {render, replace, ContentPosition} from '../utils/render.js';

import CommentsContainerView from '../view/comments/comments-container.js';
import CommentsFormView from '../view/comments/comments-form.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';

import {UserAction, UpdateType} from '../constants.js';

export default class Comments {
  constructor(container, updateFilmHandler, closeModalEscKeydownHandler, filmModel, commentsModel) {
    this._container = container;
    this._updateFilmHandler = updateFilmHandler;
    this._closeModalEscKeydownHandler = closeModalEscKeydownHandler;
    this._filmModel = filmModel;
    this._commentsModel = commentsModel;

    this._film = null;
    this._commentsContainerComponent = null;
    this._commentsFormComponent = null;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
  }

  init(film) {

    if (!this._film) {
      this._film = film;
      this._renderComments();
      render(this._container.getElement(), this._commentsContainerComponent.getElement(), ContentPosition.BEFOREEND);

    } else {

      this._replaceComponent();
    }


    this._setFocusCommentFormFieldHandler();
    this._setBlurCommentFormFieldHandler();
  }

  submitForm() {
    const comment = this._commentsFormComponent.getDescriptionValue();
    const emotion = this._commentsFormComponent.getEmotionValue();

    if (comment) {
      const data = {comment: comment, emotion: emotion};
      this._viewActionHandler(UserAction.ADD_COMMENT, data);
    }
  }

  _replaceComponent() {
    const oldElement = this._commentsContainerComponent.getElement();
    this._film = film;
    this._renderComments();
    replace(this._commentsContainerComponent.getElement(), oldElement);
  }

  _renderComments() {
    this._commentsContainerComponent = new CommentsContainerView(this._film.comments.length);
    this._commentsFormComponent = new CommentsFormView();
    const commentsListComponent = new CommentsListView();

    this._renderCommentsList(commentsListComponent);

    render(this._commentsContainerComponent.getElement(), commentsListComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._commentsContainerComponent.getElement(), this._commentsFormComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderCommentsList(commentsListComponent) {
    this._film.comments.forEach((filmCommentId) => {
      const filmComment = this._commentsModel.get().find((comment) => filmCommentId === comment.id);
      const commentComponent = new CommentView(filmComment);
      commentComponent.setDeleteHandler(this._viewActionHandler());

      render(commentsListComponent.getElement(), commentComponent.getElement(), ContentPosition.BEFOREEND);
    });

    this._commentsModel.addObserver(this._modelEventHandler);
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
        this._commentsModel.deleteComment(data, actionType);

        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(data, actionType);

        break;
    }
  }

  _modelEventHandler(id, actionType) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:

        this._updateFilmHandler(
          UserAction.UPDATE_FILM,
          [UpdateType.FILM, UpdateType.FILM_TOP_COMMENT],
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

        this._updateFilmHandler(
          UserAction.UPDATE_FILM,
          [UpdateType.FILM],
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
