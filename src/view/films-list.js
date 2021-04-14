import {createButtonMoreTemplate} from './button-more.js';

const createFilmsListTemplate = (card, showedButton = true) => {
  const button = (showedButton) ? createButtonMoreTemplate(): '';
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
        ${card}
      </div>
        
        ${button}
    </section>`;
};

export {createFilmsListTemplate};
