import Smart from '../smart.js';
import {EMOTIONS} from '../../constants.js';

const createEmojiFieldTemplate = (emotion, activeEmotion) => {
  const checked = (emotion === activeEmotion) ? 'checked' : '';
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${checked} id="emoji-${emotion}" value="${emotion}"><label class="film-details__emoji-label" for="emoji-${emotion}"><img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji"></label>`;
};
const createEmojiFieldsTemplate = (activeEmotion) => {
  return EMOTIONS.map((emotion) => createEmojiFieldTemplate(emotion, activeEmotion)).join('');
};

const createSelectEmoji = (emotion) => {
  return emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';
};

const createCommentsFormTemplate = (data = {}) => {
  const {emotion = null, text = ''} = data;
  return ` <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${createSelectEmoji(emotion)}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
              </label>
              <div class="film-details__emoji-list">${createEmojiFieldsTemplate(emotion)}</div>
          </div>`;
};

export default class CommentsForm extends Smart {
  constructor() {
    super();
    this._field = null;
    this._data = {};

    this._focusHandler = this._focusHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);

    this._setInnerHandler();
  }

  getTemplate() {
    return createCommentsFormTemplate(this._data);
  }

  setFocusHandler(callback) {
    this.callback.focus = callback;
    this._getFieldText().addEventListener('focus', this._focusHandler);
  }

  setBlurHandler(callback) {
    this.callback.blur = callback;
    this._getFieldText().addEventListener('blur', this._blurHandler);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value,
    });

    this._field = null;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this._setInnerHandler();
    this._getFieldText().addEventListener('focus', this._focusHandler);
    this._getFieldText().addEventListener('blur', this._blurHandler);
  }

  _setInnerHandler() {
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((button) => button.addEventListener('change', this._emojiClickHandler));
    this._getFieldText().addEventListener('input', this._textInputHandler);
  }

  _focusHandler(evt) {
    evt.preventDefault();
    this.callback.focus();
  }

  _blurHandler(evt) {
    evt.preventDefault();
    this.callback.blur();
  }

  _textInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

  _getFieldText() {
    if (!this._field) {
      this._field = this.getElement().querySelector('.film-details__comment-input');
    }
    return this._field;
  }
}
