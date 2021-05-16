import AbstractView from '../abstract-view.js';
import {getDateFormat} from '../../lib.js';

import {UserAction} from '../../constants.js';

const createCommentTemplate = (comment = {}) => {
  const {
    id = '',
    author = '',
    date = new Date(),
    emotion = 'smile',
    text = '',
  } = comment;

  return ` <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${getDateFormat(date, 'YYYY/DD/MM hh:mm')}</span>
            <button class="film-details__comment-delete" data-id="${id}">Delete</button>
          </p>
        </div>
      </li>`;
};

export default class Comment extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._deleteHandler = this._deleteHandler.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  setDeleteHandler(callback) {
    this.callback.delete = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._deleteHandler);
  }

  _deleteHandler(evt) {
    evt.preventDefault();

    this.callback.delete(UserAction.DELETE_COMMENT, evt.target.dataset.id);
  }
}
