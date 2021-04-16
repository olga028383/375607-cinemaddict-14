import {createElement} from '../../util';

const createCommentsContainerTemplate = (count) => {
  return ` <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${count}</span></h3>
      </section>`;
};

export default class CommentsContainer {
  constructor(countComments) {
    this.count = countComments;
    this._element = null;
  }

  getTemplate() {
    return createCommentsContainerTemplate(this.count);
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
