import RankUserView from './view/rank-user.js';
import MenuView from './view/menu.js';
import SortView from './view/sort.js';
import LayoutFilmsView from './view/layout-fillms.js';
import FilmsListView from './view/films-list.js';
import ButtonMoreView from './view/button-more.js';
import FilmsListExtraView from './view/films-list-extra.js';
import CardView from './view/card.js';
import CardDetailView from './view/card-detail.js';
import CommentsView from './view/comments.js';

import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';
import {generateComment} from './mock/comment.js';

import {render, ContentPosition} from './util.js';

const COUNT_COMMENTS = 30;
const COUNT_CARD_All = 30;
const COUNT_CARD_LIST = 5;
const COUNT_CARD_TOP = 2;
let showedCards = COUNT_CARD_LIST;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticElement = footerElement.querySelector('.footer__statistics');

const comments = new Map();
for (let i = 1; i <= COUNT_COMMENTS; i++) {
  const comment = generateComment();
  comments.set(comment.id, comment);
}
const cards = new Array(COUNT_CARD_All).fill(null).map(() => generateCard(comments));
const filters = generateFilter(cards);

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

const drawCardsList = (showed, count) => {
  const displayedComments = cards.slice(showed - count, showed);
  return displayedComments.map((card) => {
    return new CardView(card).getElement();
  });
};

const renderCard = (cardListElement, card) => {
  const cardComponent = new CardView(card);

  //const commentsComponent = new CommentsView(cards.comments.map((comment) => comments.get(comment)));
  console.log(card);

  const openModalButton = cardComponent.getElement().querySelector('.film-card');

  openModalButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('film-card__poster')
      || evt.target.classList.contains('film-card__title')
      || evt.target.classList.contains('film-card__comments')) {

      const cardDetailComponent = new CardDetailView(card);
      const closeModalButton = cardDetailComponent.getElement().querySelector('.film-details__close-btn');
      const commentTitle = cardDetailComponent.getElement().querySelector('.film-details__comments-title');

      //const commentsCardComponent = new CommentsView(card.comments.map((comment) => comments.get(comment)));
      //Создать комментарии и добавить их после

      closeModalButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        cardDetailComponent.removeElement();
        //footerElement.innerHTML = cardDetailComponent.getElement();
      });

      render(footerElement, cardDetailComponent.getElement(), 'beforeend');
    }
  });



  render(cardListElement, cardComponent.getElement(), 'beforeend');
};

renderCard(mainElement,cards[0]);

// const filmLayout = new LayoutFilmsView();
//
// const buttonMore = (showedCards < COUNT_CARD_All) ? new ButtonMoreView() : '';
// const filmList = new FilmsListView(drawCardsList(COUNT_CARD_LIST, COUNT_CARD_LIST), buttonMore.getElement());
//
// const topRatedCard = cards.slice().sort((a, b) => {
//   return b.rating - a.rating;
// }).slice(0, COUNT_CARD_TOP);
//
// const topRatedCardTemplate = new FilmsListExtraView('Top rated', topRatedCard.map((card) => {
//   return new CardView(card).getElement();
// }).join('')).getElement();
//
// const mostCommentedCard = cards.slice().sort((a, b) => {
//   return b.comments.length - a.comments.length;
// }).slice(0, COUNT_CARD_TOP);
//
// const mostCommentedCardTemplate = new FilmsListExtraView('Most commented', mostCommentedCard.map((card) => {
//   return new CardView(card).getElement();
// }).join('')).getElement();
//
// render(main, filmLayout.getElement(), 'beforeend');
// render(filmLayout.getElement(), filmList.getElement(), 'afterbegin');
//
// //const filmList = document.querySelector('.films-list__container');
// //buttonMore.addEventListener('click', loadCardsHandler);
//


render(headerElement, new RankUserView().getElement(), 'beforeend');
render(mainElement, new MenuView(filters).getElement(), 'afterbegin');
render(mainElement, new SortView().getElement(), 'beforeend');


footerStatisticElement.textContent = `${cards.length.toLocaleString()} movies inside`;
