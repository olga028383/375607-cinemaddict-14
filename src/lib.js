import * as dayjs from 'dayjs';
import nanoid from 'nanoid';

const getYear = (data) => dayjs(data).year();

const getDateFormat = (data, format) => dayjs(data).format(format);
const getTime = (data) => dayjs().minute(data);
const getId = () => nanoid();

const sortDate = (dateA, dateB) => {
  return dayjs(dateB.date).diff(dayjs(dateA.date));
};
export {getYear, getDateFormat, getId, sortDate, getTime};
