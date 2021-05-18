import AbstractView from './abstract-view.js';
import {getRankUser} from '../utils/stats.js';

const createRankUserTemplate = (name) => {
  return name ? `<section class="header__profile profile">
    <p class="profile__rating">${name}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : '<section class="header__profile profile"></section>';
};

export default class RankUser extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
    this._rankName = getRankUser(films);
  }

  getTemplate() {
    return createRankUserTemplate(this._rankName);
  }
}
