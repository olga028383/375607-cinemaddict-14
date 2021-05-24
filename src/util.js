import {MAX_LENGTH_DESCRIPTION} from './constants.js';

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;
  return element.firstElementChild;
};

const getRandom = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(max, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

function generateNumbers(min, max) {
  const randomNumbers = [];

  return () => {
    let id = getRandom(min, max);

    while (randomNumbers.includes(id)) {
      id = getRandom(min, max);
    }

    randomNumbers.push(id);

    return id;
  };
}

const generateArrayData = (lengthStart, data) => new Array(getRandom(lengthStart, data.length - 1)).fill(null).map(() => data[getRandom(0, data.length - 1)]);

const clipText = (text) => (text.length >= MAX_LENGTH_DESCRIPTION) ? `${text.slice(0, MAX_LENGTH_DESCRIPTION - 1)}...` : text;

const getRandomKeyFromArray = (data) => data[getRandom(0, data.length - 1)];

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const isOnline = () => window.navigator.onLine;

export {
  getRandom,
  generateArrayData,
  clipText,
  createElement,
  getRandomKeyFromArray,
  isEscEvent,
  isOnline,
  generateNumbers
};

