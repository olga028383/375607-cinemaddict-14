import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import nanoid from 'nanoid';
import he from 'he';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

dayjs.extend(duration);

const getYear = (data) => dayjs(data).year();

const getDateFormat = (data, format) => dayjs(data).format(format);

const getTime = (data, format) => dayjs.duration(data, 'minutes').format(format);

const getId = () => nanoid();

const sortDate = (dateA, dateB) => {
  return dayjs(dateB.date).diff(dayjs(dateA.date));
};

const escapeText = (text) => he.escape(text);

const getRandomDate = (count, period) => dayjs().subtract(count, period);

const checkIncludeDataInPeriod = (date, period) => dayjs().diff(dayjs(date), period) < 1;

export {
  getYear,
  getDateFormat,
  getId,
  sortDate,
  getTime,
  escapeText,
  Chart,
  ChartDataLabels,
  getRandomDate,
  checkIncludeDataInPeriod
};
