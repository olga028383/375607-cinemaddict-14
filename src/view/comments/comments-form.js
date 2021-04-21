import AbstractView from '../abstract-view.js';

const createCommentsFormTemplate = () => {
  return ` <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
          </div>`;
};

export default class CommentsForm extends AbstractView {
  constructor() {
    super();
    this._field = null;
    this._focusHandler = this._focusHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
  }

  getTemplate() {
    return createCommentsFormTemplate();
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

  setFocusHandler(callback) {
    this.callback.focus = callback;
    this._getField().addEventListener('focus', this._focusHandler);
  }

  setBlurHandler(callback) {
    this.callback.blur = callback;
    this._getField().addEventListener('blur', this._blurHandler);
  }
}
