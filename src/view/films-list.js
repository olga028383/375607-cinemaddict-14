import {createButtonMoreTemplate} from './button-more.js';

const createFilmsListTemplate = (card) => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
        ${card}
      </div>
        
        ${createButtonMoreTemplate()}
    </section>`;
};

export {createFilmsListTemplate};
