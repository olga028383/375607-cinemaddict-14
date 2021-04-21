import RankUserView from './view/rank-user.js';
import MenuView from './view/menu.js';
import SortView from './view/sort.js';
import LayoutFilmsView from './view/layout-fillms.js';
import StatisticsView from './view/statistics.js';

import FilmsListContainerView from './view/films/films-list-container.js';
import FilmsListView from './view/films/films-list.js';
import FilmsListExtraView from './view/films/films-list-extra.js';
import FilmView from './view/films/film.js';
import FilmsEmptyView from './view/films/films-empty.js';

import ButtonMoreView from './view/button-more.js';

import FilmDetailsContainerView from './view/film-details/film-details-container.js';
import FilmDetailsBottomView from './view/film-details/film-details-bottom.js';
import FilmDetailsView from './view/film-details/film-details.js';

import CommentsContainerView from './view/comments/comments-container.js';
import CommentsFormView from './view/comments/comments-form.js';
import CommentsListView from './view/comments/comments-list.js';
import CommentView from './view/comments/comment.js';
import EmojiListView from './view/comments/emoji-list.js';

import {generateFilter} from './mock/filter.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';

import {render, ContentPosition} from './utils/render.js';
import {isEscEvent} from './util.js';

const COUNT_CARD_All = 30;
const COUNT_CARD_LIST = 5;
const COUNT_CARD_TOP = 2;

const bodyElement = document.body;
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const comments = new Array(COUNT_CARD_All).fill(null).map(() => generateComment());
const films = new Array(COUNT_CARD_All).fill(null).map(() => generateFilm(comments));
const filters = generateFilter(films);
const commentFormComponents = new Map();

const renderCommentsForm = (comments, index) => {
  const commentsContainerElement = new CommentsContainerView(comments.length).getElement();
  const commentsFormComponent = new CommentsFormView();
  commentFormComponents.set(index, commentsFormComponent);
  const commentsFormElement = commentsFormComponent.getElement();
  const commentsListElement = new CommentsListView().getElement();

  comments.forEach((comment) => {
    render(commentsListElement, new CommentView(comment).getElement(), ContentPosition.BEFOREEND);
  });

  render(commentsContainerElement, commentsListElement, ContentPosition.BEFOREEND);
  render(commentsFormElement, new EmojiListView().getElement(), ContentPosition.BEFOREEND);
  render(commentsContainerElement, commentsFormElement, ContentPosition.BEFOREEND);

  return commentsContainerElement;
};

const renderFilmDetail = (film, index) => {
  const filmDetailContainer = new FilmDetailsContainerView();
  const filmDetailBottomElement = new FilmDetailsBottomView().getElement();
  const filmDetailElement = new FilmDetailsView(film).getElement();

  render(filmDetailBottomElement, filmDetailElement, ContentPosition.BEFOREEND);
  render(filmDetailBottomElement, renderCommentsForm(comments.slice(0, 5), index), ContentPosition.BEFOREEND);
  render(filmDetailContainer.getElement(), filmDetailBottomElement, ContentPosition.BEFOREEND);

  return filmDetailContainer;
};

const openModal = (filmDetailElement) => {
  bodyElement.classList.add('hide-overflow');
  render(bodyElement, filmDetailElement, 'beforeend');
};

const closeModal = (filmDetailElement) => {
  bodyElement.classList.remove('hide-overflow');
  filmDetailElement.remove();
};

const renderFilm = (film, index) => {
  const cardComponent = new FilmView(film);
  cardComponent.getElement();

  const filmDetailContainer = renderFilmDetail(film, index);

  const closeModalEscKeydownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();

      closeModal(filmDetailContainer.getElement());
    }
  };

  const openModalHandler = () => {

    openModal(filmDetailContainer.getElement());
    filmDetailContainer.setClickHandler(closeModalHandler);

    document.addEventListener('keydown', closeModalEscKeydownHandler);
  };

  const closeModalHandler = () => {

    closeModal(filmDetailContainer.getElement());

    document.removeEventListener('keydown', closeModalEscKeydownHandler);
  };

  cardComponent.setClickHandler(openModalHandler);

  commentFormComponents.get(index).setFocusHandler(() => {
    document.removeEventListener('keydown', closeModalEscKeydownHandler);
  });

  commentFormComponents.get(index).setBlurHandler(() => {
    document.addEventListener('keydown', closeModalEscKeydownHandler);
  });

  return cardComponent.getElement();
};

const renderFilmsList = () => {
  let showedCards = COUNT_CARD_LIST;

  const displayedComments = films.slice(showedCards - COUNT_CARD_LIST, showedCards);
  const filmListElement = new FilmsListView().getElement();
  const filmsListContainerElement = new FilmsListContainerView().getElement();
  const buttonMoreComponent = (showedCards < COUNT_CARD_All) ? new ButtonMoreView() : '';

  displayedComments.forEach((film, index) => {
    render(filmsListContainerElement, renderFilm(film, index), ContentPosition.BEFOREEND);
  });

  render(filmListElement, filmsListContainerElement, ContentPosition.BEFOREEND);

  if (buttonMoreComponent) {
    render(filmListElement, buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);
    buttonMoreComponent.setClickHandler(() => {
      const lastCountCards = showedCards;
      const loadedCards = films.slice(lastCountCards, lastCountCards + COUNT_CARD_LIST);
      showedCards = showedCards + loadedCards.length;

      loadedCards.forEach((film) => {
        render(filmsListContainerElement, renderFilm(film), ContentPosition.BEFOREEND);
      });

      render(filmListElement, filmsListContainerElement, ContentPosition.BEFOREEND);
      render(filmListElement, buttonMoreComponent.getElement(), ContentPosition.BEFOREEND);

      if (films.length - showedCards === 0) {
        buttonMoreComponent.getElement().style.display = 'none';
      }
    });
  }

  return filmListElement;
};

const FilmsListExtra = (title, films) => {
  const FilmsListExtraElement = new FilmsListExtraView(title).getElement();
  const filmsListContainerElement = new FilmsListContainerView().getElement();

  films.forEach((film) => {
    render(filmsListContainerElement, renderFilm(film), 'beforeend');
  });

  render(FilmsListExtraElement, filmsListContainerElement, 'beforeend');

  return FilmsListExtraElement;
};

render(headerElement, new RankUserView().getElement(), ContentPosition.BEFOREEND);
render(mainElement, new MenuView(filters).getElement(), ContentPosition.AFTERBEGIN);
render(mainElement, new SortView().getElement(), ContentPosition.BEFOREEND);

if (COUNT_CARD_All) {

  const LayoutFilmsComponent = new LayoutFilmsView().getElement();
  render(LayoutFilmsComponent, renderFilmsList(), ContentPosition.BEFOREEND);

  const topRatedCard = films.slice().sort((a, b) => {
    return b.rating - a.rating;
  }).slice(0, COUNT_CARD_TOP);
  render(LayoutFilmsComponent, FilmsListExtra('Top rated', topRatedCard), ContentPosition.BEFOREEND);

  const mostCommentedCard = films.slice().sort((a, b) => {
    return b.comments.length - a.comments.length;
  }).slice(0, COUNT_CARD_TOP);
  render(LayoutFilmsComponent, FilmsListExtra('Most commented', mostCommentedCard), ContentPosition.BEFOREEND);

  render(mainElement, LayoutFilmsComponent, ContentPosition.BEFOREEND);

} else {
  render(mainElement, new FilmsEmptyView().getElement(), ContentPosition.BEFOREEND);
}

render(footerElement, new StatisticsView(films.length.toLocaleString()).getElement(), ContentPosition.BEFOREEND);
