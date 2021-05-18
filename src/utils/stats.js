import {RankNames} from '../constants.js';

const makeItemsUnique = (items) => [...new Set(items)];

const countFilmsByWatched = (films, watch) => films.filter((film) => film.genres.find((genre) => genre === watch)).length;

const countTimeLengthWatch = (films) => {
  return films.reduce((previousValue, currentValue) => {
    return +previousValue + currentValue.runTime;
  }, 0);
};

const getRankUser = (films) =>{

  const filmsLength = films.length;

  if (filmsLength >= 1 && filmsLength <= 10) {
    return RankNames.NOVICE;
  } else if (filmsLength >= 11 && filmsLength <= 20) {
    return RankNames.FAN;
  } else if (filmsLength >= 21) {
    return RankNames.MOVIE_BUFF;
  }

  return 0;
};

export {makeItemsUnique, countFilmsByWatched, countTimeLengthWatch, getRankUser};
