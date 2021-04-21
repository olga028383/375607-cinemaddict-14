import AbstractView from '../abstract-view.js';

const createCommentsListTemplate = () => {
  return '<ul class="film-details__comments-list"></ul>';
};

export default class CommentsList extends AbstractView{
  getTemplate() {
    return createCommentsListTemplate();
  }
}
