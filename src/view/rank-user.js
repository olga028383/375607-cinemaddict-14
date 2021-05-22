import AbstractView from './abstract-view.js';

const createRankUserTemplate = (name) => {
  return name ? `<section class="header__profile profile">
    <p class="profile__rating">${name}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : '<section class="header__profile profile"></section>';
};

export default class RankUser extends AbstractView {
  constructor(rankName) {
    super();
    this._rankName = rankName;
  }

  getTemplate() {
    return createRankUserTemplate(this._rankName);
  }
}
