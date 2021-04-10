import {getRandom, generateArrayData} from '../util.js';
import {Emotions} from '../constants.js';

const Texts = [
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

const Authors = [
  'Tom Ford',
  'Sam Simon',
  'David Simon',
  'Amy Seimetz',
  'Peter Sullivan',
];

let count = 0;

const generateComment = () => {
  return {
    id: ++count,
    text: generateArrayData(1, Texts).join(''),
    emotion: Emotions[getRandom(0, Emotions.length - 1)],
    author: Authors[getRandom(0, Authors.length - 1)],
    date: new Date(getRandom(2000, 2020), getRandom(0, 13)),
  };
};

export {generateComment};
