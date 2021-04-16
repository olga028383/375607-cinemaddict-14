import {createElement} from '../../util.js';
import {EMOTIONS} from '../../constants.js';

const createEmojiFieldTemplate = (emotion) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"><label class="film-details__emoji-label" for="emoji-${emotion}"><img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji"></label>`;
};
const createEmojiFieldsTemplate = () => {
  return EMOTIONS.map((emotion) => createEmojiFieldTemplate(emotion)).join('');
};
const createEmojiListTemplate = () => {
  return ` <div class="film-details__emoji-list">${createEmojiFieldsTemplate()}</div>`;
};

export default class EmojiList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmojiListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
