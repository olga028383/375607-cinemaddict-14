const getRandom = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(max, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateArrayData = (lengthStart, data) => {
  return new Array(getRandom(lengthStart, data.length - 1)).fill().map(() => data[getRandom(0, data.length - 1)]);
};

const getLengthTimeFormat = (numeric) => {
  const minTime = 60;
  const minutes = numeric % minTime;
  const hours = (numeric - minutes) / minTime;

  let result = '';
  if (hours > 0) {
    result = `${hours}h`;
  }
  if (minutes > 0) {
    result += (minutes <= 9) ? ` 0${minutes}m` : ` ${minutes}m`;
  }

  return result.trim();
};

const clipText = (text, length) => {
  return (text.length >= length) ? `${text.slice(0, length - 1)}...` : text;
};

export {getRandom, generateArrayData, getLengthTimeFormat, clipText};
