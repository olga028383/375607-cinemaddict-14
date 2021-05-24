import AbstractView from '../abstract-view.js';

const createCommentsListTemplate = (isOnline = true) => {
  return `<ul class="film-details__comments-list">${(!isOnline) ? 'Comments list is not available offline' : ''}</ul>`;
};

export default class CommentsList extends AbstractView {
  constructor(isOnline) {
    super();

    this._isOnline = isOnline;
  }

  getTemplate() {
    return createCommentsListTemplate(this._isOnline);
  }
}
