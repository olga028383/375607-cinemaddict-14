import AbstractView from "../abstract-view.js";

const createFilmsEmptyTemplate = () => {
  return `<section class="films">
            <section class="films-list">
              <h2 class="films-list__title">There are no movies in our database</h2>
            </section>
          </section>`;
};

export default class FilmsEmpty extends AbstractView{
  getTemplate() {
    return createFilmsEmptyTemplate();
  }
}
