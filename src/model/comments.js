import Observer from '../utils/observer.js';
import {getId} from '../lib.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  addComment(data, action) {
    const id = getId();

    this._comments.push({
      id: id,
      text: data.comment,
      emotion: data.emotion ? data.emotion : 'smile',
      author: 'test',
      data: new Date(),
    });

    this._notify(id, action);
  }

  deleteComment(id, action) {
    const index = this._comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete the comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(id, action);
  }
}
