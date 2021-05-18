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

  set(comments) {
    this._comments = comments.slice();
  }

  add(data, action) {
    const id = getId();

    const comment = {
      id: id,
      text: data.comment,
      emotion: data.emotion ? data.emotion : 'smile',
      author: 'test',
      data: new Date(),
    };

    this._comments.push(comment);

    this._notify(comment, action);
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

    this._notify(id, action);
  }
}
