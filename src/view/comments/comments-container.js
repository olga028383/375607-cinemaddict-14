import AbstractView from '../abstract-view.js';

const createCommentsContainerTemplate = (count) => {
  return ` <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${count}</span></h3>
      </section>`;
};

export default class CommentsContainer extends AbstractView {
  constructor(countComments) {
    super();
    this._count = countComments;
  }

  getTemplate() {
    return createCommentsContainerTemplate(this._count);
  }
}
