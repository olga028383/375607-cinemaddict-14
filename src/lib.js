import * as dayjs from 'dayjs';

const getYear = (data) => {
  return dayjs(data).year();
};

const getDateFormat = (data, format) => {
  return dayjs(data).format(format);
};

export {getYear, getDateFormat};
