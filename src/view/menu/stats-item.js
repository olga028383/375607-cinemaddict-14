import AbstractView from '../abstract-view.js';

const StatsItemTemplate = () => {
  return ' <a href="#stats" class="main-navigation__additional">Stats</a>';
};

export default class StatsItem extends AbstractView {
  constructor(){
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }
  getTemplate() {
    return StatsItemTemplate();
  }

  setClickHandler(callback){
    this.callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  removeActiveClass(){
    this.getElement().classList.remove('main-navigation__additional--active');
  }

  _clickHandler(evt){
    evt.preventDefault();

    this.getElement().classList.add('main-navigation__additional--active');
    this.callback.click();
  }

}
