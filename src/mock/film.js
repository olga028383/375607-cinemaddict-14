import {getRandom, generateArrayData, getRandomKeyFromArray} from '../util.js';
import {getId} from '../lib.js';

const NAMES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

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

const COUNTRIES = [
  'Australia',
  'Finland',
  'Russia',
  'Armenia',
  'Bulgaria',
];

const PRODUCER = [
  'Tom Ford',
  'Sam Simon',
  'David Simon',
  'Amy Seimetz',
  'Peter Sullivan',
];

const GENRES = [
  'Comedy',
  'Drama',
  'Fantasy',
  'Sport',
];

const NumbersGenerationData = {
  YEAR_MIN: 1930,
  YEAR_MAX: 2020,
  MONTH_MAX: 13,
  RATING_MAX: 10,
  TIME_MIN: 60,
  TIME_MAX: 120,
  AGE_RATING_MAX: 20,
  ACTORS_MIN: 2,
};

const getRandomBoolean = () => Boolean(getRandom(0, 1));
const commentsExcluded = {};

const generateFilm = (comments) => {

  const getRandomComment = () => {
    let rand = getRandom(0, comments.length - 1);
    commentsExcluded[rand] = true;

    while (commentsExcluded[rand]) {
      rand = getRandom(0, comments.length - 1);
    }
    return comments[rand].id;
  };
  const getRandomComments = () => {
    const rand = getRandom(0, 10);
    return new Array(rand).fill(null).map(() => getRandomComment());
  };

  return {
    id: getId(),
    name: getRandomKeyFromArray(NAMES),
    originalName: getRandomKeyFromArray(NAMES),
    poster: `${getRandomKeyFromArray(POSTERS)}`,
    description: generateArrayData(1, TEXTS).join(''),
    rating: Number(`${getRandom(0, NumbersGenerationData.RATING_MAX)}.${getRandom(0, NumbersGenerationData.RATING_MAX)}`),
    ageRating: getRandom(0, NumbersGenerationData.AGE_RATING_MAX),
    country: getRandomKeyFromArray(COUNTRIES),
    date: new Date(getRandom(NumbersGenerationData.YEAR_MIN, NumbersGenerationData.YEAR_MAX), getRandom(0, NumbersGenerationData.MONTH_MAX)),
    runTime: getRandom(NumbersGenerationData.TIME_MIN, NumbersGenerationData.TIME_MAX),
    producer: getRandomKeyFromArray(PRODUCER),
    scenarists: Array.from(new Set(generateArrayData(1, PRODUCER))),
    actors: Array.from(new Set(generateArrayData(NumbersGenerationData.ACTORS_MIN, PRODUCER))),
    genres: Array.from(new Set(generateArrayData(1, GENRES))),
    isWatchList: getRandomBoolean(),
    isWatch: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    comments: getRandomComments(),
  };
};

export {generateFilm};
