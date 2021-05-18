import AbstractView from '../abstract-view.js';

const MenuTemplate = () => {
  return '<nav class="main-navigation"></nav>';
};

export default class Menu extends AbstractView {
  getTemplate() {
    return MenuTemplate();
  }
}
