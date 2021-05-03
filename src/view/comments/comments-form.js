import Smart from '../smart.js';
import {EMOTIONS} from '../../constants.js';

const createEmojiFieldTemplate = (emotion) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"><label class="film-details__emoji-label" for="emoji-${emotion}"><img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji"></label>`;
};
const createEmojiFieldsTemplate = () => {
  return EMOTIONS.map((emotion) => createEmojiFieldTemplate(emotion)).join('');
};

const createCommentsFormTemplate = () => {
  return ` <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">${createEmojiFieldsTemplate()}</div>
          </div>`;
};

export default class CommentsForm extends Smart {
  constructor() {
    super();
    this._field = null;
    this._focusHandler = this._focusHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
  }

  getTemplate() {
    return createCommentsFormTemplate();
  }

  setFocusHandler(callback) {
    this.callback.focus = callback;
    this._getField().addEventListener('focus', this._focusHandler);
  }

  setBlurHandler(callback) {
    this.callback.blur = callback;
    this._getField().addEventListener('blur', this._blurHandler);
  }

  restoreHandlers() {

  }

  _focusHandler(evt) {
    evt.preventDefault();
    this.callback.focus();
  }

  _blurHandler(evt) {
    evt.preventDefault();
    this.callback.blur();
  }

  _getField() {
    if (!this.field) {
      this.field = this._element.querySelector('.film-details__comment-input');
    }
    return this.field;
  }
}
