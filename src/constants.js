const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const FilterType = {
  ALL: 'all',
  FAVORITES: 'Favorites',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const UpdateType = {
  FILM: 'FILM',
  FILM_COMMENTS: 'FILM_COMMENTS',
  FILM_LIST: 'FILM_LIST',
  FILM_TOP_COMMENT: 'FILM_TOP_COMMENT',
};

const ENTER_CODE = 17;

export {EMOTIONS, SortType, FilterType, UserAction, UpdateType, ENTER_CODE};
