import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  get() {
    return this._films;
  }

  set(films) {
    this._films = films.slice();
    this._notify();
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t change the movie');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  sortRating() {
    return this._films.slice().sort((a, b) => {
      return b.rating - a.rating;
    });
  }

  sortComment() {
    return this._films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    });
  }
}
