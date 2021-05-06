import {render, ContentPosition} from '../utils/render.js';

import CommentsContainerView from '../view/comments/comments-container.js';
import CommentsFormView from '../view/comments/comments-form.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';

export default class Comments {
  constructor() {
    this._comments = null;
    this._filmCommentsCount = 0;
    this._closeModalEscKeydownHandler = null;
    this._commentsListComponent = new CommentsListView();
    this._commentsFormComponent = new CommentsFormView();

  }

  init(filmCommentsCount, closeModalEscKeydownHandler, comments, container) {
    this._filmCommentsCount = filmCommentsCount;
    this._closeModalEscKeydownHandler = closeModalEscKeydownHandler;
    this._comments = comments;
    this._commentsContainerComponent = new CommentsContainerView(this._filmCommentsCount);
    this._renderCommentsForm();
    this._setFocusCommentFormFieldHandler();
    this._setBlurCommentFormFieldHandler();

    render(container.getElement(), this._commentsContainerComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _renderComment() {
    this._getCurrentComments().forEach((comment) => {
      render(this._commentsListComponent.getElement(), new CommentView(comment).getElement(), ContentPosition.BEFOREEND);
    });
  }

  _renderCommentsForm() {
    this._renderComment();
    render(this._commentsContainerComponent.getElement(), this._commentsListComponent.getElement(), ContentPosition.BEFOREEND);
    render(this._commentsContainerComponent.getElement(), this._commentsFormComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _getCurrentComments() {
    return (this._filmCommentsCount) ? this._comments.slice(this._filmCommentsCount) : [];
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
}
