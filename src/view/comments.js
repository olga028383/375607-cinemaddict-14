import {getDateFormat} from '../lib.js';
import {EMOTIONS} from '../constants.js';

const generateCommentTemplate = (comment = {}) => {
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

const generateCommentsListTemaplate = (comments) => {
  return comments.map((comment) => {
    return generateCommentTemplate(comment);
  }).join('');
};

const generateInputTemplate = (emotion) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
          <label class="film-details__emoji-label" for="emoji-${emotion}">
            <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
          </label>`;
};

const generateInputListTemplate = () => {
  return EMOTIONS.map((emotion) => {
    return generateInputTemplate(emotion);
  }).join('');
};

const createCommentsTemplate = (comments) => {
  return `
        <ul class="film-details__comments-list">
         ${generateCommentsListTemaplate(comments)}
        </ul>
       <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${generateInputListTemplate()}
          </div>
        </div>`;
};

export {createCommentsTemplate};
