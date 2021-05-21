import Api from '../api/api.js';

const AUTHORIZATION = 'Basic 939ierchb37227r9';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const getConnect = () => {
  return new Api(END_POINT, AUTHORIZATION);
};
export {getConnect};
