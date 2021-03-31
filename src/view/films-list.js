import {createCardTemplate} from './card.js';
import {createButtonMoreTemplate} from './button-more.js';

const COUNT_LIST = 5;
const title = 'All movies. Upcoming';

const createFilmsListTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">${title}</h2>

      <div class="films-list__container">
        ${createCardTemplate(COUNT_LIST)}
      </div>
        
        ${createButtonMoreTemplate()}
    </section>`;
};

export {createFilmsListTemplate};
