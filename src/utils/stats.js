import {RankNames} from '../constants.js';

const makeItemsUnique = (items) => [...new Set(items)];

const countFilmsByWatched = (films, watch) => films.filter((film) => film.genres.find((genre) => genre === watch)).length;

const countTimeLengthWatch = (films) => {
  return films.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.runTime;
  }, 0);
};

const getRankUser = (films) => {

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

const getLengthTimeFormat = (numeric) => {
  const minTime = 60;
  const minutes = numeric % minTime;
  const hours = (numeric - minutes) / minTime;

  let result = 0;
  if (hours > 0) {
    result = `${hours}<span class="statistic__item-description">h</span>`;
  }
  if (minutes > 0) {
    result += (minutes <= 9) ? ` 0${minutes}<span class="statistic__item-description">m</span>` : ` ${minutes}<span class="statistic__item-description">m</span>`;
  }

  return result.trim();
};

export {makeItemsUnique, countFilmsByWatched, countTimeLengthWatch, getRankUser, getLengthTimeFormat};
