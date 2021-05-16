import {FilterType} from '../constants.js';
import Observer from '../utils/observer.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  get() {
    return this._activeFilter;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }
}
