import Api from '../api/api.js';
import Store from '../api/store.js';
import Provider from '../api/provider.js';

const AUTHORIZATION = 'Basic 939ierchb37227r9';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let api = null;
let store = null;
let provider = null;

const getConnect = () => {
  if(provider){
    return provider;
  }

  api = new Api(END_POINT, AUTHORIZATION);
  store = new Store(STORE_NAME, window.localStorage);
  provider = new Provider(api, store);

  return provider;
};

export {getConnect};
