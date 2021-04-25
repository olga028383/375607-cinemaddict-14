import AbstractView from '../abstract-view.js';

const createFilmDetailsContainerTemplate = () => {
  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get"></form>
           </section>`;
};

export default class FilmDetailsContainer extends AbstractView {
  getTemplate() {
    return createFilmDetailsContainerTemplate();
  }
}
