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
  INIT: 'INIT',
};

const ENTER_CODE = 13;

const PeriodValues = {
  'ALL': 'all-time',
  'TODAY': 'day',
  'WEEK': 'week',
  'MONTH': 'month',
  'YEAR': 'year',
};

const PeriodNames = {
  'ALL': 'All time',
  'TODAY': 'Today',
  'WEEK': 'Week',
  'MONTH': 'Month',
  'YEAR': 'Year',
};

const RankNames = {
  'MOVIE_BUFF': 'Movie buff',
  'NOVICE': 'Novice',
  'FAN': 'Fan',
};

const MAX_LENGTH_DESCRIPTION = 140;

const COUNT_FILM_LIST = 5;

const COUNT_CARD_TOP = 2;

const BAR_HEIGHT = 50;

export {
  EMOTIONS,
  SortType,
  FilterType,
  UserAction,
  UpdateType,
  ENTER_CODE,
  PeriodValues,
  PeriodNames,
  RankNames,
  MAX_LENGTH_DESCRIPTION,
  COUNT_FILM_LIST,
  COUNT_CARD_TOP,
  BAR_HEIGHT
};
