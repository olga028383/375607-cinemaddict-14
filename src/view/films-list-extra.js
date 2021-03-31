import {createCardTemplate} from './card.js';

const COUNT_LIST = 2;

const createFilmsListExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
        ${createCardTemplate(COUNT_LIST)}
      </div>
       
    </section>`;
};

export {createFilmsListExtraTemplate};
