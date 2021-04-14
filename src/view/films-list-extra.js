import {createElement} from "../util";

const createFilmsListExtraTemplate = (title, content) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
        ${content}
      </div>
       
    </section>`;
};

export default class FilmsListExtra {
  constructor(title, content) {
    this._title = title;
    this._content = content;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title, this._content);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element
  }

  removeElement() {
    this._element = null;
  }
}
