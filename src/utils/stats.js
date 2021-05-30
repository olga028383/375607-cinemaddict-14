import {RanksName, MIN_TIME} from '../constants.js';

const countTimeLengthWatch = (films) => {
  return films.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.runTime;
  }, 0);
};

const getRankUser = (films) => {

  const filmsLength = films.length;

  if (filmsLength >= 1 && filmsLength <= 10) {
    return RanksName.NOVICE;
  } else if (filmsLength >= 11 && filmsLength <= 20) {
    return RanksName.FAN;
  } else if (filmsLength >= 21) {
    return RanksName.MOVIE_BUFF;
  }

  return 0;
};

const getLengthTimeFormat = (numeric) => {
  const minutes = numeric % MIN_TIME;
  const hours = (numeric - minutes) / MIN_TIME;

  let result = 0;
  if (hours > 0) {
    result = `${hours}<span class="statistic__item-description">h</span>`;
  }
  if (minutes > 0) {
    result += (minutes <= 9) ? ` 0${minutes}<span class="statistic__item-description">m</span>` : ` ${minutes}<span class="statistic__item-description">m</span>`;
  }

  return result.trim();
};

const getFilmGenres = (films) => films.reduce((accumulator, film) => {
  return accumulator.concat(film.genres);
}, []);


const getGenresBySort = (films) => {
  const dataGenres = getFilmGenres(films).reduce((accumulator, genre) => {
    accumulator[genre] = (accumulator[genre] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(dataGenres).slice().sort((a, b) => b[1] - a[1]);
};

export {
  countTimeLengthWatch,
  getRankUser,
  getLengthTimeFormat,
  getGenresBySort,
  getFilmGenres
};
