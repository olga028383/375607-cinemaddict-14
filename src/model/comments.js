import Observer from '../utils/observer.js';
import {getId} from '../lib.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  get() {
    return this._comments;
  }

  set(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  add(data, action) {
    this._comments = data.comments.map(CommentsModel.adaptToClient);
    this._notify(action);
  }

  delete(id, action) {
    const index = this._comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete the comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(action, id);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        text: comment.comment,
      },
    );

    delete adaptedComment.comment;

    if(comment.movie) {
      delete adaptedComment.movie;
    }

    return adaptedComment;
  }
}
