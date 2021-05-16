import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import nanoid from 'nanoid';
import he from 'he';

dayjs.extend(duration);

const getYear = (data) => dayjs(data).year();

const getDateFormat = (data, format) => dayjs(data).format(format);

const getTime = (data, format) => dayjs.duration(data, 'minutes').format(format);

const getId = () => nanoid();

const sortDate = (dateA, dateB) => {
  return dayjs(dateB.date).diff(dayjs(dateA.date));
};

const escapeText = (text) => he.escape(text);

export {getYear, getDateFormat, getId, sortDate, getTime, escapeText};
