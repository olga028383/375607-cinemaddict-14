import AbstractView from '../abstract-view.js';

const createCommentsFormTemplate = () => {
  return ` <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
          </div>`;
};

export default class CommentsForm extends AbstractView{
  getTemplate() {
    return createCommentsFormTemplate();
  }
}
