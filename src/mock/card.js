import {getRandom, generateArrayData} from '../util.js';

const COUNT_COMMENTS = 30;
const Names = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const Posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

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

const Countries = [
  'Australia',
  'Finland',
  'Russia',
  'Armenia',
  'Bulgaria',
];

const Producer = [
  'Tom Ford',
  'Sam Simon',
  'David Simon',
  'Amy Seimetz',
  'Peter Sullivan',
];

const Genres = [
  'Comedy',
  'Drama',
  'Fantasy',
  'Sport',
];
let count = 0;

const generateCard = () => {
  return {
    id: count++,
    name: Names[getRandom(0, Names.length - 1)],
    originalName: Names[getRandom(0, Names.length - 1)],
    poster: `${Posters[getRandom(0, Posters.length - 1)]}`,
    description: generateArrayData(1, Texts).join(''),
    rating: Number(`${getRandom(0, 10)}.${getRandom(0, 10)}`),
    ageRating: getRandom(0, 20),
    country: Countries[getRandom(0, Countries.length - 1)],
    date: new Date(getRandom(1930, 2020), getRandom(0, 13)),
    length: getRandom(60, 210),
    producer: Producer[getRandom(1, Producer.length - 1)],
    scenarists: Array.from(new Set(generateArrayData(1, Producer))),
    actors: Array.from(new Set(generateArrayData(2, Producer))),
    genres: Array.from(new Set(generateArrayData(1, Genres))),
    isWatchList: Boolean(getRandom(0, 1)),
    isWatched: Boolean(getRandom(0, 1)),
    isFavorites: Boolean(getRandom(0, 1)),
    comments: Array.from(new Set(new Array(getRandom(0, COUNT_COMMENTS)).fill().map(() => getRandom(1, COUNT_COMMENTS)))),
  };
};

export {generateCard};
