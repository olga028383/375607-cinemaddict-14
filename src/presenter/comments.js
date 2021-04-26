import {render, ContentPosition} from '../utils/render.js';

import CommentsContainerView from '../view/comments/comments-container.js';
import CommentsFormView from '../view/comments/comments-form.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';
import EmojiListView from '../view/comments/emoji-list.js';

import {generateComment} from '../mock/comment.js';

const COUNT_CARD_All = 30;
const comments = new Array(COUNT_CARD_All).fill(null).map(() => generateComment());

export default class Comments {
  constructor(film) {
    this._comments = comments;
    this._film = film;
    this._commentsListComponent = new CommentsListView();
    this._commentsFormComponent = new CommentsFormView();
    this._commentsContainerComponent = new CommentsContainerView(this._film._film.comments.length);
  }

  init(container) {
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
    render(this._commentsFormComponent.getElement(), new EmojiListView().getElement(), ContentPosition.BEFOREEND);
    render(this._commentsContainerComponent.getElement(), this._commentsFormComponent.getElement(), ContentPosition.BEFOREEND);
  }

  _getCurrentComments() {
    return (this._film._film.comments) ? this._comments.slice(this._film._film.comments.length) : [];
  }

  _setFocusCommentFormFieldHandler() {
    this._commentsFormComponent.setFocusHandler(() => {
      document.removeEventListener('keydown', this._film._closeModalEscKeydownHandler);
    });
  }

  _setBlurCommentFormFieldHandler() {
    this._commentsFormComponent.setBlurHandler(() => {
      document.addEventListener('keydown', this._film._closeModalEscKeydownHandler);
    });
  }
}
