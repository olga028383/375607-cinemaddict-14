import AbstractView from '../abstract-view.js';

export default class Menu extends AbstractView {
  getTemplate() {
    return '<nav class="main-navigation"></nav>';
  }
}
