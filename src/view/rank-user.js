import Smart from './smart.js';
import {getRankUser} from '../utils/stats.js';

const createRankUserTemplate = (data = {}) => {
  const {films = 0} = data;
  const name = getRankUser(films);

  return name ? `<section class="header__profile profile">
    <p class="profile__rating">${name}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : '<section class="header__profile profile"></section>';
};

export default class RankUser extends Smart {
  constructor(watchedFilms) {
    super();

    this._films = watchedFilms;

    this._data = {
      films: this._films,
    };
  }

  getTemplate() {
    return createRankUserTemplate(this._data);
  }
}
