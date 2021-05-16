import {FilterType} from '../constants.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatch),
};

export {filter};
