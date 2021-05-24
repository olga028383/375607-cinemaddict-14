import Smart from './smart.js';

const createNetworkTemplate = (data = {}) => {
  const {isOnline} = data;
  return `<span class="offline">${isOnline ? '' : ' - offline'}</span>`;
};

export default class Network extends Smart {
  constructor(isOnline) {
    super();
    this._data = {isOnline: isOnline};
  }

  getTemplate() {
    return createNetworkTemplate(this._data);
  }
}
