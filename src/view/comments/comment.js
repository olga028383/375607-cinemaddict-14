import AbstractView from '../abstract-view.js';
import {getDateFormat} from '../../lib.js';


const createCommentTemplate = (comment = {}) => {
  const {
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
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`;
};

export default class Comment extends AbstractView{
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }
}
