import {createRankUserTemplate} from './view/rank-user.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortTemplate} from './view/sort.js';
import {createLayoutFilmsTemplate} from './view/layout-fillms.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createCardTemplate} from './view/card.js';
import {createCardDetailTemplate} from './view/card-detail.js';
import {createCommentsTemplate} from './view/comments.js';
import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';
import {generateComment} from './mock/comment.js';


const COUNT_COMMENTS = 30;
const COUNT_CARD_All = 30;
const COUNT_CARD_LIST = 5;
const COUNT_CARD_TOP = 2;
let showedCards = COUNT_CARD_LIST;

const comments = new Map();
for (let i = 1; i <= COUNT_COMMENTS; i++) {
  const comment = generateComment();
  comments.set(comment.id, comment);
}

const cards = new Array(COUNT_CARD_All).fill().map(() => generateCard());
const filters = generateFilter(cards);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const loadCardsHandler = () => {
  const lastCountCards = showedCards;
  const loadedCards = cards.slice(lastCountCards, lastCountCards + COUNT_CARD_LIST);
  showedCards = showedCards + loadedCards.length;

  const list = drawCardsList(showedCards, COUNT_CARD_LIST, createCardTemplate);
  render(filmList, list, 'beforeend');

  if (cards.length - showedCards === 0) {
    buttonMore.style.display = 'none';
  }
};

const drawCardsList = (showed, count, callback) => {
  const displayedComments = cards.slice(showed - count, showed);
  return displayedComments.map((card) => {
    return callback(card);
  }).join('');
};

const header = document.querySelector('.header');
render(header, createRankUserTemplate(), 'beforeend');

const main = document.querySelector('.main');
render(main, createMenuTemplate(filters), 'afterbegin');
render(main, createSortTemplate(), 'beforeend');

render(main, createLayoutFilmsTemplate(), 'beforeend');

const layout = document.querySelector('.films');
render(layout, createFilmsListTemplate(drawCardsList(COUNT_CARD_LIST, COUNT_CARD_LIST, createCardTemplate), showedCards < COUNT_CARD_All), 'beforeend');

const topRatedCard = cards.slice().sort((a, b) => {
  return b.rating - a.rating;
}).slice(0, COUNT_CARD_TOP);

render(layout, createFilmsListExtraTemplate('Top rated', topRatedCard.map((card) => {
  return createCardTemplate(card);
}).join('')), 'beforeend');

const mostCommentedCard = cards.slice().sort((a, b) => {
  return b.comments.length - a.comments.length;
}).slice(0, COUNT_CARD_TOP);

render(layout, createFilmsListExtraTemplate('Most commented', mostCommentedCard.map((card) => {
  return createCardTemplate(card);
}).join('')), 'beforeend');


const buttonMore = document.querySelector('.films-list__show-more');
const filmList = document.querySelector('.films-list__container');
buttonMore.addEventListener('click', loadCardsHandler);


const footer = document.querySelector('.footer__statistics');
footer.innerHTML = `${cards.length.toLocaleString()} movies inside`;

const openModalButtons = main.querySelectorAll('.film-card');

openModalButtons.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('film-card__poster')
      || evt.target.classList.contains('film-card__title')
      || evt.target.classList.contains('film-card__comments')) {

      const id = button.dataset.id;
      const commentsCard = createCommentsTemplate(cards[id].comments.map((comment) => comments.get(comment)));
      render(footer, createCardDetailTemplate(cards[id], commentsCard), 'beforeend');

    }
  });
});
