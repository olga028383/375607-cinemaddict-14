import {getRandom, generateArrayData, getRandomKeyFromArray} from '../util.js';
import {getId} from '../lib.js';
import {EMOTIONS} from '../constants.js';

const TEXTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const AUTHORS = [
  'Tom Ford',
  'Sam Simon',
  'David Simon',
  'Amy Seimetz',
  'Peter Sullivan',
];

const NumbersGenerationData = {
  YEAR_MIN: 2000,
  YEAR_MAX: 2020,
  MONTH_MAX: 13,
};

const generateComment = () => {
  return {
    id: getId(),
    text: generateArrayData(1, TEXTS).join(''),
    emotion: getRandomKeyFromArray(EMOTIONS),
    author: getRandomKeyFromArray(AUTHORS),
    date: new Date(getRandom(NumbersGenerationData.YEAR_MIN, NumbersGenerationData.YEAR_MAX), getRandom(0, NumbersGenerationData.MONTH_MAX)),
  };
};

export {generateComment};
