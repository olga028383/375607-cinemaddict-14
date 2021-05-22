import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  get() {
    return this._films;
  }

  set(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
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

  getSortedByRating() {
    return this._films.slice().sort((a, b) => b.rating - a.rating);
  }

  getSortedByComment() {
    return this._films.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        name: film.film_info.title,
        originalName: film.film_info.alternative_title,
        poster: film.film_info.poster,
        description: film.film_info.description,
        rating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        country: film.film_info.release.release_country,
        date: film.film_info.release.date,
        runTime: film.film_info.runtime,
        producer: film.film_info.director,
        scenarists: film.film_info.writers,
        actors: film.film_info.actors,
        genres: film.film_info.genre,
        isWatchList: film.user_details.watchlist,
        watchingDate: film.user_details.watching_date,
        isWatch: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.name,
          'alternative_title': film.originalName,
          'total_rating': film.rating,
          'poster': film.poster,
          'age_rating': film.ageRating,
          'director': film.producer,
          'writers': film.scenarists,
          'actors': film.actors,
          'release': {'date': film.date, 'release_country': film.country},
          'runtime': film.runTime,
          'genre': film.genres,
          'description': film.description,
        },
        'user_details': {
          'watchlist': film.isWatchList,
          'already_watched': film.isWatch,
          'watching_date': film.watchingDate,
          'favorite': film.isFavorite,
        },
      },
    );

    delete adaptedFilm.name;
    delete adaptedFilm.originalName;
    delete adaptedFilm.poster;
    delete adaptedFilm.description;
    delete adaptedFilm.rating;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.country;
    delete adaptedFilm.date;
    delete adaptedFilm.runTime;
    delete adaptedFilm.producer;
    delete adaptedFilm.scenarists;
    delete adaptedFilm.actors;
    delete adaptedFilm.genres;
    delete adaptedFilm.isWatchList;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isWatch;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
