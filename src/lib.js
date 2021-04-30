import * as dayjs from 'dayjs';
import nanoid from 'nanoid';

const getYear = (data) => dayjs(data).year();

const getDateFormat = (data, format) => dayjs(data).format(format);

const getId = () => nanoid();

const sortDate = (dateA, dateB) => {
  return dayjs(dateA.date).diff(dayjs(dateB.date));
};
export {getYear, getDateFormat, getId, sortDate};
